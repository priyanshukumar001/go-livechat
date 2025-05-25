import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    title: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    title,
    style,
    textStyle,
    ...props
}) => {
    const { theme } = useTheme();

    const getButtonStyles = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        };

        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            small: {
                paddingVertical: theme.spacing.xs,
                paddingHorizontal: theme.spacing.sm,
            },
            medium: {
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
            },
            large: {
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
            },
        };

        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: theme.colors.primary,
            },
            secondary: {
                backgroundColor: theme.colors.secondary,
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.colors.primary,
            },
            ghost: {
                backgroundColor: 'transparent',
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            opacity: disabled ? 0.5 : 1,
        };
    };

    const getTextStyles = (): TextStyle => {
        const baseStyle: TextStyle = {
            fontSize: theme.typography.body.fontSize,
            fontWeight: '600',
        };

        const variantTextStyles: Record<ButtonVariant, TextStyle> = {
            primary: {
                color: '#FFFFFF',
            },
            secondary: {
                color: '#FFFFFF',
            },
            outline: {
                color: theme.colors.primary,
            },
            ghost: {
                color: theme.colors.primary,
            },
        };

        return {
            ...baseStyle,
            ...variantTextStyles[variant],
        };
    };

    return (
        <TouchableOpacity
            style={[getButtonStyles(), style]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <Text style={[getTextStyles(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}; 