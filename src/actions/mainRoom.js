import database, { firebase } from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import {createRoom} from './rooms.js';
import moment from 'moment';
import {getBlockWords} from './blockedWords';
import * as path from 'path';
// import { ipcRenderer } from 'electron';

export const MESSAGE_CODE_VIDEO_1 = 'ladmincode1t';
export const MESSAGE_CODE_VIDEO_2 = 'ladmincode2t';

export const clearUnread = (roomName, uid, time, unread) => ({
  type: 'CLEAR_UNREAD',
  roomName,
  uid,
  time,
  unread
});

export const setEndVideo = () => {
  return {
    type: 'END_VIDEO',
  }
}

export const removeVideo = () => {
  return {
    type: 'REMOVE_VIDEO',
  }
}

export const saveUserInfo = (person) => ({
  type: 'SAVE_USER_INFO',
  person
});

export const setUnread = (roomName, uid, time, unread) => {
  return (dispatch) => {
    dispatch(clearUnread(roomName, uid, time, unread));
  }
};
export const updatePersonTotalWords = ( roomName , uid , totalWords) => {
  return {
    type : 'UPDATE_TOTAL_WORDS',
    roomName,
    uid,
    totalWords
  }
}

export const triggerVideo = (code) => {
  return {
    type : 'TRIGGER_VIDEO',
    code : code,
  }
}

export const startListening = (roomName) => {
  return (dispatch, getState) => {
    const state = getState();
    return database.ref(`rooms/${roomName}/messages`).on('child_added', (msgSnapshot) => {
      if (getState().rooms.find((r) => r.name === roomName)) {
        database.ref(`rooms/${roomName}/people`).once('value', (personSnapshot) => {            
          const message = msgSnapshot.val();
          if([ MESSAGE_CODE_VIDEO_1 , MESSAGE_CODE_VIDEO_2 ].includes(message.text.trim().toLowerCase() ) ){
          //  if(! message.sender.isAnonymous ){
            dispatch(triggerVideo(message.text.trim().toLowerCase()));
          //  }
          }
          let messageHandled = obfuscateWords(message.text , state.blockedWords )
          message.text = messageHandled.text;
          message.isObfuscated = messageHandled.isObfuscated;
          dispatch(sendMessage({ ...message, id: msgSnapshot.key }, roomName));
          dispatch(orderRoomsStartState()) ;
          if(message.sender.displayName!==getState().auth.displayName) {
            const audio = new Audio('/sounds/notif.mp3');
            audio.play();
          }
          const keyword = message.status && message.text.split(' ').splice(-1, 1)[0];
          if (keyword === "left") {
            dispatch(onLeft(roomName, message.sender.uid));
          }
          else if (keyword === "joined") {
            dispatch(onJoined(roomName, personSnapshot.val()[message.sender.uid]));
          }
          const personID = getState().auth.uid;

          if (personID === message.sender.uid ) {
            database.ref(`rooms/${roomName}/people/${personID}`).update({ unread: 0, lastRead: message.createdAt ,totalWords: message.sender.totalWords }).then(() => {
              dispatch(setUnread(roomName, personID, message.createdAt, 0));
              dispatch(updatePersonTotalWords(roomName,personID,message.sender.totalWords));
            });
          }
          else if (personID !== message.sender.uid && moment(message.createdAt) > moment(personSnapshot.val()[personID].lastRead)) {
            database.ref(`rooms/${roomName}/people/${personID}`).update({ unread: personSnapshot.val()[personID].unread + 1, lastRead: message.createdAt }).then(() => {
              dispatch(setUnread(roomName, personID, message.createdAt, personSnapshot.val()[personID].unread + 1));
            });
          }
        });
      }
    });
  }
}

export const saveLastRoom = (lastRoom) => {
  return {
    type: 'LAST_ROOM',
    lastRoom: lastRoom
  }
}
export const  getLastAddedRoom = () => {
    return async (dispatch, getState) => {
      const state = getState();
    const dbRef =  database.ref('rooms');
    const roomsSnapshot = await dbRef.once('value');
    const rooms = [];
    roomsSnapshot.forEach((childSnapshot) => {
      rooms.push({
        ...childSnapshot.val()
      });
    });
      
    rooms.sort(function(a, b){
      return a.date-b.date
    })

    const lastRoom = rooms[rooms.length - 1];
    return dispatch(saveLastRoom(lastRoom));
  }
}

export const updateCurrentUserWordCount = (count) => {
  return {
    type : "UPDATE_USER_MESSAGE_COUNT",
    count:count,
  }
}

export const hashWord = (word) => {
  if(word.length == 1){
     return word.replace(/./g, '*');
  }else if(word.length == 2){
    return word.replace(/.\b/g, '*');
  }else{
    const censored = word[0] + word.slice(1).replace(/.(?!$)/g, '*') 
    return censored;
    // return word.replace(/(?<!^).(?!$)/g, '*');  
  }
  return word;
}

