import React from "react";
import { LoginButton } from '@telegram-auth/react';
export const AuthWeb = () => {
  return <div className="App">
    <LoginButton
      botUsername="7218356256:AAE-8mBqDMnzso1WEQLTROnSv49a9WbXc4w"
      onAuthCallback={(data) => {
        console.log(data);

      }}
    />
  </div>
};
