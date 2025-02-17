import React from "react";
import { LoginButton } from '@telegram-auth/react';
import { IUserTg } from "../../Type/IUserTg";
export interface IAuthWeb {
  setWebUser: React.Dispatch<React.SetStateAction<IUserTg | undefined>>
}
export const AuthWeb: React.FC<IAuthWeb> = ({ setWebUser }) => {
  return <div className="App">
    <LoginButton
      botUsername="talafarelBot"
      onAuthCallback={(data) => {
        setWebUser({
          hash: data.hash,
          user: {
            photoUrl: data?.photo_url,
            id: data.id,
            allowsWriteToPm: true,
            username: data.username ?? "",
            firstName: data.first_name,
          }
        })
      }}
    />
  </div>
};
