import { StyleSheet } from "react-native";

export const notifications = StyleSheet.create({
    button: {
        borderRadius: 50,
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center"
    },

    addbutton: {
        borderRadius: 50,
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    card: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 20,
        marginBottom: 5,
        marginRight: 20,
        borderRadius: 5
    },

    description: {
        maxWidth: 280,
        fontSize: 16
    },
    caughtup: {
        fontSize: 24,
        alignSelf: "center",
        marginTop: 50
    }
})