import database, { firebase } from '../firebase/firebase';
import * as actionTypes from './types';


const getVideosRequest = () => {
    return {
        type: actionTypes.GET_VIDEOS_REQUEST
    }
}

const getVideosSuccess= (videos) => {
    console.log('videooooos',videos);
    return {
        type: actionTypes.GET_VIDEOS_SUCCESS,
        videos: videos
    }
}
const getVideosError= (error) => {
    return {
        type: actionTypes.GET_VIDEOS_ERROR,
        error: error
    }
}

export const getVideos = () => {
    return (dispatch,getState) => {
        dispatch(getVideosRequest());
        const dbRef =  database.ref(`videos`);
        return dbRef.once('value').then((snapshot)=>{
            
            const videos = snapshot.val();
            const returnVideos = {}
            for (let key in videos){
                returnVideos[key] = {};
                returnVideos[key].id = videos[key];
                returnVideos[key].hasChanged = false;
            }
            dispatch(getVideosSuccess(returnVideos));
            return videos;
        }).catch(error => {
            console.log('errrrrrrrrrrrrr',error);
            dispatch(getVideosError(error));
        });
    }
}

const insertVideoRequest = () => {
    return {
        type: actionTypes.INSERT_VIDEO_REQUEST
    }
}

const insertVideoSuccess = (name) => {
    return {
        type: actionTypes.INSERT_VIDEO_SUCCESS,
        name: name
    }
}
const insertVideoError = (error) => {
    return {
        type: actionTypes.INSERT_VIDEO_ERROR,
        error: error
    }
}

export const insertVideo = (name) => {
    return  (dispatch,getState) => {
        const state=getState();
        const videoId = state.videos[name].id;
        dispatch(insertVideoRequest());
        const saveId = videoId.trim();
        const dbRef =  database.ref(`videos/${name}`).set(saveId).then((snapshot)=>{
            dispatch(insertVideoSuccess(name));
        }).catch(error => {
            console.log('errrrrrrrrrorrrrrrrrrrrr', error);
            dispatch(insertVideoError(error));
        });
    }
}

export const changeVideo = (name,value) => {
    return {
        type: actionTypes.UPDATE_VIDEO,
        name: name,
        value: value
    }
}

