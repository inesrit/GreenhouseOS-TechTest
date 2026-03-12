import { NextResponse } from "next/server";
import { properties, contacts, offers } from "@/data/mock";

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
};

export async function GET() {
  const enrichedProperties = [];
  
  for (const property of properties) {
    const propertyOffers = offers.filter(o => o.propertyId === property.id);
    const relatedContacts = contacts.filter(c => 
      propertyOffers.some(o => o.contactId === c.id)
    );
    
    enrichedProperties.push({
      ...property,
      _metadata: {
        offerCount: propertyOffers.length,
        contactCount: relatedContacts.length
      }
    });
  }

  return NextResponse.json(enrichedProperties, {
    headers: CACHE_HEADERS,
  });
}
