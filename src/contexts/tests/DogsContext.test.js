import { renderHook, act } from "@testing-library/react";
import { DogsProvider, useDogs } from "../DogsContext";

describe("DogsContext", () => {
  test("adds and removes favorites", () => {
    const wrapper = ({ children }) => <DogsProvider>{children}</DogsProvider>;
    const { result } = renderHook(() => useDogs(), { wrapper });

    act(() => {
      result.current.addFavorite("dog1");
    });
    expect(result.current.favorites).toEqual(["dog1"]);

    act(() => {
      result.current.removeFavorite("dog1");
    });
    expect(result.current.favorites).toEqual([]);
  });
});
