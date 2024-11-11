import React, { useEffect } from "react";
// import { useLaunchParams } from "@telegram-apps/sdk-react";
import "./App.css";
export const testQuery =
  "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22Testenko%22%2C%22username%22%3A%22tst%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2";
function App() {
  useEffect(() => {
    const port = "ws://localhost:8080/";
    const ws = new WebSocket(port);
    // const lp = useLaunchParams();

    ws.onopen = () => {
      const message = {
        action: "join",
        // roomId,
      };
      ws.send(JSON.stringify(message));
    };
    ws.onmessage = (event) => {
      // const data=event.data
      // const res = JSON.parse(event.data);
      console.log(event.data);
    };
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
    return () => {
      ws.close();
    };
  }, []);

  // const lp = useLaunchParams();
  // console.log(JSON.stringify(lp));

  return <div className="App"></div>;
}

export default App;
