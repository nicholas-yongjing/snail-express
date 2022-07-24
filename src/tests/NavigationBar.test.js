import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ClassProvider } from "../contexts/ClassContext";
import NavigationBar from "../components/NavigationBar";

afterEach(cleanup);

test("navigation bar should be rendered", async () => {
  const component = render(
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <NavigationBar />
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  const element = await component.findByTestId("navbar");
  expect(element).toBeInTheDocument();
});

test("link to home should be rendered", async () => {
  const component = render(
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <NavigationBar />
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  const element = await component.findByTestId("link");
  expect(element).toBeInTheDocument();
});

test("link to login should be rendered", async () => {
  const component = render(
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <NavigationBar />
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  const element = await component.findByTestId("login");
  expect(element).toBeInTheDocument();
});

test("link to signup should be rendered", async () => {
  const component = render(
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <NavigationBar />
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  const element = await component.findByTestId("signup");
  expect(element).toBeInTheDocument();
});
