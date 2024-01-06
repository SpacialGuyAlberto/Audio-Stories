import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    LOGOUT
} from './types';

import AsyncStorage from '@react-native-async-storage/async-storage';


/*//this is the first version
const initialState = {
    access: AsyncStorage.getItem('access'),
    refresh: AsyncStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    loading: false
}*/

const initialState = {
  access: null,
  refresh: null,
  isAuthenticated: false,
  user: null,
  loading: false
};


AsyncStorage.getItem('access').then((access) => {
    AsyncStorage.getItem('refresh').then((refresh) => {
        initialState.access = access;
        initialState.refresh = refresh;
    });
});

export default function Auth(state = initialState, action) {
    const { type, payload } = action;

    switch(action.type){
        case SET_AUTH_LOADING:
            return {
                ...state,
                loading: true
            }
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                loading: false
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload
                }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null
                }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                access: null,
                refresh: null
            }
 case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
        loading: false
      };
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
        case RESET_PASSWORD_SUCCESS:
        case RESET_PASSWORD_FAIL:
        case RESET_PASSWORD_CONFIRM_SUCCESS:
        case RESET_PASSWORD_CONFIRM_FAIL:
            return{
                ...state
            }
        case REFRESH_SUCCESS:
            AsyncStorage.setItem('access', payload.access);
            return {
            ...state,
            access: AsyncStorage.getItem('access')
            }
        case SIGNUP_SUCCESS:
        case SIGNUP_FAIL:
        case LOGIN_FAIL:
        case REFRESH_FAIL:
        case LOGOUT:
            AsyncStorage.removeItem('access')
            AsyncStorage.removeItem('refresh')
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }

        default:
            return state;
    }
}