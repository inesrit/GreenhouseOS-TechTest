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
Asked AI to update the code to use the pre-existing metadata from properties get endpoint and to put both requests in detail page together to run in parallel. 

Asked AI for any performance issues I might've missed, accepted the suggestion relating to hardcoded url.

Asked AI to move all hard coded text to a separate constants file. Fixed the file structuring.

Asked AI to use the created types index to replace in code base where appropriate. (minimal knowledge of typescript so cross referenced with docs and online examples)

Phase 2:
 Asked AI to create a in high demand badge, let it choose the color and icon, modified the value to use a new created constant text and added new boolean that gets conditionally set based on if the property is available as well.

Asked to make up some dates on the offers mock data, so I could create sorting logic

Added dynamic listed for {days} label on homepage for each property

Asked for currency format logic, added it to a util file

Asked to add jsdocs, fixed where appropriate

Alongside filtering by status also added option to sort, by newest, oldest, low or high price, and address alphabetically. For a future improvement would use URL query parameters such as ?status=sold&sort=newest

Asked to create an offer form component in property details page that allows input of a value and submission. Modified it to add constraints, guidance on being above or below asking point. Created a post endpoint that mocks the offer and returns to add to page in real time only persisting in state.

Added logic to prevent offers on sold properties

Added caching headers for get endpoints for properties, decided not for offers as they have the potential to change frequently.

Added sanitization and security measures to api endpoints and form. String sanitization for sql injections, id sanitizion, property existence and availability check and number sanitization and sense limits and json parsing protection.

For mobile responsiveness, added hamburger menu for nav, viewport meta tag and horizontal scroll on offers in property detail.

Refactored code moving logic into sub components where necessary, cleaning up "noise" comments and keeping logic consistent.

Used AI to write junit tests for all the app features.

