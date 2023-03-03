import React, {useState, useEffect} from 'react'
import axios from 'axios';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import StuffiCard from './card';

const Grid = ({items = []}) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/user/favorites');
        setFavorites(data);
      } catch (err) {
        setFavorites([]);
      }
    })();
  }, []);

  const toggleFavorite = (id) => {
    try {
      toast.dismiss('updateFavorite');
      setFavorites((prev) => {
        const isFavorite = prev.find(
          (favoriteId) => favoriteId === id
        );

        if (isFavorite) {
          axios.delete(`/api/items/${id}/favorite`);
          return prev.filter((favoriteId) => favoriteId !== id);
        } else {
          axios.put(`/api/items/${id}/favorite`);
          return [...prev, id];
        }
      });
    } catch (err) {
      toast.error('Unable to update favorite.', {
        id: 'updateFavorite',
      });
    }
  };

return (
  <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {items.map((item) => (
        <StuffiCard
          key={item.id}
          {...item}
          onClickFavorite={toggleFavorite}
          favorite={
            !!favorites.find((favoriteId) => favoriteId === item.id)
          }
        />
        ))}
    </div>
  );
}

Grid.propTypes = {
  items: PropTypes.array,
}

export default Grid