import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft,
  ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, UserRound, X
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { BrowserRouter, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./styles.css";

const products = [
  { id:"celeste", name:"Celeste Diamond Ring", category:"Rings", price:52999, oldPrice:64999, image:"/assets/product-ring.jpg", badge:"Bestseller", material:"Rose Gold", sizes:[6,7,8,9,10], desc:"A refined diamond ring crafted for timeless elegance. Brilliant-cut stones meet a delicate handcrafted band.", notes:"18K rose gold · Lab-grown diamond · Hand finished" },
  { id:"pearl", name:"Pearl Drop Earrings", category:"Earrings", price:12499, image:"/assets/product-earrings.jpg", badge:"New", material:"Yellow Gold", sizes:[], desc:"A graceful pair designed around luminous pearl drops and a slender gold setting.", notes:"18K yellow gold · Freshwater pearl · Pair" },
  { id:"emerald", name:"Emerald Pendant", category:"Pendants", price:32999, image:"/assets/product-necklace.jpg", badge:"Signature", material:"White Gold", sizes:[], desc:"A deep green centre stone framed by a precise white-gold setting.", notes:"18K white gold · Emerald · Adjustable chain" },
  { id:"solitaire", name:"Solitaire Band", category:"Rings", price:28999, image:"/assets/ring.jpg", badge:"Icon", material:"Yellow Gold", sizes:[6,7,8,9,10], desc:"A quiet, sculptural band designed to sit beautifully alone or beside your favourite piece.", notes:"18K yellow gold · Hand polished" },
  { id:"aurora", name:"Aurora Tennis Bracelet", category:"Bracelets", price:44999, image:"/assets/product-bracelet.jpg", badge:"Limited", material:"Rose Gold", sizes:[], desc:"A fluid line of brilliant stones with a balanced, contemporary silhouette.", notes:"18K rose gold · Lab-grown diamonds" },
  { id:"nocturne", name:"Nocturne Chain", category:"Necklaces", price:21999, image:"/assets/product-necklace.jpg", badge:"New", material:"White Gold", sizes:[], desc:"A fine chain with a subtle architectural rhythm, made for layering.", notes:"18K white gold · Adjustable length" },
  { id:"mangalsutra", name:"Lumière Mangalsutra", category:"Mangalsutra", price:39999, image:"/assets/collections.jpg", badge:"Heritage", material:"Yellow Gold", sizes:[], desc:"A contemporary interpretation of a deeply meaningful form.", notes:"18K yellow gold · Onyx · Hand finished" },
  { id:"halo", name:"Halo Studs", category:"Earrings", price:16999, image:"/assets/product-earrings.jpg", badge:"Everyday", material:"White Gold", sizes:[], desc:"Compact halo studs designed to catch light without overpowering the wearer.", notes:"18K white gold · Lab-grown diamonds" }
];

const formatINR = n => `₹${n.toLocaleString("en-IN")}`;

const StoreContext = createContext(null);
function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("lumiere-cart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("lumiere-wishlist") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem("lumiere-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("lumiere-wishlist", JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (product, size = product.sizes?.[0] || null) => {
    setCart(prev => {
      const key = `${product.id}-${size || "default"}`;
      const found = prev.find(x => x.key === key);
      if (found) return prev.map(x => x.key === key ? {...x, qty:x.qty+1} : x);
      return [...prev, { key, id:product.id, size, qty:1 }];
    });
    setCartOpen(true);
  };
  const updateQty = (key, delta) => setCart(prev => prev.map(x => x.key === key ? {...x, qty:Math.max(1,x.qty+delta)} : x));
  const removeItem = key => setCart(prev => prev.filter(x => x.key !== key));
  const toggleWishlist = id => setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);

  const cartLines = cart.map(line => ({...line, product:products.find(p=>p.id===line.id)})).filter(x=>x.product);
  const subtotal = cartLines.reduce((s,x)=>s+x.product.price*x.qty,0);
  const count = cart.reduce((s,x)=>s+x.qty,0);

  return <StoreContext.Provider value={{cart,cartLines,subtotal,count,wishlist,cartOpen,setCartOpen,addToCart,updateQty,removeItem,toggleWishlist}}>
    {children}
  </StoreContext.Provider>
}
const useStore = () => useContext(StoreContext);

function Transition({ children }) {
  return <AnimatePresence mode="wait"><motion.div key={useLocation().pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.35,ease:[.22,1,.36,1]}}>{children}</motion.div></AnimatePresence>
}

