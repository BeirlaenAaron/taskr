import React, { useCallback, useState } from 'react'
import { Alert, Button, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/core';
import { MaterialIcons } from '@expo/vector-icons';

import firebase from 'firebase';
require("firebase/firestore");

import { connect } from 'react-redux';
import { addtask } from '../../../styles/components/addtask';
import { background, text, theme } from '../../../styles/colors/theme';

function Add(props, { navigation }) {
    const [description, setDescription] = useState("");
    const [reward, setReward] = useState(0)
    const [selectedUser, setSelectedUser] = useState<any>();
    const [date, setDate] = useState(new Date(Date.now()));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [userFriends, setUserFriends] = useState<any>([]);
    const { currentUser } = props;

    const saveTask = async () => {
        if (description != "" && selectedUser != null) {
            firebase.firestore()
                .collection('tasks')
                .doc(selectedUser)
                .collection("userTasks")
                .add({
                    description,
                    status: 'UNCOMPLETED',
                    reward,
                    creationDate: new Date(Date.now()).toLocaleString(),
                    expiryDate: date.toLocaleString(),
                    assignedBy: currentUser.username,
                }).then((function () {
                    firebase.firestore()
                        .collection('notifications')
                        .doc(selectedUser)
                        .collection("other")
                        .add({
                            description: `${currentUser.username} assigned you a task!`
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

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };


    return (
        <KeyboardAvoidingView behavior="height" style={{ flex: 1, marginTop: 20 }}>
            <TextInput style={[text.theme[100], background.theme[700], addtask.input]}
                placeholder="What has to be done?"
                multiline={true}
                placeholderTextColor="#6B717E"
                onChangeText={(description) => setDescription(description)} />

            <TextInput style={[text.theme[100], background.theme[700], addtask.input]}
                placeholder="100"
                placeholderTextColor="#6B717E"
                keyboardType="number-pad"
                onChangeText={(reward) => setReward(parseInt(reward))} />

            <View style={[background.theme[700], addtask.input]}>
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


            <View style={[addtask.spacebetween]}>
                <TouchableOpacity style={[background.accent[200], addtask.timebutton]} onPress={showDatepicker}>
                    <Text>DATE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[background.accent[200], addtask.timebutton]} onPress={showTimepicker}>
                    <Text>TIME</Text>
                </TouchableOpacity>
            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    minimumDate={new Date(Date.now())}
                    display="default"
                    onChange={onChange}
                />
            )}
            <View style={[addtask.bottom]}>
                <TouchableOpacity style={[background.accent[200], addtask.savebutton]} onPress={() => saveTask()}><Text style={[addtask.text]}>SAVE</Text></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Add);