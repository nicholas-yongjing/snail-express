import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SideBar from "../components/SideBar";

afterEach(cleanup);

test("sidebar should be rendered", async () => {
  const component = render(<SideBar />);
  const element = await component.findByTestId("sidebar");
  expect(element).toBeInTheDocument();
});

