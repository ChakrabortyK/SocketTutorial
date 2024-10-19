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
    })

    return () => {
      socket.disconnect()
    }
  }, [])


  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socketID, setSocketId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message)
    setMessage("");
  }
  // const handleRoom = (e) => { //step2
  //   e.preventDefault();
  //   socket.emit('join-room', room)
  //   setMessage("");
  // }



  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: 200 }} />
        <Typography variant="h6" component="div" gutterBottom>
          {socketID}
          {/* using the socketid set during connect */}
        </Typography>

        <form onSubmit={handleRoom}>

        </form>
        <form onSubmit={handleSubmit}>
          <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />
          <Button type="submit" variant="contained">Submit</Button>
        </form>

      </Container>
    </>
  );
};

export default App;
