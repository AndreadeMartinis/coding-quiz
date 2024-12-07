import { useQuiz } from "../_contexts/QuizContext";

function Header() {
  const {
    settings: { language },
  } = useQuiz();
  return (
    <header className="app-header">
      <img src={`logo${language}.png`} alt={`${language} logo`} />

      <h1>The Coding Quiz</h1>
    </header>
  );
}

export default Header;
