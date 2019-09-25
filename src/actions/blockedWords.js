import database, { firebase } from '../firebase/firebase';
import * as actionTypes from './types';


const getBlockWordsRequest = () => {
    return {
        type: actionTypes.GET_BLOCKED_WORDS_REQUEST
    }
}

const getBlockWordsSuccess= (action) => {
    return {
        type: actionTypes.GET_BLOCKED_WORDS_SUCCESS,
        blockedWords: action
    }
}
const getBlockWordsError= (error) => {
    return {
        type: actionTypes.GET_BLOCKED_WORDS_ERROR,
        error: error
    }
}

export const getBlockWords = () => {
    return (dispatch,getState) => {
        dispatch(getBlockWordsRequest());
        const dbRef =  database.ref(`blockedWords`);
        return dbRef.once('value').then((snapshot)=>{
            const blockedWords = []
            snapshot.forEach((childSnapshot) => {
                blockedWords.push(childSnapshot.val());
            });
            dispatch(getBlockWordsSuccess(blockedWords));
            return blockedWords;
        }).catch(error => {
            dispatch(getBlockWordsError(error));
        });
    }
}

const insertBlockWordsRequest = () => {
    return {
        type: actionTypes.INSERT_BLOCK_WORD_REQUEST
    }
}

const insertBlockWordsSuccess = (word) => {
    return {
        type: actionTypes.INSERT_BLOCK_WORD_SUCCESS,
        blockWord: word
    }
}
const insertBlockWordsError = (error) => {
    return {
        type: actionTypes.INSERT_BLOCK_WORD_ERROR,
        error: error
    }
}

export const insertBlockWords = (word) => {
    return  (dispatch,getState) => {

        dispatch(insertBlockWordsRequest());
        const saveWord = word.trim();
        const dbRef =  database.ref(`blockedWords/${saveWord}`).set(saveWord).then((snapshot)=>{
            dispatch(insertBlockWordsSuccess(saveWord));
        }).catch(error => {
            console.log('Error: ', error);
            dispatch(insertBlockWordsError(error));
        });
    }
}


const removeBlockWordsRequest = () => {
    return {
        type: actionTypes.REMOVE_BLOCK_WORD_REQUEST
    }
}

const removeBlockWordsSuccess = (word) => {
    return {
        type: actionTypes.REMOVE_BLOCK_WORD_SUCCESS,
        word: word
    }
}
const removeBlockWordsError = (error) => {
    return {
        type: actionTypes.REMOVE_BLOCK_WORD_ERROR,
        error: error
    }
}

export const removeBlockWords = (word) => {
    return  (dispatch,getState) => {

        dispatch(removeBlockWordsRequest());

        const dbRef =  database.ref(`blockedWords/${word}`);
        dbRef.remove().then(()=>{
            dispatch(removeBlockWordsSuccess(word));

        }).catch(error => {
            dispatch(removeBlockWordsError(error));
        });
    }
}
