
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
type CategoryListing={
    category:string;
    amount:number
}
export type Total={
  tAmount:number;
  Income:number;
  Expense:number;
  top5:CategoryListing[]
}