import React, { Component } from "react";

// Input: liked: boolean
// Output: onClick

const Like = ({liked, onClick}) => {
  let classes = "fa fa-heart";
  if (!liked) classes += "-o";
  return (
    <i
      onClick={onClick}
      className={classes}
      style={{ cursor: "pointer" }}
      aria-hidden="true"
    ></i>
  );
};

export default Like;
