import React, { Component, useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { accent, background, neutral, text, theme } from '../styles/colors/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Tasks from './main/Tasks/index';
import Settings from './main/Settings';
import Friends from './main/Friends/index';
import Notifications from './main/Notifications/index';
import Rewards from './main/Rewards/index';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserFriends, fetchUserFriendRequests, fetchUserOtherNotifications, clearData } from '../redux/actions/index';
import { useFocusEffect } from '@react-navigation/core';

const Tab = createBottomTabNavigator();

function Home(props) {
    const [user, setCurrentUser] = useState();
    const [userFriends, setCurrentUserFriends] = useState();
    const [userFriendRequests, setUserFriendRequests] = useState();
    const [userOtherNotifications, setUserOtherNotifications] = useState();
    const { currentUser, friendrequests, othernotifications } = props;
    const [hasNotifications, setUserNotifications] = useState<any>(null);

    useEffect(() => {
        props.clearData();
        setCurrentUser(props.fetchUser());
        setCurrentUserFriends(props.fetchUserFriends());
        setUserFriendRequests(props.fetchUserFriendRequests());
        setUserOtherNotifications(props.fetchUserOtherNotifications());
    }, [])

    useFocusEffect(
        useCallback(
            () => {
                props.fetchUser()
                props.fetchUserFriendRequests()
                props.fetchUserOtherNotifications()
                console.log("yes");
            }, []
        )
    )

    useEffect(() => {
        if (friendrequests != 0 || othernotifications != 0) {
            let count = 0
            for (var friendrequest in friendrequests) {
                count = count + 1;
            }
            for (var notification in othernotifications) {
                count = count + 1;
            }
            setUserNotifications(count);
        } else if (friendrequests == 0 && othernotifications == 0) {
            setUserNotifications(null);
        }
    })

    return (
        <Tab.Navigator initialRouteName="Tasks" sceneContainerStyle={[background.theme[800]]} tabBarOptions={{ style: { ...background.theme[800], borderTopColor: theme[600] }, activeTintColor: accent[200], inactiveTintColor: theme[400], showLabel: false, keyboardHidesTabBar: true }}>
            <Tab.Screen name="Tasks" component={Tasks}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="list-alt" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Friends" component={Friends}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="people-alt" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Notifications" component={Notifications}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="favorite" color={color} size={26} />
                    ),
                    tabBarBadge: hasNotifications
                }} />
            <Tab.Screen name="Rewards" component={Rewards}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="local-mall" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Settings" component={Settings}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="settings" color={color} size={26} />
                    ),
                }} />
        </Tab.Navigator>
    )
}

const mapStateToProps = (store: any) => ({
    currentUser: store.userState.currentUser,
    friendrequests: store.userState.friendrequests,
    othernotifications: store.userState.othernotifications,
})
const mapDispatchProps = (dispatch: any) => bindActionCreators({ fetchUser, fetchUserFriends, fetchUserFriendRequests, fetchUserOtherNotifications, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Home);