export const obfuscateWords = (message,blockedWords) => {
  const messageArray = message.split(/[ .,?!]+/);
  if( Array.isArray(blockedWords) && Array.isArray(messageArray)  ){
    if(messageArray.length > 0 && blockedWords.length > 0){

      let messageReturned = '';
      let messageHashed = false;
      messageArray.forEach(word => {
        if ( blockedWords.includes(word) ) { 
          messageReturned += hashWord(word) + ' ';
          messageHashed = true;
        }else{
          messageReturned += word + ' ';
        }
      });
      if(messageHashed){
        return {text: messageReturned , isObfuscated: true};
      }
    }
  }
  return {text:message , isObfuscated: false};
}
//Method that checks if the user is already in the channel, subscribe the user to the channel, subscribe react app to firebase
export const joinLastCreatedRoom = (user) => {

  return  async (dispatch, getState) => {
    const state = getState();
    const lastRoomWait = await dispatch(getLastAddedRoom());
    const lastRoom = lastRoomWait.lastRoom;
    const blockedWordsWait = await dispatch(getBlockWords());
    const blockedWords = blockedWordsWait;
    // react subscribe to the channel as soon as we have the last room
    dispatch(startListening(lastRoom.name));

    //query
    const dbRef = database.ref(`rooms/${lastRoom.name}`);
    const snapshot = await dbRef.once('value');
    const value = snapshot.val()

      if (value === null) {
        return showJoinError('Room not found!');
      } else {
        //dispatch(startListening(lastRoom.name));
        // construct the guest user
        const anonimNumber = `Anonim ${Object.keys(value.people).length}`;
        const person = {
          name: 'Anonim',
          anonimNumber:anonimNumber,
          isAnonymous: true,
          id: user.uid,
          totalWords: 140,
          unread: 0,
          lastRead: 0
        };
        let people = [];
        let messages = [];
        for (var key in value.people) {
          people.push({
            ...value.people[key]
          });
        }
        for (var key in value.messages) {
          let messageHandled = obfuscateWords(value.messages[key].text , blockedWords)
          value.messages[key].text = messageHandled.text;
          value.messages[key].isObfuscated = messageHandled.isObfuscated,
          messages.push({
            ...value.messages[key],
            id: key
          });

        }

        dispatch(createRoom({
          people: [...people,person],
          name: lastRoom.name,
          date: lastRoom.date,
          messages
        }));
        let storePerson = person;
        if ( !(user.uid in value.people)) {
          const personRef = database.ref(`rooms/${lastRoom.name}/people/${person.id}`); 
          const ref = await personRef.set(person);
          const usersRef = database.ref(`users/${person.id}/rooms/${lastRoom.name}`);
          const ref2 = usersRef.set({ roomName: lastRoom.name });

          const perName = person.name;

          dispatch(startSendMessage(`${person.anonimNumber} joined`, lastRoom.name, true)); 
        }else{
          // user is already in db get current user in the current room
          storePerson = value.people[user.uid];
        }
        dispatch(saveUserInfo(storePerson));
      }

  }
}
export const countWords = (s) =>{
  s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
  s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
  s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
  return s.split(/[ .,?!]+/).filter(function(str){return str!="";}).length;
  //return s.split(' ').filter(String).length; - this can also be used
}
export const sendMessage = (message, roomName) => {
  return {
    type: 'SEND_MESSAGE',
    message,
    roomName
  }
}

export const startSendMessage = (text, roomName, status = false) => {
  return (dispatch, getState) => {
    const authUser = getState().auth;

    if( authUser){

      let user = getState().rooms[0].people.filter( el =>  el.id == authUser.uid )[0];
      
      if (user) {
        const uid = user.id;
        const displayName = user.name;
        const isAnonymous = user.isAnonymous;
        let totalWords = user.totalWords - countWords(text);
        if(status){
          totalWords = user.totalWords;
        }
        const anonimNumber = user.anonimNumber;
        if(totalWords >= 0){
        
        const message = {
          sender: { uid, displayName , isAnonymous , totalWords , anonimNumber },
          text,
          createdAt: moment().format(),
          status
        };
          dispatch(updateCurrentUserWordCount(totalWords));
          return database.ref(`rooms/${roomName}/messages`).push(message);
        }else{
          //this is the second protection. The words should be blocked in the UI first. If is any problem there will catch here and not save more 140 words in db.
          console.log('Error: User submitted more than 140 words');
        }
      }else{
        console.log('Error: User Not found in Room');
      }
    }
  };
};

export const orderRoomsStartState = () => ({
  type: 'ORDER_ROOMS_START_STATE'
});


export const clearStateMainRoom = ({
  type: 'CLEAR_STATE_MAIN_ROOM',
})

export const onLeft = (roomName, personID) => ({
  type: 'ON_LEFT',
  roomName,
  personID
});

export const onJoined = (roomName, person) => ({
  type: 'ON_JOINED',
  roomName,
  person
});