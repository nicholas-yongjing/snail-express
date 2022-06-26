import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WebPage from "../components/WebPage";
import SnailLogo from "../images/snail-logo.png"

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
        <div className="d-flex gap-4 align-items-center justify-content-center">
          <img
            src={SnailLogo}
            alt="snail express"
            style={{ width: '80px' }}
          />
          <div>
            <div className="text-center text-slate-100 fs-1">snail-express</div>
            <div className="text-center text-slate-300">Post your train of thought</div>
          </div>
        </div>
        <div className="text-center text-slate-200 fs-2">
          Looking for an interactive classroom application for online
          learning? Try <strong>snail-express!</strong>
        </div>
        <div className="text-center text-slate-200 fs-2">You are currently on our landing page.</div>
      </div>
    </WebPage>
  );
}
