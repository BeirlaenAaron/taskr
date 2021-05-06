import { StyleSheet } from "react-native";

export const login = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },

    input: {
        width: "100%",
        marginVertical: 10,
        padding: 15,
        borderRadius: 8
    },
    button: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 8,
        marginVertical: 30,
    },
    text: {
        fontSize: 16,
    },
    bold: {
        fontWeight: "bold",
    },
    error: {
        color: "#FF3A2E"
    }
})