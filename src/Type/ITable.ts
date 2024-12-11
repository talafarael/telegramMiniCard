import { ICard } from "./Card";

export interface ITable {
  attack: ICard;
  deffit: ICard | null;
}
