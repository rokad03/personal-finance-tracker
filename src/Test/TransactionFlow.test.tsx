import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../components/store/store";
import App from "../App";
import { loginRequest} from "../components/slice/loginSlice";

jest.mock("uuid", () => ({
  v4: () => "static-uuid-123"
}));
jest.setTimeout(300000)

describe("Add transaction and update Dashboard", () => {
    
  beforeEach(() => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "emilys" })
    );
  });

  test("Test the restore functionality",async()=>{
     sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "emilys" })
    );
    store.dispatch(loginRequest({username:"emilys",password:"emilyspass"})); 
    render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/transactions"]}>
        <App/>
      </MemoryRouter>   
    </Provider>
   ) 
   expect(screen.queryByText("Login")).not.toBeInTheDocument();
   
  })

  test("Test the empty user data",async()=>{
    sessionStorage.removeItem("session_user");
    render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <App/>
      </MemoryRouter>
    </Provider>
   ) 
    expect(await screen.findAllByText("Login")).toHaveLength(2);
  })

  test("Test the fake login",async()=>{
   const user=userEvent.setup();
   render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <App/>
      </MemoryRouter>
    </Provider>
   ) 
    expect(await screen.findAllByText("Login")).toHaveLength(2);  
    await user.type(screen.getByPlaceholderText("username"), "emils");
    await user.type(screen.getByPlaceholderText("password"), "emispass");
    await user.click(screen.getByRole("button", { name:/login/i }));
    expect(await screen.findByText(/Invalid Credentials/i)).toBeInTheDocument();

  })

  test("creating a transaction updates dashboard totals", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

     // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug();
    // expect(screen.getByText())



    // expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(await screen.findAllByText("Login")).toHaveLength(2);  
    await user.type(screen.getByPlaceholderText("username"), "emilys");
    await user.type(screen.getByPlaceholderText("password"), "emilyspass");
    await user.click(screen.getByRole("button", { name:/login/i }));

    const logoutBtn=await screen.findByRole("button",{name:/logout/i});
    await user.click(logoutBtn);
    
   

    expect(await screen.findAllByText("Login")).toHaveLength(2);

    await user.type(screen.getByPlaceholderText("username"), "emilys");
    await user.type(screen.getByPlaceholderText("password"), "emilyspass");
    await user.click(screen.getByRole("button", { name:/login/i }));

    expect(await screen.findByText(/welcome emilys/i)).toBeInTheDocument();

    const transactionsLink = screen.getByRole("link", { name: /transactions/i });
    await user.click(transactionsLink);
   
    expect(await screen.findByText(/add the transaction/i)).toBeInTheDocument();

    await user.click(screen.getByText("Add the transaction"));

    const amount = await screen.findByTestId("amount");
    const category = await  screen.findByTestId("Category");
    const date = await screen.findByTestId("date");
   
    const submit = screen.getByRole("button", { name: /add/i });

    await user.click(screen.getByLabelText(/MoneyType/i));
    await user.click(screen.getByRole("option", { name: /expense/i }));
    expect(screen.getByTestId('Type')).toHaveValue("Expense");

    await user.type(amount, "200");
    await user.type(category, "Sports");

    await user.type(date, "2026-01-01");
    expect(date).toHaveValue("2026-01-01")
    
    expect(submit).toBeEnabled();

    await user.click(submit);

    expect(await screen.findByText("Expense cannot exceed income")).toBeInTheDocument();

     await user.click(screen.getByLabelText(/MoneyType/i));
    await user.click(screen.getByRole("option", { name: /income/i }));
    expect(screen.getByTestId('Type')).toHaveValue("Income");

      expect(submit).toBeEnabled();
    await user.click(submit);

    expect(await screen.findByText("Income")).toBeInTheDocument();
    expect(await screen.findByText("Sports")).toBeInTheDocument();
    expect(screen.queryByTestId("amount")).not.toBeInTheDocument();


    const editButton=await screen.findByRole("button",{name:"Edit"});
    await user.click(editButton);
    const updatedamount = await screen.findByTestId("amount");
    await user.clear(updatedamount);
    await user.type(updatedamount,"2000")
    expect(updatedamount).toHaveValue(2000)
    expect(await screen.findByRole("button",{name:"Update"})).toBeInTheDocument();
    const updateButton=await screen.findByRole("button",{name:"Update"})
    await user.click(updateButton)
    expect(await screen.findByText("2000")).toBeInTheDocument();

    
    const dashboardLink = await screen.findByRole("link", { name: /dashboard/i });
    await user.click(dashboardLink);
    expect(await screen.findByText("Total Income")).toBeInTheDocument();
    expect(await screen.findByText("Total Expenses")).toBeInTheDocument();
    expect(await screen.findByText("Current Balance")).toBeInTheDocument();
    expect(await screen.findAllByText("2000")).toHaveLength(3)

    
    const transactionsL = await screen.findByRole("link", { name: /transactions/i });
    await user.click(transactionsL);
    expect(await screen.findByText("2000")).toBeInTheDocument();
    const deleteButton=await screen.findByRole("button",{name:"Delete"});
    await user.click(deleteButton)
   
     expect(screen.queryByText("2000")).not.toBeInTheDocument();

    await user.click(dashboardLink);
    expect(screen.queryByText("Sports")).not.toBeInTheDocument();
    
  });
});
