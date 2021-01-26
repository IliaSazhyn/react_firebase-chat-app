import React, { useState, useContext } from "react";
import { Context } from "../../index";
import { useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  CardImg,
  Card,
  Navbar,
  NavItem,
  NavbarToggler,
  Nav,
  ListGroup,
  ListGroupItem,
  NavbarBrand,
  Button,
} from "reactstrap";
import "./RoomNavbar.css";

const RoomNavbar = (props) => {
  const { firestore } = useContext(Context);
  const history = useHistory();
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

  const exitChat = (e) => {
    firestore
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(props.roomname)
      .once("value", (resp) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x) => x.nickname === props.nickname);
        const userRef = firestore.ref("roomusers/" + user.key);
        userRef.update({ status: "offline" });
      });

    history.goBack();
  };

  return (
    <div className="Sidebar">
      <Navbar color="faded" light className="UsersCard">
        <NavbarBrand>
          {" "}
          <Button
            color="link"
            variant="primary"
            type="button"
            onClick={() => {
              exitChat();
            }}
          >
            <AiOutlineArrowLeft
              style={{ fontSize: "1.5rem", color: "black" }}
            />
          </Button>
        </NavbarBrand>
        <NavbarToggler onClick={showSidebar} className="mr-2" />
        <Card className={sidebar ? "Navbar active" : "Navbar "}>
          {" "}
          <Nav>
            <NavItem className="UsersList">
              {props.users.map((item, idx) => (
                <ListGroup flush key={idx} className="UsersCard">
                  <ListGroupItem className="CardBody">
                    {item.avatar ? (
                      <CardImg
                        className="UserImage"
                        src={item.avatar}
                        alt="User"
                      />
                    ) : null}

                    {item.nickname}
                  </ListGroupItem>
                </ListGroup>
              ))}
            </NavItem>
          </Nav>
        </Card>
      </Navbar>
    </div>
  );
};

export default RoomNavbar;
