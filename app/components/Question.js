import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";
import { stringUppercase } from "../lib/utilities";

function Question() {
  const { questions, index } = useQuiz();
  const question = questions.at(index);
  const topic = question.topic;

  return (
    <div className="box-question">
      <h5>Topic: {stringUppercase(topic)}</h5>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}

export default Question;
