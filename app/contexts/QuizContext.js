import { createContext, useContext, useReducer, useEffect } from "react";
import { shuffle } from "../lib/utilities"; // Se non hai una funzione di shuffle, crea una

const QuizContext = createContext();

const SECS_PER_QUESTION = 10;

const initialState = {
  allQuestions: [],
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
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
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
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

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  function filterQuestions(allQuestions, topic, difficulty, numQuestionsSel) {
    let filteredQuestions = [...allQuestions];

    if (topic !== "all") {
      filteredQuestions = filteredQuestions.filter((q) => q.topic === topic);
    }

    if (difficulty !== "all") {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.difficulty === difficulty
      );
    }

    if (numQuestionsSel !== "all") {
      filteredQuestions = filteredQuestions.slice(0, Number(numQuestionsSel));
    }

    return shuffle(filteredQuestions);
  }

  function randomizeAnswers(questions) {
    return questions.map((question) => {
      const shuffledOptions = shuffle([...question.options]);
      const correctOption = shuffledOptions.indexOf(
        question.options[question.correctOption]
      );

      return {
        ...question,
        options: shuffledOptions,
        correctOption,
      };
    });
  }

  useEffect(() => {
    const fileMap = {
      javascript: "/questionsJavascript.json",
      nextjs: "/questionsNextjs.json",
      react: "/questionsReact.json",
    };

    const fileToFetch = fileMap[language];

    fetch(fileToFetch)
      .then((res) => res.json())
      .then((data) => {
        // Applica la randomizzazione delle risposte
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
