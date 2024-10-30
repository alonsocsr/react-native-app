import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import { agregarVenta, getOrCreateCliente } from './api';
const Carrito = ({ carrito }) => {
  const [infoCliente, setInfoCliente] = useState({
    cedula: '',
    nombre: '',
    apellido: ''
  });

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const finalizarOrden = async () => {
    try {
      let cliente = await getClienteByCedula(infoCliente.cedula);

      if (!cliente) {
        cliente = await getOrCreateCliente(infoCliente); 
      }

      const orden = {
        fecha: new Date().toISOString(), 
        idCliente: cliente.idCliente, 
        total: calcularTotal(),
        detalles: carrito.map((item) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precio: item.precio 
        }))
      };

    
      await agregarVenta(orden);
      
      console.log('La orden ha sido guardada exitosamente.');
      finalizarOrden();
    } catch (error) {
      console.log( 'Hubo un problema al finalizar la orden.');
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Carrito:</Text>
      <FlatList
        data={carrito}
        keyExtractor={(item,index) => item.id + index.toString()}
        renderItem={({ item }) => (
          <Text>{item.nombre} x {item.cantidad} - ${item.precioVenta * item.cantidad}</Text>
        )}
      />
      
      <Text>Información del Cliente:</Text>
      <TextInput
        placeholder="Cédula"
        value={infoCliente.cedula}
        onChangeText={(value) => setInfoCliente({ ...infoCliente, cedula: value })}
      />
      <TextInput
        placeholder="Nombre"
        value={infoCliente.nombre}
        onChangeText={(value) => setInfoCliente({ ...infoCliente, nombre: value })}
      />
      <TextInput
        placeholder="Apellido"
        value={infoCliente.apellido}
        onChangeText={(value) => setInfoCliente({ ...infoCliente, apellido: value })}
      />

      <Button title="Finalizar Orden" onPress={finalizarOrden} />
    </View>
  );
};

export default Carrito;