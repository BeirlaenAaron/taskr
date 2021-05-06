import React, { useCallback, useState } from 'react';
import { View, Text, Button, TextInput, Alert, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import firebase from 'firebase';
import { useFocusEffect } from '@react-navigation/core';
require('firebase/firestore');

import { connect } from 'react-redux';
import { background, text, theme } from '../../../styles/colors/theme';
import { addreward } from '../../../styles/components/addreward';

function Add(props, { navigation }) {
    const [userFriends, setUserFriends] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>();
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(0);
    const { currentUser } = props;

    const saveReward = async () => {
        if (description != "" && selectedUser != null) {
            firebase.firestore()
                .collection('rewards')
                .doc(selectedUser)
                .collection("userRewards")
                .add({
                    description,
                    cost,
                    fromUser: currentUser.username,
                    fromUserId: firebase.auth().currentUser?.uid,
                }).then((function () {
                    firebase.firestore()
                        .collection('notifications')
                        .doc(selectedUser)
                        .collection("other")
                        .add({
                            description: `${currentUser.username} offered you a reward!`
                        }).then((function () {
                            props.navigation.popToTop()
                        }))
                }))
        } else {
            Alert.alert(
                "Warning",
                "All fields must be filled in!"
            )
        }

    }

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

    useFocusEffect(
        useCallback(
            () => {
                fetchUserFriends();
            }, []
        )
    )

    return (
        <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 20 }}>
            <TextInput style={[text.theme[100], background.theme[700], addreward.input]}
                placeholder="What reward do you want to give?"
                multiline={true}
                placeholderTextColor="#6B717E"
                onChangeText={(description) => setDescription(description)} />
            <TextInput style={[text.theme[100], background.theme[700], addreward.inputnumber]}
                placeholder="100"
                placeholderTextColor="#6B717E"
                keyboardType="number-pad"
                onChangeText={(cost) => setCost(parseInt(cost))} />
            <View style={[background.theme[700], addreward.input]}>
                <Picker style={[text.theme[100]]}
                    selectedValue={selectedUser}
                    dropdownIconColor={theme[100]}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedUser(itemValue)
                    }>
                    {userFriends.map((value, index) => {
                        return <Picker.Item label={`${value.username}`} value={`${value.id}`} key={index} />;
                    })}
                </Picker>
            </View>

            <View style={[addreward.bottom]}>
                <TouchableOpacity style={[background.accent[200], addreward.savebutton]} onPress={() => saveReward()}>
                    <Text style={[addreward.text]}>SAVE</Text>
                </TouchableOpacity>
            </View>


        </KeyboardAvoidingView>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Add);