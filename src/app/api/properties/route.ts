import { NextResponse } from "next/server";
import { properties, contacts, offers } from "@/data/mock";

export async function GET() {
  // Simulate fetching related data for each property
  const enrichedProperties = [];
  
  for (const property of properties) {
    // Sequentially fetch contacts and offers for each property
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

  return NextResponse.json(enrichedProperties);
}
