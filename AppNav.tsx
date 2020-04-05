import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './screens/Home';

const Stack = createStackNavigator();

export default function AppNav() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomePage} options={{headerTitle: "Poemify"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
