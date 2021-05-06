import React from 'react';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase';
import { background, text } from '../../styles/colors/theme';
import { settings } from '../../styles/components/settings';

export default function Settings() {

    const onLogout = () => {
        Alert.alert(
            `Warning`,
            `Are you sure you want to log out? `,
            [
                {
                    text: 'Cancel',
                    onPress: () => { console.log('User tapped out...'); },
                    style: 'cancel'
                },
                {
                    text: 'Log out',
                    onPress: () => {
                        firebase.auth().signOut();
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={[text.theme[200], settings.email]}>{firebase.auth().currentUser?.email}</Text>
            <View style={[settings.bottom]}>
                <TouchableOpacity style={[background.accent[200], settings.logout]} onPress={() => onLogout()}>
                    <Text style={[settings.text]}>LOG OUT</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}
