"use client";
import React, { useState } from "react";
import StuffCard from "./card";
import { GoogleLogin } from "@react-oauth/google";

export default function Home() {
  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        useOneTap
      />
      <StuffCard />
    </>
  );
}
