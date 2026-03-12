import { NextResponse } from "next/server";
import { offers, properties } from "@/data/mock";
import { OFFER_STATUS, PROPERTY_STATUS, OFFER_LIMITS, UI_TEXT } from "@/constants";
import { sanitizeId, sanitizeAmount, sortOffers } from "@/utils";
import type { Offer } from "@/types";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPropertyId = searchParams.get("propertyId");

  if (rawPropertyId) {
    const propertyId = sanitizeId(rawPropertyId);
    if (!propertyId) {
      return errorResponse(UI_TEXT.API_INVALID_PROPERTY_ID, 400);
    }
    
    const filtered = offers.filter((o) => o.propertyId === propertyId);
    return NextResponse.json(sortOffers(filtered));
  }

  return NextResponse.json(sortOffers(offers));
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(UI_TEXT.API_INVALID_JSON, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse(UI_TEXT.API_INVALID_BODY, 400);
    }

    const { propertyId: rawPropertyId, amount: rawAmount, contactId: rawContactId } = body as Record<string, unknown>;

    const propertyId = sanitizeId(rawPropertyId);
    if (!propertyId) {
      return errorResponse(UI_TEXT.API_PROPERTY_ID_REQUIRED, 400);
    }

    const property = properties.find((p) => p.id === propertyId);
    if (!property) {
      return errorResponse(UI_TEXT.API_PROPERTY_NOT_FOUND, 404);
    }
    if (property.status !== PROPERTY_STATUS.AVAILABLE) {
      return errorResponse(UI_TEXT.API_PROPERTY_NOT_ACCEPTING, 400);
    }

    const amount = sanitizeAmount(rawAmount, OFFER_LIMITS.MIN_AMOUNT, OFFER_LIMITS.MAX_AMOUNT);
    if (amount === null) {
      return errorResponse(
        `Offer amount must be between £${OFFER_LIMITS.MIN_AMOUNT.toLocaleString()} and £${OFFER_LIMITS.MAX_AMOUNT.toLocaleString()}`,
        400
      );
    }

    const contactId = rawContactId ? sanitizeId(rawContactId) : "contact-guest";
    if (rawContactId && !contactId) {
      return errorResponse(UI_TEXT.API_INVALID_CONTACT_ID, 400);
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      propertyId,
      contactId: contactId || "contact-guest",
      amount,
      status: OFFER_STATUS.PENDING,
      dateAdded: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: UI_TEXT.API_OFFER_SUBMITTED,
        offer: newOffer,
      },
      { status: 201 }
    );
  } catch {
    return errorResponse(UI_TEXT.API_OFFER_FAILED, 500);
  }
}
