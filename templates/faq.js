export function generateFAQs(country) {
  return [
    {
      question: `What is the meaning of the {gender} name {name} in ${country}?`,
      answer: `The {gender} name {name} in ${country}, of {origin} origin, often reflects {religion} values or cultural heritage.`
    },
    {
      question: `How does {religion} influence names like {name} in ${country}?`,
      answer: `In ${country}, {religion} shapes names like {name}, with {origin} roots often tied to spiritual or cultural traditions.`
    },
    {
      question: `Is {name} a popular name in ${country}?`,
      answer: `{name}, a {gender} name of {origin} origin, is often chosen in ${country} for its {religion}-inspired or cultural significance.`
    }
  ];
}