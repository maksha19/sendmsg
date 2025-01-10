// src/WhatsApp.tsx
import React from "react";
import LandingPage from "./components/LandingPage";
import WorkBench from "./components/WorkBench";
import { UserProvider } from "./context/userState";
import { useUser } from './context/userState';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const WhatsApp: React.FC = () => {
  return (
    <UserProvider>
      <Content />
    </UserProvider>
  );
};

const Content: React.FC = () => {
  const { user } = useUser();
  return (
    <>
      {
        user.email === '' ? <LandingPage /> : <WorkBench />

      }
    </>
  );
};

export default WhatsApp;
