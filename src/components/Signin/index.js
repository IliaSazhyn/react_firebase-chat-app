import React, { Suspense } from "react";
// import { Container, FormWrap, FormContent, Form, Icon } from "./SigninElements";

import { Link } from "react-router-dom";
import classes from "./Login.module.css";
const SignIn = () => {
  const LazyLogin = React.lazy(() => import("./Login"));
  return (
    <>
      <div className={classes.Container}>
        <div className={classes.FormWrap}>
          <Link to="/login" className={classes.Header}>SEND2ME</Link>
          <div className={classes.FormContent}>
            <div className={classes.Form}>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyLogin />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
