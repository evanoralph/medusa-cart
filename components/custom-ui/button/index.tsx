import React from 'react';
import { Button as GluestackButton, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';

interface CustomButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: 'solid' | 'outline' | 'link';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconSize?: number;
  iconColor?: string;
  className?: string;
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  onPress,
  isLoading = false,
  isDisabled = false,
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconSize = 20,
  iconColor,
  className,
}) => {
  return (
    <GluestackButton
      onPress={onPress}
      isDisabled={isDisabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading && <ButtonSpinner mr="$2" />}
      {!isLoading && LeftIcon && (
        <ButtonIcon as={LeftIcon} size={iconSize} color={iconColor} mr="$2" />
      )}
      <ButtonText>{children}</ButtonText>
      {!isLoading && RightIcon && (
        <ButtonIcon as={RightIcon} size={iconSize} color={iconColor} ml="$2" />
      )}
    </GluestackButton>
  );
};

export default Button;
