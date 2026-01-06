// export type Transaction = {
//     id: string;
//     amount: number;
//     type: string;
//     date: string;
// };
export type Values = {
  id: string,
  amount: string,
  type: Type,
  category: string,
  date: string,
  recurring:boolean,
  count:number,
  expiryDate?:string
  interval?:string
}
export interface User {
    id: number;
    firstName: string;
    lastName: string;   
    email: string;
}
export type initial={
    loading:Boolean,
    users:users|null,
    error?:string,
    restoring:boolean
}
export type users={
    username:string,
    password:string
}
export type Type= "Income"|"Expense";
export type Transaction = {
  id: string;
  type: Type;
  amount: string;
  date: string;
  recurring: boolean;
  count:number;
  category:string;
  expiryDate?:string
  interval?:string
};
export type CategoryListing={
    category:string;
    amount:number
}
export type Total={
  tAmount:number;
  Income:number;
  Expense:number;
  top3Expense:CategoryListing[]
  top3Income:CategoryListing[]
}
export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
  refreshToken: string;
}


export interface UserRes extends AuthResponse {
  accessToken: string;
  expiresAt: number;   
}