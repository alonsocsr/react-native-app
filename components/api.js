// api.js
import axios from 'axios';
import { db_ip } from '@env';

const API_URL = `http://${db_ip}:3000`;


export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error('Error en el fetch de productos:', error);
    return [];
  }
};

export const getOrCreateCliente = async (clientInfo) => {
  try {
    const response = await axios.get(`${API_URL}/clientes?cedula=${clientInfo.cedula}`);
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      const newClient = await axios.post(`${API_URL}/clientes`, clientInfo);
      return newClient.data;
    }
  } catch (error) {
    console.error('Error en crear o encontrar el cliente:', error);
    return null;
  }
};
export const getCategorias = async () => {
  const response = await fetch(`${API_URL}/categorias`);
  const data = await response.json();
  return data;
};


export const agregarVenta = async (venta) => {
  await fetch(`${API_URL}/ventas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta),
  });
};


export const getClienteByCedula = async (cedula) => {
  const response = await fetch(`${API_URL}/clientes?cedula=${cedula}`);
  const data = await response.json();
  return data.length ? data[0] : null;
};

export const getVentasFiltrado = async (filtroFechaDesde, filtroFechaHasta, filtroCliente, filtroTipoVenta) => {
  try {
    let url = `${API_URL}/ventas`;
    const params = [];

    if (filtroCliente) {
      params.push(`idCliente=${filtroCliente}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }


    const response = await fetch(url);

    const data = await response.json();
    let filteredData = data;

    if (filtroFechaDesde) {
      filteredData = filteredData.filter(venta => new Date(venta.fecha) >= new Date(filtroFechaDesde));
    }

    if (filtroFechaHasta) {
      filteredData = filteredData.filter(venta => new Date(venta.fecha) <= new Date(filtroFechaHasta));
    }

    if (filtroCliente) {
      if (filtroCliente !== '-1') {
        filteredData = filteredData.filter(venta => venta.idCliente === filtroCliente);
      }
    }

    if (filtroTipoVenta) {
      filteredData = filteredData.filter(venta => venta.tipoOperacion === filtroTipoVenta);
    }

    return filteredData;
  } catch (error) {
    console.error('Error en el fetch de ventas:', error);
    return [];
  }
};

export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/clientes`);
    return response.data;
  } catch (error) {
    console.error('Error en el fetch de clientes:', error);
    return [];
  }
};

export const getClientesFiltrado = async (nombre, apellido, cedula) => {
  try {
    const response = await axios.get(`${API_URL}/clientes`);
    let clientes = response.data || [];

    if (nombre !== null && nombre !== undefined) {
      clientes = clientes.filter(cliente => cliente.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }

    if (apellido !== null && apellido !== undefined) {
      clientes = clientes.filter(cliente => cliente.apellido.toLowerCase().includes(apellido.toLowerCase()));
    }

    if (cedula !== null && cedula !== undefined) {
      clientes = clientes.filter(cliente => cliente.cedula.includes(cedula));
    }

    return clientes;
  } catch (error) {
    console.error('Error en el fetch de clientes:', error);
    return [];
  }




};

export const actualizarInventario = async (idProducto, nuevaCantidad) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${idProducto}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el inventario');
    }
  } catch (error) {
    console.error('Error actualizando inventario:', error);
  }
};