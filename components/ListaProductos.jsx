import React, {useEffect, useState} from 'react';
import {View,Text,TextInput,Button,FlatList} from 'react-native';
import { getCategorias, getProductos } from './api';

const ListaProductos = ({ agregarCarrito }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [buscar, setBuscar] = useState('');
  
    useEffect(() => {
      const fetchProductos = async () => {
        const listaProductos = await getProductos();
        const listaCategorias=await getCategorias();
        setProductos(listaProductos);
        setCategorias(listaCategorias);
      };
      fetchProductos();
    }, []);
  
    const buscador = (text) => {
      setBuscar(text);
    };
  
    const productosFiltrados = productos.filter((producto) => {
        const nombreProductoCoincide = producto.nombre && producto.nombre.toLowerCase().includes(buscar.toLowerCase());
    
        const categoria = categorias.find((cat) => cat.idCategoria === producto.idCategoria);
        const nombreCategoriaCoincide = categoria && categoria.nombre.toLowerCase().includes(buscar.toLowerCase());
        return nombreProductoCoincide || nombreCategoriaCoincide;
      });
  
    return (
      <View>
        <TextInput 
          placeholder="Buscar producto por nombre o categoría" 
          value={buscar} 
          onChangeText={buscador} 
        />
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item,index) => item.id + index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.nombre} - ${item.precioVenta}</Text>
              <Button title="Agregar al carrito" onPress={() => agregarCarrito(item)} />
            </View>
          )}
        />
      </View>
    );
  };

export default ListaProductos;