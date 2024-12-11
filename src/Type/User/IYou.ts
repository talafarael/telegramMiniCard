import { ICard } from "../Card";
import { IUser } from "./IUser";

export interface IYou {
  user: IUser;
  card: ICard[];
  ws: WebSocket;
  state: string;
  startGameState: boolean;
  passState: boolean;
}
