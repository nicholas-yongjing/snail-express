import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ClassProvider } from "./contexts/ClassContext";

import AllRoutes from "./app/AllRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClassProvider>
          <AllRoutes />
        </ClassProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
