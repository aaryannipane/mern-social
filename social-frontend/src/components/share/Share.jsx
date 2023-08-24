import { Cancel, EmojiEmotions, Label, PermMedia, Room } from "@mui/icons-material";
import React, { useContext, useRef, useState } from "react";
import "./share.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export const Share = () => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const desc = useRef();
  const [file, setFile] = useState(null);


  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (file) {
      const data = new FormData();

      const fileName =
        Date.now() + "-" + Math.round(Math.random() * 1e9)+ "-" + file.name;

      data.append("name", fileName);
      data.append("file", file);
      newPost.image = fileName;
      try {
        axios.post("/upload", data);
        console.log(file);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }

    try {
      axios.post("/posts", newPost);
    } catch (e) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={PF + user.profilePicture} />
          <input
            placeholder={`What's in your mind ${user.username}?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={()=> setFile(null)}/>
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                accept=".png,.jpeg, .jpg"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </label>
            <div className="shareOption disabled" title="comming soon">
              <Label htmlColor="blue" className="shareIcon disabled" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption disabled" title="comming soon">
              <Room htmlColor="green" className="shareIcon disabled" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption disabled" title="comming soon">
              <EmojiEmotions htmlColor="goldenrod disabled" className="shareIcon" />
              <span className="shareOptionText">Feeling</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};
