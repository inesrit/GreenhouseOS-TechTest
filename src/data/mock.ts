/**
 * Mock data
 */

import type { Property, Contact, Offer } from "@/types";

export const properties: Property[] = [
  // London properties
  {
    id: "prop-1",
    address: "12 Kensington Gardens, London W8 4PE",
    price: 1250000,
    status: "Available",
    listedDate: "2023-10-01T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-13",
    address: "78 Chelsea Manor, London SW3 5RN",
    price: 1450000,
    status: "Available",
    listedDate: "2024-01-10T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-14",
    address: "34 Notting Hill Gate, London W11 3HT",
    price: 1100000,
    status: "Sold",
    listedDate: "2023-08-15T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-15",
    address: "5 Hampstead Heath, London NW3 2PT",
    price: 1680000,
    status: "Available",
    listedDate: "2024-02-01T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Manchester properties
  {
    id: "prop-2",
    address: "45 Victoria Road, Manchester M20 3FH",
    price: 385000,
    status: "Sale Agreed",
    listedDate: "2023-11-05T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-16",
    address: "22 Didsbury Park, Manchester M20 5LH",
    price: 425000,
    status: "Available",
    listedDate: "2024-01-20T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-17",
    address: "89 Chorlton Green, Manchester M21 9HS",
    price: 350000,
    status: "Available",
    listedDate: "2023-12-10T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Edinburgh properties
  {
    id: "prop-3",
    address: "8 Castle Street, Edinburgh EH2 3AH",
    price: 475000,
    status: "Available",
    listedDate: "2023-09-15T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-18",
    address: "15 Royal Mile, Edinburgh EH1 2PB",
    price: 520000,
    status: "Available",
    listedDate: "2024-02-05T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-19",
    address: "42 Stockbridge Lane, Edinburgh EH3 6TJ",
    price: 445000,
    status: "Sold",
    listedDate: "2023-07-01T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Bath property
  {
    id: "prop-4",
    address: "27 Queen's Parade, Bath BA1 2NJ",
    price: 695000,
    status: "Sold",
    listedDate: "2023-07-20T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Leeds properties
  {
    id: "prop-6",
    address: "91 Park Lane, Leeds LS1 5HD",
    price: 215000,
    status: "Available",
    listedDate: "2024-02-14T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-20",
    address: "17 Headingley Avenue, Leeds LS6 3EP",
    price: 285000,
    status: "Available",
    listedDate: "2024-01-05T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-21",
    address: "63 Roundhay Road, Leeds LS8 2HT",
    price: 195000,
    status: "Sale Agreed",
    listedDate: "2023-11-20T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Brighton properties
  {
    id: "prop-7",
    address: "14 The Crescent, Brighton BN1 3FN",
    price: 550000,
    status: "Sale Agreed",
    listedDate: "2023-12-01T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-22",
    address: "29 Brunswick Place, Brighton BN3 1NA",
    price: 625000,
    status: "Available",
    listedDate: "2024-02-10T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Cambridge properties
  {
    id: "prop-8",
    address: "56 Riverside Walk, Cambridge CB5 8AQ",
    price: 890000,
    status: "Available",
    listedDate: "2024-03-05T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-23",
    address: "11 Mill Road, Cambridge CB1 2AD",
    price: 750000,
    status: "Available",
    listedDate: "2024-01-15T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Oxford properties
  {
    id: "prop-9",
    address: "22 Oak Avenue, Oxford OX2 7DG",
    price: 725000,
    status: "Sold",
    listedDate: "2023-06-18T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-24",
    address: "8 Jericho Street, Oxford OX2 6BT",
    price: 680000,
    status: "Available",
    listedDate: "2024-02-20T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Liverpool properties
  {
    id: "prop-10",
    address: "7 Waterfront Place, Liverpool L3 1BY",
    price: 195000,
    status: "Available",
    listedDate: "2024-01-22T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-25",
    address: "44 Albert Dock, Liverpool L3 4AF",
    price: 245000,
    status: "Available",
    listedDate: "2024-02-28T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // York properties
  {
    id: "prop-11",
    address: "33 Cathedral Close, York YO1 7HH",
    price: 430000,
    status: "Available",
    listedDate: "2023-08-30T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  {
    id: "prop-26",
    address: "19 Shambles Walk, York YO1 7LX",
    price: 395000,
    status: "Available",
    listedDate: "2024-01-08T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
  // Whitby property
  {
    id: "prop-12",
    address: "18 Marine Terrace, Whitby YO21 3PR",
    price: 280000,
    status: "Sale Agreed",
    listedDate: "2023-10-25T10:00:00Z",
    imageUrl: "/placeholder-house.jpg",
  },
];

export const contacts: Contact[] = [
  { id: "contact-1", name: "James Whitfield", role: "Vendor", email: "j.whitfield@email.com" },
  { id: "contact-2", name: "Sarah Chen", role: "Buyer", email: "sarah.chen@email.com" },
  { id: "contact-3", name: "Michael Torres", role: "Buyer", email: "m.torres@email.com" },
  { id: "contact-4", name: "Emma Richardson", role: "Vendor", email: "emma.r@email.com" },
  { id: "contact-5", name: "David Okonkwo", role: "Buyer", email: "d.okonkwo@email.com" },
  { id: "contact-6", name: "Helen Murray", role: "Vendor", email: "helen.murray@email.com" },
  { id: "contact-7", name: "Raj Patel", role: "Buyer", email: "raj.patel@email.com" },
  { id: "contact-8", name: "Fiona Gallagher", role: "Vendor", email: "fiona.g@email.com" },
  { id: "contact-9", name: "Tom Bradley", role: "Buyer", email: "tom.b@email.com" },
  { id: "contact-10", name: "Lucy Watts", role: "Buyer", email: "lucy.watts@email.com" },
  { id: "contact-11", name: "Andrew Fletcher", role: "Vendor", email: "a.fletcher@email.com" },
  { id: "contact-12", name: "Nina Rossi", role: "Buyer", email: "nina.rossi@email.com" },
  { id: "contact-13", name: "George Palmer", role: "Vendor", email: "g.palmer@email.com" },
  { id: "contact-14", name: "Charlotte Dunn", role: "Buyer", email: "c.dunn@email.com" },
  { id: "contact-15", name: "Oliver Marsh", role: "Vendor", email: "o.marsh@email.com" },
  { id: "contact-16", name: "Priya Sharma", role: "Buyer", email: "priya.s@email.com" },
  { id: "contact-17", name: "William Grant", role: "Vendor", email: "w.grant@email.com" },
  { id: "contact-18", name: "Amy Liang", role: "Buyer", email: "amy.liang@email.com" },
  { id: "contact-19", name: "Catherine Bell", role: "Vendor", email: "c.bell@email.com" },
  { id: "contact-20", name: "Marcus Huang", role: "Buyer", email: "m.huang@email.com" },
  { id: "contact-21", name: "Diane Foster", role: "Vendor", email: "d.foster@email.com" },
  { id: "contact-22", name: "Ryan Doyle", role: "Buyer", email: "r.doyle@email.com" },
  { id: "contact-23", name: "Sandra Kowalski", role: "Vendor", email: "s.kowalski@email.com" },
  { id: "contact-24", name: "Ben Archer", role: "Buyer", email: "b.archer@email.com" },
  { id: "contact-25", name: "Peter Rowland", role: "Vendor", email: "p.rowland@email.com" },
  { id: "contact-26", name: "Lisa Jennings", role: "Buyer", email: "l.jennings@email.com" },
];

export const offers: Offer[] = [
  // London property offers (prop-1, prop-13, prop-14, prop-15)
  { id: "offer-1", propertyId: "prop-1", contactId: "contact-2", amount: 1200000, status: "Rejected", dateAdded: "2024-01-15T10:00:00Z" },
  { id: "offer-2", propertyId: "prop-1", contactId: "contact-2", amount: 1270000, status: "Pending", dateAdded: "2024-02-20T14:30:00Z" },
  { id: "offer-3", propertyId: "prop-1", contactId: "contact-3", amount: 1250000, status: "Pending", dateAdded: "2024-02-18T09:15:00Z" },
  { id: "offer-21", propertyId: "prop-13", contactId: "contact-5", amount: 1380000, status: "Rejected", dateAdded: "2024-01-20T10:00:00Z" },
  { id: "offer-22", propertyId: "prop-13", contactId: "contact-7", amount: 1420000, status: "Pending", dateAdded: "2024-02-15T14:00:00Z" },
  { id: "offer-23", propertyId: "prop-14", contactId: "contact-9", amount: 1050000, status: "Rejected", dateAdded: "2023-09-01T10:00:00Z" },
  { id: "offer-24", propertyId: "prop-14", contactId: "contact-10", amount: 1095000, status: "Accepted", dateAdded: "2023-10-15T11:30:00Z" },
  { id: "offer-25", propertyId: "prop-15", contactId: "contact-12", amount: 1600000, status: "Pending", dateAdded: "2024-02-10T09:00:00Z" },
  // Manchester property offers (prop-2, prop-16, prop-17)
  { id: "offer-4", propertyId: "prop-2", contactId: "contact-5", amount: 370000, status: "Rejected", dateAdded: "2023-11-10T11:00:00Z" },
  { id: "offer-5", propertyId: "prop-2", contactId: "contact-5", amount: 382000, status: "Accepted", dateAdded: "2023-12-05T16:45:00Z" },
  { id: "offer-26", propertyId: "prop-16", contactId: "contact-14", amount: 400000, status: "Rejected", dateAdded: "2024-01-25T10:00:00Z" },
  { id: "offer-27", propertyId: "prop-16", contactId: "contact-16", amount: 415000, status: "Pending", dateAdded: "2024-02-20T15:00:00Z" },
  { id: "offer-28", propertyId: "prop-17", contactId: "contact-18", amount: 335000, status: "Rejected", dateAdded: "2024-01-05T11:00:00Z" },
  { id: "offer-29", propertyId: "prop-17", contactId: "contact-20", amount: 345000, status: "Pending", dateAdded: "2024-02-01T14:30:00Z" },
  // Edinburgh property offers (prop-3, prop-18, prop-19)
  { id: "offer-6", propertyId: "prop-3", contactId: "contact-7", amount: 450000, status: "Pending", dateAdded: "2024-03-01T13:20:00Z" },
  { id: "offer-30", propertyId: "prop-18", contactId: "contact-22", amount: 495000, status: "Rejected", dateAdded: "2024-02-10T10:00:00Z" },
  { id: "offer-31", propertyId: "prop-18", contactId: "contact-24", amount: 510000, status: "Pending", dateAdded: "2024-02-25T11:00:00Z" },
  { id: "offer-32", propertyId: "prop-19", contactId: "contact-26", amount: 430000, status: "Rejected", dateAdded: "2023-07-15T10:00:00Z" },
  { id: "offer-33", propertyId: "prop-19", contactId: "contact-2", amount: 442000, status: "Accepted", dateAdded: "2023-08-20T14:00:00Z" },
  // Bath property offers (prop-4)
  { id: "offer-7", propertyId: "prop-4", contactId: "contact-9", amount: 660000, status: "Rejected", dateAdded: "2023-08-15T10:00:00Z" },
  { id: "offer-8", propertyId: "prop-4", contactId: "contact-10", amount: 690000, status: "Accepted", dateAdded: "2023-09-20T14:00:00Z" },
  { id: "offer-9", propertyId: "prop-4", contactId: "contact-9", amount: 685000, status: "Rejected", dateAdded: "2023-09-10T11:30:00Z" },
  // Leeds property offers (prop-6, prop-20, prop-21)
  { id: "offer-10", propertyId: "prop-5", contactId: "contact-12", amount: 310000, status: "Pending", dateAdded: "2024-02-28T09:00:00Z" },
  { id: "offer-11", propertyId: "prop-6", contactId: "contact-14", amount: 200000, status: "Rejected", dateAdded: "2024-01-05T10:00:00Z" },
  { id: "offer-12", propertyId: "prop-6", contactId: "contact-14", amount: 210000, status: "Pending", dateAdded: "2024-02-10T15:00:00Z" },
  { id: "offer-34", propertyId: "prop-20", contactId: "contact-3", amount: 270000, status: "Rejected", dateAdded: "2024-01-10T10:00:00Z" },
  { id: "offer-35", propertyId: "prop-20", contactId: "contact-5", amount: 280000, status: "Pending", dateAdded: "2024-02-05T14:00:00Z" },
  { id: "offer-36", propertyId: "prop-21", contactId: "contact-7", amount: 185000, status: "Rejected", dateAdded: "2023-12-01T10:00:00Z" },
  { id: "offer-37", propertyId: "prop-21", contactId: "contact-9", amount: 192000, status: "Accepted", dateAdded: "2024-01-15T11:30:00Z" },
  // Brighton property offers (prop-7, prop-22)
  { id: "offer-13", propertyId: "prop-7", contactId: "contact-16", amount: 530000, status: "Rejected", dateAdded: "2023-12-01T10:00:00Z" },
  { id: "offer-14", propertyId: "prop-7", contactId: "contact-16", amount: 545000, status: "Accepted", dateAdded: "2024-01-15T14:00:00Z" },
  { id: "offer-38", propertyId: "prop-22", contactId: "contact-10", amount: 595000, status: "Rejected", dateAdded: "2024-02-15T10:00:00Z" },
  { id: "offer-39", propertyId: "prop-22", contactId: "contact-12", amount: 615000, status: "Pending", dateAdded: "2024-03-01T14:30:00Z" },
  // Cambridge property offers (prop-8, prop-23)
  { id: "offer-15", propertyId: "prop-8", contactId: "contact-18", amount: 850000, status: "Pending", dateAdded: "2024-03-10T11:00:00Z" },
  { id: "offer-40", propertyId: "prop-23", contactId: "contact-14", amount: 720000, status: "Rejected", dateAdded: "2024-01-20T10:00:00Z" },
  { id: "offer-41", propertyId: "prop-23", contactId: "contact-16", amount: 740000, status: "Pending", dateAdded: "2024-02-10T15:00:00Z" },
  // Oxford property offers (prop-9, prop-24)
  { id: "offer-16", propertyId: "prop-9", contactId: "contact-20", amount: 700000, status: "Rejected", dateAdded: "2023-07-01T10:00:00Z" },
  { id: "offer-17", propertyId: "prop-9", contactId: "contact-20", amount: 720000, status: "Accepted", dateAdded: "2023-08-01T14:00:00Z" },
  { id: "offer-42", propertyId: "prop-24", contactId: "contact-18", amount: 650000, status: "Rejected", dateAdded: "2024-02-25T10:00:00Z" },
  { id: "offer-43", propertyId: "prop-24", contactId: "contact-22", amount: 670000, status: "Pending", dateAdded: "2024-03-10T11:30:00Z" },
  // Liverpool property offers (prop-10, prop-25)
  { id: "offer-18", propertyId: "prop-10", contactId: "contact-22", amount: 185000, status: "Pending", dateAdded: "2024-02-25T09:30:00Z" },
  { id: "offer-44", propertyId: "prop-25", contactId: "contact-24", amount: 230000, status: "Rejected", dateAdded: "2024-03-01T10:00:00Z" },
  { id: "offer-45", propertyId: "prop-25", contactId: "contact-26", amount: 240000, status: "Pending", dateAdded: "2024-03-15T14:00:00Z" },
  // York property offers (prop-11, prop-26)
  { id: "offer-19", propertyId: "prop-11", contactId: "contact-24", amount: 415000, status: "Pending", dateAdded: "2024-03-05T10:00:00Z" },
  { id: "offer-46", propertyId: "prop-26", contactId: "contact-3", amount: 375000, status: "Rejected", dateAdded: "2024-01-15T10:00:00Z" },
  { id: "offer-47", propertyId: "prop-26", contactId: "contact-5", amount: 388000, status: "Pending", dateAdded: "2024-02-01T15:00:00Z" },
  // Whitby property offers (prop-12)
  { id: "offer-20", propertyId: "prop-12", contactId: "contact-26", amount: 270000, status: "Accepted", dateAdded: "2024-01-20T16:00:00Z" },
];
