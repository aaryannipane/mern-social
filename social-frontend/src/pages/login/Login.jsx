import React, { useContext, useRef } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

export const Login = () => {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NipaneSocial</h3>
          <span className="loginDesc">
            Connect your friend and the world around you with NipaneSocial
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="email"
              placeholder="email"
              className="loginInput"
              ref={email}
              required
            />
            <input
              type="password"
              placeholder="password"
              minLength="6"
              className="loginInput"
              ref={password}
              required
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress style={{ color: "white" }} size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button
              className="loginRegisterButton"
              disabled={isFetching}
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              {isFetching ? (
                <CircularProgress style={{ color: "white" }} size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
