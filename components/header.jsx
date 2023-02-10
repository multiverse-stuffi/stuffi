import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Header() {
  return (
    <Box>
    <AppBar position = "static">
  <Typography>Stuffi</Typography>
    </AppBar>
    </Box>
  )
}

export default Header