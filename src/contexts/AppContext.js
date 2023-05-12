import { AuthProvider} from "./AuthContext";
import { ClassProvider } from "./ClassContext";
import { FirebaseProvider } from "./FirebaseContext";

export function AppContext({ children }) {

  return (
    <FirebaseProvider>
      <AuthProvider>
        <ClassProvider>
          {children}
        </ClassProvider>
      </AuthProvider>
    </FirebaseProvider>
  )
}