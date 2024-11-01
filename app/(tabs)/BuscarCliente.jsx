import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getClientes } from '../../components/api';

const BuscarCliente = ({ navigation, route }) => {
    const { setFiltroCliente } = route.params;
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClientes = async () => {
            const data = await getClientes();
            setClientes(data);
        };
        fetchClientes();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
    };

    const filteredClientes = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(search.toLowerCase()) ||
        cliente.cedula.includes(search)
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar Cliente</Text>
            <TextInput
                style={styles.input}
                placeholder="Buscar por nombre, apellido o cédula"
                value={search}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredClientes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => {
                            setFiltroCliente(item.id);
                            navigation.goBack();
                        }}
                    >
                        <View style={styles.clienteItem}>
                            <Text>{item.nombre} {item.apellido}</Text>
                            <Text>Cédula: {item.cedula}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

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
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    clienteItem: {
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
});

export default BuscarCliente;