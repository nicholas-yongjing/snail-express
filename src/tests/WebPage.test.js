import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ClassProvider } from "../contexts/ClassContext";
import WebPage from "../components/WebPage";

afterEach(cleanup);

test("Webpage should be rendered", async () => {
  const component = render(
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <WebPage></WebPage>
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  const element = await component.findByTestId("webpage");
  expect(element).toBeInTheDocument();
});
