import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import LogButton from './LogButton';
import Image from 'next/image';
import ChangePassword from './ChangePassword';

const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    requiresAuth: true,
  },
  {
    title: 'Pricing',
    path: '/pricing',
    requiresAuth: false,
  },
];

const Nav = () => {
  const { user, error, isLoading } = useUser();
  const pathname = useRouter();


  return (
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
          <h1 >
        <Link href='/'>
          <a>Stuff</a>
        </Link>
      </h1>
          <div>
        {menuItems.map(({ title, path, requiresAuth }) => {
          const showItem = !requiresAuth || (requiresAuth && user);
          return showItem ? (
            <Link href={path} key={path}>
              <a
                className={`${pathname === path ? 'underline' : ''}`}>
                {title}
              </a>
            </Link>
          ) : null;
        })}
      </div>
            {isLoggedIn && <ChangePassword userId={userId}/>}
            <LogButton setHeaderUsername={setUsername} refreshData={refreshData} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </Box>
        </AppBar>
       {user ? (
        <a href='/api/auth/logout'>Logout</a>
      ) : (
        <a href='/api/auth/login'>Login</a>
      )}
    </Box>
  );
};

export default Nav;
