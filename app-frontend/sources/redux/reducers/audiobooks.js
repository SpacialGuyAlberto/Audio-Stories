import { GET_BOOKS_SUCCESS, GET_BOOKS_FAIL,
    GET_BOOK_SUCCESS, GET_BOOK_FAIL

} from '../reducers/types';

const initialState = {
  audiobooks: null,
};

export default function Books(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BOOKS_SUCCESS:
      return {
        ...state,
        audiobooks: payload,
      };
    case GET_BOOKS_FAIL:
      return {
        ...state,
        audiobooks: null,
      };
    case GET_BOOK_SUCCESS:
        return {
            ...state,
            audiobook: payload,
        };
    case GET_BOOK_FAIL:
          return {
            ...state,
            audiobooks: null,
          };
    default:
      return state;
  }
}
