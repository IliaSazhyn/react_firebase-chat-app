import React, { useState, useEffect, useRef, useContext } from "react";
import { Context } from "../../index";
import { useParams } from "react-router-dom";
import Linkify from "react-linkify";
import RoomNavbar from "../RoomNavbar/RoomNavbar";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  Container,
  Button,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
} from "reactstrap";
import "./ChatRoom.css";

function ChatRoom() {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [roomname, setRoomname] = useState("");
  const [newchat, setNewchat] = useState({
    roomname: "",
    nickname: "",
    message: "",
    date: "",
    type: "",
  });
  const { room } = useParams();
  const { firebase, firestore } = useContext(Context);
  const divRef = useRef(null);
  const scrollToBottom = () => {
    if (divRef && divRef.current) {
      divRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const user = await JSON.parse(localStorage.getItem("user"));
      if (isSubscribed) {
        setNickname(user.displayName);
        setRoomname(room);
      }

      firestore
        .ref("chats/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp) => {
          if (isSubscribed) {
            resp.id = setChats([]);
            setChats(snapshotToArray(resp));
          }
        });
    };

    fetchData();
    return () => (isSubscribed = false);
  }, [room, roomname, firestore]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      firestore
        .ref("roomusers/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp2) => {
          if (isSubscribed) {
            const roomusers = snapshotToArray(resp2);
            if (roomusers.length > 0) {
              setUsers(roomusers.filter((x) => x.status === "online"));
            }
          }
        });
    };

    fetchData();
    return () => (isSubscribed = false);
  }, [room, roomname, firestore]);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const dateWithoutSecond = new Date().toLocaleTimeString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const submitMessage = async (e) => {
    e.preventDefault();
    const chat = newchat;
    chat.roomname = roomname;
    chat.nickname = nickname;

    chat.date = dateWithoutSecond;
    chat.type = "message";
    const newMessage = await firebase.database().ref("chats/").push();
    newMessage.set(chat);
    setNewchat({ roomname: "", nickname: "", message: "", date: "", type: "" });
  };

  const onChange = (e) => {
    e.persist();
    setNewchat({ ...newchat, [e.target.name]: e.target.value });
  };

  const deleteHandler = (id) => {
    const key = id;
    firestore.ref("/chats/").child(key).set({});
  };

  const scrollHandler = () => {
    scrollToBottom();
  };

  let props = {};
  if (users) {
    props.users = users;
    props.roomname = roomname;
    props.nickname = nickname;
  }

  return (
    <Container fluid={true} className="ChatRoomContainer">
      <div className="ChatRoom">
        <RoomNavbar {...props} />
        <div
          className={`${chats.length >= "7" ? "ChatTest" : "ChatContainer"}`}
        >
          <div className="ChatContent">
            <Linkify>
              {chats.map((item, idx) => (
                <div
                  key={idx}
                  className="MessageBox"
                  ref={divRef}
                  style={
                    item.nickname === nickname
                      ? { display: "flex", justifyContent: "flex-end" }
                      : null
                  }
                >
                  <div className="ChatMessage">
                    {item.nickname === nickname && (
                      <div className="ChatMessageDelete">
                        <span
                          onClick={() => {
                            deleteHandler(item.key);
                          }}
                          type={`${item.nickname === nickname && "button"}`}
                        >
                          X
                        </span>
                      </div>
                    )}

                    <div
                      className={`${
                        item.nickname === nickname
                          ? "RightBubble"
                          : "LeftBubble"
                      }`}
                    >
                      {item.nickname === nickname ? null : (
                        <span className="MsgName">{item.nickname}</span>
                      )}
                      <span className="MsgDate"> at {item.date}</span>
                      <p>{item.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Linkify>
          </div>
        </div>

        <footer className="StickyFooter">
          <Button
            className="FooterScroll"
            color="link"
            variant="primary"
            type="button"
            onClick={() => {
              scrollHandler();
            }}
          >
            <AiOutlineArrowLeft
              style={{ fontSize: "1.5rem", color: "black" }}
            />
          </Button>
          <Form className="MessageForm" onSubmit={submitMessage}>
            <InputGroup>
              <Input
                maxLength="900"
                type="text"
                name="message"
                id="message"
                autoComplete="off"
                placeholder="Enter message here"
                value={newchat.message}
                onChange={onChange}
              />
              <InputGroupAddon addonType="append">
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </footer>
      </div>
    </Container>
  );
}

export default ChatRoom;
