import type { NextRequest } from "next/server";

const FRED_BASE_URL = "https://api.stlouisfed.org/fred/series/observations";

export async function GET(request: NextRequest) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "FRED_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const seriesId = request.nextUrl.searchParams.get("series_id");
  if (!seriesId) {
    return Response.json(
      { error: "series_id parameter is required" },
      { status: 400 }
    );
  }

  // Fetch last 5 years of monthly data
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  const startDate = fiveYearsAgo.toISOString().split("T")[0];

  const url = new URL(FRED_BASE_URL);
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("observation_start", startDate);
  url.searchParams.set("frequency", "m");

  const res = await fetch(url.toString());
  if (!res.ok) {
    return Response.json(
      { error: `FRED API returned ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  const observations = data.observations
    .filter((obs: { value: string }) => obs.value !== ".")
    .map((obs: { date: string; value: string }) => ({
      date: obs.date.slice(0, 7), // "YYYY-MM"
      value: parseFloat(obs.value),
    }));

  return Response.json({ series_id: seriesId, observations });
}
