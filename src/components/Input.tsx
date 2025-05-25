import React from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    labelStyle,
    ...props
}) => {
    const { theme } = useTheme();

    const getInputContainerStyle = (): ViewStyle => ({
        marginBottom: theme.spacing.md,
    });

    const getInputStyle = (): TextStyle => ({
        height: 48,
        borderWidth: 1,
        borderColor: error ? theme.colors.error : theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        fontSize: theme.typography.body.fontSize,
    });

    const getLabelStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            marginBottom: theme.spacing.xs,
            color: theme.colors.text,
        };
        return {
            ...baseStyle,
            ...theme.typography.body,
        };
    };

    const getErrorStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            marginTop: theme.spacing.xs,
            color: theme.colors.error,
        };
        return {
            ...baseStyle,
            ...theme.typography.caption,
        };
    };

    return (
        <View style={[getInputContainerStyle(), containerStyle]}>
            {label && (
                <Text style={getLabelStyle()}>{label}</Text>
            )}
            <TextInput
                style={[getInputStyle(), inputStyle]}
                placeholderTextColor={theme.colors.gray[500]}
                {...props}
            />
            {error && (
                <Text style={getErrorStyle()}>{error}</Text>
            )}
        </View>
    );
}; 