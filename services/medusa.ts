import Medusa from "@medusajs/js-sdk"
import * as SecureStore from 'expo-secure-store';
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY || "pk_985a3cca7e01b401bb3a14ca60996dc66435b9b41c4748e9f39d189c310780b2"

// Initialize Medusa client
export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
});

//login costumer
export const loginCustomer = async (email: string, password: string) => {
  const result = await medusa.auth.login(
    "customer",
    "emailpass",
    {
      email: email,
      password: password
    }
  )

  return result;
};

//register customer
export const registerCustomer = async (email: string, password: string) => {
  try {
    const token = await medusa.auth.register('customer', 'emailpass', {
      email,
      password,
    });

    const customer = await medusa.store.customer.create(
      {
        "email": email
      },
      {},
      {
        Authorization: `Bearer ${token}`
      }
    )
      .then(({ customer }) => {
        console.log(customer)
        return customer;
      })
      .catch((error) => {
        console.error('Error registering customer:', error);
        throw error;
      });

    console.log(customer);
    return customer;
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
};

// Product related methods
export const getProducts = async () => {
  try {
    //expand the variants to get the product details
    const { products } = await medusa.store.product.list({
      region_id: 'reg_01JRMV178CZKFQ8F6SW2008R9E'
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    //add the variant id to the product to get the price
    const { product } = await medusa.store.product.retrieve(id, {
      region_id: 'reg_01JRMV178CZKFQ8F6SW2008R9E'
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Cart related methods
export const createCart = async () => {
  try {
    const { cart } = await medusa.store.cart.create({
      region_id: 'reg_01JRMV178CZKFQ8F6SW2008R9E'
    });

    await SecureStore.setItemAsync('cart_id', cart.id);
    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync('auth_token');
    const cartId = await SecureStore.getItemAsync('cart_id');

    if (!cartId) {
      return {
        cart: {
          items: []
        }
      }
    }

    const cart = await medusa.store.cart.retrieve(cartId, {
    }, {
      Authorization: `Bearer ${storedToken}`
    });

    return cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};


export const addToCart = async (variantId: string, quantity: number) => {
  try {

    let cartId = await SecureStore.getItemAsync('cart_id');

    if (!cartId) {
      //create a new cart
      const cart = await createCart();
      cartId = cart.id;
    }

    const { cart: updatedCart } = await medusa.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });


    return updatedCart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCart = async (cartId: string, items: any) => {
  const { cart: updatedCart } = await medusa.store.cart.update(cartId, {
    ...items
  });
  return updatedCart;
}

export const removeFromCart = async (variantId: string) => {
  try {
    const cartId = await SecureStore.getItemAsync('cart_id');
    if (!cartId) {
      throw new Error('Cart not found');
    }

    const updatedCart = await medusa.store.cart.deleteLineItem(cartId, variantId);
 
    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};



// Region related methods
export const getRegions = async () => {
  try {
    const { regions } = await medusa.regions.list();
    return regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getCustomer = async () => {
  const storedToken = await SecureStore.getItemAsync('auth_token');

  try {
    const { customer } = await medusa.store.customer.retrieve({}, {
      Authorization: `Bearer ${storedToken}`
    });
    return customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};


export const getPaymentProviders = async () => {
  const { payment_providers } = await medusa.store.payment.listPaymentProviders();
  return payment_providers;
}

export const completeOrder = async (cartId: string) => {
  const storedToken = await SecureStore.getItemAsync('auth_token');
  
  const order = await medusa.store.cart.complete(cartId,{},{
    Authorization: `Bearer ${storedToken}`
  });
  return order;
}

export const createPaymentSession = async (cartId: string) => {
  const { cart: updatedCart } = await medusa.carts.createPaymentSessions(cartId, {
    data: {}
  });
  return updatedCart;
}

export const updatePaymentSession = async (cartId: string, paymentProvider: string) => {
  const { cart: updatedCart } = await medusa.store.cart(cartId, paymentProvider, {
    data: {}
  });
  return updatedCart;
}

export const initializePayment = async (cart: any, paymentProvider: string) => {

  try {

    const storedToken = await SecureStore.getItemAsync('auth_token');

    const updatedCart = await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: paymentProvider,
      data: {}
    }, {}, {
      Authorization: `Bearer ${storedToken}`
    });
    

    console.log(updatedCart, 'updatedCart');

    return updatedCart;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
}

export const setShippingMethod = async (cartId: string, shippingMethodId: string) => {

  const storedToken = await SecureStore.getItemAsync('auth_token');

  const {cart:updatedCart} = await medusa.store.cart.addShippingMethod(cartId, {
    option_id: shippingMethodId,
    data: {},
  }, {}, {
    Authorization: `Bearer ${storedToken}`
  });

  console.log(updatedCart, 'updatedCart');
  return updatedCart;
}

export const getShippingOptions = async (cartId: string) => {
  const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
    cart_id: cartId,
  });
  return shipping_options;
}

export const retrieveOrder = async (orderId: string) => {
  const storedToken = await SecureStore.getItemAsync('auth_token');

  const { order } = await medusa.store.order.retrieve(orderId, {}, {
    Authorization: `Bearer ${storedToken}`  
  });

  console.log(order, 'order')
  return order;
}

export const getAllOrders = async () => {
  const storedToken = await SecureStore.getItemAsync('auth_token');

  const { orders } = await medusa.store.order.list({}, {
    Authorization: `Bearer ${storedToken}`
  });

  console.log(orders, 'orders')

  return orders;
}

export default medusa; 