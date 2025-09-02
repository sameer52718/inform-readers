// export function generateFAQs(country) {
//   return [
//     {
//       question: `What is the meaning of the {gender} name {name} in ${country}?`,
//       answer: `The {gender} name {name} in ${country}, of {origin} origin, often reflects {religion} values or cultural heritage.`
//     },
//     {
//       question: `How does {religion} influence names like {name} in ${country}?`,
//       answer: `In ${country}, {religion} shapes names like {name}, with {origin} roots often tied to spiritual or cultural traditions.`
//     },
//     {
//       question: `Is {name} a popular name in ${country}?`,
//       answer: `{name}, a {gender} name of {origin} origin, is often chosen in ${country} for its {religion}-inspired or cultural significance.`
//     }
//   ];
// }

// File: templates/faq.js
import { countryNames } from "@/constant/supportContries";

export function generateFAQs(countryCode, context = "name") {
  const country = countryNames[countryCode] || "Global";

  // Base FAQs for SWIFT codes based on Bank Codes FAQs.rtf
  const swiftCodeFAQs = [
    {
      question: "What is the SWIFT code for {bank} in {city}, {country}?",
      answer:
        "The SWIFT code for {bank} in {city}, {country} is {swiftCode}. It is used for international bank transfers to ensure secure and accurate transactions.",
    },
    {
      question: "How can I use the {swiftCode} SWIFT code for {bank}?",
      answer:
        "The {swiftCode} SWIFT code for {bank} is used when initiating international wire transfers to {bank}'s branch in {city}, {country}. Provide it to the sending bank to ensure the funds reach the correct destination.",
    },
    {
      question: "Does {bank} in {country} use IBAN with SWIFT codes?",
      answer:
        "In {country}, {bank} may require an IBAN along with the SWIFT code {swiftCode} for international transfers, especially for countries in the EU or other regions where IBAN is standard.",
    },
    {
      question: "What is the significance of {swiftCode} for {bank}?",
      answer:
        "The SWIFT code {swiftCode} uniquely identifies {bank}'s branch in {city}, {country}, ensuring that international payments are routed correctly and securely.",
    },
    {
      question: "Can I find other branches of {bank} in {country}?",
      answer:
        "Yes, {bank} may have multiple branches in {country}. Check our related branches section for other SWIFT codes associated with {bank}.",
    },
  ];

  // Return SWIFT code FAQs if context is "swiftcode", otherwise return name FAQs
  if (context === "swiftcode") {
    return swiftCodeFAQs.map((faq) => ({
      question: faq.question.replace("{country}", country),
      answer: faq.answer.replace("{country}", country),
    }));
  }

  // Existing name-related FAQs (from baby names implementation)
  const nameFAQs = [
    {
      question: `What is the meaning of the {gender} name {name} in {country}?`,
      answer: `The {gender} name {name} in {country}, of {origin} origin, often reflects {religion} values or cultural heritage.`,
    },
    {
      question: `How does {religion} influence names like {name} in {country}?`,
      answer: `In {country}, {religion} shapes names like {name}, with {origin} roots often tied to spiritual or cultural traditions.`,
    },
    {
      question: `Is {name} a popular name in {country}?`,
      answer: `{name}, a {gender} name of {origin} origin, is often chosen in {country} for its {religion}-inspired or cultural significance.`,
    },
  ];

  return nameFAQs.map((faq) => ({
    question: faq.question.replace("{country}", country),
    answer: faq.answer.replace("{country}", country),
  }));
}
