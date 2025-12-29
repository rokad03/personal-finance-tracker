import React from "react";
import { render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login";
import userEvent from "@testing-library/user-event";

// mock react-router-dom
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

test("renders login form", () => {
  render(<Login />);

  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

test("allows user to type into fields", async () => {
  const user=userEvent.setup();
  render(<Login />);
  
  await user.type(screen.getByPlaceholderText(/username/i),"nishit")
  await user.type(screen.getByPlaceholderText(/password/i), "1234");

  expect(screen.getByPlaceholderText(/username/i)).toHaveValue("nishit");
  expect(screen.getByPlaceholderText(/password/i)).toHaveValue("1234");

  await user.click(screen.getByRole("button",{name:/login/i}))
  expect(await screen.findByText("User not found")).toBeInTheDocument();
  
});

// test("navigates after successful login action", async () => {
//   render(<Login />);

//   fireEvent.change(screen.getByLabelText(/username/i), {
//     target: { value: "kminchelle" },
//   });

//   fireEvent.change(screen.getByLabelText(/password/i), {
//     target: { value: "0lelplR" },
//   });

//   fireEvent.click(screen.getByRole("button", { name: /login/i }));

//   // assert navigate was called
//   expect(mockedNavigate).toHaveBeenCalled();
// });
