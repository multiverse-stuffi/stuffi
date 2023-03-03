import PropTypes from 'prop-types';
import StuffiCard from './card';
import { ExclamationIcon } from '@heroicons/react/outline';
import StoryCard from './StoryCard';
import Grid from './Grid';
import Stories from './Stories';

const Feed = ({ items = [] }) => {
  const isEmpty = items.length === 0;

  return (
    <>
      <div className='flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto scrollbar-hide'>
        <div className='mx-auto max-w-md md:max-w-lg lg;max-w-2xl'>
          {isEmpty ? (
            <p className='text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1'>
              <ExclamationIcon className='shrink-0 w-5 h-5 mt-px' />
              <span>
                Unfortunately, there is nothing to display yet.
              </span>
            </p>
          ) : (
            <>
              <Stories />
              <Grid items={items} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

Feed.propTypes = {
  items: PropTypes.array,
};

export default Feed;
