import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Button } from 'react-native';
import { Surface, Title } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Carrito from '../../components/Carrito';
import ItemVentas from '../../components/ItemVentas';
import { db_ip } from '@env';


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
  const [isClienteModalVisible, setIsClienteModalVisible] = useState(false); // Nuevo estado para el modal de cliente

  useEffect(() => {
    getProductos();
    getCategorias();
  }, [categorias, productos]);

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
    if (productoEnCarrito) {
      setCarrito(carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1, precioVenta: producto.precioVenta }]);
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

  const verificarYRegistrarCliente = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes?cedula=${cliente.cedula}`);
      const data = await response.json();

      if (data.length > 0) {
        // Cliente existe, usa su ID
        return data[0].id;
      } else {
        // Cliente no existe, créalo
        const nuevoClienteResponse = await fetch(`${API_BASE_URL}/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cliente),
        });
        const nuevoClienteData = await nuevoClienteResponse.json();
        return nuevoClienteData.id; // Retorna el id del cliente creado
      }
    } catch (error) {
      console.error("Error al verificar o registrar cliente:", error);
      return null;
    }
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
    return ultimoId + 1;
  };

    try {
      const nuevoId = await obtenerNuevoId();
      const orden = {
        id: nuevoId,
        idCliente,
        fecha: new Date().toISOString().split('T')[0],
        detalle: carrito.map(item => ({
          idProducto: item.id,
          cantidad: item.cantidad,
          precio: item.precioVenta,
        })),
        total: carrito.reduce((total, item) => total + item.cantidad * item.precioVenta, 0),
      };

      const response = await fetch(`${API_BASE_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orden),
      });

      if (response.ok) {
        console.log("Orden registrada exitosamente");
        alert("¡Compra realizada exitosamente!");

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
        <Picker
          selectedValue={categoriaSeleccionada}
          onValueChange={(value) => setCategoriaSeleccionada(value)}
          style={styles.picker}
        >
          <Picker.Item label="Todas las categorías" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
          ))}
        </Picker>
      </View>

      <FlatList
        style={{ marginBottom: 10 }}
        data={filteredProductos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemVentas
            className="font-fsemibold text-pink-500"
            nombre={item.nombre}
            categoria={categorias.find((cat) => cat.id === item.idCategoria)?.nombre || "Sin categoría"}
            precioVenta={item.precioVenta}
            onAgregarAlCarrito={() => agregarAlCarrito(item)}
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

      {/* Modal para capturar datos del cliente */}
      <Modal
        visible={isClienteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsClienteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text  style={styles.modalTitle}>Información del Cliente</Text>
            <TextInput
              className="font-fregular"
              style={styles.input}
              placeholder="Cédula"
              value={cliente.cedula}
              onChangeText={(text) => setCliente({ ...cliente, cedula: text })}
            />
            <TextInput
              className="font-fregular"
              style={styles.input}
              placeholder="Nombre"
              value={cliente.nombre}
              onChangeText={(text) => setCliente({ ...cliente, nombre: text })}
            />
            <TextInput
              style={styles.input}
              className="font-fregular"
              placeholder="Apellido"
              value={cliente.apellido}
              onChangeText={(text) => setCliente({ ...cliente, apellido: text })}
            />
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
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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
});

export default Home;
