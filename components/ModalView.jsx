import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Title } from "react-native-paper";

const ModalView = ({ children, nombre, onSubmit, cancelable, visible = false, onDismiss, submitText = "Ok" }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onDismiss={onDismiss}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Title className="font-fregular" style={styles.modalText}>{nombre}</Title>
                    <View>
                        {children}
                    </View>
                    <View style={{ alignSelf: 'flex-end', alignItems: 'center',flexDirection: 'row', }}>
                        {cancelable && (<TouchableOpacity
                            style={{ ...styles.button, backgroundColor: 'white' }}
                            onPress={onDismiss}>
                            <Text className="font-fregular" style={[styles.textStyle, { color: '#ec4899' }]}>Cancelar</Text>
                        </TouchableOpacity>)}
                        {onSubmit && (<TouchableOpacity
                            style={styles.button}
                            onPress={onSubmit}>
                            <Text className="font-fregular" style={styles.textStyle}>{submitText}</Text>
                        </TouchableOpacity>)}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // marginHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 1,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#ec4899',
        marginLeft: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 8,
    }
});

export default ModalView;