// Update the create_story action in your frontend
import axios from 'axios';
axios.defaults.maxContentLength = 5000000;
import {
    CREATE_STORY_SUCCESS,
    CREATE_STORY_FAIL,
    CREATE_PICTURE_SUCCESS,
    CREATE_PICTURE_FAIL,
    CREATE_SPEECH_FAIL,
    CREATE_SPEECH_SUCCESS
} from '../reducers/types';

export const create_story = (parameter) => async (dispatch) => {
  // Prepare the headers and data for the POST request
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' // Specify the content type as JSON
    }
  };
  try {
  /*192.168.178.36:19000*/
    const res = await axios.post('http://192.168.178.36:8081/api/v1/story/createStory', { parameter }, config);
    //const res_picture = await axios.post('http://192.168.2.105:8081/api/v1/story/createStoryPicture', { parameter } config);
    const story = res.data.story;
    //const storyPicture = res_picture.data.image_url;
    dispatch({
      type: CREATE_STORY_SUCCESS,
      payload: { story }
    });
    return story;
  } catch (err) {
    console.error('Error creating story:', err);
    dispatch({
      type: CREATE_STORY_FAIL
    });
    return err; // Puedes devolver el error para manejarlo en el componente si es necesario
  }
};

export const create_story_picture = (parameter) => async (dispatch) => {
  // Prepare the headers and data for the POST request
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' // Specify the content type as JSON
    }
  };
  try {
    const res = await axios.post('http://192.168.178.36:8081/api/v1/story/createStoryPicture', { parameter }, config);
    const storyPicture = res.data.image_url;
    dispatch({
      type: CREATE_PICTURE_SUCCESS,
      payload: { storyPicture }
    });
    return storyPicture;
  } catch (err) {
    console.error('Error creating story:', err);
    dispatch({
      type: CREATE_PICTURE_FAIL
    });
    return err; // Puedes devolver el error para manejarlo en el componente si es necesario
  }
};

export const create_story_speech = async (parameter) => {
  try {
    const res = await axios.post('http://192.168.178.36:8081/api/v1/story/createStorySpeech', {parameter});
    console.log('Response from create_story_speech in axios:', res.data);

    const audioBuffer = res.data.audioBuffer;
    console.log('Audio Buffer Length:', audioBuffer.length);
    console.log('Base64 Encoded Audio Data:', audioBuffer.substring(0, 100));

    return res;
  } catch (err) {
    console.error('Error creating story speech:', err);

    return { success: false, error: err };
  }
};



