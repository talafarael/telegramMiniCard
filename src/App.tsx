import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { AuthTg } from "./components/AuthTg";



import { ICard } from "./Type/Card";
import { IPlayerPublisher } from "./Type/User/IPlayerPublisher";
import { IYou } from "./Type/User/IYou";
import { ITable } from "./Type/ITable";
import { IResponse } from "./Type/IResponse";
import { AuthWeb } from "./components/AuthWeb";
import { IUserTg } from "./Type/IUserTg";

declare global {
  interface Window {
    Telegram: any;
  }
}
export const userParam =
  "user=%7B%22id%22%3A1056119921%2C%22first_name%22%3A%22farael%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22shinerfa%22%2C%22language_code%22%3A%22uk%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=948078213344090422&chat_type=sender&auth_date=1731334219&hash=d75e77e0a3702152c2845498d621771eedd66724db2a23efeb4d99f0012f3e85";
// "query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22Testenko%22%2C%22username%22%3A%22tst%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2";
function App() {
  const [user, setUser] = useState<string>("");
  const [dataPalyers, setDataPlayers] = useState<IPlayerPublisher[] | []>([]);
  const [currentCard, setCurrentCard] = useState<ICard>();
  const [dataYou, setDataYou] = useState<IYou>();
  const [webUser, setWebUser] = useState<IUserTg | undefined>()
  const [yourCard, setYourCard] = useState<ICard[]>([]);
  const [trump, setTrump] = useState<ICard | null>();
  const [startGame, setStartGame] = useState<boolean>(false);
  const [table, setTable] = useState<ITable[] | null>();
  const [launchParams, setLaunchParams] = useState({
    initDataRaw: ""
  })
  const [lp, setLp] = useState({
    startParam: ""
  })
  const wsRef = useRef<WebSocket | null>(null);
  const handlerSelectRolle = (data: string) => {
    setUser(data);
  };
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.href.includes("tgWebAppData")
    ) {
      if (launchParams?.initDataRaw) {
        setUser(launchParams.initDataRaw);

        console.log(lp.startParam);
      }
    }
  }, [launchParams]);
  //t.me/@CardFaraBot
  useEffect(() => {
    const port = "wss://cardbec.onrender.com";
    const ws = new WebSocket(port);
    console.log(lp.startParam);
    wsRef.current = ws;
    ws.onopen = () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const tokenRoom = lp.startParam ?? queryParameters.get("token");
      const message = {
        action: "join",
        roomId: tokenRoom ?? undefined,
        userData: user == "" ? webUser : user,
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
        case "UserReady":
        case "startGame":
        case "attack":
        case "def":
        case "pass":
        case "nextMove":
        case "grab": {
          setStateGame(res);
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
  }, [user, webUser]);
  function setStateGame(res: IResponse) {
    setYourCard(res.you.card);
    setDataYou(res.you);
    setDataPlayers(res.players);
    setStartGame(true);
    setTrump(res.trump);
    setTable(res.cardsOnTable);
  }

  const handleStartGame = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = lp.startParam ?? queryParameters.get("token");
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
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = lp.startParam ?? queryParameters.get("token");

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
    const tokenRoom = lp.startParam ?? queryParameters.get("token");
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
  const handlerPass = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = lp.startParam ?? queryParameters.get("token");

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
    const tokenRoom = lp.startParam ?? queryParameters.get("token");

    if (wsRef.current && dataYou && tokenRoom) {
      const message = {
        action: "grab",
        userData: user,
        roomId: tokenRoom,
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const handlerAdd = (card: ICard) => {
    console.log("AA");
    const queryParameters = new URLSearchParams(window.location.search);
    const tokenRoom = lp.startParam ?? queryParameters.get("token");

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

  const handleDrop = (e: React.DragEvent | React.TouchEvent, elem: ICard) => {
    console.log(elem);
    if (!currentCard) {
      return;
    }
    if (dataYou?.state == "defending") {
      handlerDeff(currentCard, elem);
    }
    if (table?.length == 0 && dataYou?.state == "attacking") {
      handlerAttack(currentCard);
    }
    handlerAdd(currentCard);
  };
  const handleDropTable = (e: React.DragEvent | React.TouchEvent) => {
    if (!currentCard) {
      return;
    }
    if (table?.length == 0 && dataYou?.state == "attacking") {
      // console.log("aaa")
      handlerAttack(currentCard);
    }
    handlerAdd(currentCard);
  };
  const dragStartHandler = (
    e: React.DragEvent | React.TouchEvent,
    card: ICard
  ) => {
    setCurrentCard(card);
  };
  const dragEndHandler = (e: React.DragEvent | React.TouchEvent) => { };
  const dragOverHandler = (e: React.DragEvent | React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div className="App">
      <header>
        {typeof window !== "undefined" &&
          window.location.href.includes("tgWebAppData") ? <AuthTg setLaunchParams={setLaunchParams} setLp={setLp} /> :
          <AuthWeb setWebUser={setWebUser} />

        }
        {!lp.startParam ? (
          <>
            {" "}
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
          </>
        ) : null}
      </header>
      <section className="gameSection">
        <article className="gameTopBoard">
          <div className="yourOpponents">
            {dataPalyers.map((elem) => (
              <div className="Opponent" key={elem.id}>
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
              handleDropTable(e);
            }}
            onTouchEnd={(e) => {
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
                onTouchEnd={(e) => {
                  handleDrop(e, elem.attack);
                }}
                className="tableCell"
              >
                <img
                  className="cardOnTableAttack"
                  src={`/${elem.attack.suit}/${elem.attack.rank + elem.attack.suit
                    }.svg`}
                  alt=""
                />
                {elem.deffit && (
                  <img
                    className="cardOnTableDeffit"
                    src={`/${elem.deffit.suit}/${elem.deffit.rank + elem.deffit.suit
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
                onTouchStart={(e) => {
                  console.log("AA");
                  dragStartHandler(e, elem);
                }}
                // onTouchMove={(e) => e.preventDefault()} // Prevent touch move default behavior
                // onTouchEnd={(e) => dragEndHandler(e)}
                className={
                  currentCard?.rank == elem.rank &&
                    currentCard?.suit == elem.suit
                    ? key < yourCard.length / 2
                      ? "yourBeforeCard yourCard yourCardActiveBefore"
                      : "yourCardAfter yourCard yourCardActive"
                    : key < yourCard.length / 2
                      ? "yourBeforeCard yourCard"
                      : "yourCardAfter yourCard"
                }
                src={`/${elem.suit}/${elem.rank + elem.suit}.svg`}
                alt=""
              />
            );
          })}
          <section className="sectionYou">
            {dataYou && (
              <div>
                <h1>{dataYou?.user.firstName}</h1>
                <p>{dataYou.state}</p>
                <h1>{dataYou?.startGameState ? "ready" : "dont read"}</h1>
                <p>pass: {dataYou?.passState ? "pass" : "dont pass"}</p>
              </div>
            )}
            <article>
              <button onClick={handleStartGame}>start</button>
              <button onClick={handlerPass}>skip</button>
              <button onClick={handlerGab}>grab</button>
            </article>
          </section>
        </article>
      </section>
    </div>
  );
}

export default App;
