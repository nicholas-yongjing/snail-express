import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WebPage from "../components/WebPage";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  });

  return (
    <WebPage>
      <div
        className='w-50 align-self-center flex-grow-1 d-flex flex-column justify-content-center gap-4'
      >
        <div>
          <h1 className="text-center text-primary">snail-express</h1>
          <div className="text-center text-secondary">Post your train of thought</div>
        </div>
        <div className="text-center fs-2">
          Looking for an interactive classroom application for online
          learning? Try <strong>snail-express!</strong>
        </div>
        <div className="text-center fs-2">You are currently on our landing page.</div>
      </div>
    </WebPage>
  );
}
