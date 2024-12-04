import { useQuiz } from "../contexts/QuizContext";
import { stringUppercase } from "../lib/utilities";

function StartScreen() {
  const {
    dispatch,
    allQuestions,
    questions,
    settings: { language, topic, difficulty, numQuestionsSel },
  } = useQuiz();

  const handleLanguageChange = (e) => {
    dispatch({
      type: "settingsUpdate",
      payload: { language: e.target.value, topic, difficulty, numQuestionsSel },
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
      <h2 className="best-h2">
        Il miglior <span>{stringUppercase(language)} Quiz</span> del mondo!
      </h2>

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
        <h5>
          Topic <span>(opzionale)</span>
        </h5>
        <select className="dropdown" value={topic} onChange={handleTopicChange}>
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
          Difficoltà <span>(opzionale)</span>
        </h5>
        <select
          className="dropdown"
          value={difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="all">Mix</option>
          <option value="beginner">Beginner</option>
          <option value="competent">Competent</option>
          <option value="expert">Expert</option>
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

/* 

- Aggiunta salvataggio record nei cookie 

*/
