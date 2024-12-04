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
  const [currentCard, setCurrentCard] = useState<ICard>();
  const [count, setCount] = useState<number>(0);
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
    const port = "wss://cardbec.onrender.com/";
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
        case "grab": {
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
  const handlerStartGame = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");
    console.log("AA");
    if (wsRef.current && dataYou && tokenRoom) {
      console.log("suak");
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
  const handlerDeff = (card: ICard, attacCard: ICard) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");
    if (wsRef.current && dataYou && tokenRoom && table) {
      const message = {
        action: "deff",
        userData: user,
        roomId: tokenRoom,
        card: card,
        attacCard: attacCard,
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
  const handlerGab = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = queryParameters.get("token");

    if (wsRef.current && dataYou && tokenRoom) {
      const message = {
        action: "grab",
        userData: user,
        roomId: tokenRoom,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  const dragEndHandler = (e: React.DragEvent) => {};
  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const dropHandler = (e: React.DragEvent, card: any) => {};
  // Дропаем карту

  // Разрешаем сброс
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
  const handleDrop = (e: React.DragEvent, elem: ICard) => {
    console.log(elem);
    if (!currentCard) {
      return;
    }
    if (dataYou?.state == "defending") {
      handlerDeff(currentCard, elem);
    }
    if (table?.length == 0 && dataYou?.state == "attacking") {
      // console.log("aaa")
      handlerAttack(currentCard);
    }
    handlerAdd(currentCard);
    // : table?.length == 0
    // ? dataYou?.state == "attacking" && handlerAttack(elem)
    // : handlerAdd(elem);
  };
  const handleDropTable = (e: React.DragEvent) => {
    if (!currentCard) {
      return;
    }
    if (table?.length == 0 && dataYou?.state == "attacking") {
      // console.log("aaa")
      handlerAttack(currentCard);
    }
    handlerAdd(currentCard);
  };
  const dragStartHandler = (e: React.DragEvent, card: ICard) => {
    //start
    setCurrentCard(card);
  };
  return (
    <div className="App">
      <header>
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
      </header>
      <section className="gameSection">
        <article className="gameTopBoard">
          <div className="yourOpponents">
            {dataPalyers.map((elem) => (
              <div className="Opponent">
                <h1>{elem.firstName}</h1>
                <p>{elem.state}</p>
                <h1>{elem.startGame ? "ready" : "dont read"}</h1>
                <p>pass{elem.passState ? "pass" : "dont pass"}</p>
              </div>
            ))}
          </div>
          <div
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => {
              console.log("aa");
              handleDropTable(e);
            }}
            className="table"
          >
            <div>
              {trump ? (
                <img
                  className="trump"
                  src={`/${trump.suit}/${trump.rank + trump.suit}.svg`}
                  alt=""
                />
              ) : null}
            </div>
            {table?.map((elem, index) => (
              <div
                key={`${elem.attack.rank}-${elem.attack.suit}`}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => {
                  handleDrop(e, elem.attack);
                }}
                className="tableCell"
              >
                <img
                  className="cardOnTableAttack"
                  src={`/${elem.attack.suit}/${
                    elem.attack.rank + elem.attack.suit
                  }.svg`}
                  alt=""
                />
                {elem.deffit && (
                  <img
                    className="cardOnTableDeffit"
                    src={`/${elem.deffit.suit}/${
                      elem.deffit.rank + elem.deffit.suit
                    }.svg`}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="gameBottom">
          {yourCard.map((elem, key) => {
            return (
              <img
                draggable={true}
                onDragStart={(e) => dragStartHandler(e, elem)}
                onDragEnd={(e) => dragEndHandler(e)}
                className={
                  key < yourCard.length / 2
                    ? "yourBeforeCard yourCard"
                    : "yourCardAfter yourCard"
                }
                src={`/${elem.suit}/${elem.rank + elem.suit}.svg`}
                alt=""
              />
            );
          })}
          <section className="sectionYou"> 
        
              <button
                onClick={() => {
                  handlerStartGame();
                  console.log("Suk");
                }}
              >
                start
              </button>
              
           
             <button onClick={handlerPass}>skip</button>  <button onClick={handlerGab}>grab</button>
            {dataYou && (
              <div>
                <h1>{dataYou?.user.firstName}</h1>
                <p>{dataYou.state}</p>
                <h1>{dataYou?.startGameState ? "ready" : "dont read"}</h1>
                <p>pass: {dataYou?.passState ? "pass" : "dont pass"}</p>
              </div>
            )}
            {/* ddddddddd */}
           
          </section>
        </article>
      </section>
    </div>
  );
}

export default App;
