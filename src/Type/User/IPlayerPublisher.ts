export interface IPlayerPublisher {
  id: number;
  cardCount: number;
  firstName: string | null;
  startGame: boolean;
  state: string;
  passState: boolean;
  photoUrl: string
}
