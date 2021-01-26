import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../index";
import { useHistory } from "react-router-dom";
import Loader from "../Loading/Loader";
import {
  Alert,
  Jumbotron,
  Form,
  Button,
  FormGroup,
  Navbar,
  CustomInput,
  Label,
  Input,
} from "reactstrap";
import "./AddRoom.css";

function AddRoom() {
  const { firestore } = useContext(Context);
  const history = useHistory();
  const [room, setRoom] = useState({
    roomname: "",
    status: "public",
    pass: "",
    admin: "",
  });
  const [showLoading, setShowLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const ref = firestore.ref("rooms/");

  const saveFormData = () => {
    setRoom((room.admin = nickname));
    ref
      .orderByChild("roomname")
      .equalTo(room.roomname)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          setShowError(true);
        } else {
          const newRoom = firestore.ref("rooms/").push();
          newRoom.set(room);
          history.goBack();
          setShowLoading(false);
          alert("Room was create successfully!");
        }
      });
  };

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const user = await JSON.parse(localStorage.getItem("user"));
      if (isSubscribed) {
        setNickname(user.displayName);
      }
    };

    fetchData();
    return () => (isSubscribed = false);
  }, []);

  const goBack = () => {
    history.goBack();
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      saveFormData();
      setShowLoading(true);
    } catch (error) {
      alert(`Registration failed! ${error.message}`);
    }
  };
  const set = (name) => {
    return ({ target: { value } }) => {
      setRoom((oldValues) => ({ ...oldValues, [name]: value }));
    };
  };

  const onChangeRadio = () => {
    room.status === "private" ? setShowPassword(false) : setShowPassword(true);
  };
  const onDismiss = () => setShowError(false);
  return (
    <div className="AddRoom">
      <Navbar color="faded" light className="AddRoom_Navbar">
        <Button
          onClick={() => {
            goBack();
          }}
        >
          Back
        </Button>
      </Navbar>
      {showLoading && <Loader />}
      <Jumbotron>
        <h2>Please create new Room</h2>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label>Room Name</Label>
            <Alert color="info" isOpen={showError} toggle={onDismiss}>
              Room is already exist
            </Alert>
            <Input
              required
              type="text"
              name="roomname"
              id="roomname"
              maxLength="40"
              placeholder="Enter Room Name"
              value={room.roomname}
              onChange={set("roomname")}
            />

            <FormGroup>
              <Label for="exampleCheckbox">Accessibility</Label>
              <div>
                <CustomInput
                  defaultChecked
                  type="radio"
                  id="Radio"
                  value="public"
                  name="Radio"
                  label="Public chat"
                  onClick={set("status")}
                  onChange={onChangeRadio}
                />
                <CustomInput
                  type="radio"
                  id="Radio2"
                  name="Radio"
                  value="private"
                  label="Private chat"
                  onClick={set("status")}
                  onChange={onChangeRadio}
                />
              </div>
            </FormGroup>
            {showPassword && (
              <Input
                className="AddPassword"
                required
                min="1"
                type="number"
                name="password"
                placeholder="Enter Password"
                value={room.pass}
                onChange={set("pass")}
              />
            )}
          </FormGroup>

          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </Jumbotron>
    </div>
  );
}

export default AddRoom;
