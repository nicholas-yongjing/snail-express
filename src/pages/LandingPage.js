import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import WebPage from "../components/WebPage";
import SnailLogo from "../images/snail-logo.png";
import Achievements from "../images/earn-achievements.jpg";
import Endorse from "../images/endorse-students.jpg";
import InstantFeedback from "../images/instant-feedback.jpg";
import LiveQuiz from "../images/live-quiz.jpg";
import Revise from "../images/revise-quizzes.jpg";
import LearnByHelping from "../images/learn-by-helping-others.jpg";
import Gallery from "../components/Gallery";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showStudents, setShowStudent] = useState(true);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  });

  const toggleFeatures = (useCase) => {
    if (useCase === "students") {
      setShowStudent(true);
    } else {
      setShowStudent(false);
    }
  };

  return (
    <WebPage>
      <div className="m-5 w-50 align-self-center d-flex flex-column justify-content-center gap-4 p-4">
        <div className="d-flex gap-4 align-items-center justify-content-center">
          <img src={SnailLogo} alt="snail express" style={{ width: "80px" }} />
          <div>
            <div className="text-center text-slate-100 fs-1">snail-express</div>
            <div className="text-center text-slate-300">
              Post your train of thought
            </div>
          </div>
        </div>
        <div className="text-center text-slate-200 fs-2" data-testid="tagline">
          <div>
            Looking for an interactive classroom application for online
            learning?
          </div>
          <div>
            Try <strong>snail-express!</strong>
          </div>
        </div>
      </div>
      <div className="m-4 p-4 d-flex flex-column justify-content-center align-items-stretch slate-700">
        <span className="d-flex justify-content-center">
          <Button
            className="m-2"
            onClick={() => toggleFeatures("students")}
            disabled={showStudents}
          >
            Students
          </Button>
          <Button
            className="m-2"
            onClick={() => toggleFeatures("tutors")}
            disabled={!showStudents}
          >
            Tutors
          </Button>
        </span>
        {showStudents
          ? (
            <Gallery items={
              [
                <div>
                  <h2 className="text-slate-100 p-3">
                    Ask questions and learn by helping others out
                  </h2>
                  <img src={LearnByHelping} alt="" className="w-100"/>
                </div>,
                <div>
                  <h2 className="text-slate-100 p-3 mt-5">
                    Gain XP, level up and earn achievements!
                  </h2>
                  <img src={Achievements} alt="" className="w-100" />
                </div>,
                <div>
                  <h2 className="text-slate-100 p-3 mt-5">
                    Revise your quizzes
                  </h2>
                  <img src={Revise} alt="" className="w-100" />
                </div>
              ]
            } />
          ) : (
            <Gallery items={[
              <div>
                <h2 className="text-slate-100 p-3">
                  Conduct live quizzes to test content
                </h2>
                <img src={LiveQuiz} alt="" className="w-100" />
              </div>,
              <div>
                <h2 className="text-slate-100 p-3 mt-5">
                  Incentivise student participation
                </h2>
                <img src={Achievements} alt="" className="w-100"/>
              </div>,
              <div>
                <h2 className="text-slate-100 p-3 mt-5">
                  Empower students to foster rich forum discussions
                </h2>
                <img src={Endorse} alt="" className="w-100" />
              </div>,
              <div>
                <h2 className="text-slate-100 p-3 mt-5">
                  Get instant feedback on lecture pacing
                </h2>
                <img src={InstantFeedback} alt="" className="w-100" /> 
              </div>
            ]} />
          )}
      </div>
    </WebPage>
  );
}
