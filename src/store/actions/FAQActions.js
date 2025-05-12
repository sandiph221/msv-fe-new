
import axios from 'axios';
import {
  GET_FAQS_REQUEST,
  GET_FAQS_SUCCESS,
  GET_FAQS_FAILURE,
  CREATE_FAQ_REQUEST,
  CREATE_FAQ_SUCCESS,
  CREATE_FAQ_FAILURE,
  UPDATE_FAQ_REQUEST,
  UPDATE_FAQ_SUCCESS,
  UPDATE_FAQ_FAILURE,
  DELETE_FAQ_REQUEST,
  DELETE_FAQ_SUCCESS,
  DELETE_FAQ_FAILURE
} from '../reducers/FAQReducers';

export const GetFAQs = () => async (dispatch) => {
  try {
    dispatch({ type: GET_FAQS_REQUEST });
    const response = await axios.get('/faqs');
    dispatch({ type: GET_FAQS_SUCCESS, payload: response.data });
    return response;
  } catch (error) {
    dispatch({ type: GET_FAQS_FAILURE, payload: error.response?.data });
    throw error;
  }
};

export const CreateFAQ = (data) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_FAQ_REQUEST });
    const response = await axios.post('/faqs', data);
    dispatch({ type: CREATE_FAQ_SUCCESS, payload: response.data });
    return response;
  } catch (error) {
    dispatch({ type: CREATE_FAQ_FAILURE, payload: error.response?.data });
    throw error;
  }
};

export const UpdateFAQ = (data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_FAQ_REQUEST });
    const response = await axios.put(`/faqs/${data.id}`, data);
    dispatch({ type: UPDATE_FAQ_SUCCESS, payload: response.data });
    return response;
  } catch (error) {
    dispatch({ type: UPDATE_FAQ_FAILURE, payload: error.response?.data });
    throw error;
  }
};

export const DeleteFAQ = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_FAQ_REQUEST });
    const response = await axios.delete(`/faqs/${id}`);
    dispatch({ type: DELETE_FAQ_SUCCESS, payload: id });
    return response;
  } catch (error) {
    dispatch({ type: DELETE_FAQ_FAILURE, payload: error.response?.data });
    throw error;
  }
};