function Logo({ light=false }) {
  return <Link to="/" className={`logo ${light ? "logo-light":""}`}>
    <span className="logo-mark">✦</span><span>LUMIÈRE</span>
  </Link>
}

function Header() {
  const {count} = useStore();
  const [menu,setMenu] = useState(false);
  const [search,setSearch] = useState(false);
  return <>
    <header className="site-header">
      <button className="icon-button mobile-only" onClick={()=>setMenu(true)} aria-label="Menu"><Menu size={20}/></button>
      <Logo/>
      <nav className="desktop-nav">
        <Link to="/collections">Collections</Link>
        <Link to="/shop">Jewellery</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={()=>setSearch(true)}><Search size={18}/></button>
        <Link className="icon-button desktop-only" to="/account"><UserRound size={18}/></Link>
        <Link className="bag-button" to="/cart"><ShoppingBag size={18}/><span>{count}</span></Link>
      </div>
    </header>
    <AnimatePresence>
      {menu && <motion.div className="menu-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <motion.div className="menu-panel" initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}} transition={{duration:.5,ease:[.22,1,.36,1]}}>
          <div className="menu-top"><Logo light/><button onClick={()=>setMenu(false)} className="icon-button light"><X/></button></div>
          <div className="menu-links">
            <Link onClick={()=>setMenu(false)} to="/">Home <ArrowUpRight/></Link>
            <Link onClick={()=>setMenu(false)} to="/collections">Collections <ArrowUpRight/></Link>
            <Link onClick={()=>setMenu(false)} to="/shop">Jewellery <ArrowUpRight/></Link>
            <Link onClick={()=>setMenu(false)} to="/about">About <ArrowUpRight/></Link>
            <Link onClick={()=>setMenu(false)} to="/contact">Contact <ArrowUpRight/></Link>
          </div>
          <div className="menu-image"><img src="/assets/collections.jpg"/><span>A story in every piece.</span></div>
        </motion.div>
      </motion.div>}
      {search && <motion.div className="search-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div className="search-box"><Logo/><button className="icon-button" onClick={()=>setSearch(false)}><X/></button></div>
        <div className="search-inner"><Search size={28}/><input autoFocus placeholder="Search rings, earrings, pendants..." onKeyDown={e=>e.key==="Escape"&&setSearch(false)}/></div>
      </motion.div>}
    </AnimatePresence>
  </>
}

function PageIntro({eyebrow,title,copy}) {
  return <section className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{copy&&<p>{copy}</p>}</section>
}

function Home() {
  const {scrollYProgress} = useScroll();
  const heroY = useTransform(scrollYProgress,[0,.28],[0,-80]);
  const heroScale = useTransform(scrollYProgress,[0,.25],[1,1.06]);
  return <div>
    <section className="hero">
      <motion.img style={{y:heroY,scale:heroScale}} src="/assets/hero.jpg" className="hero-img"/>
      <div className="hero-shade"/>
      <div className="hero-copy">
        <span className="eyebrow">Fine Jewellery</span>
        <h1>Elegance<br/>Lives in<br/><i>Every Detail.</i></h1>
        <p>Timeless designs. Thoughtfully crafted.<br/>Made to be part of your story.</p>
        <Link className="button button-gold" to="/collections">Explore Collections <ArrowRight size={16}/></Link>
      </div>
      <div className="hero-meta"><span>01</span><span>02</span><span>03</span><span className="line"/><span className="scroll-label"><ArrowDown size={14}/> Scroll</span></div>
    </section>

    <section className="statement section-pad">
      <span className="eyebrow">Jewellery for life's brightest moments</span>
      <h2>Designed to be noticed.<br/><i>Made to be remembered.</i></h2>
      <p>From quiet everyday pieces to the ones reserved for a lifetime, every Lumière design begins with proportion, light and the human story behind it.</p>
    </section>

    <section className="feature-split">
      <div className="feature-image"><img src="/assets/ring.jpg"/></div>
      <div className="feature-copy">
        <span className="eyebrow">The Celeste Collection</span>
        <h2>A little more<br/><i>light.</i></h2>
        <p>Warm metal, brilliant stones and hand-finished details come together in pieces designed around the way light moves.</p>
        <Link className="text-link" to="/product/celeste">Discover Celeste <ArrowRight size={16}/></Link>
      </div>
    </section>

    <section className="collection-strip section-pad">
      <div className="section-head"><div><span className="eyebrow">Curated for you</span><h2>Our collections</h2></div><Link className="text-link" to="/collections">View all <ArrowRight size={16}/></Link></div>
      <div className="collection-grid">
        {[
          ["Rings","/assets/product-ring.jpg","120+ designs"],
          ["Necklaces","/assets/product-necklace.jpg","90+ designs"],
          ["Earrings","/assets/product-earrings.jpg","80+ designs"],
          ["Bracelets","/assets/product-bracelet.jpg","60+ designs"]
        ].map(([name,image,count])=><Link to={`/shop?category=${name}`} className="collection-card" key={name}>
          <img src={image}/><div><span>{name}</span><small>{count}</small><ArrowUpRight/></div>
        </Link>)}
      </div>
    </section>

    <section className="marquee"><div>{["CRAFTED WITH INTENTION","18K GOLD","LAB-GROWN DIAMONDS","HAND FINISHED","CRAFTED WITH INTENTION"].map((x,i)=><span key={i}>{x} <b>✦</b></span>)}</div></section>

    <section className="editorial section-pad">
      <div><span className="eyebrow">The Lumière Journal</span><h2>The art of<br/><i>wearing a story.</i></h2><p>Notes on craft, styling and the small details that make a piece feel like yours.</p><Link className="text-link" to="/about">Our story <ArrowRight size={16}/></Link></div>
      <div className="editorial-image"><img src="/assets/collections.jpg"/></div>
    </section>
  </div>
}

