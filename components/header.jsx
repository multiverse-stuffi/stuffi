import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import Head from './Head';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import HeaderIcon from './HeaderIcon';
import Link from 'next/link';
import PropTypes from 'prop-types';
import AuthModal from './AuthModal';
import {
  BellIcon,
  ChatIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ViewGridIcon,
} from '@heroicons/react/solid';
import {
  HeartIcon,
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  FlagIcon,
  PlayIcon,
  SparklesIcon,
  UserIcon,
  SearchIcon,
  ShoppingCartIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';

const menuItems = [
  {
    label: 'List a new item',
    icon: PlusIcon,
    href: '/create',
  },
  {
    label: 'My stuff',
    icon: HomeIcon,
    href: '/items',
  },
  {
    label: 'Favorites',
    icon: HeartIcon,
    href: '/favorites',
  },
  {
    label: 'Logout',
    icon: LogoutIcon,
    onClick: signOut,
  },
];

function Header({ children }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const user = session?.user;
  const isLoadingUser = status === 'loading';


  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 shadow-md'>
        {/* Left */}
        <div className='flex items-center'>
          <Link href='/' passHref>
            <Image
              src='https://www.pngfind.com/pngs/m/10-102649_pushpin-transparent-background-push-pin-transparent-hd-png.png'
              width='40'
              height='40'
              layout='fixed'
              alt='stuffi logo - a pushpin'
            />
          </Link>
          <div className='hidden md:inline-flex ml-2 items-center rounded-full bg-gray-100 p-2'>
            <SearchIcon className='h-6 text-gray-600' />
            <input
              className='hidden lg:inline-flex ml-2 bg-transparent outline-none placeholder-gray-500 flex-shrink'
              placeholder='Search Stuffi'
            />
          </div>
        </div>

        {/* Center */}
        <div className='flex justify-center flex-grow'>
          <div className='flex space-x-6 md:space-x-2'>
            <HeaderIcon active Icon={HomeIcon} />
            <HeaderIcon Icon={FlagIcon} />
            <HeaderIcon Icon={PlayIcon} />
            <HeaderIcon Icon={ShoppingCartIcon} />
            <Link href='/create' passHref>
              <HeaderIcon Icon={PlusIcon} />
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className='flex items-center sm:space-x-2 justify-end'>
          <Image
            onClick={() => signOut()}
            className='rounded-full cursor-pointer'
            src={user?.image}
            width='40'
            height='40'
            layout='fixed'
            alt='image of user'
          />
          <p className='hidden lg:inline-flex text-sm whitespace-nowrap font-semibold pr-3'>
            Jenna Gelato
            {/* {session?.user.name} */}
          </p>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => {
                session?.user ? router.push('/create') : openModal();
              }}
              className='hidden sm:block hover: bg-gray-200 transition px-3 py-1 rounded-md'>
              List Your Item
            </button>
            {isLoadingUser ? (
              <div className='h-8 w-[75px] bg-gray-200 animate-pulse rounded-md' />
            ) : user ? (
              <Menu as='div' className='relative z-50'>
                <Menu.Button className='flex items-center space-x-px group'>
                  <div className='shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9'>
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        alt={user?.name || 'Avatar'}
                        layout='fill'
                      />
                    ) : (
                      <UserIcon className='text-gray-400 w-6 h-6' />
                    )}
                  </div>
                  <ChevronDownIcon className='w-5 h-5 shrink-0 text-gray-500 group-hover:text-current' />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'>
                  <Menu.Items className='absolute right-0 w-72 overflow-hidden mt-1 divide-y divide-gray-100 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='flex items-center space-x-2 py-4 px-4 mb-2'>
                      <div className='shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9'>
                        {user?.image ? (
                          <Image
                            src={user?.image}
                            alt={user?.name || 'Avatar'}
                            layout='fill'
                          />
                        ) : (
                          <UserIcon className='text-gray-400 w-6 h-6' />
                        )}
                      </div>
                      <div className='flex flex-col truncate'>
                        <span>{user?.name}</span>
                        <span className='text-sm text-gray-500'>
                          {user?.email}
                        </span>
                      </div>
                    </div>

                    <div className='py-2'>
                      {menuItems.map(
                        ({ label, href, onClick, icon: Icon }) => (
                          <div
                            key={label}
                            className='px-2 last:border-t last:pt-2 last:mt-2'>
                            <Menu.Item>
                              {href ? (
                                <Link href={href}>
                                  <a className='flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100'>
                                    <Icon className='w-5 h-5 shrink-0 text-gray-500' />
                                    <span>{label}</span>
                                  </a>
                                </Link>
                              ) : (
                                <button
                                  className='w-full flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100'
                                  onClick={onClick}>
                                  <Icon className='w-5 h-5 shrink-0 text-gray-500' />
                                  <span>{label}</span>
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        )
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button
                type='button'
                onClick={openModal}
                className='ml-4 px-4 py-1 rounded-md bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50 text-white transition'>
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      <main className='flex-grow container mx-auto'>
        <div className='px-4 py-12'>
          {typeof children === 'function'
            ? children(openModal)
            : children}
        </div>
      </main>

      <AuthModal show={showModal} onClose={closeModal} />
    </div>
  );
}

export default Header;

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
