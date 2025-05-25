import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

interface TextProps extends RNTextProps {
    variant?: TextVariant;
    color?: string;
    style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
    variant = 'body',
    color,
    style,
    ...props
}) => {
    const { theme } = useTheme();

    const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            color: color || theme.colors.text,
        };

        const variantStyle = theme.typography[variant];
        return {
            ...baseStyle,
            ...variantStyle,
        };
    };

    return <RNText style={[getTextStyle(), style]} {...props} />;
};