import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled';
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    style,
}) => {
    const { theme } = useTheme();

    const getCardStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
        };

        const variantStyles: Record<string, ViewStyle> = {
            elevated: {
                backgroundColor: theme.colors.card,
                shadowColor: theme.colors.text,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.colors.border,
            },
            filled: {
                backgroundColor: theme.colors.card,
            },
        };

        return {
            ...baseStyle,
            ...variantStyles[variant],
        };
    };

    return <View style={[getCardStyle(), style]}>{children}</View>;
}; 