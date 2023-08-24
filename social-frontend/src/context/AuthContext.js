// https://youtu.be/pFHyZvVxce0?t=3421 (watch video to understand what it is)

import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const user_test_data = {
  _id: "63b184b89201ba4687d7e00e",
  username: "One",
  email: "one@gmail.com",
  password: "$2b$10$2s3x7ET72g2RXsE/66GQXeSaHqCzP7gMvKSHqIKNFZS1XfAhgfyvO",
  profilePicture: "person/1.jpeg",
  coverPicture: "",
  followers: ["63b1880b7603ae2cbb5eb168"],
  isAdmin: false,
  createdAt: { $date: { $numberLong: "1672578232169" } },
  updatedAt: { $date: { $numberLong: "1688761745008" } },
  __v: { $numberInt: "0" },
  followings: [],
  desc: "Hello Friends",
  city: "mumbai",
  from: "India",
  relationship: { $numberDecimal: "1" },
};

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  // update user data when there is any changes in user data in database like when following, unfollowing we are not updating user data here in context state

  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
