import { BrowserRouter } from "react-router-dom";

import AllRoutes from "./app/AllRoutes";
import Firebase from "./app/Firebase";

function App() {
  return (
    <BrowserRouter>
      <Firebase>
        <AllRoutes />
      </Firebase>
    </BrowserRouter>
  );
}

export default App;
