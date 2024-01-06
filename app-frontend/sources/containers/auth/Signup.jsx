import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { signup } from '../../redux/actions/auth';
import {Card, Block, theme, Button, Input} from 'galio-framework';


const Signup = ({ signup }) => {
  const [accountCreated, setAccountCreated] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { 
    username,
    email,
    password
    // re_password
  } = formData;

  const onChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async() => {
    try{ 
    await signup(username, email, password);
    setAccountCreated(true);
    setConfirmationMessage('Registro exitoso. Ahora puedes iniciar sesión.'); 
    } catch (error){
      setConfirmationMessage('Error al registrar. Por favor, intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.form}>
        <Input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => onChange('username', text)}
        />
        <Input
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => onChange('email', text)}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => onChange('password', text)}
        />
        <Button
          onPress={onSubmit}
          style={[styles.button]}
        > Register </Button>
      </View>
      {accountCreated && (
        <View>
          <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
          <Button
            title="Iniciar Sesión"
            onPress={() => {
              // Navega a la pantalla de inicio de sesión
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    marginLeft: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});


export default connect(null, { signup })(Signup);
