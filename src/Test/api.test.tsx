import { fetchUsersApi } from "../components/api/fetchusers";
import { userAuthorisation } from "../components/api/userAuthorisation";

describe("API helpers (switch-case mock)", () => {

  beforeEach(() => {
    jest.resetAllMocks();

    global.fetch = jest.fn().mockImplementation((url: string, options?: any) => {
      const path = new URL(url).pathname;

      switch (path) {

        case "/users":
          return Promise.resolve({
            ok: true,
            json: async () => ({ users: [{ id: 1, username: "john" }] }),
          });

        
        case "/auth/login":
          return Promise.resolve({
            ok: true,
            json: async () => ({ token: "abc123" }),
          });

        default:
          return Promise.reject(new Error("Unknown endpoint: " + path));
      }
    });
  });

  test("fetchUsersApi → success", async () => {
    const result = await fetchUsersApi();

    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/users");
    expect(result).toEqual({ users: [{ id: 1, username: "john" }] });
  });

  test("fetchUsersApi → failure (ok=false)", async () => {
    
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    await expect(fetchUsersApi()).rejects.toThrow("Failed to fetch users");
  });

  test("userAuthorisation → success", async () => {
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

    expect(result).toEqual({ token: "abc123" });
  });
});