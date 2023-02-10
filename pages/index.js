import React, { useState } from "react";
import StuffCard from "../components/card";
import Box from '@mui/material/Box';
import Header from "@/components/header";

function Home({data}) {
  const [items, setItems] = useState(data);
  const boxStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    justifyContent: 'center'
  }

  return (
    <>
      <Header />
      <Box sx={boxStyles}>
        {items.map(item => (
          <StuffCard item={item}/>
        ))}
      </Box>
    </>
  );
}


export async function getServerSideProps(context) {
  const { req } = context;
  if (!req.cookies.token) return {
    props: {
      data: []
    }
  };
  const res = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api/item`, {headers: {Cookie: req.headers.cookie}});
  const data = res.ok ? await res.json() : [];
  console.log(data);
  return {
    props: {
      data
    }
  };
}

export default Home;