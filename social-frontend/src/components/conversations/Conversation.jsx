import React, { useEffect, useState } from 'react'
import "./conversation.css"
import axios from 'axios'

export const Conversation = ({conversation, currentUser}) => {
  const [user, setUser]= useState(null)

  useEffect(()=>{
    const friendId = conversation.members.find(m=> m!==currentUser._id)
    const getUser = async ()=>{
      try {
        const response = await axios.get("/users?userId="+friendId);
        setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [currentUser?._id])

  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <div className='conversation'>
      <img src={user?.profilePicture? (PF + user.profilePicture) : (PF + "person/noAvatar.png")} alt="" className='conversationImg'/>
      <span className='conversationName'>{user?.username}</span>
    </div>
  )
}
