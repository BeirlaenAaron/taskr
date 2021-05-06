import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import firebase from 'firebase';
import { useFocusEffect } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
require('firebase/firestore');

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserFriendRequests } from '../../../redux/actions/index';
import { background, text } from '../../../styles/colors/theme';
import { notifications } from '../../../styles/components/notifications';

function Notifications(props) {
    const [userFriendRequests, setUserFriendRequests] = useState<any[]>([]);
    const [otherNotifications, setOtherNotifications] = useState<any[]>([]);

    const fetchFriendRequests = () => {
        firebase.firestore()
            .collection('notifications')
            .doc(firebase.auth().currentUser?.uid)
            .collection('friendrequests')
            .get()
            .then((snapshot) => {
                let userFriendRequests = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserFriendRequests(userFriendRequests);

            })
    }

    const fetchOtherNotifications = () => {
        firebase.firestore()
            .collection('notifications')
            .doc(firebase.auth().currentUser?.uid)
            .collection('other')
            .get()
            .then((snapshot) => {
                let otherNotifications = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setOtherNotifications(otherNotifications);
            })
    }

    useFocusEffect(
        useCallback(
            () => {
                fetchFriendRequests();
                fetchOtherNotifications();
            }, []
        )
    )

    const onAccept = (item) => {
        firebase.firestore()
            .collection("friendships")
            .doc(firebase.auth().currentUser?.uid)
            .collection("friends")
            .doc(item.id)
            .update({
                status: "A"
            })

        firebase.firestore()
            .collection("friendships")
            .doc(item.id)
            .collection("friends")
            .doc(firebase.auth().currentUser?.uid)
            .update({
                status: "A"
            })

        firebase.firestore()
            .collection("notifications")
            .doc(firebase.auth().currentUser?.uid)
            .collection("friendrequests")
            .doc(item.id)
            .delete()

        fetchFriendRequests();
    }

    const onDecline = (item) => {
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
            .doc(firebase.auth().currentUser?.uid)
            .collection("friendrequests")
            .doc(item.id)
            .delete()

        fetchFriendRequests();

    }

    const onDismiss = (item) => {
        firebase.firestore()
            .collection('notifications')
            .doc(firebase.auth().currentUser?.uid)
            .collection('other')
            .doc(item.id)
            .delete()

        fetchOtherNotifications();
    }

    if (Object.keys(userFriendRequests).length === 0 && Object.keys(otherNotifications).length === 0) {
        return (
            <SafeAreaView>
                <Text style={[text.theme[200], notifications.caughtup]}>You're all caught up!</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ marginTop: 20 }}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={userFriendRequests}
                renderItem={({ item }) => (
                    <View style={[background.theme[700], notifications.card]}>
                        <Text style={[notifications.description, text.theme[100]]}>{item.username} wants to be your friend!</Text>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={[notifications.addbutton, background.accent[200]]} onPress={() => onAccept(item)} >
                                <MaterialIcons name="check" size={20} style={text.accent[300]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[notifications.button, background.theme[400]]} onPress={() => onDecline(item)} >
                                <MaterialIcons name="close" size={20} style={text.theme[200]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={otherNotifications}
                renderItem={({ item }) => (
                    <View style={[background.theme[700], notifications.card]}>
                        <Text style={[notifications.description, text.theme[100]]}>{item.description}</Text>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={[notifications.button, background.theme[400]]} onPress={() => onDismiss(item)} >
                                <MaterialIcons name="close" size={20} style={text.theme[200]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    fetchUserFriendRequests: fetchUserFriendRequests,
}, dispatch);

export default connect(null, mapDispatchToProps)(Notifications);