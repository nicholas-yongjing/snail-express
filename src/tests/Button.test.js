import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Button from "../components/Button";

test("button should be rendered", async () => {
  const component = render(<Button></Button>);
  const element = await component.findByTestId("button");
  expect(element).toBeInTheDocument();
})