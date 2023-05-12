import { BrowserRouter } from "react-router-dom";

import { AppContextProvider } from "./contexts/AppContext";
import AllRoutes from "./app/AllRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <AllRoutes />
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
