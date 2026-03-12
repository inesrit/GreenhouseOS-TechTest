import { NextResponse } from "next/server";
import { offers, properties } from "@/data/mock";
import { UI_TEXT } from "@/constants";
import { sanitizeId, extractCity } from "@/utils";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function calculateSuggestedOffer(
  propertyId: string,
  askingPrice: number,
  allOffers: typeof offers,
  allProperties: typeof properties
): {
  suggestedAmount: number;
  reasoning: string;
  marketData: {
    existingOffers: number;
    avgExistingOffer: number | null;
    nearbyProperties: number;
    avgNearbyPrice: number | null;
    avgNearbyOfferPercentage: number | null;
  };
} {
  const property = allProperties.find(p => p.id === propertyId);
  if (!property) {
    return {
      suggestedAmount: askingPrice * 0.95,
      reasoning: "Property not found, suggesting 5% below asking price as default.",
      marketData: {
        existingOffers: 0,
        avgExistingOffer: null,
        nearbyProperties: 0,
        avgNearbyPrice: null,
        avgNearbyOfferPercentage: null,
      }
    };
  }

  const city = extractCity(property.address);

  const propertyOffers = allOffers.filter(o => o.propertyId === propertyId);
  const avgExistingOffer = propertyOffers.length > 0
    ? propertyOffers.reduce((sum, o) => sum + o.amount, 0) / propertyOffers.length
    : null;

  const nearbyProperties = allProperties.filter(
    p => p.id !== propertyId && extractCity(p.address) === city
  );
  const avgNearbyPrice = nearbyProperties.length > 0
    ? nearbyProperties.reduce((sum, p) => sum + p.price, 0) / nearbyProperties.length
    : null;

  let avgNearbyOfferPercentage: number | null = null;
  if (nearbyProperties.length > 0) {
    const nearbyOfferData: { offerPercentage: number }[] = [];
    
    nearbyProperties.forEach(np => {
      const npOffers = allOffers.filter(o => o.propertyId === np.id);
      if (npOffers.length > 0) {
        const avgOffer = npOffers.reduce((sum, o) => sum + o.amount, 0) / npOffers.length;
        nearbyOfferData.push({ offerPercentage: avgOffer / np.price });
      }
    });

    if (nearbyOfferData.length > 0) {
      avgNearbyOfferPercentage = nearbyOfferData.reduce((sum, d) => sum + d.offerPercentage, 0) / nearbyOfferData.length;
    }
  }

  let suggestedAmount: number;
  const reasons: string[] = [];

  if (avgExistingOffer && avgNearbyOfferPercentage) {
    const marketBasedSuggestion = askingPrice * avgNearbyOfferPercentage;
    suggestedAmount = (avgExistingOffer * 0.6) + (marketBasedSuggestion * 0.4);
    
    const existingOfferPercentage = ((avgExistingOffer / askingPrice) * 100).toFixed(1);
    const marketPercentage = (avgNearbyOfferPercentage * 100).toFixed(1);
    
    reasons.push(`Based on ${propertyOffers.length} existing offer(s) averaging ${existingOfferPercentage}% of asking price`);
    reasons.push(`Market trend in ${city}: offers average ${marketPercentage}% of asking price`);
    reasons.push(`Weighted suggestion: 60% existing offers + 40% market trend`);
  } else if (avgExistingOffer) {
    suggestedAmount = avgExistingOffer * 1.02;
    const percentage = ((avgExistingOffer / askingPrice) * 100).toFixed(1);
    reasons.push(`Based on ${propertyOffers.length} existing offer(s) averaging ${percentage}% of asking price`);
    reasons.push(`Suggesting slightly above average to be competitive`);
  } else if (avgNearbyOfferPercentage) {
    suggestedAmount = askingPrice * avgNearbyOfferPercentage;
    const marketPercentage = (avgNearbyOfferPercentage * 100).toFixed(1);
    reasons.push(`No existing offers on this property`);
    reasons.push(`Based on market trend in ${city}: offers average ${marketPercentage}% of asking price`);
  } else {
    suggestedAmount = askingPrice * 0.95;
    reasons.push(`Limited market data available for ${city}`);
    reasons.push(`Suggesting 5% below asking price as a starting point`);
  }

  suggestedAmount = Math.max(suggestedAmount, askingPrice * 0.90);
  suggestedAmount = Math.min(suggestedAmount, askingPrice * 1.10);

  suggestedAmount = Math.round(suggestedAmount / 1000) * 1000;

  return {
    suggestedAmount,
    reasoning: reasons.join(". ") + ".",
    marketData: {
      existingOffers: propertyOffers.length,
      avgExistingOffer,
      nearbyProperties: nearbyProperties.length,
      avgNearbyPrice,
      avgNearbyOfferPercentage,
    }
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPropertyId = searchParams.get("propertyId");

  const propertyId = sanitizeId(rawPropertyId);
  if (!propertyId) {
    return errorResponse(UI_TEXT.API_INVALID_PROPERTY_ID, 400);
  }

  const property = properties.find(p => p.id === propertyId);
  if (!property) {
    return errorResponse(UI_TEXT.API_PROPERTY_NOT_FOUND, 404);
  }

  const suggestion = calculateSuggestedOffer(
    propertyId,
    property.price,
    offers,
    properties
  );

  return NextResponse.json({
    propertyId,
    askingPrice: property.price,
    ...suggestion
  });
}
