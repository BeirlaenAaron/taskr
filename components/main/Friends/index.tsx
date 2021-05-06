import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { background, neutral, text, theme } from '../../../styles/colors/theme';

import List from './List';
import Search from './Search';

const Stack = createStackNavigator();

const Friends = ({ navigation }: any) => {
    return (
        <Stack.Navigator screenOptions={{ cardStyle: { ...background.theme[800] }, headerStyle: { ...background.theme[900] }, headerTintColor: theme[200] }}>
            <Stack.Screen name="List" component={List} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
    )
}

export default Friends;
