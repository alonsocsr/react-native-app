import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

export default function ItemVentas({ nombre, categoria, precioVenta, imagen, onAgregarAlCarrito, deshabilitado }) {
  return (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <Image
        source={{ uri: imagen}} 
        style={styles.productImage}
/>
        <View style={styles.details}>
          <Text className="font-fregular"  style={styles.nombre}>{nombre}</Text>
          <Text className="font-fregular" style={styles.categoria}>Categoría: {categoria}</Text>
          <Text className="font-fregular" style={styles.precio}>Precio: {precioVenta} GS</Text>
          <TouchableOpacity onPress={onAgregarAlCarrito} 
          style={deshabilitado ? styles.disabledButton : styles.activeButton} >
            <Text className="font-fregular" style={styles.buttonText}>Agregar al Carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  
  rowView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    elevation: 4,
    borderRadius: 8,
  },
  productImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoria: {
    fontSize: 14,
    color: '#6b7280',
  },
  precio: {
    fontSize: 16,
    color: '#ec4899',
  },
  activeButton: {
    marginTop: 10,
    backgroundColor: '#ec4899',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabledButton: {
    marginTop: 10,
    backgroundColor: '#d1d5db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
