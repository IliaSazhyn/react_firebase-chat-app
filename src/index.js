import React, { createContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase/app";
import "./index.css";
import App from "./App";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwLnrncOwUvkopdVnkbG2v2-i0RkGRROc",
  authDomain: "send2me-chat.firebaseapp.com",
  databaseURL: "https://send2me-chat-default-rtdb.firebaseio.com/",
  projectId: "send2me-chat",
  storageBucket: "send2me-chat.appspot.com",
  messagingSenderId: "1038144293399",
  appId: "1:1038144293399:web:7c04423a07ae1492b9aa52",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.database();
export const Context = createContext(null);

ReactDOM.render(
  <Context.Provider value={{ firebase, auth, firestore }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Context.Provider>,
  document.getElementById("root")
);
