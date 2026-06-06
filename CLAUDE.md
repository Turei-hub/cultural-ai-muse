# Cultural AI Muse

Māori AI art brand website for a creator based in Australia. Sells AI-generated digital art celebrating Māori culture — portraits, landscapes, whakataukī quotes, seasonal content.

## Stack

- **React 18 + Vite 8** — frontend framework
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (NOT PostCSS — config goes in `vite.config.js`)
- **React Router v6** — client-side routing
- **Supabase** — auth, database (products/orders), storage (art files + signed download URLs)
- **Stripe** — payments via Checkout Sessions (server-side via Supabase Edge Functions)
- **Lucide React** — icons

## Environment Variables

Copy `.env.example` to `.env.local`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Project Structure

```
src/
  components/
    Navbar.jsx          # Fixed top nav, cart badge, mobile menu
    Footer.jsx          # Links, newsletter signup, TikTok link
    ProductCard.jsx     # Art card with quick-add hover overlay
  context/
    CartContext.jsx     # Cart state (useReducer), useCart hook
  data/
    placeholderProducts.js  # 9 placeholder products + CATEGORIES constant
  lib/
    supabase.js         # Supabase client (reads from env)
    stripe.js           # Stripe.js loader (lazy)
  pages/
    Home.jsx            # Hero mosaic, featured grid, kaupapa banner, social proof
    Shop.jsx            # Full gallery with category filter, search, sort
    ProductDetail.jsx   # Full image, format/size selector (digital/A4/A3), add to cart
    About.jsx           # Creator story, kaupapa statement, TikTok section, values
    Cart.jsx            # Cart items, order summary, Stripe checkout trigger
    Admin.jsx           # Product list (toggle active/featured), add new form, orders tab
  App.jsx               # BrowserRouter + CartProvider + routes
  index.css             # Tailwind @theme tokens + global styles + animations
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/shop` | Gallery / Shop |
| `/product/:id` | Product Detail |
| `/about` | About |
| `/cart` | Cart |
| `/admin` | Admin Dashboard (no auth yet — add Supabase auth gate) |

## Design Tokens

Defined in `src/index.css` `@theme` block:

- **Gold**: `#c9a84c` / light `#e8c97a` / dark `#9a7a2e`
- **Background**: `#0a0a0a` (charcoal), `#141414` (card), `#1e1e1e` (input)
- **Border**: `#2a2a2a`
- **Text**: `#f5f0e8` (primary), `#9a9080` (muted)
- **Fonts**: Cormorant Garamond (serif headings), Inter (body)

Use raw hex values in Tailwind classes (e.g. `bg-[#c9a84c]`) — the `@theme` tokens are available as CSS vars but Tailwind utility class names use the token names.

## Supabase Schema (to apply)

```sql
-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  image_url text,
  tags text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  stripe_session_id text unique,
  total numeric(10,2) not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Order items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int default 1,
  price_at_purchase numeric(10,2) not null,
  format text not null
);

-- Newsletter
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);
```

## Stripe Integration (to complete)

1. Create a Supabase Edge Function `create-checkout-session`
2. It receives cart items, creates a Stripe Checkout Session, returns the URL
3. On success, Stripe webhook → Edge Function `stripe-webhook` → insert order + generate signed download URLs
4. Digital downloads served via `supabase.storage.from('art').createSignedUrl(path, 3600)`

## Admin Auth (to add)

The `/admin` route has no auth gate yet. Protect it with Supabase Auth:
- Add `supabase.auth.signInWithOtp({ email })` login
- Wrap `/admin` route with an auth check component

## Content

Replace placeholder Unsplash images by uploading real art to Supabase Storage and updating `image_url` values in the `products` table. The `Admin > Add New` tab is wired for this (needs the Supabase insert hooked up).

## Dev

```bash
npm run dev    # http://localhost:5173
npm run build  # production build
```
