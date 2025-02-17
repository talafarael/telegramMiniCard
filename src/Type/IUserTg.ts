export interface IUserTg {
  hash: string;
  user: {
    photoUrl?: string;
    id: number;
    allowsWriteToPm: boolean;
    username: string;
    firstName: string;
  };
}
