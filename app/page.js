"use client";
import { QuizProvider } from "./contexts/QuizContext";

import QuizApp from "./components/QuizApp";

export default function Home() {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  );
}
