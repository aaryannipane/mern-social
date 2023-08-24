import React, { useRef } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const res = await axios.post("/auth/register", user);
        console.log(res.data);
        return navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

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
              placeholder="username"
              className="loginInput"
              ref={username}
              required
            />
            <input
              type="email"
              placeholder="email"
              className="loginInput"
              ref={email}
              required
            />
            <input
              type="password"
              minLength="6"
              placeholder="password"
              className="loginInput"
              ref={password}
              required
            />
            <input
              type="password"
              minLength="6"
              placeholder="password again"
              className="loginInput"
              ref={passwordAgain}
              required
            />
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <button
              type="button"
              className="loginRegisterButton"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
