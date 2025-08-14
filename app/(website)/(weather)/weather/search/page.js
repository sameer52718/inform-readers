import { redirect } from "next/navigation";

export default function SearchPage({ searchParams }) {
  const query = searchParams.q;

  if (query) {
    redirect(`/weather/today/${encodeURIComponent(query)}`);
  }

  redirect("/");
}
