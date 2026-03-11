# GreenHouse Property Portal

A modern property management portal built with Next.js 14, React, and TypeScript. This application provides a user-friendly interface for browsing properties, viewing detailed information, and managing offers.

## Project Overview

The GreenHouse Property Portal is a full-stack application designed to streamline property discovery and offer management. The frontend is built with Next.js 14 and styled with Tailwind CSS, while the backend API routes handle all data operations.

### Key Features

- **Property Listings** — Browse all available properties with key details (price, location, status)
- **Property Details** — View comprehensive information about individual properties
- **Offer Management** — Track and manage offers on properties
- **Contact Management** — Store and manage contact information for buyers and sellers
- **Responsive Design** — Works seamlessly on desktop and mobile devices

### Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Runtime:** Node.js 18+

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage with property listings
│   ├── layout.tsx                  # Root layout wrapper
│   ├── globals.css                 # Global styles
│   ├── components/
│   │   └── PropertyCard.tsx         # Reusable property card component
│   ├── property/
│   │   └── [id]/page.tsx            # Individual property detail page
│   └── api/
│       ├── properties/route.ts      # GET /api/properties
│       ├── offers/route.ts          # GET /api/offers
│       ├── contacts/route.ts        # GET /api/contacts
│       └── [id]/route.ts            # Individual property endpoints
└── data/
    └── mock.ts                      # Mock data and TypeScript interfaces
```

## Setup

Install all dependencies:

```bash
npm install
```

## Running

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Commands

- `npm run dev` — Start development server with hot reload
- `npm run build` — Build for production
- `npm run start` — Run production server
- `npm run lint` — Run ESLint code quality checks

## Notes

This is a prototype implementation. The data is currently mocked in `src/data/mock.ts` and served through API routes. The application is fully functional but may benefit from further optimization and refinement for production use.


## AI Tools Usage

I used the integrated GitHub Copilot Chat throughout this.

Phase 1:
Asked AI to update the code to use the pre-existing metadata from properties call and to put both requests in detail page together to run in parallel. 

Asked AI for any performance issues I might've missed, accepted the suggestion relating to hardcoded url.

Asked AI to move all hard coded text to a separate constants file. Fixed the file structuring.

Asked AI to use the created types index to replace in code base where appropriate. 


