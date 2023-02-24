import React, { useState, useEffect, useCallback } from "react";
import StuffCard from "../components/card";
import { Box } from '@mui/material';
import Header from "../components/header";
import Filters from "../components/filters";
import { getCookies, getCookie } from "cookies-next";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import prisma from '../lib/prisma';
const jwt = require("jsonwebtoken");
import View from "@/components/View";

function Home({ data, token, user }) {
  const [items, setItems] = useState(data.items);
  const [filteredItems, setFilteredItems] = useState(items);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [filters, setFilters] = useState([]);
  const [filterMode, setFilterMode] = useState("or");
  const [tags, setTags] = useState(data.tags);
  const [username, setUsername] = useState(user.username);
  const [sortedItems, setSortedItems] = useState(filteredItems);
  const [sort, setSort] = useState(0);
  const [sortMode, setSortMode] = useState('desc');
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false);
  const boxStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center'
  }
  const generateTagColors = useCallback(() => {
    const newColors = {};
    const samples = [
      { tag: "#bfd7ea", text: "#000" },
      { tag: "#91aec1", text: "#fff" },
      { tag: "#508ca4", text: "#fff" },
      { tag: "#0a8754", text: "#fff" },
      { tag: "#004f2d", text: "#fff" },
    ];
    for (const tag of tags) {
      if (!tag.color) newColors[tag.id] = samples[Math.floor(Math.random() * samples.length)];
    }
    return newColors;
  }, [tags]);
  const [tagColors, setTagColors] = useState(generateTagColors());
  useEffect(() => {
    setTagColors(generateTagColors());
  }, [tags, generateTagColors]);
  const refreshData = async () => {
    if (!getCookie("token")) {
      setItems([]);
      return;
    }
    const itemsRes = await fetch('/api/item', { headers: { Cookie: getCookies() } });
    const data = {};
    data.items = itemsRes.ok ? await itemsRes.json() : [];
    const tagsRes = await fetch('/api/tag', { headers: { Cookie: getCookies() } });
    data.tags = tagsRes.ok ? await tagsRes.json() : [];
    setItems(data.items);
    setTags(data.tags);
  }
  const checkTag = useCallback((tag, filter = null) => {
    for (const f of (filter === null ? filters : [filter])) {
      if (f.id == tag.tagId) {
        if (f.value || f.value === 0) {
          return eval(tag.value + f.compType + f.value);
        }
        return true;
      }
    }
    return false;
  }, [filters]);
  useEffect(() => {
    if (!filters.length) {
      setFilteredItems(items);
      return;
    }
    const filtered = [];
    let or = false;
    let and = false;
    eval(`${filterMode}=true`);
    if (or)
      for (const item of items) {
        for (const tag of item.tags) {
          if (checkTag(tag)) {
            filtered.push(item);
            break;
          }
        }
      }
    else if (and)
      for (const item of items) {
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
  }, [items, filters, filterMode, checkTag])
  useEffect(() => {
    const sorted = [...filteredItems];
    if (sort === 0) {
      if (sortMode === "desc") setSortedItems(sorted);
      else if (sortMode === "asc") setSortedItems(sorted.reverse());
    } else {
      sorted.sort((a, b) => {
        const tagA = a.tags.filter((i) => i.tagId == sort)[0];
        const tagB = b.tags.filter((i) => i.tagId == sort)[0];
        if (typeof tagA === "undefined" && typeof tagB === "undefined")
          return 0;
        if (typeof tagA === "undefined") return sortMode === "desc" ? 1 : -1;
        if (typeof tagB === "undefined") return sortMode === "desc" ? -1 : 1;
        const valA = tagA.value;
        const valB = tagB.value;
        return (valB - valA) * (sortMode === "desc" ? 1 : -1);
      });
      setSortedItems(sorted);
    }
  }, [filteredItems, sort, sortMode]);

  return (
    <>
      <Header
        username={username}
        setUsername={setUsername}
        userId={user.id}
        refreshData={refreshData}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      {isLoggedIn && (
        <Filters
          sort={sort}
          setSort={setSort}
          sortMode={sortMode}
          setSortMode={setSortMode}
          tagColors={tagColors}
          tags={tags}
          getContrastingColor={getContrastingColor}
          filters={filters}
          setFilters={setFilters}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
        />
      )}
      <EditModal setItems={setItems} items={items} setTags={setTags} tags={tags} tagColors={tagColors} editModal={editModal} setEditModal={setEditModal} getContrastingColor={getContrastingColor} />
      <DeleteModal items={items} setItems={setItems} deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
      <Box sx={boxStyles}>
        {sortedItems.map(item => (
          <StuffCard tagColors={tagColors} getContrastingColor={getContrastingColor} key={item.id} item={item} setEditModal={setEditModal} setDeleteModal={setDeleteModal} />
        ))}
      </Box>
    </>
  );
}

function getContrastingColor(backgroundColor) {
  // convert hex color code to RGB values
  let r = parseInt(backgroundColor.substring(0, 2), 16);
  let g = parseInt(backgroundColor.substring(2, 4), 16);
  let b = parseInt(backgroundColor.substring(4, 6), 16);

  // apply the luminosity contrast formula
  let luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminosity > 0.5 ? "#000" : "#fff";
}

export async function getServerSideProps(context) {
  const { req } = context;
  let user = { username: null, id: null };
  if (!req.cookies.token) return {
    props: {
      data: { items: [], tags: [] },
      token: null,
      user
    }
  };
  const data = {};
  await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
    if (!decoded.id) {
      data.items = [];
      data.tags = [];
      return;
    }
    const items = await prisma.item.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        tags: {
          include: {
            Tag: true
          }
        }
      },
      orderBy: {
        tags: {
          _count: 'desc'
        }
      }
    });
    data.items = items;
    const tags = await prisma.tag.findMany({
      where: {
        userId: decoded.id
      }
    });
    data.tags = tags;
    user = decoded;
  });
  return {
    props: {
      data,
      token: req.cookies.token,
      user,
    },
  };
}

export default Home;
