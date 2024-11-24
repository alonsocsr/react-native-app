import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal, SafeAreaView, Image } from 'react-native';
import { getVentasFiltrado, getClientesFiltrado, getProductos, getClientes } from '../../components/api';
import ModalView from '../../components/ModalView';
import { Surface, Title, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

const Ventas = () => {
  // set_states de componentes (idk que son realmente)
  const [ventas, setVentas] = useState([]);
  const [filtroFechaDesde, setFiltroFechaDesde] = useState(null);
  const [filtroFechaHasta, setFiltroFechaHasta] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [mostrarPickerDesde, setMostrarPickerDesde] = useState(false);
  const [mostrarPickerHasta, setMostrarPickerHasta] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [detalleVentaVisible, setDetalleVentaVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);
  const [filtroTipoVenta, setFiltroTipoVenta] = useState(null);


  /* 
    ======================================================

      Funciones para filtrar las ventas o clientes

    ======================================================
  */
  // get ventas
  useEffect(() => {
    const fetchVentas = async () => {
      const data = await getVentasFiltrado(filtroFechaDesde, filtroFechaHasta, filtroCliente, filtroTipoVenta);
      setVentas(data);
    };
    fetchVentas();
  }, [filtroFechaDesde, filtroFechaHasta, filtroCliente, filtroTipoVenta]);


  // get clientes
  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);


  // filtros para las fechas de inicio
  const seleccionarFechaDesde = (event, selectedDate) => {
    setMostrarPickerDesde(false);
    if (event.type === "set" && selectedDate) {
      setFiltroFechaDesde(selectedDate.toISOString().split('T')[0]);
    }
  };
  const seleccionarFechaHasta = (event, selectedDate) => {
    setMostrarPickerHasta(false);
    if (event.type === "set" && selectedDate) {
      setFiltroFechaHasta(selectedDate.toISOString().split('T')[0]);
    }
  };


  // Metodo para filtra el cliente una vez aceptado desde el modal
  const handleFiltrarClientes = async () => {
    const clientesFiltrados = await getClientesFiltrado(nombre, apellido, cedula);
    if (clientesFiltrados.length > 0) {
      setFiltroCliente(clientesFiltrados[0].id);
    } else {
      setFiltroCliente('-1');
    }
    setModalVisible(false);
  };

  // ver detalle de una venta
  const handleSeleccionarVenta = async (venta) => {
    const productos = await getProductos(venta.idVenta);
    setVentaSeleccionada(venta);
    setProductos(productos);
    setDetalleVentaVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface className="bg-white mt-6 mb-2" style={styles.header}>
        <Title className="font-fbold">Ventas</Title>
      </Surface>
      <View style={styles.center}>
        {/* filtros de fecha */}
        <View style={styles.row}>
          <Text className="font-fsemibold">Filtrar por fecha: {' '}</Text>
          <Button color={'#ec4899'} title="Desde" onPress={() => setMostrarPickerDesde(true)} />
          {mostrarPickerDesde && (
            <DateTimePicker
              value={filtroFechaDesde ? new Date(filtroFechaDesde) : new Date()}
              mode="date"
              display="default"
              onChange={seleccionarFechaDesde}
            />
          )}
          <View style={styles.espace_1} />
          <Button color={'#ec4899'} title="Hasta" onPress={() => setMostrarPickerHasta(true)} />
          {mostrarPickerHasta && (
            <DateTimePicker
              value={filtroFechaHasta ? new Date(filtroFechaHasta) : new Date()}
              mode="date"
              display="default"
              onChange={seleccionarFechaHasta}
            />
          )}
        </View>
      </View>

      <View style={styles.center}>
        {/* espacio para mostrar las fechas */}
        {filtroFechaDesde && (
          <View style={styles.row}>
            <Text style={styles.subTitle}>Fecha desde: {filtroFechaDesde}</Text>
            <View style={styles.espace_1} />
            <Button
              color={'#ec4899'}
              title=" X "
              onPress={() => {
                setFiltroFechaDesde(null);
              }}
            />
          </View>
        )}
        {filtroFechaHasta && (
          <View style={styles.row}>
            <Text style={styles.subTitle}>Fecha hasta: {filtroFechaHasta}</Text>
            <View style={styles.espace_1} />
            <Button
              color={'#ec4899'}
              title=" X "
              onPress={() => {
                setFiltroFechaHasta(null);
              }}
            />
          </View>
        )}

        {(filtroCliente || nombre || apellido || cedula) && (
          <View style={styles.colum}>
            {nombre && (
              <Text style={styles.subTitle}>Nombre: {nombre}</Text>
            )}
            {apellido && (
              <Text style={styles.subTitle}>Apellido: {apellido}</Text>
            )}
            {cedula && (
              <Text style={styles.subTitle}>Cedula: {cedula}</Text>
            )}
          </View>
        )}
        <View style={styles.row}>
          <Text className="font-fsemibold">Filtrar por tipo de venta:</Text>
          <Picker
            selectedValue={filtroTipoVenta}
            style={{ height: 50, width: 150 }}
            onValueChange={async (itemValue) => {
              if (itemValue === "todos") {
                const data = await getVentasFiltrado(filtroFechaDesde, filtroFechaHasta, filtroCliente, null);
                setVentas(data);
              } else {
                setFiltroTipoVenta(itemValue);
              }
            }}
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Pickup" value="pickup" />
            <Picker.Item label="Delivery" value="delivery" />
          </Picker>
        </View>
      </View>

      <View style={styles.espace_05} />

      {/* Seleccion del cliente */}
      <View className="ml-6 mr-6">
        <Button
          color={'#ec4899'}
          title="Filtro de Cliente"
          onPress={() => setModalVisible(true)}
        />
      </View>

      {/* Modal del cliente */}
      <ModalView
        visible={modalVisible}
        nombre="Buscar Cliente"
        onSubmit={handleFiltrarClientes}
        cancelable={true}
        onDismiss={() => setModalVisible(false)}
        submitText="Filtrar"
      >
        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={{ marginBottom: 10, backgroundColor: '#fce7f3' }}
        />

        <TextInput
          label="Apellido"
          value={apellido}
          onChangeText={setApellido}
          style={{ marginBottom: 10, backgroundColor: '#fce7f3' }}
        />
        <TextInput
          label="Cédula"
          value={cedula}
          onChangeText={setCedula}
          style={{ marginBottom: 10, backgroundColor: '#fce7f3' }}
        />
        <Button
          color={'#ec4899'}
          title="Limpiar"
          onPress={() => {
            setNombre(null);
            setApellido(null);
            setCedula(null);
          }
          }
        />
      </ModalView>

      <View style={styles.espace_05} />

      {/* Limpiador de filtros */}
      <View className="ml-6 mr-6">
        <Button
          color={'#ec4899'}
          title="Limpiar filtros"
          onPress={async () => {
            setFiltroFechaDesde(null);
            setFiltroFechaHasta(null);
            setFiltroCliente(null);
            setNombre(null);
            setCedula(null);
            setFiltroTipoVenta(null);
            const data = await getVentasFiltrado(null, null, null, null);
            setVentas(data);
          }}
        />
      </View>

      {/* Lista de ventas con (o sin) los filtros aplicados */}
      <Text style={styles.subTitle}>Resultados:</Text>
      {ventas.length === 0 ? (
        <Text style={styles.subTitle}>No se encontraron ventas con los filtros seleccionados</Text>
      ) : (
        <FlatList
          data={ventas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const cliente = clientes.find(cliente => cliente.id === item.idCliente.toString());
            return (
              <TouchableOpacity onPress={() => handleSeleccionarVenta(item)}>
                <View className="mr-4 ml-4" style={styles.ventaItem}>
                  <Text>Fecha: {item.fecha}</Text>
                  <Text>Total: Gs {item.total}</Text>
                  <Text>Cliente:  {cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no encontrado"}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Modal para seleccionar los detalles de una venta */}
      {ventaSeleccionada && (
        <Modal
          visible={detalleVentaVisible}
          animationType="slide"
          onRequestClose={() => setDetalleVentaVisible(false)}
        >
          <View className="m-4" style={styles.container}>
            <Text className="font-fsemibold" style={styles.title}>Detalle de Venta</Text>
            <View className="mr-2 ml-2 flex-col">
              <Text className="font-fregular" >Cliente: {clientes.find(cliente => cliente.id === ventaSeleccionada.idCliente)?.nombre} {clientes.find(cliente => cliente.id === ventaSeleccionada.idCliente)?.apellido}</Text>
              <Text className="font-fregular">Tipo: {ventaSeleccionada.tipoOperacion}</Text>
              <Text className="font-fregular">Fecha: {ventaSeleccionada.fecha}</Text>
              <Text className="font-fregular">Total: Gs {ventaSeleccionada.total}</Text>
            </View>
            {ventaSeleccionada.tipoOperacion === 'delivery' && ventaSeleccionada.direccionEntrega && (
              <View style={{ height: 300, marginVertical: 10 }}>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: ventaSeleccionada.ubicacionMapa.latitude,
                    longitude: ventaSeleccionada.ubicacionMapa.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: ventaSeleccionada.ubicacionMapa.latitude,
                      longitude: ventaSeleccionada.ubicacionMapa.longitude,
                    }}
                    title="Ubicación de entrega"
                  />
                </MapView>
              </View>
            )}
            <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }} />
            {/* Lista de productos comprados */}
            <FlatList
              data={ventaSeleccionada.detalle}
              keyExtractor={(item) => item.idProducto.toString()}
              renderItem={({ item }) => (
                <View style={styles.productoItem}>
                  <View style={styles.row}>
                    <Image
                      source={{ uri: productos.find(producto => producto.id === item.idProducto)?.imagen }}
                      style={{ width: 50, height: 50, marginRight: 10 }}
                    />
                    <View>
                      <Text className="font-fregular" >Producto: {productos.find(producto => producto.id === item.idProducto)?.nombre}</Text>
                      <Text className="font-fregular" >Cantidad: {item.cantidad}</Text>
                      <Text className="font-fregular" >Precio: Gs {item.precio}</Text>
                      <Text className="font-fregular" >Sup Total: Gs {item.cantidad * item.precio}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
            <Button color={'#ec4899'} title="Cerrar" onPress={() => setDetalleVentaVisible(false)} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

// estilos de elementos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    marginTop: 10,
    textAlign: 'center',
  },
  ventaItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 2,
  },
  productoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colum: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
  },
  espace_1: {
    margin: 10,
  },
  espace_05: {
    margin: 4,
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
  Button: {
    backgroundColor: '#ec4899',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  ButtonText: {
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

export default Ventas;
