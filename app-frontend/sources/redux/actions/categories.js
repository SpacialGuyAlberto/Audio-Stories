import axios from 'axios';

import {
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAIL,
} from '../reducers/types';

export const get_categories = () => async dispatch => {
    // Configuración de las cabeceras para la solicitud GET.
    const config = {
      headers: {
        'Accept': 'application/json'
      }
    };
    try {
     /*const res = await axios.get(`http://localhost:8081/api/v1/categories/`, config);*/
      const res = await axios.get(`http://192.168.178.36:8081/api/v1/categories/`, config);
      const data = await res.data;
      dispatch({
        type: GET_CATEGORIES_SUCCESS,
        payload: data
      });
      return res; // Devuelve la respuesta para que puedas acceder a los datos en la función que llama a esta acción.
    } catch(err){
      dispatch({
        type: GET_CATEGORIES_FAIL
      });
      return err; // Devuelve el error en caso de que ocurra un error en la solicitud a la API.
    }
  }