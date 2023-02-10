import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import LogButton from "./LogButton";
import Image from 'next/image';
import Head from './head';

function Header(props) {
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
            padding: "15px 1em"
          }}
        >
          <Box sx = {{display: "flex", alignItems: "center"}}>
          <Image src="/thumbtack.png" width={50} height={50} alt="logo"/>
          <Typography variant="h4">Stuffi</Typography>
          </Box>
          <LogButton refreshData={props.refreshData}/>
        </AppBar>
    </Box>
    </>
  );
}

export default Header;
