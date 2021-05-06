import { StyleSheet } from "react-native";

export const addtask = StyleSheet.create({
    input: {
        marginRight: 20,
        marginLeft: 20,
        marginVertical: 10,
        padding: 10,
        borderRadius: 8,
    },
    savebutton: {
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        margin: 20,
        borderRadius: 8,
        marginVertical: 30,
    },
    timebutton: {
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        padding: 15,
        margin: 20,
        borderRadius: 8,
        marginVertical: 30,
    },
    spacebetween: {
        flexDirection: "row",
        alignSelf: "center"
    },
    bottom: {
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    text: {
        fontSize: 16,
    },
})