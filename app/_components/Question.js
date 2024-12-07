import Options from "./Options";
import { useQuiz } from "../_contexts/QuizContext";
import { stringUppercase } from "../_lib/utils";

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
