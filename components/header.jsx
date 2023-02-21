import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import LogButton from "./LogButton";
import Image from 'next/image';
import Head from './head';
import ChangePassword from './ChangePassword';

function Header({username, setUsername, userId, refreshData, isLoggedIn, setIsLoggedIn}) {
  return (
    <>
      <Head />
      <Box>
        <AppBar
          position="static"
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            background: "#004F2D",
            padding: "15px 1em",
            '@media(max-width: 780px)': {flexDirection: 'column'},
          }}
        >
          <Box sx = {{display: "flex", alignItems: "center"}}>
          <Image src="/thumbtack.png" width={50} height={50} alt="logo"/>
          <Typography variant="h4">Stuffi</Typography>
          </Box>
          {isLoggedIn && <Typography sx={{'@media(max-width: 780px)': {display: 'none'}}} variant="h5">Welcome, {username}!</Typography>}
          <Box>
            {isLoggedIn && <ChangePassword userId={userId}/>}
            <LogButton setHeaderUsername={setUsername} refreshData={refreshData} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </Box>
        </AppBar>
    </Box>
    </>
  );
}

export default Header;
