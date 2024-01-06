// En el archivo: redux/actions/audiobooks.js
import axios from 'axios';
import {
    GET_BOOKS_SUCCESS,
    GET_BOOKS_FAIL,
    GET_BOOK_SUCCESS,
    GET_BOOK_FAIL,
    CREATE_BOOK_SUCCESS,
    CREATE_BOOK_FAIL
} from '../reducers/types';

export const get_audiobooks = () => async dispatch => {
    const config = {
      headers: {
        'Accept': 'application/json'
      }
    };
    try {
      const res = await axios.get(`http://192.168.178.36:8081/api/v1/books/`, config);
      const data = await res.data;
      dispatch({
        type: GET_BOOKS_SUCCESS,
        payload: data
      });
      return res; // Devuelve la respuesta para que puedas acceder a los datos en la función que llama a esta acción.
    } catch(err){
      dispatch({
        type: GET_BOOKS_FAIL
      });
      return err; // Devuelve el error en caso de que ocurra un error en la solicitud a la API.
    }
  };

  export const create_audiobook = (newBookData) => async (dispatch) => {
    // Prepare the headers and data for the POST request
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' // Specify the content type as JSON
      }
    };
    try {
      // Send a POST request to create the new book
      const res = await axios.post(`http://192.168.178.36:8081/api/v1/books/`, newBookData, config);
      dispatch({
        type: CREATE_BOOK_SUCCESS,
        payload: res.data
      });
      return res;
    } catch (err) {
      dispatch({
        type: CREATE_BOOK_FAIL
      });
      return err;
    }
  };

 export const get_audiobook = (id) => async dispatch => {
     const config = {
       headers: {
         'Accept': 'application/json'
       }
     };
     try {
       const res = await axios.get(`http://192.168.178.36:8081/api/v1/books/${id}`, config);
       const data = await res.data;
       dispatch({
         type: GET_BOOK_SUCCESS,
         payload: data
       });
       return res; // Devuelve la respuesta para que puedas acceder a los datos en la función que llama a esta acción.
     } catch(err){
       dispatch({
         type: GET_BOOK_FAIL
       });
       return err; // Devuelve el error en caso de que ocurra un error en la solicitud a la API.
     }
   };



