import { BrowserRouter } from "react-router-dom";

import { AppContext } from "./contexts/AppContext";
import AllRoutes from "./app/AllRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <AllRoutes />
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
