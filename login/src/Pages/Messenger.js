import React, { useState, useEffect } from "react";
import "./Messenger.css";
import Messages from "../Components/Messenger/Messages.js";
import Friends from "../Components/Friends/Friends.js";
import Chatbox from "../Components/Messenger/Chatbox.js";
import { useUserContext } from "../Contexts/UserContext.js";

export default function Messenger() {
  const [message, setMessage] = useState({});
  const [friendData, setFriendData] = useState([]);
  const [messages, setMessages] = useState([]);
  const { userData, setUserData } = useUserContext();
  const [currentFriendId, setCurrentFriendId] = useState('')

  useEffect(() => {
    const fetchMyData = async () => {
      const response = await fetch(`http://localhost:3001/user`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      const userData = {
        id: result.data,
      };

      setUserData(userData);
    };
    fetchMyData();
  }, []);

  useEffect(() => {
    const fetchFriendData = async () => {
      console.log(`User Id: ${userData.id}`)
      const response = await fetch(
        `http://localhost:3001/user/${userData.id}/friends/data`
      );
      const result = await response.json();
      setFriendData(result.data);
      console.log(result.data);
    };
    if(userData.id) {
      fetchFriendData();
    }
  }, [userData.id]);

  //**** PROVIDE CONTEXT ****/
  const extractFriendData = async (dataFromFriend) => {
    const friendId = dataFromFriend._id;
    setCurrentFriendId(friendId)
    const response = await fetch(
      `http://localhost:3001/conversation/user/${friendId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const result = await response.json();
    const conversationMessages = result.data; //array of message Ids
    setMessages(conversationMessages);
  };

  const handleMessageChange = (e) => {
    setMessage({
      ...message,
      content: e.target.value,
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    console.log('PPEASE')
    const newMessage = {
      sender: userData.id,
      receiver: currentFriendId,
      content: message.content,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log('HI')
    console.log(`Message Data: ${JSON.stringify(newMessage)}`)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
      credentials: "include",
    };
    const response = await fetch("http://localhost:3001/message/new", options);
    setMessage({
      content: "",
      sender: "",
      receiver: "",
      id: null,
    });
  };

  return (
    <div className="messages">
      <div className="messenger">
        <Friends
          className="friends-list"
          friendData={friendData}
          extractFriendData={extractFriendData}
        />
        <div className="chat-container">
          <div className="chat-box">
            <Messages 
              messages={messages} 
            />
          </div>
          <Chatbox 
            className='message-submission'
            onSubmit={handleSend}
            onChange={handleMessageChange}
            inputValue={message.content}
          />
        </div>
      </div>
    </div>
  );
}
