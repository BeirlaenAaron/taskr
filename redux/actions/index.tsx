import firebase from 'firebase';
require('firebase/firestore')
import { USER_STATE_CHANGE, USER_FRIENDS_STATE_CHANGE, USER_NOTIFICATIONS_FRIENDREQUESTS_STATE_CHANGE, USER_NOTIFICATIONS_OTHER_STATE_CHANGE, CLEAR_DATA } from '../constants/index';

export function clearData() {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}

export function fetchUser() {
    return ((dispatch: any) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser?.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
                } else {
                    console.log('does not exist');
                }
            })
    })
}

export function fetchUserFriends() {
    return ((dispatch: any) => {
        firebase.firestore()
            .collection("friendships")
            .doc(firebase.auth().currentUser?.uid)
            .collection("friends")
            .onSnapshot((snapshot) => {
                let friends = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id;
                })
                dispatch({ type: USER_FRIENDS_STATE_CHANGE, friends })
            })
    })
}

export function fetchUserFriendRequests() {
    return ((dispatch: any) => {
        firebase.firestore()
            .collection("notifications")
            .doc(firebase.auth().currentUser?.uid)
            .collection("friendrequests")
            .onSnapshot((snapshot) => {
                let friendrequests = snapshot.docs.map(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    return { id, ...data };
                })
                dispatch({ type: USER_NOTIFICATIONS_FRIENDREQUESTS_STATE_CHANGE, friendrequests });
            })
    })
}

export function fetchUserOtherNotifications() {
    return ((dispatch: any) => {
        firebase.firestore()
            .collection("notifications")
            .doc(firebase.auth().currentUser?.uid)
            .collection("other")
            .onSnapshot((snapshot) => {
                let othernotifications = snapshot.docs.map(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    return { id, ...data };
                })
                dispatch({ type: USER_NOTIFICATIONS_OTHER_STATE_CHANGE, othernotifications });
            })
    })
}
