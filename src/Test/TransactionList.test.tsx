import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";
import { useAppSelector } from "../components/hooks";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Transaction from "../components/Pages/Transaction";
import { configureStore } from "@reduxjs/toolkit";
import transactionReducer, { transactions } from '../components/slice/transactionSlice'

jest.mock('uuid', () => ({
    v4: () => '1234-adas-23232',
}))
jest.setTimeout(100000);


const renderWithProviders = (preloadedState = {}) => {
    const store = configureStore({
        reducer: { transaction: transactionReducer },
        preloadedState
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <Transaction />
            </MemoryRouter>
        </Provider>
    );
};
test("Testing the inital Page load",async()=>{
    const user=userEvent.setup();
    global.alert = jest.fn();
    const mockTransaction = {
        id: "1",
        type: "Expense",
        amount: "200",
        date: "2025-12-01",
        recurring: true,
        count: 1,
        category: "Sports",
    };
    renderWithProviders({
        transaction: {
            list: [mockTransaction],
            totalItems: {
                tAmount: 200,
                Income: 0,
                Expense: 200,
                top5: [{ category: "Sports", amount: 200 }]
            }
        }
    })
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort By Amount" })).toBeInTheDocument();


    expect(screen.getByText("2025-12-01")).toBeInTheDocument();
    expect(screen.getAllByText("Expense")).toHaveLength(2)
    expect(screen.getByText(/sports/i)).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("True")).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: "Delete" })
    const editBtn = screen.getByRole("button", { name: "Edit" })
    const clearBtn = screen.getByRole("button", { name: "Clear" })
    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();

    //Test the delete button
     await user.click(deleteBtn)
     expect(screen.queryByText("2025-12-01")).not.toBeInTheDocument();

     await user.click(clearBtn);
     expect(global.alert).toHaveBeenCalled();
})
test("Test the editing functionality of transaction list", async () => {
    const user = userEvent.setup();
    global.alert = jest.fn();
    const mockTransaction = {
        id: "1",
        type: "Expense",
        amount: "200",
        date: "2025-12-01",
        recurring: false,
        count: 1,
        category: "Sports",
    };
    renderWithProviders({
        transaction: {
            list: [mockTransaction],
            totalItems: {
                tAmount: 200,
                Income: 0,
                Expense: 200,
                top5: [{ category: "Sports", amount: 200 }]
            }
        }
    })

    //Tes the edit button
    const editBtn = screen.getByRole("button", { name: "Edit" })
    await user.click(editBtn);
    expect(screen.getByText("Edit Transaction")).toBeInTheDocument();


     const checkbox = screen.getByLabelText(/marks as recurring/i);
     const editedAmount=screen.getByTestId("EditedAmount");
     expect(editedAmount).toHaveValue(200);
    
     const editedCategory=screen.getByTestId("EditedCategory")
     const editedType=screen.getByRole("combobox",{name:/type/i})
     const editedDate=screen.getByTestId("EditedDate")
    await user.clear(editedAmount);
    await user.type(editedAmount,"400")
    expect(editedAmount).toHaveValue(400);

    await user.clear(editedCategory);
    await user.type(editedCategory,"Shopping");
    expect(editedCategory).toHaveValue("Shopping")

    fireEvent.click(checkbox);
    
     await user.click(editedType);
     await user.click(await screen.findByRole("option",{name:"Income"}))

     const cancelButton=screen.getByRole("button",{name:"Cancel"})
    const saveButton=screen.getByRole("button",{name:"Save"})
    
     await user.clear(editedDate);
     await user.type(editedDate,"2025-11-07")
     await user.click(saveButton)
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("Shopping")).toBeInTheDocument();
    expect(screen.getByText("2025-11-07")).toBeInTheDocument();


    //  expect(screen.getByText("Income")).toBeInTheDocument();

     await user.click(editBtn);
     await user.click(cancelButton);
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.queryByText("200")).not.toBeInTheDocument();

    
})


test("Testing the sort by amount button of TransactionList", async () => {
    const user = userEvent.setup();
    const mockTransaction = [{
        id: "1",
        type: "Expense",
        amount: "200",
        date: "2025-12-01",
        recurring: true,
        count: 1,
        category: "Sports",
    }, {
        id: "2",
        type: "Income",
        amount: "500",
        date: "2025-12-01",
        recurring: true,
        count: 1,
        category: "BGMI",
    }
    ];

    renderWithProviders({
        transaction: {
            list: mockTransaction,
            totalItems: {
                tAmount: 700,
                Income: 500,
                Expense: 200,
                top5: [{ category: "Sports", amount: 200 }, { categoty: "BGMI", amount: 500 }]
            }
        }
    })
    await user.click(screen.getByText("Sort By Amount"));
    const rows = screen.getAllByRole("row").slice(1);

    expect(rows[0]).toHaveTextContent("500");
    expect(rows[1]).toHaveTextContent("200");
})

test("Test the paging", async () => {
    const user = userEvent.setup();
    const items = Array.from({ length: 6 }).map((_, i) => ({
        id: String(i),
        type: "Expense",
        amount: "10",
        date: "2025-01-01",
        recurring: true,
        category: `Items`,
        count: 1,
    }))

    renderWithProviders({
        transaction:{list:items,totalItems:{tAmount:60,Income:0,Expense:60,top5:{ category: "Items", amount: 60 }}}
    })
  expect(screen.getByText(/1 of 2/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByText(/2 of 2/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /prev/i }));
  expect(screen.getByText(/1 of 2/i)).toBeInTheDocument();
})