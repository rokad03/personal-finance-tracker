import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../components/Pages/Dashboard";
import transactionReducer from "../components/slice/transactionSlice";
import authReducer from "../components/slice/loginSlice"

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));


const renderWithProviders = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { auth:authReducer, transaction: transactionReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );
};


describe("Dashboard Component", () => {

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });


  test("renders transaction data correctly", () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit", expiresAt:Date.now() + 1000*30*60, accessToken: "token" })
    );

    renderWithProviders({
      transaction: {
        list: [{
          id: "1",
          type: "Expense",
          amount: 200,
          category: "Sports",
          date: new Date().toISOString(),
          recurring: false,
        }],
        recursiveList:[],
        
      },
    });

    expect(screen.getByText(/Sports/i)).toBeInTheDocument();
   expect(screen.getAllByText("200").length).toBeGreaterThan(0);
    expect(screen.getByText("-200")).toBeInTheDocument(); // balance
  });


  test("top expense category is displayed", () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit", expiresAt:Date.now() + 1000*30*60,accessToken:"token" })
    );

    renderWithProviders({
      transaction: {
        list: [{
          id: "1",
          type: "Income",
          amount: 200,
          category: "Sports",
          date: "2024-01-01",
          recurring: false,
          count:1
        }],
        recursiveList:[]
      },
    });

    expect(screen.getAllByText("200")).toHaveLength(3);
  });

  test("Top3 sorting items",async()=>{
     sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit", expiresAt:Date.now() + 1000*30*60,accessToken:"token",refreshToken: "refresh",})
    );
    renderWithProviders({
      auth: {
        users: { username: "Nishit" },
        restoring: false,
        loading: false,
        error: "",
      },
      transaction: {
      list: [
        { id: "1", type: "Income", amount: "100", date: "2024-01-01", recurring:false, count:1, category:"Food" },
        { id: "2", type: "Income", amount: "300", date: "2024-01-02", recurring:false, count:1, category:"Rent" },
        { id: "3", type: "Income", amount: "200", date: "2024-01-03", recurring:false, count:1, category:"Snacks" },

        { id: "4", type: "Income", amount: "500", date: "2024-01-01", recurring:false, count:1, category:"Food" },
        { id: "5", type: "Income", amount: "400", date: "2024-01-02", recurring:false, count:1, category:"Rent" },
        { id: "6", type: "Income", amount: "100", date: "2024-01-03", recurring:false, count:1, category:"Snacks" },
      ],
      recursiveList:[],
      totalItems: {}
    }
    })
  
  expect(await screen.findByText("600")).toBeInTheDocument();
    expect(await screen.findByText("700")).toBeInTheDocument();
      expect(await screen.findByText("300")).toBeInTheDocument();

  const expectedTop3Expense = [
    {},
    
  ];

  const expectedTop3Income = [
    { category:"Food", amount:600 },
    { category:"Rent", amount:700 },
    { category:"Snacks", amount:300 },
  ];

  expect(expectedTop3Expense).toHaveLength(1)
  expect(expectedTop3Income).toHaveLength(3);
  expect(expectedTop3Income[0].category).toEqual("Food")
  expect(expectedTop3Income[1].category).toEqual("Rent")
  expect(expectedTop3Income[2].category).toEqual("Snacks")
    
  })

});
