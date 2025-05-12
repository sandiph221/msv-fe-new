import axios from "axios";
import { toast } from "react-toastify";

export const getPagesInfo = (page =1, page_limit =10) => (dispatch, getState)=> { // get all added profile pages info for superadmin
    dispatch({
        type: "GET_PAGES_INFO_START"
    })
    const { activeSocialMediaType } =
    getState().socialMediaProfileListReducer;
    axios.get(`admin-dashboard/${activeSocialMediaType}?page=${page}&page_limit=${page_limit}`)
    .then(response => {
        dispatch({
            type: "GET_PAGES_INFO",
            payload: response.data.data
        })
    })
    .catch((error) => { 
        if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Some thing went wrong");

          }
    })
}

export const updatePagesInfo = (id) => (dispatch, getState)=> { // update profile pages info for superadmin
    dispatch({
        type: "UPDATE_PAGES_INFO_START"
    })
    const { activeSocialMediaType } =
    getState().socialMediaProfileListReducer;
    axios.put(`social-media/${activeSocialMediaType}/${id}/pull`)
    .then(response => {
       dispatch({
           type: "UPDATE_PAGES_INFO"
       })
    })
    .then(() => {
        toast.success("Page updated  sucessfull")
    })
    
    .catch((error) => { 
        if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong");

          }
    })
}

export const deletePagesInfo = (id) => (dispatch, getState)=> { // delete profile pages info for superadmin
    dispatch({
        type: "DELETE_PAGES_START"
    })
    const { activeSocialMediaType } =
    getState().socialMediaProfileListReducer;
    axios.delete(`social-media/profiles/delete/${id}`)
    .then(response => {
       dispatch({
           type: "DELETE_PAGES"
       })
    })
    .then(() => {
        toast.success("Page removed sucessfull")
    })
    .then(() => {
        dispatch(getPagesInfo())
    })
    .catch((error) => { 
        if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong");

          }
    })
}