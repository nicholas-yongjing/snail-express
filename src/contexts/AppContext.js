import { AuthProvider} from "./AuthContext";
import { ClassProvider } from "./ClassContext";

export function AppContextProvider({ children }) {

  return (
    <AuthProvider>
      <ClassProvider>
        {children}
      </ClassProvider>
    </AuthProvider>
  )
}