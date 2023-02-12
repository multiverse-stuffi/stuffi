import React, { useState, useEffect } from "react";
import StuffCard from "../components/card";
import Box from '@mui/material/Box';
import Header from "../components/header";
import { getCookies, getCookie } from 'cookies-next';
const jwt = require('jsonwebtoken');

function Home({data, url, token, username}) {
  const [items, setItems] = useState(data);
  const [filteredItems, setFilteredItems] = useState(items);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [filters, setFilters] = useState([]);
  const [filterMode, setFilterMode] = useState('or');
  const boxStyles = {
    display: 'flex',
    flexWrap:   'wrap',
    gap: '10px',
    justifyContent: 'center'
  }
  const refreshData = async () => {
    if (!getCookie('token')) {
      setItems([]);
      return;
    }
    const res = await fetch(`http://${url}/api/item`, {headers: {Cookie: getCookies()}});
    const data = res.ok ? await res.json() : [];
    setItems(data);
  }
  const checkTag = (tag, filter=null) => {
    for (const f of (filter === null ? filters : [filter])) {
      if (f.id === tag.tagId) {
        if (f.value !== null) {
          return eval(tag.value+f.compType+f.value);
        }
        return true;
      }
    }
    return false;
  }
  useEffect(() => {
    if (!filters.length) {
      setFilteredItems(items);
      return;
    }
    const filtered = [];
    let or = false;
    let and = false;
    eval(`${filterMode}=true`);
    if (or) for (const item of items) {
      for (const tag of item.tags) {
        if (checkTag(tag)) {
          filtered.push(item);
          break;
        }
      }
    } else if (and) for (const item of items) {
      let ok = true;
      for (const filter of filters) {
        let found = false;
        for (const tag of item.tags) {
          if (checkTag(tag, filter)) {
            found = true;
            break;
          }
        }
        if (!found) {
          ok = false;
          break;
        }
      }
      if (ok) filtered.push(item);
    }
    setFilteredItems(filtered);
  }, [items, filters, filterMode])
  return (
    <>
      <Header username={username} refreshData={refreshData} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Box sx={boxStyles}>
        {filteredItems.map(item => (
          <StuffCard key={item.id} item={item}/>
        ))}
      </Box>
    </>
  );
}


export async function getServerSideProps(context) {
  const { req } = context;
  const url = `${process.env.HOST}:${process.env.PORT}`;
  let username = null;
  if (!req.cookies.token) return {
    props: {
      data: [],
      url,
      token: null,
      username
    }
  };
  const res = await fetch(`http://${url}/api/item`, {headers: {Cookie: req.headers.cookie}});
  const data = res.ok ? await res.json() : [];
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, function (err, decoded) {
    username = decoded.username;
  });
  return {
    props: {
      data,
      url,
      token: req.cookies.token,
      username
    }
  };
}

export default Home;