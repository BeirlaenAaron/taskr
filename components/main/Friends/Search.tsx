import React, { useEffect, useState } from 'react'
import { Button, TextInput, Text, View, FlatList, Alert, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

import firebase from 'firebase';
require('firebase/firestore');

import { connect } from 'react-redux';
import { background, text, theme } from '../../../styles/colors/theme';
import { addfriends } from '../../../styles/components/addfriends';

function Search(props: any) {
    const [users, setUsers] = useState<any[]>([]);
    const { currentUser, friends } = props;

    const checkFriended = (item) => {
        if (props.friends.indexOf(item.id) > -1) {
            return <TouchableOpacity style={[addfriends.button, background.theme[400]]} onPress={() => onRemove(item)}>
                <MaterialIcons name="delete" size={20} style={text.theme[200]} />
            </TouchableOpacity>;
        } else {
            return <TouchableOpacity style={[addfriends.button, background.accent[200]]} onPress={() => onAdd(item)} >
                <MaterialIcons name="add" size={20} style={text.accent[300]} />
            </TouchableOpacity>;
        }
    }

    const onAdd = (item) => {
        firebase.firestore()
            .collection("friendships")
            .doc(firebase.auth().currentUser?.uid)
            .collection("friends")
            .doc(item.id)
            .set({
                username: item.username,
                status: "R"
            })

        firebase.firestore()
            .collection("friendships")
            .doc(item.id)
            .collection("friends")
            .doc(firebase.auth().currentUser?.uid)
            .set({
                username: currentUser.username,
                status: "P"
            })

        firebase.firestore()
            .collection("notifications")
            .doc(item.id)
            .collection("friendrequests")
            .doc(firebase.auth().currentUser?.uid)
            .set({
                username: currentUser.username
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

                        firebase.firestore()
                            .collection("notifications")
                            .doc(item.id)
                            .collection("friendrequests")
                            .doc(firebase.auth().currentUser?.uid)
                            .delete()
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('username', '>=', search)
            .where('username', '<=', search + '\uf8ff')
            .get()
            .then((snapshot) => {
                let excludeSelfFromUsers = snapshot.docs.filter(doc => {
                    if (doc.id != firebase.auth().currentUser?.uid) {
                        return doc
                    }
                })
                let users = excludeSelfFromUsers.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUsers(users);
            })
    }
    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={[background.theme[700], addfriends.search]}>
                <MaterialIcons name="search" size={20} style={[text.theme[100], addfriends.searchicon]} />
                <TextInput style={[addfriends.text, text.theme[100]]} placeholder="Search someone" placeholderTextColor={theme[200]} onChangeText={(search) => fetchUsers(search)} />
            </View>
            <FlatList style={{ marginTop: 20 }}
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <View style={[background.theme[700], addfriends.card]}>
                        <Text style={[addfriends.text, text.theme[100]]}>{item.username}</Text>
                        {checkFriended(item)}
                    </View>
                )}
            />
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    friends: store.userState.friends
})

export default connect(mapStateToProps, null)(Search);
