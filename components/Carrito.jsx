import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Carrito = ({ visible, carrito, onClose, onFinalizarCompra }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text className="font-fsemibold" style={styles.title}>Carrito de Compras</Text>

          <FlatList
            data={carrito}
            keyExtractor={(item, index) => item.id + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text className="font-fregular">{item.nombre} x {item.cantidad}</Text>
                <Text className="font-fregular">{item.precioVenta * item.cantidad} GS</Text>
              </View>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text className="font-fregular" style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.finalizeButton} onPress={onFinalizarCompra}>
              <Text  className="font-fregular" style={styles.buttonText}>Finalizar Orden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
  finalizeButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Carrito;