function Collections() {
  const groups = [
    ["Rings","/assets/product-ring.jpg","Designed around the hand."],
    ["Necklaces","/assets/product-necklace.jpg","Lines that frame the story."],
    ["Earrings","/assets/product-earrings.jpg","A little light, close to you."],
    ["Bracelets","/assets/product-bracelet.jpg","Movement, captured in gold."],
    ["Pendants","/assets/product-necklace.jpg","Quiet pieces with presence."],
    ["Mangalsutra","/assets/collections.jpg","Heritage, interpreted anew."]
  ];
  return <><PageIntro eyebrow="The collection" title="Our Collections" copy="Distinct designs for every chapter of your story."/><section className="collection-page-grid">
    {groups.map(([name,img,copy],i)=><Link className={`big-collection c-${i}`} to={`/shop?category=${name}`} key={name}><img src={img}/><div><span>{name}</span><p>{copy}</p><ArrowUpRight/></div></Link>)}
  </section></>
}

function Shop() {
  const query = new URLSearchParams(useLocation().search);
  const initial = query.get("category") || "All";
  const [cat,setCat] = useState(initial);
  const [sort,setSort] = useState("featured");
  const [filterOpen,setFilterOpen] = useState(false);
  const categories=["All","Rings","Necklaces","Earrings","Bracelets","Pendants","Mangalsutra"];
  const filtered = products.filter(p=>cat==="All"||p.category===cat).sort((a,b)=>sort==="price-low"?a.price-b.price:sort==="price-high"?b.price-a.price:0);
  return <><PageIntro eyebrow="The jewellery edit" title="Pieces with presence." copy="Explore the full Lumière collection, from everyday signatures to statement pieces."/>
    <section className="shop-toolbar"><div className="chips">{categories.map(c=><button className={cat===c?"active":""} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div><div className="toolbar-right"><button onClick={()=>setFilterOpen(true)} className="filter-button">Filter & Sort <ChevronDown size={16}/></button></div></section>
    <section className="product-grid">{filtered.map(p=><ProductCard product={p} key={p.id}/>)}</section>
    <AnimatePresence>{filterOpen&&<FilterDrawer sort={sort} setSort={setSort} close={()=>setFilterOpen(false)}/>}</AnimatePresence>
  </>
}

function ProductCard({product}) {
  const {wishlist,toggleWishlist,addToCart}=useStore();
  const liked=wishlist.includes(product.id);
  return <motion.article className="product-card" layout whileHover={{y:-5}}>
    <Link to={`/product/${product.id}`} className="product-photo">
      <img src={product.image}/>
      <span className="badge">{product.badge}</span>
      <motion.div className="hover-view" initial={{opacity:0}} whileHover={{opacity:1}}>View piece <ArrowUpRight size={15}/></motion.div>
    </Link>
    <div className="product-info"><div><span className="product-category">{product.category}</span><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link></div>
      <button className={`heart ${liked?"liked":""}`} onClick={()=>toggleWishlist(product.id)} aria-label="Wishlist"><Heart size={18} fill={liked?"currentColor":"none"}/></button></div>
    <div className="product-bottom"><strong>{formatINR(product.price)}</strong><button onClick={()=>addToCart(product)} className="quick-add">Add <Plus size={14}/></button></div>
  </motion.article>
}

function FilterDrawer({sort,setSort,close}) {
  return <motion.div className="drawer-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close}><motion.aside className="filter-drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} onClick={e=>e.stopPropagation()}><div className="drawer-head"><h3>Filter & Sort</h3><button onClick={close} className="icon-button"><X/></button></div><div className="drawer-section"><span className="eyebrow">Sort by</span>{[["featured","Featured"],["price-low","Price — Low to high"],["price-high","Price — High to low"]].map(([v,l])=><button className={`drawer-option ${sort===v?"selected":""}`} onClick={()=>setSort(v)} key={v}>{l}{sort===v&&<Check size={16}/>}</button>)}</div><button className="button button-dark full" onClick={close}>Apply</button></motion.aside></motion.div>
}

function ProductPage() {
  const {id}=useParams();
  const product=products.find(p=>p.id===id) || products[0];
  const {wishlist,toggleWishlist,addToCart}=useStore();
  const [size,setSize]=useState(product.sizes?.[0]||null);
  const [active,setActive]=useState(product.image);
  const images=[product.image,"/assets/ring.jpg","/assets/product-ring.jpg","/assets/product-earrings.jpg"];
  useEffect(()=>{setSize(product.sizes?.[0]||null);setActive(product.image)},[id]);
  return <section className="product-page">
    <div className="product-gallery"><div className="thumbs">{images.map((x,i)=><button className={active===x?"active":""} onClick={()=>setActive(x)} key={i}><img src={x}/></button>)}</div><motion.div className="main-product-image" layoutId={`product-${product.id}`}><AnimatePresence mode="wait"><motion.img key={active} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.35}} src={active}/></AnimatePresence></motion.div></div>
    <div className="product-detail"><span className="eyebrow">{product.category} · {product.badge}</span><h1>{product.name}</h1><div className="rating">★★★★★ <span>4.9 · 128 reviews</span></div><div className="detail-price">{formatINR(product.price)} {product.oldPrice&&<del>{formatINR(product.oldPrice)}</del>}</div><p>{product.desc}</p><div className="spec-line">{product.notes}</div>
      <div className="selector"><span>Material</span><div className="selector-options"><button className="selected">Rose Gold</button><button>Yellow Gold</button><button>White Gold</button></div></div>
      {product.sizes?.length>0&&<div className="selector"><span>Size <a href="#size">Size Guide</a></span><div className="selector-options">{product.sizes.map(s=><button className={size===s?"selected":""} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div></div>}
      <div className="detail-actions"><button className="button button-dark" onClick={()=>addToCart(product,size)}>Add to Bag <ArrowRight size={16}/></button><button className={`wishlist-large ${wishlist.includes(product.id)?"liked":""}`} onClick={()=>toggleWishlist(product.id)}><Heart fill={wishlist.includes(product.id)?"currentColor":"none"}/></button></div>
      <div className="trust-row"><span>◎ Certified Jewellery</span><span>↻ 7-Day Returns</span><span>□ Free Shipping</span><span>♡ Lifetime Support</span></div>
    </div>
  </section>
}

function Cart() {
  const {cartLines,subtotal,updateQty,removeItem}=useStore();
  return <section className="cart-page"><PageIntro eyebrow="Your selection" title="Your Cart" copy={`${cartLines.length} pieces selected.`}/><div className="cart-layout"><div className="cart-lines">{cartLines.length===0?<Empty text="Your bag is waiting." action="/shop" label="Explore Jewellery"/>:cartLines.map(x=><div className="cart-line" key={x.key}><img src={x.product.image}/><div className="cart-line-info"><span className="product-category">{x.product.category}</span><h3>{x.product.name}</h3><p>{x.size?`Size ${x.size} · `:""}{x.product.material}</p><strong>{formatINR(x.product.price)}</strong></div><div className="qty"><button onClick={()=>updateQty(x.key,-1)}><Minus/></button><span>{x.qty}</span><button onClick={()=>updateQty(x.key,1)}><Plus/></button></div><button className="remove" onClick={()=>removeItem(x.key)}><X/></button></div>)}</div>{cartLines.length>0&&<div className="summary"><span className="eyebrow">Order summary</span><div><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div><div><span>Shipping</span><strong>Free</strong></div><div><span>GST (2%)</span><strong>{formatINR(Math.round(subtotal*.02))}</strong></div><hr/><div className="total"><span>Total</span><strong>{formatINR(Math.round(subtotal*1.02))}</strong></div><Link className="button button-dark full" to="/checkout">Proceed to Checkout <ArrowRight/></Link></div>}</div></section>
}

function CartDrawer() {
  const {cartOpen,setCartOpen,cartLines,subtotal,updateQty,removeItem}=useStore();
  return <AnimatePresence>{cartOpen&&<motion.div className="drawer-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setCartOpen(false)}><motion.aside className="cart-drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} onClick={e=>e.stopPropagation()}><div className="drawer-head"><h3>Your Cart <small>({cartLines.length})</small></h3><button onClick={()=>setCartOpen(false)} className="icon-button"><X/></button></div>{cartLines.length===0?<Empty text="Your bag is waiting." action="/shop" label="Explore Jewellery"/>:<><div className="drawer-items">{cartLines.map(x=><div className="mini-line" key={x.key}><img src={x.product.image}/><div><strong>{x.product.name}</strong><span>{formatINR(x.product.price)}</span><div className="mini-qty"><button onClick={()=>updateQty(x.key,-1)}><Minus/></button><span>{x.qty}</span><button onClick={()=>updateQty(x.key,1)}><Plus/></button><button onClick={()=>removeItem(x.key)}><X/></button></div></div></div>)}</div><div className="drawer-total"><div><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div><Link onClick={()=>setCartOpen(false)} className="button button-dark full" to="/checkout">Checkout <ArrowRight/></Link></div></>}</motion.aside></motion.div>}</AnimatePresence>
}

