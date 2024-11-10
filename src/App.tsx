import React from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import "./App.css";

function App() {
  const lp = useLaunchParams();
  console.log(lp);
  return <div className="App">fff</div>;
}

export default App;
