"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  tag: string | null;
  desc: string;
  sizes: string[];
  colors: string[];
  image: null;
}

interface CartItem extends Product {
  qty: number;
  selectedSize: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1, name: "WORD IS BOND TEE", category: "TOPS", price: 800, tag: "NEW DROP", desc: "Heavyweight 340gsm cotton. Oversized cut. Screen-printed verse on chest.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#f5f0e8","#1a1a1a","#0d6e5a"], image: null },
  { id: 2, name: "COVENANT CARGO", category: "BOTTOMS", price: 148, tag: "BESTSELLER", desc: "Waxed cotton utility cargo. Embroidered cross detail at thigh pocket.", sizes: ["S","M","L","XL"], colors: ["#2c2418","#1a1a1a"], image: null },
  { id: 3, name: "GRACE PERIOD HOODIE", category: "TOPS", price: 128, tag: "LIMITED", desc: "500gsm French terry. Dropped shoulders. Faith script across the back.", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#f5f0e8","#0d6e5a","#1a1a1a"], image: null },
  { id: 4, name: "EXODUS WINDBREAKER", category: "OUTERWEAR", price: 218, tag: "COLLAB", desc: "Technical ripstop shell. Quilted lining. Zipper pull engraved with cross.", sizes: ["S","M","L","XL"], colors: ["#0d1f1a","#1a1a1a","#f5f0e8"], image: null },
  { id: 5, name: "NARROW ACCESSORIES", category: "ACCESSORIES", price: 48, tag: null, desc: "6-panel structured cap. Embroidered arch logo. Adjustable strap.", sizes: ["ONE SIZE"], colors: ["#1a1a1a","#f5f0e8","#0d6e5a"], image: null },
  { id: 6, name: "PILGRIM SHORTS", category: "BOTTOMS", price: 880, tag: "NEW DROP", desc: "Heavy twill. Relaxed fit. Hidden pocket with lamb's wool lining.", sizes: ["S","M","L","XL","XXL"], colors: ["#2c2418","#f5f0e8"], image: null },
];

const CATEGORIES = ["ALL", "TOPS", "BOTTOMS", "OUTERWEAR", "ACCESSORIES"];
const TEAL = "#0d9e75";

// ─── ProductCard ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  onOpen: (p: Product) => void;
  onWishlist: (p: Product) => void;
  wishlisted: boolean;
  onAddCart: (p: Product & { selectedSize: string }) => void;
}

const ProductCard = ({ product, onOpen, onWishlist, wishlisted, onAddCart }: ProductCardProps) => (
  <div className="group cursor-pointer flex flex-col" style={{ borderTop: "2px solid #1a1a1a" }}>
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: product.id % 2 === 0 ? "#1a1a1a" : "#f5f0e8", aspectRatio: "3/4", minHeight: 260 }}
      onClick={() => onOpen(product)}
    >
      <div className="flex flex-col items-center justify-center gap-3 opacity-30">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="4" width="48" height="56" rx="2" stroke={product.id % 2 === 0 ? "#f5f0e8" : "#1a1a1a"} strokeWidth="2" />
          <path d="M8 20 L20 12 L32 22 L44 10 L56 20" stroke={product.id % 2 === 0 ? "#f5f0e8" : "#1a1a1a"} strokeWidth="2" />
          <circle cx="20" cy="30" r="6" stroke={product.id % 2 === 0 ? "#f5f0e8" : "#1a1a1a"} strokeWidth="2" />
        </svg>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 3, color: product.id % 2 === 0 ? "#f5f0e8" : "#1a1a1a" }}>
          {product.category}
        </span>
      </div>

      {product.tag && (
        <span className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1"
          style={{ background: TEAL, fontFamily: "'Anton', sans-serif", letterSpacing: 2, fontSize: 10 }}>
          {product.tag}
        </span>
      )}

      <button
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all"
        style={{ background: wishlisted ? TEAL : "rgba(255,255,255,0.85)", border: "none" }}
        onClick={(e) => { e.stopPropagation(); onWishlist(product); }}
        aria-label="Wishlist"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "white" : "none"} stroke={wishlisted ? "white" : "#1a1a1a"} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ background: TEAL }}>
        <button
          className="w-full text-white py-3 text-sm font-bold tracking-widest"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: 3 }}
          onClick={(e) => { e.stopPropagation(); onAddCart({ ...product, selectedSize: product.sizes[0] }); }}
        >
          QUICK ADD
        </button>
      </div>
    </div>

    <div className="pt-3 pb-4 flex flex-col gap-1" onClick={() => onOpen(product)}>
      <div className="flex justify-between items-start">
        <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, letterSpacing: 1.5, lineHeight: 1.2, color: "#1a1a1a" }}>{product.name}</h3>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, color: TEAL }}>${product.price}</span>
      </div>
      <p style={{ fontSize: 12, color: "#888", letterSpacing: 1 }}>{product.category}</p>
      <div className="flex gap-1 mt-1">
        {product.colors.map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: "1px solid #ccc" }} />
        ))}
      </div>
    </div>
  </div>
);