function Checkout() {
  const {subtotal,cartLines}=useStore();
  const [step,setStep]=useState(1);
  const [placed,setPlaced]=useState(false);
  if (placed) return <OrderSuccess/>;
  if (!cartLines.length) return <Empty text="Your cart is empty." action="/shop" label="Explore Jewellery"/>;
  return <section className="checkout"><div className="checkout-head"><Logo/><div className="steps">{["Shipping","Payment","Review"].map((x,i)=><span className={step===i+1?"active":step>i+1?"done":""} key={x}><b>{i+1}</b>{x}</span>)}</div></div><div className="checkout-layout"><div className="checkout-form">{step===1&&<Form title="Shipping Details" fields={["Full Name","Phone Number","Address","City","State","Pincode"]}/>} {step===2&&<Form title="Payment" fields={["Card Number","Name on Card","Expiry","CVV"]}/>} {step===3&&<div className="review"><h2>Review your order</h2>{cartLines.map(x=><div className="review-line" key={x.key}><img src={x.product.image}/><span>{x.product.name} × {x.qty}</span><strong>{formatINR(x.product.price*x.qty)}</strong></div>)}</div>}<button className="button button-dark full" onClick={()=>step<3?setStep(step+1):setPlaced(true)}>{step<3?"Continue":"Place Order"} <ArrowRight/></button></div><div className="checkout-summary"><span className="eyebrow">Order Summary</span>{cartLines.map(x=><div className="review-line small" key={x.key}><span>{x.product.name} × {x.qty}</span><strong>{formatINR(x.product.price*x.qty)}</strong></div>)}<hr/><div className="total"><span>Total</span><strong>{formatINR(Math.round(subtotal*1.02))}</strong></div></div></div></section>
}

