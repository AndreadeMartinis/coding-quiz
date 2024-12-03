import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";

function Question() {
  const { questions, index } = useQuiz();
  const question = questions.at(index);

  return (
    <div className="box-question">
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}

export default Question;
