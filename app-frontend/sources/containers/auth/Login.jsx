import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { login, logout } from '../../redux/actions/auth';
import { Auth } from '../../redux/reducers/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBar from '../../components/BottomBar';
import { ApplicationProvider, Layout } from '@ui-kitten/components';

const LoginScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authState = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

   useEffect(() =>{
      console.log('State is changed', isAuthenticated)
    }, [isAuthenticated])

    useEffect(() => {
        console.log('Auth state is changed', authState);
      }, [authState]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      // Handle focus event if needed
    });

    AsyncStorage.getItem('username').then((storedUsername) => {
        if (storedUsername) {
          setFormData({ ...formData, username: storedUsername });
        } else {
            console.log('Your username is undefined my friend')
        }
      });
  }, [navigation]);



   useEffect(() => {
      const initializeAuth = async () => {
        const storedAccess = await AsyncStorage.getItem('access');
        const storedRefresh = await AsyncStorage.getItem('refresh');

        if (storedAccess && storedRefresh) {
          dispatch(setInitialAuthState(storedAccess, storedRefresh));
        }
      };

      initializeAuth();
    }, [dispatch]);


  const handleLogin = async () => {

    if (username && password) {
      try {
        const res = await dispatch(login(username, password));
         useEffect(() => {
                console.log('Auth state is changed', authState);
              }, [authState]);
      } catch (error) {
      }
    } else {
      console.log('Login information is empty');
    }
  };

  const handleLogout = () => {

    AsyncStorage.removeItem('email');

    dispatch(logout());
  };




  return (
  <Layout>
    <View style={styles.container}>
      {isAuthenticated ? (
        <View>
          <Text style={styles.title}>Welcome, {username}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Sign in to your account</Text>
          <Text>
            Or{' '}
            <Text onPress={() => navigation.navigate('SignUp')} style={styles.link}>
              register
            </Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            /* secureTextEntry */
          />
          {loading ? (
            <ActivityIndicator size="large" color="yellow" />
          ) : (
            <Button title="Login" onPress={handleLogin} />
          )}
        </View>
        
      )}
    </View>
    <BottomBar style={styles.bottomNavigation}/>
    </Layout>
  );

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddinHorizontal: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    color: 'blue', // Puedes cambiar el color según tu preferencia
    textDecorationLine: 'underline',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  bottomNavigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -63,
  },
});

 const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {
    login,
})(LoginScreen)

/* export default LoginScreen; */



/*

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
});

export default connect(mapStateToProps, {
  activate,
})(ActivationScreen); */
