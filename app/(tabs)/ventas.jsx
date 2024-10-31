import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal } from 'react-native';
import { getVentasFiltrado, getClientesFiltrado, getProductos, getClientes } from '../../components/api';
import ModalView from '../../components/ModalView';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  /* 
    ======================================================

      Funciones para filtrar las ventas o clientes

    ======================================================
  */
  // get ventas
  useEffect(() => {
    const fetchVentas = async () => {
      const data = await getVentasFiltrado(filtroFechaDesde, filtroFechaHasta, filtroCliente);
      setVentas(data);
    };
    fetchVentas();
  }, [filtroFechaDesde, filtroFechaHasta, filtroCliente]);

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
    if (selectedDate) {
      setFiltroFechaDesde(selectedDate.toISOString().split('T')[0]);
    }
  };
  const seleccionarFechaHasta = (event, selectedDate) => {
    setMostrarPickerHasta(false);
    if (selectedDate) {
      setFiltroFechaHasta(selectedDate.toISOString().split('T')[0]);
    }
  };


  // Metodo para filtra el cliente una vez aceptado desde el modal
  const handleFiltrarClientes = async () => {
    const clientesFiltrados = await getClientesFiltrado(nombre, apellido, cedula);
    if (clientesFiltrados.length > 0) {
      setFiltroCliente(clientesFiltrados[0].id);
    } else {
      setFiltroCliente(null);
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
    <View style={styles.container}>
      <Text style={styles.title}>Consultas de Ventas</Text>
      <View style={styles.center}>
        {/* filtros de fecha */}
        <View style={styles.row}>
          <Button title="Desde" onPress={() => setMostrarPickerDesde(true)} />
          {mostrarPickerDesde && (
            <DateTimePicker
              value={filtroFechaDesde ? new Date(filtroFechaDesde) : new Date()}
              mode="date"
              display="default"
              onChange={seleccionarFechaDesde}
            />
          )}
          <View style={styles.espace_1} />
          <View style={styles.espace_1} />
          <Button title="Hasta" onPress={() => setMostrarPickerHasta(true)} />
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
      </View>

      <View style={styles.espace_05} />

      {/* Seleccion del cliente */}
      <Button
        title="Filtro de Cliente"
        onPress={() => setModalVisible(true)}
      />

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
          style={{ marginBottom: 10 }}
        />

        <TextInput
          label="Apellido"
          value={apellido}
          onChangeText={setApellido}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Cédula"
          value={cedula}
          onChangeText={setCedula}
          style={{ marginBottom: 10 }}
        />
        <Button
          title="Limpiar"
          onPress={() => {
            setNombre('');
            setApellido('');
            setCedula('');
          }
          }
        />
      </ModalView>

      <View style={styles.espace_05} />

      {/* Limpiador de filtros */}
      <Button
        title="Limpiar filtros"
        onPress={async () => {
          setFiltroFechaDesde(null);
          setFiltroFechaHasta(null);
          setFiltroCliente(null);
          const data = await getVentasFiltrado(null, null, null);
          setVentas(data);
        }}
      />

      {/* Lista de ventas con (o sin) los filtros aplicados */}
      <Text style={styles.subTitle}>Resultados:</Text>
      {ventas.length === 0 ? (
        <Text style={styles.subTitle}>No se encontraron ventas con los filtros seleccionados</Text>
      ) : (
        <FlatList
          data={ventas}
          keyExtractor={(item) => item.idVenta.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSeleccionarVenta(item)}>
              <View style={styles.ventaItem}>
                <Text>Fecha: {item.fecha}</Text>
                <Text>Total: Gs {item.total}</Text>
                <Text>Cliente: {clientes.find(cliente => cliente.id === item.idCliente)?.nombre}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal para seleccionar los detalles de una venta */}
      {ventaSeleccionada && (
        <Modal
          visible={detalleVentaVisible}
          animationType="slide"
          onRequestClose={() => setDetalleVentaVisible(false)}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Detalle de Venta</Text>
            <View style={styles.row}>
              <Text>Cliente: {clientes.find(cliente => cliente.id === ventaSeleccionada.idCliente)?.nombre}</Text>
              <View style={styles.espace_1} />
              <View style={styles.espace_1} />
              <View style={styles.espace_1} />
              <Text>Fecha: {ventaSeleccionada.fecha}</Text>
            </View>
            <Text>Total: Gs {ventaSeleccionada.total}</Text>
            {/* Lista de productos comprados */}
            <FlatList
              data={ventaSeleccionada.detalle}
              keyExtractor={(item) => item.idProducto.toString()}
              renderItem={({ item }) => (
                <View style={styles.productoItem}>
                  <Text>Producto: {productos.find(producto => producto.id === item.idProducto)?.nombre}</Text>
                  <View style={styles.row}>
                    <Text>Cantidad: {item.cantidad}</Text>
                    <View style={styles.espace_1} />
                    <View style={styles.espace_1} />
                    <View style={styles.espace_1} />
                    <Text>Precio: Gs {item.precio}</Text>
                  </View>
                  <Text>Sup Total: Gs {item.cantidad * item.precio}</Text>
                </View>
              )}
            />
            <Button title="Cerrar" onPress={() => setDetalleVentaVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

// estilos de elementos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    shadowRadius: 2,
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
  }
});

export default Ventas;
