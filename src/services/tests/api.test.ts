import { login, fetchBreeds } from "../api";

beforeEach(() => {
  global.fetch = jest.fn();
});

test("login API call", async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({}),
    headers: new Headers(),
    status: 200,
    statusText: "OK",
  });

  await login({ name: "test", email: "test@example.com" });

  expect(global.fetch).toHaveBeenCalledWith(
    "https://frontend-take-home-service.fetch.com/auth/login",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "test", email: "test@example.com" }),
      credentials: "include",
    })
  );
});

test("fetchBreeds error", async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status: 403,
    json: async () => ({}),
    headers: new Headers(),
    statusText: "Forbidden",
  });

  await expect(fetchBreeds()).rejects.toThrow("HTTP error: 403");
});