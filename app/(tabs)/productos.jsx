import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Modal } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from '../../components/ModalView';
import ItemsProd from '../../components/ItemsProd';
import { Ionicons } from '@expo/vector-icons';
import { db_ip } from '@env';

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
  const [imagen, setImagen] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [isCategoriaModalVisible, setIsCategoriaModalVisible] = useState(false);

  const API_URL = `http://${db_ip}:3000/productos`;
  const CATEGORIAS_URL = `http://${db_ip}:3000/categorias`;

  const getProductos = async () => {
    setLoading(true);
    await fetch(API_URL)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        getCategorias();
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

  const obtenerNuevoIdProducto = async () => {
    try {
      const response = await fetch(API_URL);
      const productos = await response.json();
      const nuevoId = productos.length > 0 ? (Math.max(...productos.map(producto => parseInt(producto.id))) + 1).toString() : '1';
      return nuevoId;
    } catch (error) {
      console.error('Error al obtener el nuevo ID del producto:', error);
      return null;
    }
  };

  const agregarProducto = async (nombre, idCategoria, precioVenta, imagen, cantidadDisponible) => {
    if (!nombre.trim() || !idCategoria || precioVenta == null || !imagen.trim() || cantidadDisponible == null) {
      alert('Todos los campos son obligatorios');
      return;
    }
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: await obtenerNuevoIdProducto(),
        nombre,
        idCategoria,
        precioVenta,
        imagen,
        cantidadDisponible
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('Producto creado', response);
        actualizarProducto();
      })
      .catch((error) => console.error(error));
  };

  const actualizarProducto = () => {
    setVisible(false);
    setNombre('');
    setIdProducto(0);
    setPrecioVenta(0);
    setCantidadDisponible(0);
    getProductos();
  };

  const editarProducto = (idProducto, nombre, idCategoria, precioVenta, imagen, cantidadDisponible) => {
    if (!nombre || !idCategoria || !precioVenta || !imagen || cantidadDisponible == null) {
      alert('Todos los campos son obligatorios');
      console.error('Todos los campos son obligatorios');
      return;
    }
    fetch(`${API_URL}/${idProducto}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nombre": nombre,
        "idCategoria": idCategoria,
        "precioVenta": parseInt(precioVenta),
        "imagen": imagen,
        "cantidadDisponible": parseInt(cantidadDisponible)
      })
    }).then((response) => response.json())
      .then((response) => {
        console.log("producto editado", response)
        actualizarProducto();
      }).catch((error) => console.error(error));
  };

  const editar = (id, nombre, idCategoria, precio, imagen, cantidad) => {
    setVisible(true);
    setIdProducto(id);
    setNombre(nombre);
    setIdCategoria(idCategoria);
    setPrecioVenta(precio.toString());
    setImagen(imagen);
    setCantidadDisponible(cantidad.toString());
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
      <Surface className="bg-white mt-6" style={styles.header}>
        <Title className="font-fbold">Productos</Title>
        <TouchableOpacity className="bg-pink-600" style={styles.button} onPress={() => setVisible(true)}>
          <Text className="font-fsemibold text-white">Crear Producto</Text>
        </TouchableOpacity>
      </Surface>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: '#fce7f3' }]}
          placeholder="Buscar producto por nombre"
          value={searchQuery}
          onChangeText={(text) => buscadorFiltrado(text)}
        />
      </View>

      <Text className="font-fsemibold" style={styles.textFriends}>{filteredData.length} Productos encontrados</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getProductos}
        renderItem={({ item }) => (
          <ItemsProd
            id={item.id}
            nombre={item.nombre}
            categoria={categorias.find(cat => cat.id === item.idCategoria)?.nombre}
            precioVenta={item.precioVenta}
            imagen={item.imagen}
            cantidadDisponible={item.cantidadDisponible}
            onEdit={() => editar(item.id, item.nombre, item.idCategoria, item.precioVenta, item.imagen, item.cantidadDisponible)}
            onDelete={() => eliminarProducto(item.id)}
          />
        )}
      />

      <ModalView
        visible={visible}
        title="Crear Producto"
        onDismiss={() => { setVisible(false); getCategorias(); }}
        onSubmit={() => {
          if (idProducto !== 0) {
            editarProducto(idProducto, nombre, idCategoria, precioVenta, imagen, cantidadDisponible);
          } else {
            agregarProducto(nombre, idCategoria, precioVenta, imagen, cantidadDisponible);
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
        <TouchableOpacity
          onPress={() => setIsCategoriaModalVisible(true)}
          style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}
        >
          <Ionicons
            name={categorias.find((cat) => cat.id === idCategoria)?.icono || 'apps'}
            size={24}
            style={{ marginRight: 10 }}
          />
          <Text>
            {categorias.find((cat) => cat.id === idCategoria)?.nombre || 'Seleccionar Categoría'}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={isCategoriaModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsCategoriaModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
              <FlatList
                data={categorias}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                    onPress={() => {
                      setIdCategoria(item.id); // Selecciona la categoría
                      setIsCategoriaModalVisible(false); // Cierra el modal
                    }}
                  >
                    <Ionicons name={item.icono} size={24} style={{ marginRight: 10 }} />
                    <Text>{item.nombre}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setIsCategoriaModalVisible(false)}
                style={{ marginTop: 20, alignSelf: 'center' }}
              >
                <Text style={{ color: 'blue' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TextInput
          label="Precio de Venta"
          value={precioVenta}
          onChangeText={(text) => setPrecioVenta(parseFloat(text))}
          keyboardType="numeric"
          mode="outlined"
        />
        <TextInput
          label="Imagen URL"
          value={imagen}
          onChangeText={(text) => setImagen(text)}
          placeholder='Ingresa el URL de la imagen'
          mode="outlined"
        />
        <TextInput
          label="Cantidad Disponible"
          value={cantidadDisponible}
          onChangeText={(text) => setCantidadDisponible(parseInt(text))}
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 20

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
  textFriends: {
    fontSize: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});

export default Productos;
