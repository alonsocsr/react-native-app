import { View, Text } from 'react-native'
import React,{useState} from 'react'
import ListaProductos from '../../components/ListaProductos';
import Carrito from '../../components/Carrito';
import { getProductos } from '../../components/api';
import {finalizarOrden} from '../../components/Carrito'

const Ventas = () => {
  const [carrito,setCarrito]=useState([]);
  const [cliente, setCliente] = useState({ idCliente: '', nombre: '', cedula: '' });
  
  const agregarCarrito = (producto) => {
    setCarrito((prevCarrito) => {
        const productoExistente = prevCarrito.find(
            (item) => item.idProducto === producto.idProducto
        );

        if (productoExistente) {
            return prevCarrito.map((item) =>
                item.idProducto === producto.idProducto
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            );
        } else {
            return [...prevCarrito, { ...producto, cantidad: 1 }];
        }
    });
};


  return (
    <View>
      <ListaProductos agregarCarrito={agregarCarrito} />
      <Carrito carrito={carrito} finalizarOrden={finalizarOrden} />
    </View>
  )
}

export default Ventas