# J Studio (Juan’s Dessert)

**Live Demo:** https://juans-dessert.com/

A full‑stack e‑commerce portfolio project themed around a handmade dessert brand. It includes a complete shopping experience, CMS for articles and news, shopping cart and checkout flow, and backend APIs for product, inventory, and discount management.

**Note:** Because the TapPay Sandbox environment only allows whitelisted fixed IPs, the deployed version uses a **mocked payment flow**. To experience the full TapPay Sandbox credit card process, please follow the **Local Setup** instructions below.

---

## Tech Stack

- **Frontend:** Vue 3 (Composition API) + Vite + Vue Router + Pinia + Tailwind CSS
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** MySQL (Prisma Schema & Seed)
- **Deployment:** Zeabur (Frontend & Backend), Cloudflare DNS

---

## Site Overview

- **Home:** Hero banner, featured products, latest articles & news, fully responsive design
- **Products:**
  - Category & subcategory pages showing minimum variant price per product
  - Product detail page with variant options, dynamic pricing, and Add to Cart
- **Cart:** Increment/decrement quantities, delete items, display subtotal & shipping
- **Checkout:** Shipping info, discount codes, payment (mocked online), order confirmation
- **Articles:** List and detail pages with cover image, categories, subcategories, TOC, and lazy loading
- **News:** Sorted by date (latest first)

---

## Key Features

- **Multi‑variant products:** Minimum price calculation via `productvariant`
- **Cart persistence:** Pinia state management + LocalStorage
- **SEO‑friendly content system:** Category & slug‑based routing
- **Discount and Add‑on models:** Flexible backend schemas with validation
- **Error handling:** Clear API messages, loading and retry states on frontend

---

## Payment Integration (Important)

TapPay Sandbox requires fixed IPs for Pay API access. The cloud environment uses **dynamic outbound IPs**, so online payment is **simulated only**.

To test the **real payment flow** (Prime → Pay by Prime → order creation), run the backend locally and use the provided test card below.

---

## Demo Video

- **YouTube:** `https://youtu.be/nmqCNKN29jQ`

---

## Local Setup

### 1) Requirements

- Node.js ≥ 20
- npm ≥ 9
- MySQL running locally or via cloud service

### 2) Clone the repository

```bash
git clone <repo-url>
cd j_studio
```

### 3) Create environment files

**Frontend** (`j-frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_TAPPAY_APP_ID=164515
VITE_TAPPAY_APP_KEY=app_xMENquzDbwYyniL02tCaswjO6xhDjnvcSMcMjbO2iJTbtUaIGUZ859Vrr5x0
VITE_TAPPAY_ENV=sandbox
```

**Backend** (`j-api/.env`)

```env
DATABASE_URL="mysql://root:password@j-mysql:3306/j_studio"
TAPPAY_PARTNER_KEY=partner_yrslawOp2wmSj1X2yGCOQ09fd0mnvNeiSqfI95uKUa8bOu4AD8zTymtx
TAPPAY_MERCHANT_ID=JStudio_FUBON_POS_3
TAPPAY_ENV=sandbox
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 4) Run the backend

```bash
cd j-api
npm install
npx prisma migrate reset
node prisma/seed.js
npm run dev          # runs at http://localhost:3000
```

### 5) Run the frontend

```bash
cd ../j-frontend
npm install
npm run dev          # runs at http://localhost:5173
```

---

## TapPay Sandbox Test Card

| Field       | Example                                                   |
| ----------- | --------------------------------------------------------- |
| Card Number | 4242 4242 4242 4242                                       |
| Expiration  | any future month/year after the current date (e.g. 01/30) |
| CCV         | 123                                                       |

1. Input the above card details at checkout.
2. The frontend obtains a **Prime token**, sends it to backend `/api/tappay/pay-by-prime`, which calls TapPay Sandbox and returns a simulated payment result.
3. Check backend logs and database for the order record.

> If you see an authorization error, verify `.env` keys and confirm your local IP is added to the TapPay Sandbox whitelist.

---

## API Endpoints (Summary)

- `GET /api/products/hot` — popular products
- `GET /api/categories` — category list
- `GET /api/products?category=...` — products by category
- `POST /api/orders` — create order
- `POST /api/tappay/pay-by-prime` — payment (sandbox)
- `GET /api/articles` / `GET /api/articles/:slug` — articles list & detail
- `GET /api/news` / `GET /api/news/:id` — news list & detail

---

## Data Models

- **ArticleCategory / ArticleSubCategory / Article** — structured content hierarchy for blog articles with unique slugs, category/subcategory relations, and publication timestamps.
- **Banners** — homepage banners with image, title, button text/link, and configurable font color.
- **Cart / CartItem** — temporary guest cart linked by `guestId`, supports shipping method, discounts, and multiple cart items.
- **Course / CourseIntent** — course registration and inquiry forms with capacity, duration, and user messages.
- **DiscountCode** — discount code management with type (percent/fixed), value, status, and expiry.
- **Order / OrderItem** — complete order system containing buyer info, totals, discounts, payment details, and itemized records.
- **Product / ProductVariant** — product catalog supporting categories, subcategories, variants, visibility, and detailed attributes (ingredients, shelf life, flavor profile).
- **ProductCategory / ProductSubcategory** — hierarchical product organization with descriptions, order indices, and timestamps.
- **News** — news posts with title, image, content, and publication date.
- **Enums:**
  - `order_shippingMethod`: home, pickup
  - `order_status`: PENDING, PAID, FAILED, CANCELLED
  - `order_paymentMethod`: ECPAY_CREDIT, TAPPAY_CREDIT, CASH
  - `banners_fontColor`: light, dark

---

## Deployment Notes

- **Zeabur:** Frontend and backend are deployed separately. Configure environment variables and health routes.
- **Cloudflare:** DNS points to frontend; backend uses a subdomain or Zeabur-provided domain.
- **TapPay Whitelist:** Sandbox and Production have independent IP whitelists. For environments without fixed IP, use **mock mode** or consider a proxy with fixed outbound IP.

---

## Troubleshooting

- **Payment API blocked:** Verify TapPay keys and IP whitelist.
- **Prisma migration errors:** Run `prisma migrate deploy` then `prisma db seed`; clear duplicate unique data if needed.

---

## License

This project is for personal learning and portfolio purposes only. Commercial use requires prior permission from the author.
