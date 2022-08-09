import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AuthProvider } from "../contexts/AuthContext";
import { ClassProvider } from "../contexts/ClassContext";
import AddQuestions from "../components/AddQuestions";

afterEach(cleanup);

test("Initial count should be zero", async () => {
  const component = render(
      <AuthProvider>
        <ClassProvider>
          <AddQuestions />
        </ClassProvider>
      </AuthProvider>
  );
  const element = await component.findByTestId("count");
  expect(element.textContent.slice(0, 1)).toBe("0");
});
