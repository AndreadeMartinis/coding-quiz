export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // scambia gli elementi
  }
  return array;
}

export function randomizeAnswers(questions) {
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

export function stringUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
