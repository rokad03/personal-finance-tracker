// export type Transaction = {
//     id: string;
//     amount: number;
//     type: string;
//     date: string;
// };
export type Values = {
  id: string,
  amount: string,
  type: MethodType,
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
export type Initial={
    loading:boolean,
    users:Users|null,
    error?:string,
    restoring:boolean
}
export type Users={
    username:string,
    password:string
}
// export type TransactionType= "Income"|"Expense";
export enum MethodType {
  Income = "Income",
  Expense = "Expense",
}

export type Transaction = {
  id: string;
  type: MethodType;
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
  accessToken?: string;
  refreshToken: string;
}


export interface UserRes extends AuthResponse {
  expiresAt: number;   
}