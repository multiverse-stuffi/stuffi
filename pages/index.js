import React, { useState } from "react";
import StuffCard from "../components/card";
import Box from '@mui/material/Box';
import Header from "../components/header";
import { getCookies } from 'cookies-next';

function Home({data, url}) {
  const [items, setItems] = useState(data);
  const boxStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center'
  }
  const refreshData = async () => {
    const res = await fetch(`http://${url}/api/item`, {headers: {Cookie: getCookies()}});
    const data = res.ok ? await res.json() : [];
    setItems(data);
  }

  return (
    <>
      <Header refreshData={refreshData}/>
      <Box sx={boxStyles}>
        {items.map(item => (
          <StuffCard key={item.id} item={item}/>
        ))}
      </Box>
    </>
  );
}


export async function getServerSideProps(context) {
  const { req } = context;
  const url = `${process.env.HOST}:${process.env.PORT}`;
  if (!req.cookies.token) return {
    props: {
      data: [],
      url
    }
  };
  const res = await fetch(`http://${url}/api/item`, {headers: {Cookie: req.headers.cookie}});
  const data = res.ok ? await res.json() : [];
  return {
    props: {
      data,
      url
    }
  };
}

export default Home;