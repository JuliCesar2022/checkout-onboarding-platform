import { useAppDispatch } from "./shared/hooks/useAppDispatch";
import "@testing-library/jest-dom";

describe("Smoke test", () => {
  test("imports useAppDispatch", () => {
    expect(useAppDispatch).toBeDefined();
  });
});
