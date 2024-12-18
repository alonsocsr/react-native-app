

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Button = ({ onPress, style, icon }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Feather name={icon} size={24} />
  </TouchableOpacity>
)

export default function Items({ nombre, icono, onEdit, onDelete }) {
  return (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <View style={styles.rowView}>
          <Ionicons name={icono} size={24} style={styles.icon} />
          <Text className="font-fregular" style={styles.nombre}>
            {nombre}
          </Text>
        </View>
        <View style={styles.rowView}>
          <Button
            onPress={onEdit}
            icon="edit"
            style={{ marginHorizontal: 16 }}
          />
          <Button onPress={onDelete} icon="trash-2" />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    margin: 16,
    elevation: 4,
    borderRadius: 8,
  },
  nombre: {
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10, 
    color: '#555', 
  },
});
