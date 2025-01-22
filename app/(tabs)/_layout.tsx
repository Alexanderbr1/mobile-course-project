import { Tabs } from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';



export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="auth"
                options={{
                    title: 'Auth',
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                }}
            />
            <Tabs.Screen
                name="articles"
                options={{
                    title: 'Articles',
                }}
            />
        </Tabs>
    );
}