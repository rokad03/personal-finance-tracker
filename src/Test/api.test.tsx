import { fetchUsersApi } from "../components/api/fetchusers";
import { userAuthorisation } from "../components/api/userAuthorisation";

describe("API helpers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  
  test("fetchUsersApi Success", async () => {
    const mockJson = { users: [{ id: 1, username: "john" }] };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJson),
      })
    ) 

    const result = await fetchUsersApi();

    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/users");
    expect(result).toEqual(mockJson);
  });

  test("fetchUsersApi -> Error", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    )

    await expect(fetchUsersApi()).rejects.toThrow("Failed to fetch users");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("userAuthorisation -> success", async () => {
    const mockResponse = { token: "abc123" };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await userAuthorisation({
      username: "john",
      password: "123",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "john",
          password: "123",
          expiresInMins: 30,
        }),
     })
    );

    expect(result).toEqual(mockResponse);
  });

//   test("userAuthorisation", async () => {
//     const mockResponse = { message: "Invalid credentials" };

//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve(mockResponse),
//       } as Response)
//     ) as jest.Mock;

//     await expect(
//       userAuthorisation({ username: "wrong", password: "bad" })
//     ).resolves.toEqual(mockResponse);

//     expect(fetch).toHaveBeenCalledTimes(1);
//   });
});
