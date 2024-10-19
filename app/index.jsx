import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Categoria from './categorias';

export default function App() {
  const [mostrarCategorias, setMostrarCategorias] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Administracion de Catgeorias</Text>
      <Button
        title="Administrar Categorías"
        onPress={() => setMostrarCategorias(!mostrarCategorias)}
      />
      
    
      {mostrarCategorias && <Categoria />}
    </View>
  );
}