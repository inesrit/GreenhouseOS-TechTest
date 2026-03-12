# GreenHouse Property Portal

A modern property management portal built with Next.js 14, React, and TypeScript. This application provides a user-friendly interface for browsing properties, viewing detailed information, and managing offers.

## Project Overview

The GreenHouse Property Portal is a full-stack application designed to streamline property discovery and offer management. The frontend is built with Next.js 14 and styled with Tailwind CSS, while the backend API routes handle all data operations.

### Key Features

- **Property Listings** — Browse all available properties with filtering and sorting
- **Property Details** — View comprehensive information about individual properties
- **Offer Management** — Submit and track offers on properties with real-time validation
- **Smart Filtering** — Filter by status (Available, Sale Agreed, Sold) and sort by price, date, or address
- **High Demand Badge** — Visual indicator for properties with 5+ offers
- **Responsive Design** — Works seamlessly on desktop and mobile devices with hamburger navigation

### Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Runtime:** Node.js 18+

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Homepage with property listings
│   ├── layout.tsx                      # Root layout wrapper
│   ├── globals.css                     # Global styles
│   ├── components/
│   │   ├── MobileNav.tsx               # Responsive hamburger navigation
│   │   ├── OfferForm.tsx               # Offer submission form with validation
│   │   ├── PropertyCard.tsx            # Property card for listings
│   │   ├── PropertyFilters.tsx         # Filter/sort controls container
│   │   ├── SortSelect.tsx              # Sort dropdown component
│   │   └── StatusFilter.tsx            # Status filter dropdown
│   ├── property/
│   │   └── [id]/page.tsx               # Individual property detail page
│   └── api/
│       ├── properties/
│       │   ├── route.ts                # GET /api/properties
│       │   └── [id]/route.ts           # GET /api/properties/:id
│       ├── offers/route.ts             # GET/POST /api/offers
│       └── contacts/route.ts           # GET /api/contacts
├── constants/
│   └── index.ts                        # UI text, status values, colors
├── types/
│   └── index.ts                        # TypeScript interfaces and types
├── utils/
│   └── index.ts                        # Utility functions (formatters, validators, sanitizers)
└── data/
    └── mock.ts                         # Mock data for properties, contacts, offers
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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint code quality checks |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List all properties with metadata |
| GET | `/api/properties/:id` | Get single property details |
| GET | `/api/offers` | List all offers (filterable by propertyId) |
| POST | `/api/offers` | Submit a new offer |
| GET | `/api/contacts` | List all contacts |

## Architecture Decisions

### Centralised Constants & Types
- All UI text in `constants/index.ts` for easy i18n support
- TypeScript interfaces in `types/index.ts` for type safety
- Utility functions in `utils/index.ts` for reusability

### Security Measures
- Input sanitisation for IDs (alphanumeric only, max 50 chars)
- Amount validation with sensible limits (£1,000 - £100,000,000)
- JSON parsing protection against malformed requests
- Property availability checks before accepting offers

### Performance
- Caching headers on property endpoints
- Parallel API requests on detail pages
- Optimised re-renders with React hooks

## Notes

This is a prototype implementation. The data is currently mocked in `src/data/mock.ts` and served through API routes. The application is fully functional but may benefit from further optimisation and refinement for production use.


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

Phase 3:

Used AI to write junit tests for all the app features. Added a couple of missing edge cases and removed unnecessary duplicates. 

With the help of AI created an algorithm for offer suggestion for buyers to have an idea of what amount to offer for a property, this is based on the current existing offers, and other properties availble that are nearby asking price. This could be further improved with the help of AI model integrated trained on existing historical data or market trends.

This could use some more consitency keeping.git g

Some choice were maded during the last phase that fit into what this one is asking for.
Ideally with more time and effort put into this, afull integrated and more visually please system could be built. I chose to focus on the properties and their presentation and did not add to the dashboard or settings, did not create a distinction in the system between buyer, seller, and admin and what functionality would be available to each.
Ideas that popped up are a main landing page that allows buyers to take control over and narrow down what properties they would like to see.
A medium of communication between buyers, sellers, and admins, contact forms, live chat.
The management side has a lot of potential, AI could be used to dictate/suggest the asking price for a property based on related data available such as location, ammenities, surrounding properties value.
A workflow could be automated for the buying and selling side that makes the process easier and more straightforward, with each step crafted per admin requests and the system providing or automating information request and integrating it from buyers.

