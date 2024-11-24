import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, Platform, View, Modal } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ModalView from '../../components/ModalView';
import Items from '../../components/Items';
import { db_ip } from '@env';

const Categorias = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [iconModalVisible, setIconModalVisible] = useState(false);

  const API_URL = `http://${db_ip}:3000/categorias`;
  const iconOptions = Object.keys(Ionicons.glyphMap).slice(0,100);

  const getCategorias = async () => {
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

  const obtenerNuevoIdCategoria = async () => {
    try {
      const response = await fetch(API_URL);
      const categorias = await response.json();
      const nuevoId = categorias.length > 0 ? (Math.max(...categorias.map(categoria => parseInt(categoria.id))) + 1).toString() : '1';
      return nuevoId;
    } catch (error) {
      console.error('Error al obtener el nuevo ID de la categoría:', error);
      return null;
    }
  };

  const agregarCategoria = async (nombre, icono) => {
    if (!nombre.trim()) {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }
    if (!icono) {
      alert('Selecciona un icono.');
      return;
    }
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: await obtenerNuevoIdCategoria(),
        nombre: nombre,
        icono: icono,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        actualizarCategoria();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const actualizarCategoria = () => {
    setVisible(false);
    setNombre('');
    setIdCategoria(0);
    setSelectedIcon('');
    getCategorias();
  };

  const editarCategoria = (idCategoria, nombre, icono) => {
    fetch(`${API_URL}/${idCategoria}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre,
        icono: icono,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        actualizarCategoria();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const editar = (id, nombre, icono) => {
    setVisible(true);
    setIdCategoria(id);
    setNombre(nombre);
    setSelectedIcon(icono);
  };

  const eliminarCategoria = (idCategoria) => {
    fetch(`${API_URL}/${idCategoria}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        getCategorias();
      })
      .catch((error) => {
        console.error(error);
      });
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
  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setIconModalVisible(false); 
  };

  const renderIconOption = ({ item }) => (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => handleIconSelect(item)}
    >
      <Ionicons name={item} size={30} color="black" />
      <Text style={styles.iconName}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-white" style={styles.container}>
      <StatusBar style="auto" />
      <Surface className="bg-white mt-6" style={styles.header}>
        <Title className="font-fbold">Categorías</Title>
        <TouchableOpacity className="bg-pink-600" style={styles.button} onPress={() => setVisible(true)}>
          <Text className="font-fsemibold text-white">Crear Categoría</Text>
        </TouchableOpacity>
      </Surface>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: '#fce7f3' }]}
          placeholder="Buscar categoría por nombre"
          value={searchQuery}
          onChangeText={(text) => buscadorFiltrado(text)}
        />
      </View>

      <Text className="font-fsemibold" style={styles.textFriends}>
        {filteredData.length} Categorías encontradas
      </Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getCategorias}
        renderItem={({ item }) => (
          <Items
            nombre={item.nombre}
            icono={item.icono}
            onEdit={() => editar(item.id, item.nombre, item.icono)}
            onDelete={() => eliminarCategoria(item.id)}
          />
        )}
      />

      <ModalView
        visible={visible}
        title="Crear Categoría"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (idCategoria && nombre) {
            editarCategoria(idCategoria, nombre, selectedIcon);
          } else {
            agregarCategoria(nombre, selectedIcon);
          }
        }}
        cancelable
      >
        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={(text) => setNombre(text)}
          mode="outlined"
          style= {{padding:10}}
        />

<TouchableOpacity
        style={styles.selectIconButton}
        onPress={() => setIconModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedIcon ? `Icono Seleccionado: ${selectedIcon}` : 'Seleccionar Icono'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={iconModalVisible}
        animationType="slide"
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={iconOptions}
            keyExtractor={(item) => item}
            renderItem={renderIconOption}
            numColumns={4} 
          />
         
          <TouchableOpacity onPress={() => setIconModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </ModalView>

      <Modal
        visible={iconModalVisible}
        animationType="slide"
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={iconOptions}
            keyExtractor={(item) => item}
            renderItem={renderIconOption}
            numColumns={3}
          />
        </View>
      </Modal>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#d6336c',
  },
  textFriends: {
    fontSize: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  selectIconButton: {
    padding: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    paddingTop:10
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingTop:5
  },
  iconName: {
    marginTop: 5,
    fontSize: 12,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  selectIconButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Categorias;