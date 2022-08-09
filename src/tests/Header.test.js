import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Header from "../components/Header";

afterEach(cleanup);

test("header should be rendered", async () => {
  const component = render(<Header />);
  const element = await component.findByTestId("header");
  expect(element).toBeInTheDocument();
});

test("button should be rendered", async () => {
  const component = render(<Header />);
  const element = await component.findByTestId("button");
  expect(element).toBeInTheDocument();
});