// ─── CartDrawer ───────────────────────────────────────────────────────────────

interface CartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: number, size: string) => void;
  onQty: (id: number, size: string, delta: number) => void;
}

const CartDrawer = ({ cart, onClose, onRemove, onQty }: CartDrawerProps) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div className="h-full flex flex-col" style={{ width: "min(420px, 100vw)", background: "#fff", borderLeft: `4px solid ${TEAL}` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "2px solid #1a1a1a" }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: 3 }}>YOUR CART</span>
          <button onClick={onClose} style={{ fontFamily: "'Anton', sans-serif", fontSize: 12, letterSpacing: 2, color: TEAL, background: "none", border: "none", cursor: "pointer" }}>CLOSE ✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, color: "#eee" }}>∅</div>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: 3, color: "#aaa" }}>CART IS EMPTY</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {cart.map((item) => (
              <div key={`${item.id}_${item.selectedSize}`} className="flex gap-4" style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
                <div style={{ width: 72, height: 90, background: item.id % 2 === 0 ? "#1a1a1a" : "#f5f0e8", flexShrink: 0 }} />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: 1 }}>{item.name}</span>
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, color: TEAL }}>${item.price * item.qty}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#999", letterSpacing: 1 }}>SIZE: {item.selectedSize}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => onQty(item.id, item.selectedSize, -1)} style={{ width: 24, height: 24, border: "1px solid #ddd", background: "none", fontWeight: 700, cursor: "pointer" }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onQty(item.id, item.selectedSize, 1)} style={{ width: 24, height: 24, border: "1px solid #ddd", background: "none", fontWeight: 700, cursor: "pointer" }}>+</button>
                    <button onClick={() => onRemove(item.id, item.selectedSize)} style={{ marginLeft: "auto", fontSize: 10, color: "#aaa", letterSpacing: 1, fontFamily: "'Anton', sans-serif", background: "none", border: "none", cursor: "pointer" }}>REMOVE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-5" style={{ borderTop: "2px solid #1a1a1a" }}>
          <div className="flex justify-between mb-4">
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: 2 }}>SUBTOTAL</span>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: TEAL }}>${total}</span>
          </div>
          <button className="w-full py-4 text-white font-bold tracking-widest"
            style={{ background: "#1a1a1a", fontFamily: "'Anton', sans-serif", letterSpacing: 4, fontSize: 14, border: `2px solid ${TEAL}`, cursor: "pointer" }}>
            CHECKOUT — ${total}
          </button>
          <p style={{ fontSize: 10, color: "#aaa", textAlign: "center", marginTop: 8, letterSpacing: 1 }}>SHIPPING + TAX CALCULATED AT CHECKOUT</p>
        </div>
      </div>
    </div>
  );
};

// ─── WishlistDrawer ───────────────────────────────────────────────────────────

