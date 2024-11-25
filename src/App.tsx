import React, { useEffect, useState } from "react";
// import { useLaunchParams } from "@telegram-apps/sdk-react";
import "./App.css";
export interface IUser {
  session: string;
  hash: string;
  allowsWriteToPm: boolean | null | undefined;
  firstName: string | null;
  id: number;
  username: string | null | undefined;
}
export const userParam =
  "user=%7B%22id%22%3A1056119921%2C%22first_name%22%3A%22farael%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22shinerfa%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=948078213344090422&chat_type=sender&auth_date=1731334219&hash=d75e77e0a3702152c2845498d621771eedd66724db2a23efeb4d99f0012f3e85";
// "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22Testenko%22%2C%22username%22%3A%22tst%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2";
function App() {
  const [user, setUser] = useState<string>("");
  const [palyer, setPlayer] = useState<IUser[] | []>([]);
  const handlerSelectRolle = (data: string) => {
    setUser(data);
  };
  useEffect(() => {
    if (user == "") return;
    const port = "ws://localhost:8080/";
    const ws = new WebSocket(port);
    // const lp = useLaunchParams();
    ws.onopen = () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const tokenRoom = queryParameters.get("token");
      const message = {
        action: "join",
        roomId: tokenRoom ? tokenRoom : undefined,
        userData: user,
      };
      ws.send(JSON.stringify(message));
    };
    ws.onmessage = async (event) => {
      const res = JSON.parse(event.data);
      console.log(res);
      switch (res.action) {
        case "join": {
          const url = new URL(window.location.href);
          url.searchParams.set("token", res.roomId);
          window.history.replaceState({}, "", url.toString());
          console.log(res);
          break;
        }
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
    return () => {
      ws.close();
    };
  }, [user]);

  // const lp = useLaunchParams();
  // console.log(JSON.stringify(lp));

  return (
    <div className="App">
      <button
        onClick={() => {
          handlerSelectRolle(
            "AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22Testenko%22%2C%22username%22%3A%22tst%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2"
          );
        }}
      >
        user1
      </button>

      <button
        onClick={() => {
          handlerSelectRolle(
            "user=%7B%22id%22%3A1056119921%2C%22first_name%22%3A%22farael%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22shinerfa%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=948078213344090422&chat_type=sender&auth_date=1731334219&hash=d75e77e0a3702152c2845498d621771eedd66724db2a23efeb4d99f0012f3e85"
          );
        }}
      >
        user2
      </button>

      <button>start</button>
    </div>
  );
}

export default App;
