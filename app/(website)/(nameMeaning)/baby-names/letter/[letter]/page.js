import LetterPage from "@/components/pages/babynames/LetterPage";

export async function generateMetadata({ params }) {
  const { letter } = params;
  const upperLetter = letter?.toUpperCase() || "A";

  try {
    return {
      title: `Baby Names Starting with "${upperLetter}" | Infrom Readers`,
      description: `Explore beautiful baby names starting with the letter "${upperLetter}" along with their meanings, origins, and cultural significance.`,
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
