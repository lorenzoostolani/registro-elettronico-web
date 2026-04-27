export interface LoginToken {
  token: string;
  expire: string;
  firstName: string;
  lastName: string;
  ident: string | null;
  userId: string;
}