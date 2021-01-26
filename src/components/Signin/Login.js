import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./Login.module.css";
import { FcGoogle } from "react-icons/fc";
import {Context} from "../../index";
import firebase from "firebase";

const Login = () => {
  const {auth} = useContext(Context);
  const history = useHistory();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const onSubmit = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        // var user = result.user;
        var user = result.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setIsLogged(true);
          setName(user.displayName);
          setPhoto(user.photoURL);
          history.push("/roomlist");
        } else {
          // No user is signed in.
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("user");
        // Sign-out successful.
      })
      .catch(function (error) {
        console.log(error);
      });
    setIsLogged(false);
  };

  return (
    <>
      {isLogged ? (
        <div className={classes.formContent}>
          <div className={classes.user}>
            <img src={photo} alt="avatar" className={classes.userImg} />
          </div>
          <div className={classes.userName}>
            <h5>{name}</h5>
          </div>
          <button
            onClick={onLogout}
            type="button"
            className={classes.formButton}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className={classes.formContent}>
          <FcGoogle className={classes.Icon}/>
          <h1 className={classes.formHeader}>Sign in to your account</h1>

          <button
            onClick={onSubmit}
            type="button"
            className={classes.formButton}
          >
            Continue with Google
          </button>
        </div>
      )}
    </>
  );
};

export default Login;
