import LetterPage from "@/components/pages/babynames/LetterPage";

function parseNameSlug(slug) {
  // expected: "boys-starting-with-a"
  const regex = /(boys|girls)-starting-with-([a-z])/i;

  const match = slug.match(regex);

  if (!match) return null;

  return {
    gender: match[1].toUpperCase(), // BOYS / GIRLS
    alphabet: match[2].toUpperCase(), // A / B / C...
  };
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { gender, alphabet: upperLetter } = parseNameSlug(slug);

  try {
    return {
      title: `Baby Names Starting with "${upperLetter}" for ${gender} | Infrom Readers`,
      description: `Explore beautiful baby names starting with the letter "${upperLetter}" for ${gender} along with their meanings, origins, and cultural significance.`,
      keywords: [
        `baby names starting with ${upperLetter}`,
        `${upperLetter} baby names meaning`,
        "unique baby names",
        "baby name search",
      ],
    };
  } catch (error) {
    return {
      title: `Baby Names Starting with "${upperLetter}" | Infrom Readers`,
      description: `Discover baby names starting with "${upperLetter}" and their meanings.`,
    };
  }
}

export default function Page() {
  return <LetterPage />;
}