interface WishlistDrawerProps {
  wishlist: Product[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onAddCart: (p: Product & { selectedSize: string }) => void;
}

const WishlistDrawer = ({ wishlist, onClose, onRemove, onAddCart }: WishlistDrawerProps) => (
  <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
    <div className="h-full flex flex-col" style={{ width: "min(420px, 100vw)", background: "#fff", borderLeft: `4px solid ${TEAL}` }} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "2px solid #1a1a1a" }}>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: 3 }}>WISHLIST</span>
        <button onClick={onClose} style={{ fontFamily: "'Anton', sans-serif", fontSize: 12, letterSpacing: 2, color: TEAL, background: "none", border: "none", cursor: "pointer" }}>CLOSE ✕</button>
      </div>
      {wishlist.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, color: "#eee" }}>♡</div>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: 3, color: "#aaa" }}>NOTHING SAVED YET</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="flex gap-4" style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              <div style={{ width: 72, height: 90, background: item.id % 2 === 0 ? "#1a1a1a" : "#f5f0e8", flexShrink: 0 }} />
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: 1 }}>{item.name}</span>
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, color: TEAL }}>${item.price}</span>
                </div>
                <span style={{ fontSize: 11, color: "#999", letterSpacing: 1 }}>{item.category}</span>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onAddCart({ ...item, selectedSize: item.sizes[0] })}
                    className="px-3 py-1 text-white text-xs font-bold"
                    style={{ background: TEAL, fontFamily: "'Anton', sans-serif", letterSpacing: 2, fontSize: 10, border: "none", cursor: "pointer" }}>
                    ADD TO CART
                  </button>
                  <button onClick={() => onRemove(item.id)}
                    style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, fontFamily: "'Anton', sans-serif", background: "none", border: "none", cursor: "pointer" }}>
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── ProductModal ─────────────────────────────────────────────────────────────

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddCart: (p: Product & { selectedSize: string }) => void;
  onWishlist: (p: Product) => void;
  wishlisted: boolean;
}

