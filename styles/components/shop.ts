import { StyleSheet } from "react-native";

export const shop = StyleSheet.create({
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
    points: {
        fontSize: 18,
        alignSelf: "center",
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 50
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
        maxWidth: 280
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
    redeem: {
        borderRadius: 50,
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    norewards: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})