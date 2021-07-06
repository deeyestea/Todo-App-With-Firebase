import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAleK4Y36oUORREQ6_k731Mk7fXuznzBC8",
    authDomain: "todo-app-f6284.firebaseapp.com",
    databaseURL: "https://todo-app-f6284-default-rtdb.firebaseio.com",
    projectId: "todo-app-f6284",
    storageBucket: "todo-app-f6284.appspot.com",
    messagingSenderId: "166171569744",
    appId: "1:166171569744:web:919ebc1ccb4cd0857aab55"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const users = firebaseApp.database().ref().child('users');
export const usersTasklist = firebaseApp.database().ref().child('usersTasklist');