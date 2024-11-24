import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const Button = ({ onPress, style, icon }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Feather name={icon} size={24} />
  </TouchableOpacity>
);

export default function ItemsProd({ id, nombre, categoria, precioVenta, cantidadDisponible, onEdit, onDelete, db_ip }) {
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${db_ip}:3000/productos/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setImagen(data.imagen);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar el producto:', error);
        setLoading(false);
      });
  }, [id, db_ip]);

  return (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Image
              source={{ uri: imagen }} 
              style={styles.productImage}
            />
          )}
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.categoria}>Categoria: {categoria}</Text>
          <Text style={styles.precio}>Precio de venta: {precioVenta} GS</Text>
          <Text style={styles.cantidad}>Cantidad Disponible: {cantidadDisponible}</Text>
        </View>
        <View style={styles.rowView}>
          <Button onPress={onEdit} icon="edit" style={{ marginHorizontal: 16 }} />
          <Button onPress={onDelete} icon="trash-2" />
        </View>
      </View>
    </Card>
  );
}

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
  cantidad: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  productImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
});
