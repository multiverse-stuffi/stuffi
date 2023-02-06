'use client';
import React, { useState } from 'react';
import StuffCard from '../components/card';
import{ GoogleLogin} from '@react-oauth/google';

export default function Home() {
  return (
    <>
      <GoogleLogin />
      <StuffCard />
    </>
  );
}
