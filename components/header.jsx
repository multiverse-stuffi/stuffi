import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import LogButton from './LogButton';
import Image from 'next/image';
import Head from './head';
import ChangePassword from './ChangePassword';
import { useSession, signIn, signOut } from 'next-auth/react';

function Header({ username, setUsername, userId, refreshData }) {
  const { data: session } = useSession();
  
  return (
    <>
      <Head />
      <Box>
        <AppBar
          position='static'
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            background: '#004F2D',
            padding: '15px 1em',
            '@media(max-width: 780px)': { flexDirection: 'column' },
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src='/thumbtack.png'
              width={50}
              height={50}
              alt='logo'
            />
            <Typography variant='h4'>📌 Stuffi</Typography>
          </Box>
          {session && (
            <Typography
              sx={{ '@media(max-width: 780px)': { display: 'none' } }}
              variant='h5'>
              Welcome, {username}!
            </Typography>
          )}
          <Box>
            <>{session && <ChangePassword userId={userId} />}</>
            {session && (
              <LogButton
                setHeaderUsername={setUsername}
                refreshData={refreshData}
                onClick={() => signOut()}
              />
            )}
            {!session && (
              <LogButton
                setHeaderUsername={setUsername}
                refreshData={refreshData}
                onClick={() => signIn()}
              />
            )}
          </Box>
        </AppBar>
      </Box>
    </>
  );
}

export default Header;
