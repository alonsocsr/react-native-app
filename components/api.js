// api.js
import axios from 'axios';

const API_URL = 'http://192.168.0.106:3000';


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