import { ICard } from "./Card";
import { ITable } from "./ITable";
import { IPlayerPublisher } from "./User/IPlayerPublisher";
import { IYou } from "./User/IYou";

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
