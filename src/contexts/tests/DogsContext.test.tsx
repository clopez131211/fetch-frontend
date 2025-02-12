import React, { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import { DogsProvider, useDogs, Dog } from "../DogsContext";

describe("DogsContext", () => {
  test("adds and removes favorites", () => {
    const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
      <DogsProvider>{children}</DogsProvider>
    );
    const { result } = renderHook(() => useDogs(), { wrapper });

    const dummyDog: Dog = {
      id: "dog1",
      name: "Test Dog",
      img: "test.jpg",
      age: 3,
      breed: "Test Breed",
      zip_code: "00000",
    };

    act(() => {
      result.current.addToFavorites(dummyDog);
    });
    expect(result.current.favorites).toEqual([dummyDog]);

    act(() => {
      result.current.removeFromFavorites("dog1");
    });
    expect(result.current.favorites).toEqual([]);
  });
});
