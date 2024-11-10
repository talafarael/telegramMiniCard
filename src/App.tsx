import React from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import "./App.css";
const userData={

}
function App() {
  const lp = useLaunchParams();
  console.log(JSON.stringify(lp));

  return <div className="App">fff</div>;
}

export default App;
