import { StatusBar, } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, Platform, View } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from '../../components/ModalView';
import Items from '../../components/Items';

const Categorias = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const API_URL = 'http://192.168.0.10:3000/categorias';
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
        console.log("creado",response)
        actualizarCategoria();
      })
      .catch((error) =>{
        console.error(error)
      });
  };


  const actualizarCategoria = () => {
    getCategorias();
    setVisible(false);
    setNombre('');
    setIdCategoria(0);
  };


  const editarCategoria = (idCategoria, nombre) => {
    fetch(`${API_URL}/${idCategoria}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nombre": nombre,
      })
    }).then((response) => response.json())
      .then((response) => {
        console.log("editado",response);
        actualizarCategoria();
      }).catch(error => {
        console.error(error)
      });
  };

  
  const editar = (id, nombre) => {
    setVisible(true);
    setIdCategoria(id);
    setNombre(nombre);
  };

 
  const eliminarCategoria = (idCategoria) => {
    fetch(`${API_URL}/${idCategoria}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("eliminado",response);
        getCategorias();
      })
      .catch((error) =>{
        console.error(error)
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
    <SafeAreaView className="bg-white" style={styles.container}>
      <StatusBar style="auto" />
      <Surface className="bg-white" style={styles.header}>
        <Title className="font-fbold">Categorías</Title>
        <TouchableOpacity className="bg-pink-100" style={styles.button} onPress={() => setVisible(true)}>
          <Text className="font-fsemibold text-pink-500">Crear Categoria</Text>
        </TouchableOpacity>
      </Surface>

      <View className="rounded-lg m-2 mb-2">
        <TextInput
            className="font-fsemibold bg-pink-100 rounded-lg"
            style={styles.searchBar}
            placeholder="Buscar categoría por nombre"
            value={searchQuery}
            onChangeText={(text) => buscadorFiltrado(text)}
          />
      </View>      

      <Text className="font-fsemibold" style={styles.textFriends}>{filteredData.length} Categorías encontradas</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getCategorias}
        renderItem={({ item }) => (
          <Items
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
  buttonText: {
    color: 'white',
  },
  searchBar: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    padding: 4,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  textFriends: {
    fontSize: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Categorias;