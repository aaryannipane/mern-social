import React, { useEffect, useState } from "react";
import "./chatOnline.css";
import axios from "axios";
export const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  const [friends, setFriends] = useState();
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("/users/friends/" + currentId);
        setFriends(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleClick = async (user)=>{
    try{
      const res = await axios.get(`/conversations/find/${currentId}/${user._id}`)
      setCurrentChat(res.data)
    }catch(e){
      console.log(e)
    }
  }
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={()=>{handleClick(o)}}>
          <div className="chatOnlineImgContainer">
            <img src={o?.profilePicture ? PF + o?.profilePicture : PF+"person/noAvatar.png"} className="chatOnlineImg" alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">o?.username</span>
        </div>
      ))}
    </div>
  );
};
