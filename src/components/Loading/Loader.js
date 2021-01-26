import React from "react";
import { Spinner } from "reactstrap";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="onLoad">
      <Spinner  color="primary" />
    </div>
  );
};

export default Loader;
