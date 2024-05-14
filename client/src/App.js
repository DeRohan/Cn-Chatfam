import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import Image from "./Image";
import img from  "./image/chatfams copy.png";

const primaryColor = "#041E42";
const secondaryColor = "#007791";
const textColor = "#333";

const Page = styled.div`
  display: flex;
  align-items: center;
  background-color: #7CB9E8;
  flex-direction: column;
`;

const Container = styled.div`
  background-color: #fff;
  margin: auto;
  height: 60vh;
  padding: 33px;
  overflow-y: scroll;
  margin-bottom: 23px;
  margin-top: 10px;
  border-radius: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: 1000px;
`;

const TextArea = styled.textarea`
  width: 500px;
  height: 42px;
  border: 2px solid ${primaryColor};
  border-radius: 10px;
  margin-top: 2px;
  // padding: 10px;
  font-size: 17px;
  background-color: transparent;
  color: ${textColor};
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${secondaryColor};
  }

  &::placeholder {
    color: ${secondaryColor};
  }
`;

const Button = styled.button`
  background: #ace1af;
  border: none;
  height: 35px;
  width: 100px;
  border-radius: 2px;
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  max-width: 1000px;
  align-items: center;
  margin-top: 20px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: ${primaryColor};
  color: #fff;
  padding: 5px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const MyReply = styled.div`
  width: 45%;
  background-color: ${secondaryColor};
  color: #fff;
  padding: 10px;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #ace1af;
  width: 100px;
  // border-radius: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Para = styled.p`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const Imagecheck = styled.img`
  width: 80px;
  height: 80px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const FileInput = styled.input `
  padding-left: 10px;
`;  

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");
  const [username, setUsername] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');
  
    const name = prompt("Please enter your name:");
    setUsername(name);
  
    // Emit a message indicating that the user has joined the chat
    socketRef.current.emit("send message", {
      type: "join",
      username: "Admin",
      body: `${name} has joined the chat`
    });
  
    socketRef.current.on("your id", id => {
      setYourID(id);
    });
  
    socketRef.current.on("message", message => {
      receivedMessage(message);
    });
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (file) {
      const messageObject = {
        id: yourID,
        type: "file",
        body: file,
        namefile: file.type,
        filename: file.name,
        username: username
      };
      setMessage("");
      setFile("");
      socketRef.current.emit("send message", messageObject);
    } else {
      const messageObject = {
        id: yourID,
        type: "text",
        body: message,
        username: username
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function selectFile(e) {
    setMessage(e.target.files[0]);
    setFile(e.target.files[0])
  }

  function renderMessages(message, index) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });
      if (message.id === yourID) {
        return (
          <MyRow key={index}>
            <Image fileNmae={message.filename} blob={blob} />
            {message.username}
          </MyRow>
        )
      }
      return (
        <PartnerRow key={index}>
          <Image fileNmae={message.filename} blob={blob} />
          {message.username}
        </PartnerRow>
      )
    }
    if (message.body !== "")
    {
      if (message.id === yourID) {
        return (
          <MyRow key={index}>
            <MyMessage>
              {message.username} : {message.body}
            </MyMessage>
          </MyRow>
        )
      }
      return (
        <PartnerRow key={index}>
          <MyReply>
            {message.username} : {message.body}
          </MyReply>
        </PartnerRow>
      )
    }

  }

  return (
    <Page>
      <Navbar>
      <Para>CHATFAMS</Para>
        <Imagecheck src={img} alt="" />
      </Navbar>
      <Container>
        {messages.map(renderMessages)}
      </Container>
      <Form onSubmit={sendMessage}>
        <TextArea value={message} onChange={handleChange} placeholder="Say something..." />
        <FileInput onChange={selectFile} type="file" />
        <Button>Send</Button>
      </Form>
    </Page>
  );
};

export default App;