function Form({title,fields}) {
  return <div className="form"><h2>{title}</h2>{fields.map(f=><label key={f}>{f}<input placeholder={f}/></label>)}<label className="check"><input type="checkbox"/> Save this information for next time</label></div>
}

function OrderSuccess() {
  return <section className="success"><div className="success-icon"><Check/></div><span className="eyebrow">Order confirmed</span><h1>Placed<br/><i>Successfully.</i></h1><p>Thank you for choosing Lumière.<br/>Your order #LMR2315 has been confirmed.</p><Link className="button button-gold" to="/account">View Order <ArrowRight/></Link><div className="order-track"><span>Order Confirmed</span><span>Processing</span><span>Shipped</span><span>Out for Delivery</span><span>Delivered</span></div></section>
}

function Account() {
  const {wishlist}=useStore();
  return <section className="account"><PageIntro eyebrow="Your Lumière" title="Welcome back." copy="Your pieces, orders and saved details in one place."/><div className="account-stats"><div><strong>5</strong><span>Total Orders</span></div><div><strong>{wishlist.length}</strong><span>Wishlist Items</span></div><div><strong>2</strong><span>Saved Addresses</span></div></div><div className="account-panel"><div className="account-nav"><button className="active">Overview</button><button>Orders</button><button>Wishlist</button><button>Addresses</button><button>Profile</button></div><div className="account-content"><div className="section-head"><h2>Recent Orders</h2><span>View all →</span></div>{[["#LMR2316","Celeste Diamond Ring","₹52,999","Delivered"],["#LMR3089","Pearl Drop Earrings","₹12,499","Shipped"],["#LMR2840","Emerald Pendant","₹65,498","Processing"]].map(x=><div className="order-row" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><span>{x[2]}</span><em>{x[3]}</em><button>View Details</button></div>)}</div></div></section>
}

