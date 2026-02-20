import { NextResponse } from "next/server";
import { contacts } from "@/data/mock";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (propertyId) {
    const filtered = contacts.filter((c: any) => c.propertyId === propertyId);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(contacts);
}
