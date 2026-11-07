// Single source of truth for products and prices.
// Used by the website (app/page.tsx) AND by the payment API routes,
// so the amount charged is always calculated on the server.

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  tag: string | null;
  desc: string;
  sizes: string[];
  colors: string[];
  image: string | null;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "ADONAI MY ANCHOR TEE", category: "TOPS", price: 999, tag: "NEW DROP", desc: "Oversized cut. Hebrews 6:19 with anchor, katana and cherry blossom artwork.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#1a1a1a"], image: "/images/adonai-my-anchor-tee.jpg" },
  { id: 2, name: "YAHWEH TEE", category: "TOPS", price: 999, tag: "NEW DROP", desc: "Oversized cut. Bold YAHWEH lettering with doves and florals across the back.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#1a1a1a"], image: "/images/yahweh-tee.jpg" },
  { id: 3, name: "CHRIST LIVES IN ME TEE", category: "TOPS", price: 999, tag: "NEW DROP", desc: "Oversized cut. Galatians 2:20 with an anatomical heart graphic on the back.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#f5f0e8"], image: "/images/christ-lives-in-me-tee.jpg" },
  { id: 4, name: "FAITH HOPE & LOVE TEE", category: "TOPS", price: 999, tag: "NEW DROP", desc: "Oversized cut. 1 Corinthians 13:13 typography on the back.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#ffffff"], image: "/images/faith-hope-love-tee.jpg" },
  { id: 5, name: "FAITH & GRACE TEE", category: "TOPS", price: 999, tag: "NEW DROP", desc: "Oversized cut. Romans 5:1-2 with a striped sofa illustration on the back.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#f5f0e8"], image: "/images/faith-and-grace-tee.jpg" },
];

// Shipping: free at or above this order value, otherwise SHIPPING_FEE (in rupees).
export const FREE_SHIPPING_ABOVE = 1999;
export const SHIPPING_FEE = 0; // set e.g. 79 to charge a flat fee under the free-shipping limit

export interface OrderLine {
  id: number;
  qty: number;
  size: string;
}

export function calcTotals(lines: OrderLine[]) {
  const subtotal = lines.reduce((sum, l) => {
    const p = PRODUCTS.find((x) => x.id === l.id);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);
  const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}