function About() { return <><PageIntro eyebrow="The house of Lumière" title="A story in every piece." copy="Jewellery made with proportion, patience and a respect for the moments it becomes part of."/><section className="about-hero"><img src="/assets/collections.jpg"/><div><span className="eyebrow">Our philosophy</span><h2>Quietly distinctive.<br/><i>Never ordinary.</i></h2><p>We believe fine jewellery does not need to shout. It needs to catch the light at the right moment, sit beautifully against the skin and remain meaningful long after the occasion has passed.</p></div></section><section className="about-values section-pad"><div><Sparkles/><h3>Considered design</h3><p>Every silhouette begins with proportion, balance and how it moves when worn.</p></div><div><Sparkles/><h3>Responsible craft</h3><p>We favour traceable materials and lab-grown stones where they suit the design.</p></div><div><Sparkles/><h3>Made for a lifetime</h3><p>Our pieces are finished to be worn, loved, repaired and passed forward.</p></div></section></> }

function Contact() { return <section className="contact"><PageIntro eyebrow="Come closer" title="Let's talk jewellery." copy="For appointments, custom pieces, gifting or simply finding the right piece, our team is here."/><div className="contact-grid"><div><span className="eyebrow">Visit</span><h3>Mumbai Atelier</h3><p>By appointment only.<br/>Monday — Saturday<br/>10:00 — 19:00</p><a href="mailto:hello@lumiere.example" className="text-link">hello@lumiere.example <ArrowUpRight/></a></div><form className="contact-form"><input placeholder="Your name"/><input placeholder="Email address"/><select defaultValue=""><option value="" disabled>What can we help with?</option><option>Jewellery consultation</option><option>Custom piece</option><option>Order support</option></select><textarea placeholder="Tell us a little more"></textarea><button className="button button-dark">Send Enquiry <ArrowRight/></button></form></div></section> }

function Empty({text,action,label}) { return <div className="empty"><span>✦</span><h2>{text}</h2><Link className="button button-dark" to={action}>{label} <ArrowRight/></Link></div> }

function Footer() {
  return <footer><div className="footer-main"><div><Logo light/><p>Jewellery for life's<br/>brightest moments.</p></div><div><span className="footer-title">Explore</span><Link to="/collections">Collections</Link><Link to="/shop">Jewellery</Link><Link to="/about">Our Story</Link></div><div><span className="footer-title">Client care</span><Link to="/contact">Contact</Link><Link to="/account">Orders</Link><Link to="/cart">Your Bag</Link></div><div><span className="footer-title">Newsletter</span><p>Private notes on new pieces, craft and the world of Lumière.</p><div className="newsletter"><input placeholder="Your email"/><button><ArrowRight/></button></div></div></div><div className="footer-bottom"><span>© 2026 LUMIÈRE</span><span>Jewellery for life's brightest moments.</span><span>Privacy · Terms</span></div></footer>
}

function App() {
  return <StoreProvider><Header/><Transition/><Routes/><CartDrawer/><Footer/></StoreProvider>
}

function Routes() {
  const path=useLocation().pathname;
  const page = path==="/" ? <Home/> :
    path==="/collections" ? <Collections/> :
    path==="/shop" ? <Shop/> :
    path.startsWith("/product/") ? <ProductPage/> :
    path==="/cart" ? <Cart/> :
    path==="/checkout" ? <Checkout/> :
    path==="/account" ? <Account/> :
    path==="/about" ? <About/> :
    path==="/contact" ? <Contact/> : <Home/>;
  return <main>{page}</main>
}

createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
