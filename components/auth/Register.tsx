import React, { Component } from 'react'
import { View, Button, TextInput, Text, TouchableOpacity } from 'react-native'
import firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { background, neutral, text, textPlaceholder } from '../../styles/colors/theme';
import { login } from '../../styles/components/login';

export class Register extends Component<{}, { email: string, password: string, username: string, error: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            error: '',
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password, username } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser?.uid)
                    .set({
                        username,
                        email,
                        points: 0
                    })
                console.log(result);
            })
            .then((error) => {
                console.log(error);
            }).catch(err => {
                this.setState({ error: err.message })
            })
    }

    render() {
        return (
            <SafeAreaView style={[login.container]}>
                <TextInput style={[text.theme[100], background.theme[700], login.input]}
                    placeholder="Name"
                    placeholderTextColor="#6B717E"
                    onChangeText={(username) => this.setState({ username })} />
                <TextInput style={[text.theme[100], background.theme[700], login.input]}
                    placeholder="E-mail"
                    placeholderTextColor="#6B717E"
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })} />
                <TextInput style={[text.theme[100], background.theme[700], login.input]}
                    placeholder="Password"
                    placeholderTextColor="#6B717E"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })} />

                <Text style={[login.error]}>{this.state.error}</Text>

                <TouchableOpacity style={[background.accent[200], login.button]}
                    onPress={() => this.onSignUp()}>
                    <Text style={[login.text]}>SIGN UP</Text>
                </TouchableOpacity>
                <Text style={[text.theme[400]]}>Already have an account? <Text style={[text.accent[200], login.bold]} onPress={() => { this.props.navigation.navigate('Login') }}> Log in!</Text></Text>
            </SafeAreaView >
        )
    }
}

export default Register
