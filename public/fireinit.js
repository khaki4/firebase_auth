/// <reference path="../node_modules/@types/firebase/index.d.ts" />

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAMDHT019sZpp8kkmaaebaMht_iV3QAp68",
  authDomain: "fir-auth-ff24b.firebaseapp.com",
  databaseURL: "https://fir-auth-ff24b.firebaseio.com",
  storageBucket: "fir-auth-ff24b.appspot.com",
  messagingSenderId: "64516457407"
};
const app = firebase.initializeApp(config);
const auth = app.auth();
