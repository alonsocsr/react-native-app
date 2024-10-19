import { StatusBar, } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from './ModalView';
import CrearView from './CrearView';

const Categorias = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [idCategoria, setCategoriaId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const API_URL = 'http://192.168.0.105:3000/categorias';
  const getCategorias = async () => {
    setLoading(true);
    await fetch(API_URL)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setFilteredData(response)
      })
      .catch((e) => console.log(e));
    setLoading(false);
  };


  const agregarCategoria = (nombre) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nombre": nombre
      }),
    })
      .then((response) => response.json())
      .then((response) => {
     
        actualizarCategoria();
      })
      .catch((error) =>{
      
      });
  };


  const actualizarCategoria = () => {
    getCategorias();
    setVisible(false);
    setNombre('');
    setCategoriaId(0);
  };


  const editarCategoria = (idCategoria, nombre) => {
    fetch(`${API_URL}/${idCategoria}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nombre": nombre,
      })
    }).then((res) => res.json())
      .then((resJson) => {
        Alert.alert('Categoría ' + response.nombre + ' editada con éxito');
        actualizarCategoria();
      }).catch(e => {});
  };

  
  const editar = (id, nombre) => {
    setVisible(true);
    setCategoriaId(id);
    setNombre(nombre);
  };

 
  const eliminarCategoria = (idCategoria) => {
    fetch(`${API_URL}/${idCategoria}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((response) => {
        
        getCategorias();
      })
      .catch((error) =>{
        
      }
    )
  };

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
    getCategorias();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Surface style={styles.header}>
        <Title>Categorías</Title>
        <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
          <Text style={styles.buttonText}>Crear Categoria</Text>
        </TouchableOpacity>
      </Surface>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar categoría por nombre"
        value={searchQuery}
        onChangeText={(text) => buscadorFiltrado(text)}
      />

      <Text style={styles.textFriends}>{filteredData.length} Categorías encontradas</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getCategorias}
        renderItem={({ item }) => (
          <CrearView
            nombre={item.nombre}
            onEdit={() => editar(item.id, item.nombre)}
            onDelete={() => eliminarCategoria(item.id)}
          />
        )}
      />

      <ModalView
        visible={visible}
        title="Crear Categoria"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (idCategoria && nombre) {
            editarCategoria(idCategoria, nombre);
          } else {
            agregarCategoria(nombre);
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
      </ModalView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 24 : 0,
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'steelblue',
  },
  buttonText: {
    color: 'white',
  },
  searchBar: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  textFriends: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Categorias;