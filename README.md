# Medusa E-commerce App with Expo 👋

This is an [Expo](https://expo.dev) project integrated with [Medusa.js](https://www.medusajs.com/) for e-commerce functionality, created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Features

- 🛍️ Full e-commerce functionality powered by Medusa.js
- 📱 Cross-platform mobile app built with Expo
- 🔄 Real-time inventory and order management
- 💳 Secure payment processing
- 📦 Product catalog management

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Medusa.js backend running (see [Medusa Documentation](https://docs.medusajs.com/))

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure Medusa backend URL
   - Create a `.env` file in the root directory
   - Add your Medusa backend URL:
     ```
     MEDUSA_BACKEND_URL=your_medusa_backend_url
     ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Medusa Integration

This app uses the Medusa.js client to interact with your e-commerce backend. Key features include:

- Product browsing and search
- Cart management
- Checkout process
- Order tracking
- User authentication

For more information about Medusa.js integration, refer to the [Medusa Documentation](https://docs.medusajs.com/).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo and Medusa.js, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Medusa Documentation](https://docs.medusajs.com/): Learn how to build and customize your e-commerce backend.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
- [Medusa Discord](https://discord.gg/medusajs): Connect with the Medusa.js community.
