import { StyleSheet } from "react-native";

export const tasks = StyleSheet.create({
    addbutton: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 20
    },

    card: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginLeft: 20,
        marginBottom: 5,
        marginRight: 20,
        borderRadius: 5

    },
    description: {
        fontSize: 16,
        maxWidth: 250
    },
    assigned: {
        alignSelf: "flex-end",
        marginRight: 15,
        marginTop: -15,
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    expired: {
        backgroundColor: '#FF3A2E',
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10

    },
    done: {
        borderRadius: 50,
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    date: {
        fontSize: 18,
        marginLeft: 10,
        marginRight: 10,
    },
    separator: {
        flexDirection: 'row', alignItems: 'center', padding: 20
    },

    separatorline: {
        flex: 1, height: 1
    },
})