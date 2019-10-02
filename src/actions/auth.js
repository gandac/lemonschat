import database, { firebase, githubAuthProvider as provider } from '../firebase/firebase';

export const login = (uid, displayName , isAnonymous) => { 
  return {
    type: 'LOGIN',
    uid,
    displayName,
    isAnonymous
  };
}
export const startEmailLogin = (email,password) => {
  return dispatch => {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then ( result => {
        console.log('result' , result);
      })
      .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      // ...
    });
  }
}
export const signInAnonymously = () => {
  return dispatch => {
    return firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    
      if (errorCode === 'auth/operation-not-allowed') {
        alert('You must enable Anonymous auth in the Firebase Console.');
      } else {
        console.error(error);
      }
    });
  }
}
export const startLogin = () => {
  return () => {
    // return firebase.auth().signInWithPopup(googleAuthProvider);
   return firebase.auth().signInWithRedirect(provider);
   
   firebase.auth().getRedirectResult().then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      const name = user.displayName ? user.displayName : user.email;
      database.ref(`users/${user.uid}`).once((snapshot) => {
        if(!snapshot.val()) {
          database.ref(`users/${user.uid}`).set({
            name,
            uid: user.uid,
            email: user.email,
            rooms: [],
            token
          });
        }
      });
      
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  };
};

export const logout = () => ({
  type: 'LOGOUT'
});

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
