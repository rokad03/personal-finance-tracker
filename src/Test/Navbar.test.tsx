import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import loginReducer,{logout} from "../components/slice/loginSlice"
import userEvent from "@testing-library/user-event";

const renderNavbar=()=>{
    const store=configureStore({
        reducer:{auth:loginReducer}
    })
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        </Provider>
    )
    return { store, dispatchSpy };
}

test("Test the navbar",async()=>{
    const user=userEvent.setup();
    const {store,dispatchSpy}=renderNavbar();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();

    const Btn=screen.getByRole("button",{name:/logout/i})
    expect(Btn).toBeInTheDocument();
    await user.click(Btn)
    expect(dispatchSpy).toHaveBeenCalledWith(logout());

    const state=store.getState();
    expect(state.auth.users).toBeNull();
})