// Initialize Firebase
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3uacXbXuYPTBSOWTtgOyodjsUhTcX03o",
  authDomain: "euclideanpuzzle.firebaseapp.com",
  databaseURL: "https://euclideanpuzzle-default-rtdb.firebaseio.com",
  projectId: "euclideanpuzzle",
  storageBucket: "euclideanpuzzle.appspot.com",
  messagingSenderId: "557054114182",
  appId: "1:557054114182:web:e03f1797cbc5a035a8d407",
  measurementId: "G-J4F4YF7Y54",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// NE PAS OUBLIER DE CONFIGURER FIREBASE AUTH TO ANONYMOUS !!!

// SIGN ANONYMOUS USER ----
firebase.auth().onAuthStateChanged((user) => {
  console.log("onAuthStateChanged");
  if (user) {
    // console.log(user);
    // User is signed in.
    let isAnonymous = user.isAnonymous;
    let uid = user.uid;
    // console.log(uid);
  } else {
    // No user is signed in.
  }
});

firebase
  .auth()
  .signInAnonymously()
  .catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log("anonymously auth error ----- " + errorCode);
    console.log(errorCode);
  });

const DATABASE = firebase.database();

//Permets d'enregistrer des informations dans la base de données
function SEND_MESSAGE(_type, _data) {
  // _data = {'data': _data, 't_created': Date.now()};
  DATABASE.ref(_type).set(_data);
}