const ProductModal = ({ product, onClose, onAddCart, onWishlist, wishlisted }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<number>(0);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }} onClick={onClose}>
      <div
        className="w-full flex flex-col md:flex-row overflow-hidden"
        style={{ maxWidth: 900, maxHeight: "90vh", background: "#fff", borderTop: `4px solid ${TEAL}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center" style={{ flex: "0 0 45%", background: product.id % 2 === 0 ? "#1a1a1a" : "#f5f0e8", minHeight: 280 }}>
          <div className="opacity-20 flex flex-col items-center gap-2">
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="4" width="48" height="56" rx="2" stroke={product.id % 2 === 0 ? "#fff" : "#1a1a1a"} strokeWidth="2" />
              <path d="M8 20 L20 12 L32 22 L44 10 L56 20" stroke={product.id % 2 === 0 ? "#fff" : "#1a1a1a"} strokeWidth="2" />
            </svg>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 10, letterSpacing: 4, color: product.id % 2 === 0 ? "#fff" : "#1a1a1a" }}>PRODUCT IMAGE</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8 flex flex-col gap-5">
          <button onClick={onClose} style={{ alignSelf: "flex-end", fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2, color: "#aaa", background: "none", border: "none", cursor: "pointer" }}>CLOSE ✕</button>

          <div>
            {product.tag && (
              <span className="text-white px-2 py-1 text-xs mb-2 inline-block"
                style={{ background: TEAL, fontFamily: "'Anton', sans-serif", letterSpacing: 2, fontSize: 10 }}>
                {product.tag}
              </span>
            )}
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: 30, letterSpacing: 2, lineHeight: 1, color: "#1a1a1a" }}>{product.name}</h2>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: TEAL, marginTop: 4 }}>${product.price}</p>
          </div>

          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{product.desc}</p>

          <div>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2, color: "#aaa", marginBottom: 8 }}>COLOR</p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button key={i} onClick={() => setSelectedColor(i)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: selectedColor === i ? `3px solid ${TEAL}` : "2px solid #ddd", cursor: "pointer" }} />
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2, color: "#aaa", marginBottom: 8 }}>SIZE</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)}
                  style={{ padding: "6px 14px", fontFamily: "'Anton', sans-serif", fontSize: 12, letterSpacing: 2, border: selectedSize === s ? `2px solid ${TEAL}` : "1px solid #ddd", color: selectedSize === s ? TEAL : "#1a1a1a", background: "none", cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => { onAddCart({ ...product, selectedSize }); onClose(); }}
              className="flex-1 py-4 text-white font-bold"
              style={{ background: "#1a1a1a", fontFamily: "'Anton', sans-serif", letterSpacing: 4, fontSize: 13, border: "none", cursor: "pointer" }}>
              ADD TO CART
            </button>
            <button onClick={() => onWishlist(product)}
              style={{ width: 52, border: `2px solid ${wishlisted ? TEAL : "#ddd"}`, background: wishlisted ? TEAL : "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "white" : "none"} stroke={wishlisted ? "white" : "#1a1a1a"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <p style={{ fontSize: 11, color: "#aaa", letterSpacing: 1 }}>✦ FREE SHIPPING ON ORDERS OVER $200 &nbsp;&nbsp; ✦ RETURNS WITHIN 30 DAYS</p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<"home" | "shop">("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [mobileMenu, setMobileMenu] = useState(false);

  const addToCart = (product: Product & { selectedSize: string }) => {
    setCart((prev) => {
      const key = `${product.id}_${product.selectedSize}`;
      const existing = prev.find((i) => `${i.id}_${i.selectedSize}` === key);
      if (existing) return prev.map((i) => `${i.id}_${i.selectedSize}` === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number, size: string) => setCart((p) => p.filter((i) => !(i.id === id && i.selectedSize === size)));
  const adjustQty = (id: number, size: string, delta: number) => setCart((p) => p.map((i) => i.id === id && i.selectedSize === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => prev.find((i) => i.id === product.id) ? prev.filter((i) => i.id !== product.id) : [...prev, product]);
  };

  const filtered = activeCategory === "ALL" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital@0;1&family=Space+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; color: #1a1a1a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${TEAL}; }
        .nav-link { font-family: 'Anton', sans-serif; font-size: 12px; letter-spacing: 3px; color: #1a1a1a; text-decoration: none; cursor: pointer; transition: color 0.2s; background: none; border: none; }
        .nav-link:hover { color: ${TEAL}; }
        .ticker-wrap { overflow: hidden; white-space: nowrap; background: ${TEAL}; padding: 8px 0; }
        .ticker { display: inline-block; animation: ticker 20s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .hero-title { font-family: 'Anton', sans-serif; font-size: clamp(60px, 14vw, 160px); letter-spacing: -2px; line-height: 0.9; color: #1a1a1a; }
        .section-title { font-family: 'Anton', sans-serif; font-size: clamp(32px, 6vw, 72px); letter-spacing: 2px; line-height: 1; color: #1a1a1a; }
        .editorial-italic { font-family: 'Playfair Display', serif; font-style: italic; color: ${TEAL}; }
        .mono { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 2px; color: #888; }
      `}</style>

      {/* TICKER */}
      <div className="ticker-wrap">
        <span className="ticker" style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 4, color: "#fff" }}>
          {Array(8).fill("✦ NEW SEASON DROP ✦ FREE SHIPPING $200+ ✦ FAITH OVER FEAR ✦ NARROW SS25 ✦").join("  ")}
        </span>
      </div>

      {/* NAV */}
      <nav style={{ borderBottom: "2px solid #1a1a1a", position: "sticky", top: 0, background: "#fff", zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <div className="flex items-center justify-between" style={{ height: 60 }}>
            <div className="flex items-center gap-8">
              <button onClick={() => { setPage("home"); setMobileMenu(false); }}
                style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: 3, color: "#1a1a1a", background: "none", border: "none", cursor: "pointer" }}>
                NARROW
              </button>
              <div className="hidden md:flex gap-6">
                <button className="nav-link" onClick={() => setPage("home")}>HOME</button>
                <button className="nav-link" onClick={() => setPage("shop")}>SHOP</button>
                <button className="nav-link" style={{ color: TEAL }}>SS25</button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="nav-link hidden md:block" onClick={() => setPage("shop")}>SEARCH</button>

              <button onClick={() => setWishlistOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlist.length > 0 && (
                  <span style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, background: TEAL, borderRadius: "50%", fontSize: 9, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Anton', sans-serif" }}>{wishlist.length}</span>
                )}
              </button>

              <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, background: TEAL, borderRadius: "50%", fontSize: 9, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Anton', sans-serif" }}>{cartCount}</span>
                )}
              </button>

              <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ height: 2, background: "#1a1a1a" }} />
                  <div style={{ height: 2, background: "#1a1a1a" }} />
                  <div style={{ height: 2, background: TEAL }} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {mobileMenu && (
          <div style={{ borderTop: "1px solid #eee", padding: "20px", display: "flex", flexDirection: "column", gap: 16, background: "#fff" }}>
            <button className="nav-link" style={{ textAlign: "left" }} onClick={() => { setPage("home"); setMobileMenu(false); }}>HOME</button>
            <button className="nav-link" style={{ textAlign: "left" }} onClick={() => { setPage("shop"); setMobileMenu(false); }}>SHOP</button>
            <button className="nav-link" style={{ textAlign: "left", color: TEAL }}>SS25 COLLECTION</button>
          </div>
        )}
      </nav>

      {/* HOME PAGE */}
      {page === "home" && (
        <main>
          <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 20px 40px" }}>
            <div className="flex flex-col gap-6">
              <p className="mono">✦ SPRING / SUMMER 2025</p>
              <div>
                <h1 className="hero-title">DRESSED</h1>
                <h1 className="hero-title" style={{ color: TEAL }}>IN GRACE,</h1>
                <h1 className="hero-title">BUILT FOR</h1>
                <h1 className="hero-title">THE STREETS.</h1>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between mt-4">
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(16px, 2.5vw, 22px)", color: "#555", maxWidth: 420, lineHeight: 1.6 }}>
                  Where scripture meets the pavement. Garments for the faithful and the fearless.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setPage("shop")} className="px-8 py-4 text-white font-bold"
                    style={{ background: "#1a1a1a", fontFamily: "'Anton', sans-serif", letterSpacing: 4, fontSize: 13, border: "none", cursor: "pointer" }}>
                    SHOP NOW
                  </button>
                  <button onClick={() => setPage("shop")} className="px-8 py-4 font-bold"
                    style={{ border: "2px solid #1a1a1a", fontFamily: "'Anton', sans-serif", letterSpacing: 4, fontSize: 13, background: "none", cursor: "pointer" }}>
                    SS25 LOOKBOOK
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section style={{ background: "#1a1a1a", margin: "0 0 80px", padding: "0 20px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div className="grid grid-cols-3 gap-0" style={{ borderTop: `4px solid ${TEAL}` }}>
                {(["FAITH", "DROPS", "NOW"] as const).map((word, i) => (
                  <div key={word} className="flex flex-col items-center justify-center"
                    style={{ height: "clamp(140px, 30vw, 320px)", borderRight: i < 2 ? "1px solid #333" : "none" }}>
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(28px, 7vw, 96px)", color: i === 1 ? TEAL : "#fff", letterSpacing: 2 }}>{word}</span>
                    {i === 1 && <span className="mono" style={{ color: "#888", marginTop: 8 }}>SEASON 25</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ maxWidth: 1280, margin: "0 auto 80px", padding: "0 20px" }}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="mono mb-2">✦ FEATURED PIECES</p>
                <h2 className="section-title">THE<br /><span className="editorial-italic">DROP.</span></h2>
              </div>
              <button onClick={() => setPage("shop")} className="nav-link" style={{ borderBottom: `2px solid ${TEAL}`, paddingBottom: 2 }}>VIEW ALL →</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {PRODUCTS.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} onWishlist={toggleWishlist} wishlisted={wishlist.some((w) => w.id === p.id)} onAddCart={addToCart} />
              ))}
            </div>
          </section>

          <section style={{ background: TEAL, padding: "60px 20px", marginBottom: 80 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>✦ OUR ETHOS</p>
                  <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(36px, 6vw, 72px)", color: "#fff", letterSpacing: 2, lineHeight: 1 }}>
                    NOT RELIGIOUS.<br />JUST ROOTED.
                  </h2>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(16px, 2vw, 22px)", color: "rgba(255,255,255,0.85)", maxWidth: 400, lineHeight: 1.7 }}>
                  Every piece tells a story. Every stitch a statement.
                </p>
              </div>
            </div>
          </section>

          <section style={{ maxWidth: 1280, margin: "0 auto 80px", padding: "0 20px" }}>
            <p className="mono mb-8" style={{ textAlign: "center" }}>✦ BROWSE BY CATEGORY</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["TOPS", "BOTTOMS", "OUTERWEAR", "ACCESSORIES"] as const).map((cat, i) => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setPage("shop"); }}
                  className="flex flex-col items-center justify-end"
                  style={{ height: "clamp(140px, 20vw, 220px)", background: i % 2 === 0 ? "#1a1a1a" : "#f5f0e8", border: "none", cursor: "pointer", padding: 20, transition: "transform 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(16px, 3vw, 24px)", color: i % 2 === 0 ? "#fff" : "#1a1a1a", letterSpacing: 3 }}>{cat}</span>
                  <div style={{ width: 24, height: 2, background: TEAL, marginTop: 8 }} />
                </button>
              ))}
            </div>
          </section>

          <footer style={{ background: "#1a1a1a", padding: "48px 20px 24px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                  <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: 3, color: "#fff", marginBottom: 8 }}>NARROW</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "#888", lineHeight: 1.6 }}>Faith-rooted. Street-raised.</p>
                </div>
                {([["SHOP", ["All Products", "New Arrivals", "SS25 Collection", "Sale"]], ["INFO", ["About Us", "Sustainability", "Size Guide", "Contact"]], ["LEGAL", ["Privacy Policy", "Terms", "Returns", "Shipping"]]] as [string, string[]][]).map(([title, links]) => (
                  <div key={title}>
                    <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>{title}</p>
                    {links.map((l) => <p key={l} style={{ fontSize: 12, color: "#888", marginBottom: 6, cursor: "pointer" }}>{l}</p>)}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #333", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <p className="mono" style={{ color: "#555" }}>© 2026 NARROW. ALL RIGHTS RESERVED.</p>
                <p className="mono" style={{ color: TEAL }}>FAITH OVER FEAR ✦</p>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* SHOP PAGE */}
      {page === "shop" && (
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px 80px" }}>
          <div className="mb-10">
            <p className="mono mb-3">✦ SPRING / SUMMER 2025</p>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(40px, 8vw, 96px)", letterSpacing: 2, lineHeight: 0.9 }}>
              SHOP<br /><span style={{ color: TEAL }}>ALL.</span>
            </h1>
          </div>

          <div className="flex gap-2 mb-10 overflow-x-auto pb-2" style={{ borderBottom: "2px solid #1a1a1a" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ fontFamily: "'Anton', sans-serif", fontSize: 12, letterSpacing: 3, padding: "10px 16px", background: activeCategory === cat ? "#1a1a1a" : "none", color: activeCategory === cat ? "#fff" : "#888", border: "none", cursor: "pointer", whiteSpace: "nowrap", borderBottom: activeCategory === cat ? `3px solid ${TEAL}` : "3px solid transparent", transition: "all 0.2s" }}>
                {cat}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontFamily: "'Anton', sans-serif", fontSize: 11, letterSpacing: 2, color: "#aaa", alignSelf: "center", whiteSpace: "nowrap" }}>
              {filtered.length} PIECES
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} onWishlist={toggleWishlist} wishlisted={wishlist.some((w) => w.id === p.id)} onAddCart={addToCart} />
            ))}
          </div>
        </main>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddCart={addToCart} onWishlist={toggleWishlist} wishlisted={wishlist.some((w) => w.id === selectedProduct.id)} />
      )}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onQty={adjustQty} />}
      {wishlistOpen && <WishlistDrawer wishlist={wishlist} onClose={() => setWishlistOpen(false)} onRemove={(id) => setWishlist((p) => p.filter((i) => i.id !== id))} onAddCart={addToCart} />}
    </>
  );
}