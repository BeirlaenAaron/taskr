import React, { useCallback, useState } from 'react'
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

import firebase from 'firebase';
import { useFocusEffect } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { background, text } from '../../../styles/colors/theme';
import { friends } from '../../../styles/components/friends';
require('firebase/firestore');

const List = ({ navigation }: any) => {
    const [userFriends, setUserFriends] = useState<any[]>([]);

    const fetchUserFriends = () => {
        firebase.firestore()
            .collection('friendships')
            .doc(firebase.auth().currentUser?.uid)
            .collection('friends')
            .where('status', '==', 'A')
            .get()
            .then((snapshot) => {
                let userFriends = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserFriends(userFriends);
            })
    }

    const onRemove = (item) => {
        Alert.alert(
            `Warning`,
            `Are you sure you want to remove ${item.username} as your friend? `,
            [
                {
                    text: 'Cancel',
                    onPress: () => { console.log('User tapped out...'); },
                    style: 'cancel'
                },
                {
                    text: 'Remove',
                    onPress: () => {
                        firebase.firestore()
                            .collection("friendships")
                            .doc(firebase.auth().currentUser?.uid)
                            .collection("friends")
                            .doc(item.id)
                            .delete()

                        firebase.firestore()
                            .collection("friendships")
                            .doc(item.id)
                            .collection("friends")
                            .doc(firebase.auth().currentUser?.uid)
                            .delete()

                        fetchUserFriends();
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    useFocusEffect(
        useCallback(
            () => {
                fetchUserFriends();
            }, []
        )
    )

    if (Object.keys(userFriends).length === 0) {
        return (
            <SafeAreaView style={[friends.nofriends]}>
                <Text style={[text.theme[100]]}>It's quiet here!</Text>
                <Text style={[text.theme[200]]} > You have no friends, try adding some.</Text>
                <TouchableOpacity style={[background.accent[200], friends.addbutton]}
                    onPress={() => navigation.navigate('Search')}>
                    <MaterialIcons name="add" size={32} style={text.accent[300]} />
                </TouchableOpacity>
            </SafeAreaView >
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20 }}>

            <FlatList
                numColumns={1}
                horizontal={false}
                data={userFriends}
                renderItem={({ item }) => (
                    <View style={[background.theme[700], friends.card]}>
                        <Text style={[friends.text, text.theme[100]]}>{item.username}</Text>
                        <TouchableOpacity style={[friends.delete, background.theme[400]]} onPress={() => onRemove(item)}>
                            <MaterialIcons name="delete" size={20} style={text.theme[200]} />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={[background.accent[200], friends.addbutton]}
                onPress={() => navigation.navigate('Search')}>
                <MaterialIcons name="add" size={32} style={text.accent[300]} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default List;
