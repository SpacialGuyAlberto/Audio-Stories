import axios from 'axios';
import { Alert } from 'react-native';
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  LOGOUT
} from '../reducers/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
// Función para registrarse
export const signup = (username, email, password) => async dispatch => {
  dispatch({
    type: SET_AUTH_LOADING
  });

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({
    username,
    email,
    password
  });

  try {
    const res = await axios.post('http://192.168.178.36:8081/api/v1/auth/signup', body, config);

    if (res.status === 201) {
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data
      });
      console.log('Te enviamos un correo, por favor activa tu cuenta. Revisa el correo de spam', 'green');
    } else {
      dispatch({
        type: SIGNUP_FAIL
      });
      Alert.show('Error al crear cuenta', 'red');
    }
    dispatch({
      type: REMOVE_AUTH_LOADING
    });
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL
    });
    dispatch({
      type: REMOVE_AUTH_LOADING
    });
    Alert.show('Error conectando con el servidor, intenta más tarde.', 'red');
  }
};


export const load_user = () => async dispatch => {
    if(localStorage.getItem('access')){
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`http://192.168.178.36:8081/auth/users/me/`, config);
        
            if (res.status === 200) {
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: USER_LOADED_FAIL
                });
            }
        }
        catch(err){
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
}

// Función para activar la cuenta
export const activate = (activationToken) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(`http://192.168.178.36:8081/api/v1/auth/${activationToken}`, null, config);
    if (res.status === 200) {
      dispatch({
        type: ACTIVATION_SUCCESS
      });
      dispatch(setAlert('Cuenta activada correctamente', 'green'));
    } else {
      dispatch({
        type: ACTIVATION_FAIL
      });
    }
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL
    });
  }
};

export const login = (username, password) => async dispatch => {
  dispatch({ type: SET_AUTH_LOADING });

  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post('http://192.168.178.36:8081/api/v1/auth/signin', body, config);

    if (res.status === 200) {
      await AsyncStorage.setItem('access', JSON.stringify(res.data.access));
      await AsyncStorage.setItem('refresh', JSON.stringify(res.data.refresh));
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    } else {
      dispatch({ type: LOGIN_FAIL });
    }
  } catch (err) {
    dispatch({ type: LOGIN_FAIL });
  } finally {
    dispatch({ type: REMOVE_AUTH_LOADING });
  }
};

export const setInitialAuthState = (access, refresh) => dispatch => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: { access, refresh }
  });
};


// Función para verificar la autenticación
export const checkAuthenticated = () => async dispatch => {
  if (localStorage.getItem('accessToken')) {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    };

    try {
      const res = await axios.get('http://192.168.178.36:8081/api/v1/auth/check-authenticated', config);

      if (res.status === 200) {
        dispatch({
          type: AUTHENTICATED_SUCCESS
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL
    });
  }
};


// Función para cerrar sesión
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
  dispatch(setAlert('Sesión cerrada con éxito', 'green'));
};
