"use client";
import { QuizProvider } from "./contexts/QuizContext";

import QuizApp from "./components/QuizApp";
import Header from "./components/Header";
import Signature from "./components/Signature";

export default function Home() {
  return (
    <QuizProvider>
      <Header />
      <QuizApp />
      <Signature />
    </QuizProvider>
  );
}
