import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from '../../components/ModalView';
import ItemsProd from '../../components/ItemsProd';
import { Picker } from '@react-native-picker/picker';
const {IP}=process.env

const Productos = () => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [visible, setVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [idProducto, setIdProducto] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [idCategoria, setIdCategoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = "http://192.168.0.106:3000/productos";
  const CATEGORIAS_URL ="http://192.168.0.106:3000/categorias";


  const getProductos = async () => {
    setLoading(true);
    await fetch(API_URL)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setFilteredData(response);
      })
      .catch((e) => console.log(e));
    setLoading(false);
  };


  const getCategorias = async () => {
    await fetch(CATEGORIAS_URL)
      .then((response) => response.json())
      .then((response) => {
        setCategorias(response); 
      })
      .catch((e) => console.log(e));
  };


  const agregarProducto = (nombre, idCategoria, precioVenta) => {

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nombre":nombre,
        "idCategoria":idCategoria,
        "precioVenta":precioVenta
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("producto creado",response)
        actualizarProducto();
      })
      .catch((error) => console.error(error));
  };

  const actualizarProducto = () => {
    getProductos();
    setVisible(false);
    setNombre('');
    setIdProducto(0);
    setPrecioVenta(0);
  };

  const editarProducto = (idProducto,nombre,idCategoria,precioVenta) => {
    fetch(`${API_URL}/${idProducto}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nombre": nombre,
        "idCategoria":idCategoria,
        "precioVenta": precioVenta
      })
    }).then((response) => response.json())
      .then((response) => {
        console.log("producto editado",response)
        actualizarProducto();
      }).catch((error) => console.error(error));
  };
  
  const editar = (id, nombre, idCategoria,precio) => {
    setVisible(true);
    setIdProducto(id);
    setNombre(nombre);
    setIdCategoria(idCategoria)
    setPrecioVenta(precio);
  };


  const eliminarProducto = (idProducto) => {
    fetch(`${API_URL}/${idProducto}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
      if (response.ok) {
        console.log('Producto eliminado con éxito');
        getProductos();
      } else {
        console.error('Error al eliminar el producto');
      }
    })
    .catch((error) => console.error(error));
  };
  // Filtrar productos por nombre
  const buscadorFiltrado = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = data.filter((item) => {
        const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };
  useEffect(() => {
    getProductos();
    getCategorias(); 
  }, []);

  return (
    <SafeAreaView className="bg-white" style={styles.container}>
      <StatusBar style="auto" />
      <Surface className="bg-white" style={styles.header}>
        <Title className="font-fbold">Productos</Title>
        <TouchableOpacity className="bg-pink-100" style={styles.button} onPress={() => setVisible(true)}>
          <Text className="font-fsemibold text-pink-500">Crear Producto</Text>
        </TouchableOpacity>
      </Surface>

      <View className="rounded-lg m-2 mb-2">
        <TextInput
          className="font-fsemibold bg-pink-100 rounded-lg"
          style={styles.searchBar}
          placeholder="Buscar producto por nombre"
          value={searchQuery}
          onChangeText={(text) => buscadorFiltrado(text)}
        />
      </View>

      <Text className="font-fsemibold" style={styles.textFriends}>{filteredData.length} Productos encontrados</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item,index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getProductos}
        renderItem={({ item }) => (
          <ItemsProd
            nombre={item.nombre}
            categoria={categorias.find(cat => cat.id === item.idCategoria)?.nombre} 
            precioVenta={item.precioVenta}
            onEdit={() => editar(item.id, item.nombre,item.idCategoria,item.precioVenta)}
            onDelete={() => eliminarProducto(item.id)}
          />
        )}
      />

      <ModalView
        visible={visible}
        title="Crear Producto"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (idProducto !== 0) {
            editarProducto(idProducto, nombre, idCategoria, precioVenta); 
          } else {
            agregarProducto(nombre, idCategoria, precioVenta);
          }
        }}
        cancelable
        >
        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={(text) => setNombre(text)}
          mode="outlined"
        />
        <Picker
          selectedValue={idCategoria}
          onValueChange={(itemValue) => setIdCategoria(itemValue)}
        >
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
          ))}
        </Picker>
        <TextInput
          label="Precio de Venta"
          value={precioVenta}
          onChangeText={(text) => setPrecioVenta(parseFloat(text))}
          keyboardType="numeric"
          mode="outlined"
        />
      </ModalView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 20,
  },
  searchBar: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    padding: 4,
  },
  textFriends: {
    fontSize: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});

export default Productos;

