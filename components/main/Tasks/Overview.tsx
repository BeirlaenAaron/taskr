import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { tasks } from '../../../styles/components/tasks';

import firebase from 'firebase';
import { fetchUser } from '../../../redux/actions';
import { useFocusEffect } from '@react-navigation/core';
import { accent, background, text } from '../../../styles/colors/theme';
require('firebase/firestore');

const Overview = ({ navigation }: any) => {
    const [userTasks, setUserTasks] = useState<any[]>([]);

    const fetchUserTasks = () => {
        firebase.firestore()
            .collection('tasks')
            .doc(firebase.auth().currentUser?.uid)
            .collection('userTasks')
            .orderBy('expiryDate', 'desc')
            .get()
            .then((snapshot) => {
                let userTasks = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserTasks(userTasks);

            })
    }

    const handleExpiredTasks = () => {
        userTasks.map(doc => {
            let expiryDate = doc.expiryDate;
            let id = doc.id;
            if (new Date(expiryDate) < new Date(Date.now())) {
                if (new Date(expiryDate) < new Date(Date.now() - (3600 * 1000 * 24))) {
                    firebase.firestore()
                        .collection('tasks')
                        .doc(firebase.auth().currentUser?.uid)
                        .collection('userTasks')
                        .doc(id)
                        .delete()
                }

                firebase.firestore()
                    .collection('tasks')
                    .doc(firebase.auth().currentUser?.uid)
                    .collection('userTasks')
                    .doc(id)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.exists) {
                            let taskData = snapshot.data()
                            if (taskData != null) {
                                if (taskData.status == "UNCOMPLETED") {
                                    firebase.firestore()
                                        .collection('tasks')
                                        .doc(firebase.auth().currentUser?.uid)
                                        .collection('userTasks')
                                        .doc(id)
                                        .update({
                                            status: 'EXPIRED'
                                        })
                                }
                            }
                        }
                    })
            }
            if (new Date(expiryDate) < new Date(Date.now() - (3600 * 1000 * 24))) {
                firebase.firestore()
                    .collection('tasks')
                    .doc(firebase.auth().currentUser?.uid)
                    .collection('userTasks')
                    .doc(id)
                    .delete()
            }
        })
    }

    const onClickDone = (item) => {
        Alert.alert(
            `Warning`,
            `Are you sure you want to mark the task assigned by ${item.assignedBy} as done? \n\nYou will be rewarded ${item.reward} points.`,
            [
                {
                    text: 'Cancel',
                    onPress: () => { console.log('User tapped out...'); },
                    style: 'cancel'
                },
                {
                    text: 'Mark as done',
                    onPress: () => {
                        firebase.firestore()
                            .collection("tasks")
                            .doc(firebase.auth().currentUser?.uid)
                            .collection("userTasks")
                            .doc(item.id)
                            .delete()

                        firebase.firestore()
                            .collection("users")
                            .doc(firebase.auth().currentUser?.uid)
                            .update({
                                points: firebase.firestore.FieldValue.increment(item.reward)
                            })

                        fetchUserTasks();
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    useFocusEffect(
        useCallback(
            () => {
                fetchUserTasks();
                handleExpiredTasks();
            }, []
        )
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={userTasks}
                renderItem={({ item }) => (
                    <View>
                        <View style={[tasks.separator]}>
                            <View style={[tasks.separatorline, background.theme[400]]} />
                            <Text style={[tasks.date, text.theme[400]]}>{new Date(item.expiryDate).toDateString()}</Text>
                            <View style={[tasks.separatorline, background.theme[400]]} />
                        </View>
                        <View style={[background.theme[700], tasks.card]}>
                            <View>
                                <Text style={[text.neutral[100], tasks.description]}>{item.description}</Text>
                                <Text style={[text.theme[200]]}>Expires: {new Date(item.expiryDate).toLocaleTimeString()}</Text>
                            </View>
                            {item.status != "EXPIRED" ? <TouchableOpacity style={[tasks.done, background.accent[200]]} onPress={() => onClickDone(item)}><MaterialIcons name="check" size={20} style={text.accent[300]} /></TouchableOpacity> : <Text style={[tasks.expired, text.neutral[100]]}>EXPIRED</Text>}
                        </View>
                        <Text style={[text.neutral[100], tasks.assigned, background.accent[200]]}>{item.assignedBy}</Text>
                    </View>

                )}
            />
            <TouchableOpacity style={[background.accent[200], tasks.addbutton]}
                onPress={() => { navigation.navigate('Add'); }} >
                <MaterialIcons name="add" size={32} style={text.accent[300]} />
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Overview
