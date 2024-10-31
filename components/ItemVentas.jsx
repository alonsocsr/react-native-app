import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';

const ItemVentas = ({ nombre, categoria, precioVenta, onAgregarAlCarrito }) => {
  return (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <View>
          <Text className="font-fregular" style={styles.nombre}>{nombre}</Text>
          <Text className="font-fregular" style={styles.categoria}>Categoría: {categoria}</Text>
          <Text className="font-fregular" style={styles.precio}>Precio de venta: {precioVenta} GS</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAgregarAlCarrito}>
          <Text className="font-fregular" style={styles.addButtonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    margin: 16,
    elevation: 4,
    borderRadius: 8,
  },
  nombre: {
    fontSize: 18,
  },
  categoria: {
    fontSize: 10,
  },
  precio: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#f9a8d4',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});


export default ItemVentas;
