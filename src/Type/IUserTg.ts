export interface IUserTg {
  hash: string;
  user: {
    photo_url?: string;
    id: number;
    allowsWriteToPm: boolean;
    username: string;
    firstName: string;
  };
}
