"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "../_contexts/QuizContext";
import { stringUppercase } from "../_lib/utils";

function StartScreen() {
  const router = useRouter();
  const {
    dispatch,
    allQuestions,
    questions,
    settings: { language, topic, difficulty, numQuestionsSel },
  } = useQuiz();

  // Funzione per aggiornare la route e fetchare nuove domande
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;

    /* // Aggiorna la route
    router.push(`/${newLanguage}`); */

    // Aggiorna il contesto con il nuovo linguaggio
    dispatch({
      type: "settingsUpdate",
      payload: { language: newLanguage, topic, difficulty, numQuestionsSel },
    });
  };

  const handleTopicChange = (e) => {
    dispatch({
      type: "settingsUpdate",
      payload: { language, topic: e.target.value, difficulty, numQuestionsSel },
    });
  };

  const handleDifficultyChange = (e) => {
    dispatch({
      type: "settingsUpdate",
      payload: { language, topic, difficulty: e.target.value, numQuestionsSel },
    });
  };

  const handleNumQuestionsSelChange = (e) => {
    dispatch({
      type: "settingsUpdate",
      payload: { language, topic, difficulty, numQuestionsSel: e.target.value },
    });
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      alert("No questions available for the selected options.");
      return;
    }
    dispatch({ type: "start" });
  };

  return (
    <div className="start">
      <div className="bestTitle">
        <h2>Il miglior</h2>
        <h2>
          <span className={language}>{stringUppercase(language)} Quiz</span>
        </h2>
        <h2>del mondo!</h2>
      </div>

      <div className="container-box-dropdown">
        <div className="box-dropdown">
          <h5>Linguaggio</h5>
          <select
            className="dropdown"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="react">React</option>
            <option value="javascript">JavaScript</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>

        <div className="box-dropdown">
          <h5>Livello</h5>
          <select
            className="dropdown"
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <option value="beginner">Base</option>
            <option value="competent">Intermedio</option>
            <option value="expert">Esperto</option>
          </select>
        </div>

        <div className="box-dropdown">
          <h5>
            Topic <span>(opzionale)</span>
          </h5>
          <select
            className="dropdown"
            value={topic}
            onChange={handleTopicChange}
          >
            <option value="all">Mix</option>
            {allQuestions &&
              [...new Set(allQuestions.map((question) => question.topic))].map(
                (uniqueTopic) => (
                  <option key={uniqueTopic} value={uniqueTopic}>
                    {stringUppercase(uniqueTopic)}
                  </option>
                )
              )}
          </select>
        </div>

        <div className="box-dropdown">
          <h5>
            Domande massime <span>(opzionale)</span>
          </h5>
          <select
            className="dropdown"
            value={numQuestionsSel}
            onChange={handleNumQuestionsSelChange}
          >
            <option value="all">Tutte</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>
      <h3>
        <span>{questions.length}</span> domande disponibili
      </h3>
      <button className="btn btn-ui" onClick={startQuiz}>
        Cominciamo!
        <img src={`logo${language}.png`} alt={`${language} logo`} />
      </button>
    </div>
  );
}

export default StartScreen;
