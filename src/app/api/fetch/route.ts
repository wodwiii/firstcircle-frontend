import axios from "axios";
import { NextResponse } from "next/server";
export const revalidate = 0;
export async function GET(request: Request) {
  const activities = [];
  for (let i = 0; i < 15; i++) {
    const res = await axios.get("https://bored-api.appbrewery.com/random");
    activities.push(res.data);
  }
  return NextResponse.json(activities);
}
