import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
const App = () => {

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socketId FrontEnd: ', socket.id)
      setSocketId(socket.id);// step2
    })

    socket.on('welcome', (msgData) => {
      console.log("Welcome emit recieve: ", msgData);
    })

    socket.on('recieve-message', (msgData) => {
      console.log("From Other Side: ", msgData);
      setConversation(prevConvosation => [...prevConvosation, msgData]);

      console.log('conversation', conversation)
    })

    return () => {
      socket.disconnect()
    }
  }, [])



  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { message, roomName })
    setMessage("");
  }
  const handleRoom = (e) => { //step2
    e.preventDefault();
    socket.emit('join-room', roomName)
    setMessage("");
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: 100 }} />
        <Typography variant="h6" component="div" gutterBottom>
          {socketID}
          {/* using the socketid set during connect */}
        </Typography>

        <form onSubmit={handleRoom}>
          <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id="outlined-basic" label="Room" variant="outlined" />
          <Button type="submit" variant="contained">Join</Button>
        </form>
        <form onSubmit={handleSubmit}>
          <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />

          <TextField value={user} onChange={(e) => setUser(e.target.value)} id="outlined-basic" label="User" variant="outlined" />
          <Button type="submit" variant="contained">Submit</Button>
        </form>

        <Stack>
          {conversation.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))}
        </Stack>

      </Container>
    </>
  );
};

export default App;
