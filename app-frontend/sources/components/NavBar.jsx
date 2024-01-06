import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';

const TopBar = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-sharp" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    backgroundColor: '#0000', // Color de fondo
    alignItems: 'center', // Centrar horizontalmente
    justifyContent: 'center', // Centrar verticalmente
    paddingTop: 10, // Ajustar según la necesidad
    marginTop: -100
  },
  title: {
    fontSize: 20,
    color: '#ffffff', // Color del texto
  },
  backButton:{
    position: 'absolute',
    left: 10,
    top:10,
  },
});

export default TopBar;