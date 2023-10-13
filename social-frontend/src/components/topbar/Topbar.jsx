import React, { useContext, useEffect, useState, useRef } from "react";
import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
export const Topbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    // Add event listener to the document to handle clicks
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    // localStorage.removeItem("user");
    dispatch({type: "LOGOUT"})
    console.log(user);
    navigate("/login")
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Nipanesocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat
              onClick={() => {
                navigate("/messenger");
              }}
            />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        {/*  */}
        <div className="imageOptionsContainer" ref={dropdownRef}>
          <button className="topbarImgContainer" onClick={toggleDropdown}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "/person/noAvatar.png"
              }
              alt=""
              className="topbarImg"
            />
          </button>
          {isDropdownVisible && (
            <div className="topbarProfileOptions">
              <Link to={`/profile/${user.username}`} className="optionLink">
                Profile
              </Link>
              <Link to={"/setting"}  className="optionLink">
                Setting
              </Link>
              <div className="optionLink" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
