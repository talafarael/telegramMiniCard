import React from "react";
import { LoginButton } from '@telegram-auth/react';
export const AuthWeb = () => {
  return <div className="App">
    <LoginButton
      botUsername="talafarelBot"
      onAuthCallback={(data) => {
        console.log(data);

      }}
    />
  </div>
};
