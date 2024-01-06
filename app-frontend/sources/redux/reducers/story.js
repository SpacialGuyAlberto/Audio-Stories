import {
    CREATE_STORY_SUCCESS,
    CREATE_STORY_FAIL,
    CREATE_PICTURE_FAIL,
    CREATE_PICTURE_SUCCESS,
    CREATE_SPEECH_FAIL,
    CREATE_SPEECH_SUCCESS
} from '../reducers/types';

const initialState = {
    story: null,
    storyPicture: null,
    storySpeech: null
};

export default function Story(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case  CREATE_STORY_SUCCESS:
            return {
                ...state,
                story: payload,
            }
        case CREATE_STORY_FAIL:
            return {
                ...state,
                story: null
            }
        case CREATE_PICTURE_SUCCESS:
              return {
                 ...state,
                   storyPicture: payload,
                 }
        case CREATE_PICTURE_FAIL:
             return {
                ...state,
                   storyPicture: null
                }
        case CREATE_SPEECH_SUCCESS:
             return {
               ...state,
               storySpeech: payload,
                     }
        case CREATE_SPEECH_FAIL:
             return {
               ...state,
               storySpeech: null
                  }
        default:
            return state
    }
}



