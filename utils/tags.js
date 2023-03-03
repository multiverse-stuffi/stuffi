import React, { useState, useEffect, useCallback } from 'react';

const generateTagColors = () => {
  const samples = [
    { tag: '#bfd7ea', text: '#000' },
    { tag: '#91aec1', text: '#fff' },
    { tag: '#508ca4', text: '#fff' },
    { tag: '#0a8754', text: '#fff' },
    { tag: '#004f2d', text: '#fff' },
  ];
  return tags.reduce((acc, tag) => {
    if (!tag.color) {
      acc[tag.id] =
        samples[Math.floor(Math.random() * samples.length)];
    }
    return acc;
  }, {});
};

export const TagColors = ({
  tags,
  setTagColors,
  generateTagColors,
}) => {
  useEffect(() => {
    setTagColors(generateTagColors());
  }, [tags, setTagColors, generateTagColors]);

  return null; // or render some component

  const UtilComponent = () => {
    const [tagColors, setTagColors] = useState(() =>
      generateTagColors()
    );

    // rest of the code goes here

    useEffect(() => {
      setTagColors(generateTagColors());
    }, []);

    const checkTag = useCallback((tag, filter = null) => {
      for (const f of filter === null ? filters : [filter]) {
        if (f.id == tag.tagId) {
          if (f.value || f.value === 0) {
            return eval(tag.value + f.compType + f.value);
          }
          return true;
        }
      }
      return false;
    }, []);

    useEffect(() => {
      let filtered = [];
      let or = false;
      let and = false;
      switch (filterMode) {
        case 'or':
          or = true;
          break;
        case 'and':
          and = true;
          break;
        default:
          break;
      }
      if (or) {
        filtered = items.filter((item) => {
          for (const tag of item.tags) {
            if (checkTag(tag)) {
              return true;
            }
          }
          return false;
        });
      } else if (and) {
        filtered = items.filter((item) => {
          for (const filter of filters) {
            let found = false;
            for (const tag of item.tags) {
              if (checkTag(tag, filter)) {
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          }
          return true;
        });
      } else {
        filtered = items;
      }
      setFilteredItems(filtered);
    }, [checkTag]);

    useEffect(() => {
      const sorted = [...filteredItems];
      if (sort === 0) {
        if (sortMode === 'desc') setSortedItems(sorted);
        else if (sortMode === 'asc') setSortedItems(sorted.reverse());
      } else {
        sorted.sort((a, b) => {
          const tagA = a.tags.filter((i) => i.tagId == sort)[0];
          const tagB = b.tags.filter((i) => i.tagId == sort)[0];
          if (
            typeof tagA === 'undefined' &&
            typeof tagB === 'undefined'
          )
            return 0;
          if (typeof tagA === 'undefined')
            return sortMode === 'desc' ? 1 : -1;
          if (typeof tagB === 'undefined')
            return sortMode === 'desc' ? -1 : 1;
          const valA = tagA.value;
          const valB = tagB.value;
          return (valB - valA) * (sortMode === 'desc' ? 1 : -1);
        });
        setSortedItems(sorted);
      }
    }, []);
  };

  return (
    <div>
      <TagColors
        tags={tags}
        setTagColors={setTagColors}
        generateTagColors={generateTagColors}
      />
      {/* rest of the component */}
    </div>
  );
};
