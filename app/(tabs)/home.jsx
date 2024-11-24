import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Button } from 'react-native';
import { Surface, Title } from 'react-native-paper';
import Carrito from '../../components/Carrito';
import ItemVentas from '../../components/ItemVentas';
import { db_ip } from '@env';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const API_BASE_URL = `http://${db_ip}:3000`;

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cliente, setCliente] = useState({ cedula: '', nombre: '', apellido: '' });
  const [isCarritoVisible, setIsCarritoVisible] = useState(false);
  const [isClienteModalVisible, setIsClienteModalVisible] = useState(false);
  const [isCategoriaModalVisible, setIsCategoriaModalVisible] = useState(false);

  const [tipoOperacion, setTipoOperacion] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: -25.3,
    longitude: -57.633333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Se rechazó el acceso a la ubicación.');
        return;
      }
    
      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Error obteniendo ubicación actual:", error);
      alert("No se pudo obtener la ubicación actual. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  const getProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      const data = await response.json();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const actualizarInventario = async (idProducto, nuevaCantidad) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${idProducto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidadDisponible: nuevaCantidad }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el inventario');
      }
    } catch (error) {
      console.error('Error actualizando inventario:', error);
    }
  };
  
  const getCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    const filteredData = productos.filter((item) => {
      const matchesSearchQuery = item.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoriaSeleccionada || item.idCategoria.toString() === categoriaSeleccionada.toString();
      return matchesSearchQuery && matchesCategory;
    });
    setFilteredProductos(filteredData);
  }, [searchQuery, categoriaSeleccionada, productos]);

  const agregarAlCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

    if (producto.cantidadDisponible > cantidadEnCarrito) {
      // Si hay suficiente inventario, agregar al carrito
      if (productoEnCarrito) {
        setCarrito(
          carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        );
      } else {
        setCarrito([
          ...carrito,
          { ...producto, cantidad: 1, precioVenta: producto.precioVenta },
        ]);
      }
    } else {
      // Si no hay suficiente inventario, mostrar un mensaje de alerta
      alert(
        `No hay suficiente inventario para agregar más unidades del producto: ${producto.nombre}`
      );
    }
  };
  const eliminarDelCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);

    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad > 1) {
        setCarrito(
          carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          )
        );
      } else {
        setCarrito(carrito.filter((item) => item.id !== producto.id));
      }
    }
  };

  const obtenerNuevoIdCliente = async () => {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    const clientes = await response.json();
    const ultimoId = clientes.length > 0 ? Math.max(...clientes.map(cliente => parseInt(cliente.id))) : 0;
    return (ultimoId + 1).toString();
  };

  const getClienteBuscado = async () => {
    if (cliente.cedula.trim() === '') {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/clientes?cedula=${cliente.cedula}`);
      const data = await response.json();
      if (data.length > 0) {
        setCliente(data[0]);
      } else {
        setCliente({ ...cliente, nombre: 'No encontrado', apellido: '' });
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      alert("Error al buscar cliente");
    }
  };

  const verificarYRegistrarCliente = async () => {
    try {
      const isCedulaEmpty = cliente.cedula.trim() === '';
      const isNombreEmpty = cliente.nombre.trim() === '';
      const isApellidoEmpty = cliente.apellido.trim() === '';
      const isClienteDataValid = !isCedulaEmpty && !isNombreEmpty && !isApellidoEmpty;
      if (!isClienteDataValid) {
        // Los datos no son validos si no se completo algun campo, se retorna null
        return null;
      }
      const response = await fetch(`${API_BASE_URL}/clientes?cedula=${cliente.cedula}`);
      const data = await response.json();

      if (data.length > 0) {
        // Cliente existe, usa su ID
        return data[0].id;
      } else {
        // Cliente no existe, créalo
        const nuevoId = await obtenerNuevoIdCliente();
        let body = JSON.stringify({ ...cliente, id: nuevoId });
        const nuevoClienteResponse = await fetch(`${API_BASE_URL}/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
        });
        const nuevoClienteData = await nuevoClienteResponse.json();
        return nuevoClienteData.id; // Retorna el id del cliente creado
      }
    } catch (error) {
      console.error("Error al verificar o registrar cliente:", error);
      return null;
    }
  };


  const handleOptionSelect = (tipo) => {
    setTipoOperacion(tipo);
  };

  const handleOpenMap = () => {
    setIsMapVisible(true);
  };

  const handleCloseMap = () => {
    setIsMapVisible(false);
  };

  const handleConfirmLocation = (location) => {
    setSelectedLocation(location);
    setIsMapVisible(false);
    console.log("Location selected:", location);
  };

  const finalizarOrden = async () => {
    const idCliente = await verificarYRegistrarCliente();
    if (!idCliente) {
      alert("Error al procesar la información del cliente.");
      return;
    }

    const obtenerNuevoId = async () => {
      const response = await fetch(`${API_BASE_URL}/ventas`);
      const ventas = await response.json();
      const ultimoId = ventas.length > 0 ? Math.max(...ventas.map(venta => parseInt(venta.id))) : 0;
      return (ultimoId + 1).toString();
    };

    try {
      const nuevoId = await obtenerNuevoId();
      const orden = {
        id: nuevoId,
        idCliente: idCliente,
        fecha: new Date().toISOString().split('T')[0],
        detalle: carrito.map(item => ({
          idProducto: item.id,
          cantidad: item.cantidad,
          precio: item.precioVenta,
        })),
        // aqui se cargaran los datos del tipo de pedido
        tipoOperacion: tipoOperacion, 
        direccionEntrega: "direccionEntrega",
        ubicacionMapa: selectedLocation,
        total: carrito.reduce((total, item) => total + item.cantidad * item.precioVenta, 0),
      };

      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orden),
      });

      if (response.ok) {
        // para la cantidad
        for (const item of carrito) {
          const nuevoInventario = item.cantidadDisponible - item.cantidad;
          await actualizarInventario(item.id, nuevoInventario);
        }
        console.log("Orden registrada exitosamente");
        alert("¡Compra realizada exitosamente!");

        // actualizar el home de articulos
        getProductos();

        // Vaciar el carrito y limpiar los datos del cliente
        setCarrito([]);
        setCliente({ cedula: '', nombre: '', apellido: '' });
      } else {
        const errorData = await response.json();
        console.error("Error al registrar la orden:", errorData);
        alert("Error al registrar la orden. Por favor, intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error en la orden:", error);
      alert("Ocurrió un error en la compra. Verifica tu conexión e intenta nuevamente.");
    }
  };

  return (
    <SafeAreaView className="bg-white" style={styles.container}>
      <Surface className="bg-white mt-6" style={styles.header}>
        <Title className="font-fbold">Inicio</Title>
      </Surface>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: '#fce7f3' }]}
          placeholder="Buscar producto por nombre"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity
          style={styles.categoriaButton}
          onPress={() => setIsCategoriaModalVisible(true)}
        >
          <Text style={styles.categoriaButtonText}>
            {categoriaSeleccionada
              ? `Filtrar: ${categorias.find((cat) => cat.id === categoriaSeleccionada)?.nombre || "Todas las categorías"}`
              : "Filtrar por categoría"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ marginBottom: 10 }}
        data={filteredProductos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemVentas
            nombre={item.nombre}
            categoria={categorias.find((cat) => cat.id === item.idCategoria)?.nombre || "Sin categoría"}
            precioVenta={item.precioVenta}
            imagen={item.imagen} // Nuevo campo para la imagen
            onAgregarAlCarrito={() => agregarAlCarrito(item)}
            deshabilitado={item.cantidadDisponible <= 0}
          />
        )}
        ListEmptyComponent={<Text className="font-fsemibold" style={styles.emptyText}>No hay productos disponibles</Text>}
      />


      <TouchableOpacity style={styles.carritoButton} onPress={() => setIsCarritoVisible(true)}>
        <Text className="font-fsemibold" style={styles.carritoButtonText}>Ver Carrito ({carrito.length})</Text>
      </TouchableOpacity>

      <Carrito
        visible={isCarritoVisible}
        carrito={carrito}
        onClose={() => setIsCarritoVisible(false)}
        onFinalizarCompra={() => {
          setIsCarritoVisible(false);
          setIsClienteModalVisible(true); // Abre el modal para datos del cliente
        }}
        onEliminarDelCarrito={eliminarDelCarrito}
      />

      {/* Modal para seleccionar categorías */}
      <Modal
        visible={isCategoriaModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCategoriaModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
            <FlatList
              data={[{ id: '', nombre: 'Todas las categorías', icono: 'apps' }, ...categorias]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoriaOption}
                  onPress={() => {
                    setCategoriaSeleccionada(item.id);
                    setIsCategoriaModalVisible(false);
                  }}
                >
                  <Ionicons name={item.icono} size={20} color="#000" style={styles.icon} />
                  <Text style={styles.categoriaOptionText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cerrar" onPress={() => setIsCategoriaModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal para capturar datos del cliente */}
      <Modal
        visible={isClienteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsClienteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text className="font-fsemibold text-xl text-gray-900 mb-2">Información del Cliente</Text>
            <View style={styles.row}>
              <TextInput
                className="font-fregular w-[80%]"
                style={styles.input}
                placeholder="Cédula"
                value={cliente.cedula}
                onChangeText={(text) => setCliente({ ...cliente, cedula: text })}
              />
              <TouchableOpacity
                onPress={async () => getClienteBuscado()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="search" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="font-fregular w-[80%]"
              style={styles.input}
              placeholder="Nombre"
              value={cliente.nombre}
              onChangeText={(text) => setCliente({ ...cliente, nombre: text })}
            />
            <TextInput
              style={styles.input}
              className="font-fregular w-[80%]"
              placeholder="Apellido"
              value={cliente.apellido}
              onChangeText={(text) => setCliente({ ...cliente, apellido: text })}
            />
            {/* seleccionar orden */}
             <Text className="font-fsemibold text-gray-900 text-lg mb-1">Selecciona el tipo de orden</Text>
            
            <View className="flex flex-row gap-4 items-start justify-start mb-2">

              <TouchableOpacity
                className="rounded-lg bg-pink-500 p-2"
                onPress={() => handleOptionSelect('pickup')}
              >
                <Text className="text-psemibold text-white">Pickup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg bg-pink-500 p-2"
                onPress={() => {handleOptionSelect('delivery'); handleOpenMap(); }}
              >
                <Text className="text-fsemibold text-white">Delivery</Text>
              </TouchableOpacity>
            </View>

            {tipoOperacion && (
              <Text className="text-fsemibold text-black text-sm">
                {tipoOperacion} seleccionada.
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <Button color={'#ff0000'} title="Cancelar" onPress={() => setIsClienteModalVisible(false)} />
              <Button
                color={'#ec4899'}
                title="Confirmar Orden"
                onPress={() => {
                  setIsClienteModalVisible(false);
                  finalizarOrden(); // Llama a finalizarOrden después de capturar los datos del cliente
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ubicacion */}
      <Modal
        visible={isMapVisible}
        animationType="slide"
        onRequestClose={handleCloseMap}
      >
        <View style={{ flex: 1 }}>
          {/* Map Section */}
          <View style={{ flex: 3 }}>
            <MapView
              style={{ flex: 1 }}
              onPress={(event) => setSelectedLocation(event.nativeEvent.coordinate)}
              initialRegion={initialRegion}
            >
              {selectedLocation && (
                <Marker coordinate={selectedLocation} title="Selected Location" />
              )}
            </MapView>
          </View>
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}>
            <Button title="Obtener ubicación actual" onPress={getCurrentLocation} />
            <View style={{ marginVertical: 4 }} />
            <Button title="Confirmar" onPress={() => handleConfirmLocation(selectedLocation)} />
            <View style={{ marginVertical: 4 }} />
            <Button title="Cerrar" onPress={handleCloseMap} />
          </View>
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
  picker: {
    height: 40,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  carritoButton: {
    backgroundColor: '#ec4899',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  carritoButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 45,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  categoriaOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  categoriaOptionText: { marginLeft: 10 },
  icon: { marginRight: 10 },
  categoriaButton: { backgroundColor: '#f3f4f6', padding: 10, borderRadius: 8 },
  categoriaButtonText: { color: '#374151', fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  optionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
