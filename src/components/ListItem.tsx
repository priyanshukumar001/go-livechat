import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeContext';

interface ListItemProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    onPress,
    rightElement,
}) => {
    const { theme } = useTheme();

    const content = (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text variant="body" style={styles.title}>{title}</Text>
                {subtitle && (
                    <Text variant="caption" style={styles.subtitle}>{subtitle}</Text>
                )}
            </View>
            {rightElement && (
                <View style={styles.rightElement}>
                    {rightElement}
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.touchable, { backgroundColor: theme.colors.surface }]}
            >
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.7,
    },
    rightElement: {
        marginLeft: 16,
    },
    touchable: {
        borderRadius: 8,
        marginVertical: 4,
    },
}); 