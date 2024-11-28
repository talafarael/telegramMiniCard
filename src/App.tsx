import React, { useEffect, useRef, useState } from "react";
// import { useLaunchParams } from "@telegram-apps/sdk-react";
import "./App.css";
import { platform } from "os";
import { start } from "repl";
export interface IUser {
  session: string;
  hash: string;
  allowsWriteToPm: boolean | null | undefined;
  firstName: string | null;
  id: number;
  username: string | null | undefined;
}
export interface ICard {
  rank: string;
  suit: string;
}
export interface IPlayerPublisher {
  id: number;
  cardCount: number;
  firstName: string | null;
  startGame: boolean;
  state: string;
  passState: boolean;
}
export interface IYou {
  user: IUser;
  card: ICard[];
  ws: WebSocket;
  state: string;
  startGameState: boolean;
  passState: boolean;
}
export interface IResponse {
  session: string;
  action: string;
  players: IPlayerPublisher[];
  roomId: string;
  you: IYou;
  cardsOnTable: ITable[];
  trump: ICard | null;
  pass: ICard[];
  passState: boolean;
}
export interface ITable {
  attack: ICard;
  deffit: ICard | null;
}
export const userParam =
  "user=%7B%22id%22%3A1056119921%2C%22first_name%22%3A%22farael%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22shinerfa%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=948078213344090422&chat_type=sender&auth_date=1731334219&hash=d75e77e0a3702152c2845498d621771eedd66724db2a23efeb4d99f0012f3e85";
// "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22Testenko%22%2C%22username%22%3A%22tst%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2";
function App() {
  const [user, setUser] = useState<string>("");
  const [dataPalyers, setDataPlayers] = useState<IPlayerPublisher[] | []>([]);
  const [dataYou, setDataYou] = useState<IYou>();
  const [yourCard, setYourCard] = useState<ICard[]>([]);
  const [trump, setTrump] = useState<ICard | null>();
  const [startGame, setStartGame] = useState<boolean>(false);
  const [table, setTable] = useState<ITable[] | null>();
  const wsRef = useRef<WebSocket | null>(null);
  const handlerSelectRolle = (data: string) => {
    setUser(data);
  };
  useEffect(() => {
    if (user == "") return;
    const port = "ws://localhost:8080/";
    const ws = new WebSocket(port);
    // const lp = useLaunchParams();
    wsRef.current = ws;
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
      const res: IResponse = JSON.parse(event.data);
      console.log(res);
      switch (res.action) {
        case "join": {
          const url = new URL(window.location.href);
          url.searchParams.set("token", res.roomId);
          window.history.replaceState({}, "", url.toString());
          setDataPlayers(res.players);
          setDataYou(res.you);
          setYourCard(res.you.card);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
          break;
        }
        case "UserReady": {
          setYourCard(res.you.card);
          setDataPlayers(res.players);
          setDataYou(res.you);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
          break;
        }
        case "startGame": {
          setYourCard(res.you.card);
          setDataYou(res.you);
          setDataPlayers(res.players);
          setStartGame(true);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
          break;
        }
        case "attack": {
          setYourCard(res.you.card);
          setDataYou(res.you);
          setDataPlayers(res.players);
          setStartGame(true);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
          break;
        }
        case "def": {
          setYourCard(res.you.card);
          setDataYou(res.you);
          setDataPlayers(res.players);
          setStartGame(true);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
          break;
        }
        case "pass": {
          setYourCard(res.you.card);
          setDataYou(res.you);
          setDataPlayers(res.players);
          setStartGame(true);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
          break;
        }
        case "nextMove": {
          setYourCard(res.you.card);
          setDataYou(res.you);
          setDataPlayers(res.players);
          setStartGame(true);
          setTrump(res.trump);
          setTable(res.cardsOnTable);
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
  const handleStartGame = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");
    if (wsRef.current && dataYou && tokenRoom) {
      const message = {
        action: "start",
        userData: user,
        roomId: tokenRoom,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  const handlerAttack = (card: ICard) => {
    console.log("AA");
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");

    if (wsRef.current && dataYou && tokenRoom) {
      const message = {
        action: "attack",
        userData: user,
        roomId: tokenRoom,
        card: card,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  const handlerDeff = (card: ICard) => {
    const index = prompt("aaa");
    console.log(index);
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");
    if (wsRef.current && dataYou && tokenRoom && table) {
      const message = {
        action: "deff",
        userData: user,
        roomId: tokenRoom,
        card: card,
        attacCard: table[Number(index) - 1].attack,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  // const lp = useLaunchParams();
  // console.log(JSON.stringify(lp));
  const handlerPass = () => {
    console.log("AA");
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");

    if (wsRef.current && dataYou && tokenRoom) {
      const message = {
        action: "pass",
        userData: user,
        roomId: tokenRoom,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  const handlerAdd = (card: ICard) => {
    console.log("AA");
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");

    if (wsRef.current && dataYou && tokenRoom) {
      const message = {
        action: "add",
        userData: user,
        roomId: tokenRoom,
        card: card,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
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

      {dataPalyers.map((elem) => (
        <div>
          <h1>{elem.firstName}</h1>
          <p>{elem.state}</p>
          <h1>{elem.startGame ? "ready" : "dont read"}</h1>
        </div>
      ))}
      {dataYou && (
        <div>
          <h1>{dataYou?.user.firstName}</h1>
          <p>{dataYou.state}</p>
          <h1>{dataYou?.startGameState ? "ready" : "dont read"}</h1>
          <button onClick={handleStartGame}>start</button>
        </div>
      )}

      <div>
        {yourCard.map((elem) => (
          <div
            onClick={() => {
              dataYou?.state == "defending"
                ? handlerDeff(elem)
                : table?.length == 0
                ? dataYou?.state == "attacking" && handlerAttack(elem)
                : handlerAdd(elem);
            }}
          >
            {elem.rank}
            {elem.suit}
          </div>
        ))}
      </div>
      <div>
        козырь
        <h1>{trump?.rank}</h1>
        <h1>{trump?.suit}</h1>
      </div>
      <div>
        стол
        {table?.map((elem) => (
          <div className="background">
            <h1>attack</h1>
            <h1>{elem.attack.rank}</h1>
            <h1>{elem.attack.suit}</h1>
            <h1>def</h1>
            <h1>{elem?.deffit?.rank}</h1>
            <h1>{elem?.deffit?.suit}</h1>
          </div>
        ))}
      </div>
      <button onClick={handlerPass}>ff</button>
    </div>
  );
}

export default App;
