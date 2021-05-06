import React, { useCallback, useState } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase';
import { useFocusEffect } from '@react-navigation/core';
require('firebase/firestore');

import { connect } from 'react-redux';
import { background, text } from '../../../styles/colors/theme';
import { shop } from '../../../styles/components/shop';
import { MaterialIcons } from '@expo/vector-icons';

function Overview(props, { navigation }) {
    const [rewardPoints, setRewardPoints] = useState(0)
    const [rewards, setRewards] = useState<any[]>([]);
    const { currentUser } = props;

    const fetchUserPoints = () => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser?.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let userData = snapshot.data();
                    if (userData != null) {
                        setRewardPoints(userData.points)
                    }
                }
            })
    }

    const fetchUserRewards = () => {
        firebase.firestore()
            .collection("rewards")
            .doc(firebase.auth().currentUser?.uid)
            .collection("userRewards")
            .get()
            .then((snapshot) => {
                let userRewards = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setRewards(userRewards);

            })
    }

    const onRedeem = (item) => {
        Alert.alert(
            `Warning`,
            `Are you sure you want to redeem the reward from ${item.fromUser}? \n\nThis will cost ${item.cost} points.`,
            [
                {
                    text: 'Cancel',
                    onPress: () => { console.log('User tapped out...'); },
                    style: 'cancel'
                },
                {
                    text: 'Redeem',
                    onPress: () => {
                        if (rewardPoints >= item.cost) {
                            firebase.firestore()
                                .collection("rewards")
                                .doc(firebase.auth().currentUser?.uid)
                                .collection("userRewards")
                                .doc(item.id)
                                .delete()

                            firebase.firestore()
                                .collection("users")
                                .doc(firebase.auth().currentUser?.uid)
                                .update({
                                    points: firebase.firestore.FieldValue.increment(-Math.abs(item.cost))
                                })
                            firebase.firestore()
                                .collection("notifications")
                                .doc(item.fromUserId)
                                .collection("other")
                                .add({
                                    description: `${currentUser.username} redeemed your reward: '${item.description}'`
                                })

                            fetchUserRewards();
                            setTimeout(() => {
                                fetchUserPoints();
                            }, 1000)
                        } else {
                            Alert.alert(
                                `Warning`,
                                `You do not have enough points!`)
                        }
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    useFocusEffect(
        useCallback(
            () => {
                fetchUserPoints();
                fetchUserRewards();
            }, []
        )
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={[shop.points, text.theme[800], background.accent[200]]}>Points: {rewardPoints}</Text>
            <FlatList style={{ marginTop: 20 }}
                numColumns={1}
                horizontal={false}
                data={rewards}
                renderItem={({ item }) => (
                    <View>
                        <View style={[background.theme[700], shop.card]}>
                            <View>
                                <Text style={[text.neutral[100], shop.description]}>{item.description}</Text>
                                <Text style={[text.theme[200]]}>Cost: {item.cost}</Text>
                            </View>
                            <TouchableOpacity style={[shop.redeem, background.accent[200]]} onPress={() => onRedeem(item)} >
                                <MaterialIcons name="shopping-cart" size={16} style={text.accent[300]} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[text.neutral[100], shop.assigned, background.accent[200]]}>{item.fromUser}</Text>
                    </View>

                )}
            />
            <TouchableOpacity style={[background.accent[200], shop.addbutton]}
                onPress={() => { props.navigation.navigate('Add'); }} >
                <MaterialIcons name="add" size={32} style={text.accent[300]} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Overview);