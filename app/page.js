"use client";
import { QuizProvider } from "./_contexts/QuizContext";

import QuizApp from "./_components/QuizApp";
import Header from "./_components/Header";

export default function Home() {
  return (
    <QuizProvider>
      <Header />
      <QuizApp />
    </QuizProvider>
  );
}
