import React, { lazy, Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import Loader from "./components/Loading/Loader";
const SignIn = lazy(() => import('./components/Signin/index'));
const RoomList = lazy(() => import('./components/RoomList/RoomList'));
const AddRoom = lazy(() => import('./components/AddRoom/AddRoom'));
const ChatRoom = lazy(() => import('./components/ChatRoom/ChatRoom'));

function App() {
  let location = useLocation();

  return (
    <Router>
      <>
      <Suspense fallback={<Loader/>}>
        <Redirect
          to={{
            pathname: "/roomlist",
            state: { from: location },
          }}
        />
        <Switch>
          <Route path="/login">
            <SignIn />
          </Route>
          <SecureRoute path="/roomlist">
            <RoomList />
          </SecureRoute>
          <SecureRoute path="/addroom">
            <AddRoom />
          </SecureRoute>
          <SecureRoute path="/chatroom/:room">
            <ChatRoom />
          </SecureRoute>
        </Switch>
        </Suspense>
      </>
    </Router>
  );
}

export default App;

function SecureRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("user") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
