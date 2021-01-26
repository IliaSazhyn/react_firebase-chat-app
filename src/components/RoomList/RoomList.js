import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../index";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useObject } from 'react-firebase-hooks/database';
import { RiDeleteBin2Line } from "react-icons/ri";
import { Link, useHistory } from "react-router-dom";
import {
  Alert,
  Badge,
  Jumbotron,
  ListGroup,
  ListGroupItem,
  Media,
  Navbar,
  Input,
  Button,
} from "reactstrap";
import "./RoomList.css";
import Loader from "../Loading/Loader";

const RoomList = () => {
  const [room, setRoom] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [tempName, setTempName] = useState("");
  const [showError, setShowError] = useState(false);
  const { firebase, firestore } = useContext(Context);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const user = await JSON.parse(localStorage.getItem("user"));
      if (isSubscribed) {
        setNickname(user.displayName);
        setAvatar(user.photoURL);
      }

      firestore.ref("rooms/").on("value", (resp) => {
        if (isSubscribed) {
          setRoom([]);
          setRoom(snapshotToArray(resp));
          setShowLoading(false);
        }
      });
    };

    fetchData();
    return () => (isSubscribed = false);
  }, [firestore]);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const enterChatRoom = (roomname) => {
    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .on("value", (resp) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x) => x.nickname === nickname);

        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "online" });
        } else {
          const newroomuser = {
            roomname: "",
            nickname: "",
            avatar: "",
            status: "",
          };
          newroomuser.roomname = roomname;
          newroomuser.nickname = nickname;
          newroomuser.avatar = avatar;
          newroomuser.status = "online";
          const newRoomUser = firebase.database().ref("roomusers/").push();
          newRoomUser.set(newroomuser);
        }
      });

    history.push("/chatroom/" + roomname);
  };

  const handlePass = (event) => {
    setConfirmPass(event.target.value);
  };

  const handlePrivate = (roomname) => {
    if (roomname.status === "private") {
      setShowPassword(!showPassword);
      setPass(roomname.pass);
      setTempName(roomname.roomname);
    } else {
      return enterChatRoom(roomname.roomname);
    }
  };

  const passwordHandler = () => {
    if (confirmPass === pass) {
      return enterChatRoom(tempName);
    } else setShowError(true);
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("user");
        history.push("/login");
        // Sign-out successful.
      });
  };

  const onDismiss = () => setShowError(false);

  const deleteHandler = (id) => {

    setShowPassword(!showPassword);
    const key = id.key;
    firebase.database().ref("/rooms/").child(key).set({});
  };

  return (
    <>
      <Navbar color="faded" light>
        <Button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
        <Media
          right
          object
          src={avatar}
          alt="User Avatar"
          className="RoomList_Avatar"
        />
      </Navbar>
      <Jumbotron className="RoomList_Table">
        <h2>Room List</h2>
        <div>
          <Link to="/addroom">
            <Button color="primary"> Add Room</Button>
          </Link>
        </div>
        <ListGroup>
          {room.map((item, idx) => (
            <ListGroupItem
              key={idx}
              className="ListGroup"
              action
              onClick={() => handlePrivate(item)}
            >
              <span>{item.roomname}</span>

              {item.admin === nickname ? (
                <Button
                  color="link"
                  className="ListGroupDelete"
                  onClick={() => deleteHandler(item)}
                >
                  <RiDeleteBin2Line />
                </Button>
              ) : null}

              <Badge color="primary">{item.status}</Badge>
            </ListGroupItem>
          ))}
          {showPassword && (
            <>
              <Alert color="info" isOpen={showError} toggle={onDismiss}>
                Please enter correct password
              </Alert>
              <Alert>
                <Input
                  required
                  min="1"
                  type="text"
                  name="password"
                  placeholder="Enter Password"
                  value={confirmPass}
                  onChange={handlePass}
                />{" "}
                <Button
                  className="PasswordConfirm"
                  onClick={() => {
                    passwordHandler();
                  }}
                >
                  Confirm
                </Button>
              </Alert>
            </>
          )}
        </ListGroup>

        {showLoading && <Loader />}
      </Jumbotron>
    </>
  );
};

export default RoomList;
