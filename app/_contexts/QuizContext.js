import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { randomizeAnswers, shuffle } from "../_lib/utils";

const QuizContext = createContext();

// Impostazioni di default
const SECS_PER_QUESTION = 10;
const initialState = {
  allQuestions: [],
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0, // Impostato a 0 inizialmente
  secondsRemaining: null,
  settings: {
    language: "react",
    topic: "all",
    difficulty: "all",
    numQuestionsSel: "all",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        allQuestions: action.payload,
        questions: action.payload,
        status: "dataLoaded",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "settingsUpdate":
      return {
        ...state,
        settings: action.payload,
      };
    case "questionsUpdate":
      return {
        ...state,
        questions: action.payload,
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      const newHighscore =
        state.points > state.highscore ? state.points : state.highscore;
      localStorage.setItem(
        `${state.settings.language}-highscore`,
        newHighscore
      ); // Salva il highscore per la categoria
      return {
        ...state,
        status: "finished",
        highscore: newHighscore,
      };
    case "restart":
      return {
        ...initialState,
        allQuestions: state.allQuestions,
        questions: state.allQuestions,
        highscore: state.highscore,
        status: "dataLoaded",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "setHighscore":
      return {
        ...state,
        highscore: action.payload,
      };
    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    {
      allQuestions,
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      settings: { language, topic, difficulty, numQuestionsSel },
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [isClient, setIsClient] = useState(false); // Stato per determinare se siamo nel browser

  // Impostare highscore iniziale solo nel client
  useEffect(() => {
    setIsClient(true); // Quando il componente è montato, aggiorniamo lo stato
  }, []);

  useEffect(() => {
    if (!isClient) return; // Non eseguire l'effetto finché non siamo nel client

    const savedHighscore = localStorage.getItem(`${language}-highscore`);
    dispatch({
      type: "setHighscore",
      payload: savedHighscore ? parseInt(savedHighscore) : 0,
    });
  }, [isClient, language]);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  function filterQuestions(allQuestions, topic, difficulty, numQuestionsSel) {
    let filteredQuestions = [...allQuestions];

    if (difficulty !== "all") {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.difficulty === difficulty
      );
    }

    if (topic !== "all") {
      filteredQuestions = filteredQuestions.filter((q) => q.topic === topic);
    }

    if (numQuestionsSel !== "all") {
      filteredQuestions = filteredQuestions.slice(0, Number(numQuestionsSel));
    }

    return shuffle(filteredQuestions);
  }

  useEffect(() => {
    const fileMap = {
      javascript: "/javascriptQuestions.json",
      nextjs: "/nextjsQuestions.json",
      react: "/reactQuestions.json",
    };

    const fileToFetch = fileMap[language];

    fetch(fileToFetch)
      .then((res) => res.json())
      .then((data) => {
        const randomizedQuestions = randomizeAnswers(data.questions);
        dispatch({ type: "dataReceived", payload: randomizedQuestions });
      })
      .catch(() => dispatch({ type: "dataFailed" }));
  }, [language]);

  useEffect(() => {
    if (!allQuestions.length) return;

    const filteredQuestions = filterQuestions(
      allQuestions,
      topic,
      difficulty,
      numQuestionsSel
    );

    dispatch({ type: "questionsUpdate", payload: filteredQuestions });
  }, [topic, difficulty, numQuestionsSel, allQuestions]);

  return (
    <QuizContext.Provider
      value={{
        allQuestions,
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        settings: { language, topic, difficulty, numQuestionsSel },
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
