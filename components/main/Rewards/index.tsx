import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { accent, background, neutral, text, theme } from '../../../styles/colors/theme';

import Overview from './Overview';
import Add from './Add';

const Stack = createStackNavigator();

const Rewards = ({ navigation }: any) => {
    return (
        <Stack.Navigator screenOptions={{ cardStyle: { ...background.theme[800] }, headerStyle: { ...background.theme[900] }, headerTintColor: theme[200] }}>
            <Stack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={Add} />
        </Stack.Navigator>
    )
}

export default Rewards;
