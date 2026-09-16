/**
 * Barabelun Budo Martial Arts Academy
 * Full eCommerce Shopping Cart & Dojo Blog Client Application
 * Zero external framework dependencies - 100% static & Cloudflare Pages ready.
 */

const SENSEI_PHONE = '918515082913';

// Cart State
let cart = [];

// Blog Articles Content
const ARTICLES = {
  knot: {
    title: 'The Proper Way to Tie and Care for Your Karate Belt (Obi)',
    meta: 'By Sensei SK Solaman &bull; Official Dojo Equipment Guide',
    content: `
      <p>In traditional Japanese Karate-Do, the belt (Obi) represents more than rank &mdash; it holds your gi closed and anchors your center of gravity (the Tanden or Hara).</p>
      <p><strong>Step-by-Step Square Knot (Koma-musubi):</strong></p>
      <p>1. Find the exact center of the belt and place it below your navel.</p>
      <p>2. Wrap both ends around your waist and bring them back to the front, ensuring the belt lies flat without twisting behind your back.</p>
      <p>3. Cross the right end over the left, and tuck the top end underneath both layers of the belt, pulling it upward.</p>
      <p>4. Form a simple square knot with the two ends and tighten horizontally with a sharp snap. Both hanging ends should be of equal length, signifying balance between physical technique and mental discipline.</p>
      <p><strong>Care &amp; Etiquette:</strong> Never wash your belt with bleach or hot water. Always fold your belt neatly after training and treat it as a symbol of your dedication to the tatami.</p>
    `
  },
  zanshin: {
    title: 'Understanding "Zanshin": The State of Unbroken Awareness',
    meta: 'By Sensei SK Solaman &bull; Zanshin Karate-Do Kai Core Principles',
    content: `
      <p>Our academy proudly trains under the authorized lineage of <em>Zanshin Karate-Do Kai</em>. But what does <strong>Zanshin (残心)</strong> truly mean?</p>
      <p>The kanji translates literally to "remaining mind." It is the mental posture of complete, calm, and unbroken awareness before, during, and after an action is completed.</p>
      <p>In kumite (sparring), a practitioner who hits an opponent and immediately drops their hands or celebrates lacks Zanshin &mdash; they are vulnerable to a sudden counter-strike. True mastery means delivering a technique with full focus and remaining fully poised, balanced, and ready.</p>
      <p>Off the tatami, Zanshin teaches students situational safety, alertness when walking alone, calm composure during school exams, and respect towards elders.</p>
    `
  },
  reigi: {
    title: 'Dojo Etiquette (Reigi): Essential Manners for New Students',
    meta: 'Barabelun Budo Academy &bull; Student Handbook',
    content: `
      <p>Master Gichin Funakoshi taught: <em>"Karate begins with courtesy and ends with courtesy."</em> Before learning how to strike or kick, a student must first learn how to respect the training ground.</p>
      <p><strong>Key Dojo Rules at Barabelun:</strong></p>
      <p>• <strong>Bowing (Rei):</strong> Always bow respectfully when stepping onto or leaving the tatami floor.</p>
      <p>• <strong>Clean Uniform (Dogi):</strong> Keep your training uniform clean, odorless, and with your rank belt properly tied.</p>
      <p>• <strong>Punctuality:</strong> Arrive at least 10 minutes before batch time. If late, kneel in Seiza at the dojo entrance until Sensei grants permission to join.</p>
      <p>• <strong>Silence &amp; Focus:</strong> Refrain from casual chatting during instruction. Respond promptly with a crisp <em>"Osu!"</em> (I understand / I will persevere).</p>
    `
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Mode Controller
  initTheme();

  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('fYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Load Cart from localStorage if available
  loadCart();
  renderCart();

  // 3. Mobile Navigation Drawer Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    drawer.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    });
  }

  // 4. Cart Trigger Open Button
  const cartTrigger = document.getElementById('cartTriggerBtn');
  if (cartTrigger) {
    cartTrigger.addEventListener('click', openCart);
  }

  // 5. Global Size Sync Picker
  const globalPicker = document.getElementById('globalSizePicker');
  if (globalPicker) {
    globalPicker.addEventListener('change', () => {
      const selectedSize = globalPicker.value;
      const sizeSelects = document.querySelectorAll('.item-size-select');
      sizeSelects.forEach(select => {
        for (let i = 0; i < select.options.length; i++) {
          if (selectedSize.includes(select.options[i].value.split(' ')[0])) {
            select.selectedIndex = i;
            break;
          }
        }
      });
    });
  }

  // 6. Online Inquiry Form to WhatsApp
  const inquiryForm = document.getElementById('ecomInquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName')?.value.trim() || 'Customer';
      const type = document.getElementById('cType')?.value || 'Inquiry';
      const msg = document.getElementById('cMsg')?.value.trim() || 'No additional note';

      let text = `Hello Sensei SK Solaman, inquiry from Barabelun Budo Store & Academy:\n\n`;
      text += `• Name: ${name}\n`;
      text += `• Subject: ${type}\n`;
      text += `• Note: ${msg}\n\n`;
      text += `Please let me know how to proceed.`;

      window.open(`https://wa.me/${SENSEI_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    });
  }

  // 7. Active Nav Spy on Scroll
  initScrollSpy();
});

/* ==========================================================================
   CART FUNCTIONS
   ========================================================================== */
function loadCart() {
  try {
    const saved = localStorage.getItem('barabelun_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (err) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem('barabelun_cart', JSON.stringify(cart));
  } catch (err) {}
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderCart() {
  const list = document.getElementById('cartItemsList');
  const countBadge = document.getElementById('cartCount');
  const drawerCount = document.getElementById('drawerCartCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const footer = document.getElementById('cartFooter');

  if (!list) return;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (countBadge) countBadge.textContent = totalItems;
  if (drawerCount) drawerCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
  if (subtotalEl) subtotalEl.textContent = `₹${totalPrice}`;

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty-cart-msg">
        <p>Your belt cart is currently empty.</p>
        <a href="#store" class="btn btn-teal btn-sm" onclick="closeCart()">Browse Belt Catalog</a>
      </div>
    `;
    if (footer) footer.style.display = 'none';
  } else {
    if (footer) footer.style.display = 'block';
    list.innerHTML = cart.map((item, idx) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-size">${item.size}</span>
          <span class="cart-item-price">₹${item.price} each</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">&minus;</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">&plus;</button>
          <button class="del-item-btn" onclick="removeFromCart(${idx})" title="Remove item">&times;</button>
        </div>
      </div>
    `).join('');
  }
}

function addToCart(item) {
  const existingIdx = cart.findIndex(i => i.name === item.name && i.size === item.size);
  if (existingIdx > -1) {
    cart[existingIdx].qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
  renderCart();
}

// Add to Cart from Product Card Button
function addToCartFromCard(buttonElement) {
  const card = buttonElement.closest('.product-item');
  if (!card) return;

  const name = card.getAttribute('data-name');
  const price = parseInt(card.getAttribute('data-price'), 10) || 300;
  const sizeSelect = card.querySelector('.item-size-select');
  const size = sizeSelect ? sizeSelect.value : 'Size 3 (240 cm)';

  addToCart({
    name,
    price,
    size,
    qty: 1
  });
}

// Quick Add for Hero Product
function quickAddHeroBelt() {
  addToCart({
    name: 'Tournament Red Kumite Belt (Aka)',
    price: 320,
    size: 'Size 3 (240 cm)',
    qty: 1
  });
}

// 1-Click Buy via WhatsApp directly from single card
function buyViaWhatsApp(buttonElement, event) {
  event.preventDefault();
  const card = buttonElement.closest('.product-item');
  if (!card) return;

  const name = card.getAttribute('data-name');
  const price = card.getAttribute('data-price');
  const sizeSelect = card.querySelector('.item-size-select');
  const size = sizeSelect ? sizeSelect.value : 'Size 3 (240 cm)';

  const text = `Hello Sensei, I would like to order the ${name} (₹${price}) [${size}]. Please share the delivery details.`;
  window.open(`https://wa.me/${SENSEI_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

// Checkout Entire Cart via WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) return;

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  let message = `🥋 *New Order from Barabelun Budo Store:*\n\n`;
  cart.forEach((item, i) => {
    message += `${i + 1}. *${item.name}* [${item.size}]\n   Qty: ${item.qty} &bull; Price: ₹${item.price * item.qty}\n`;
  });
  message += `\n💰 *Total Order Amount: ₹${totalPrice}*\n\n`;
  message += `Hello Sensei SK Solaman, please share the delivery address confirmation and UPI / payment details.`;

  window.open(`https://wa.me/${SENSEI_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

/* ==========================================================================
   PRODUCT DESCRIPTION MODAL DATA & FUNCTIONS
   ========================================================================== */
const PRODUCTS_DATA = {
  'r1-navy': {
    id: 'r1-navy',
    name: 'Rich Navy Kyu Belt',
    kanji: '空手帯 &bull; 紺帯',
    collection: 'Row 1: Teal & Blue Collection',
    rank: 'Navy Kyu Rank (Senior Intermediate)',
    price: 340,
    mrp: 420,
    colorHex: '#0D1B2A',
    textColor: '#A8DADC',
    badge: 'Senior Kyu Grade',
    imageType: 'strap',
    strapText: '空手',
    desc: 'The Rich Navy belt signifies deepening tactical maturity within the Zanshin Karate-Do Kai curriculum. As students transition from intermediate to advanced kyu grades, this belt provides the firm abdominal compression required for dynamic hip rotation during kihon and kata performance.',
    specs: [
      'Fabric: 100% High-Density Woven Heavy Cotton (Zero Synthetic Blends)',
      'Stitching: 10 longitudinal chain-stitch rows for balanced rigidity',
      'Core: Layered unbleached cotton core that softens ergonomically with practice',
      'Width: Standard 4.5 cm competition dojo width',
      'Dye: Deep colorfast reactive vat dye resistant to sweat and fading'
    ],
    curriculum: 'Focus Kata: Heian Godan & Tekki Shodan. Advanced footwork, sweeps (Ashi Barai), and controlled counter-strikes (Gyaku Zuki).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r1-indigo': {
    id: 'r1-indigo',
    name: 'Deep Indigo Karate Belt',
    kanji: '空手帯 &bull; 藍帯',
    collection: 'Row 1: Teal & Blue Collection',
    rank: '4th Kyu Rank (Intermediate)',
    price: 320,
    mrp: 390,
    colorHex: '#1B4965',
    textColor: '#FFFFFF',
    badge: 'Dojo Certified',
    imageType: 'strap',
    strapText: '残心',
    desc: 'Deep Indigo represents the expansive ocean &mdash; calm on the surface yet holding immense power underneath. Tailored specifically for 4th Kyu students advancing into complex continuous combination techniques and semi-contact kumite.',
    specs: [
      'Fabric: 100% Premium Pure Woven Cotton canvas',
      'Stitching: 9 precision needle rows preventing belt unraveling during sparring',
      'Core: Reinforced heavy canvas interior for tight, non-slip square knots',
      'Width: Standard 4.5 cm dojo standard',
      'Inspection: Batch checked by Sensei SK Solaman at Barabelun Dojo'
    ],
    curriculum: 'Focus Kata: Heian Yondan. Emphasis on open-hand blocks (Shuto Uke) and balance recovery in Kokutsu Dachi.',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r1-teal': {
    id: 'r1-teal',
    name: 'Light Sea Green Belt',
    kanji: '空手帯 &bull; 青緑帯',
    collection: 'Row 1: Teal & Blue Collection',
    rank: '5th Kyu Rank (Progressive Grade)',
    price: 300,
    mrp: 360,
    colorHex: '#29ADB2',
    textColor: '#0D1B2A',
    badge: 'Official Kyu Grade',
    imageType: 'strap',
    strapText: '武道',
    desc: 'The Teal belt marks the emergence of clean defensive timing and explosive chambering. Designed with optimal flexibility for youth and adult students practicing multi-directional pivoting and low kicks.',
    specs: [
      'Fabric: 100% Woven Cotton with soft pre-wash treatment',
      'Stitching: 8 tight rows maintaining crisp shape during daily workouts',
      'Core: Medium-density unbleached core for effortless knotting by juniors',
      'Width: Standard 4.5 cm',
      'Safety: Skin-friendly organic dyes safe for all-day training sessions'
    ],
    curriculum: 'Focus Kata: Heian Sandan. Introduction to hammer-fist strikes (Tettsui Uchi) and stance shifting (Kiba Dachi).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r1-celeste': {
    id: 'r1-celeste',
    name: 'Celeste Pale Cyan Belt',
    kanji: '空手帯 &bull; 空色帯',
    collection: 'Row 1: Teal & Blue Collection',
    rank: 'Junior Blue / Sky Rank',
    price: 290,
    mrp: 350,
    colorHex: '#A8DADC',
    textColor: '#1B4965',
    badge: 'Junior Favorite',
    imageType: 'strap',
    strapText: '基本',
    desc: 'Pale Cyan reflects the open sky towards which the young martial artist begins their journey. Lightweight yet ruggedly woven, this belt gives junior practitioners pride and tactile reinforcement without feeling bulky.',
    specs: [
      'Fabric: 100% Natural Cotton with smooth non-abrasive surface',
      'Stitching: 8 continuous longitudinal seams',
      'Core: Supple interior flexible for children tying their own Obi',
      'Width: 4.2 cm optimized for smaller dojo uniforms',
      'Durability: Tested against tear forces up to 250 kg'
    ],
    curriculum: 'Focus Kata: Taikyoku Shodan & Kihon combinations. Basic blocks (Age Uke, Gedan Barai) and front kicks (Mae Geri).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r2-red': {
    id: 'r2-red',
    name: 'Crimson Red Kumite Belt (Aka)',
    kanji: '空手帯 &bull; 赤帯 (赤組)',
    collection: 'Row 2: Warm Sunset Collection',
    rank: 'Official Tournament Competition Grade',
    price: 320,
    mrp: 399,
    colorHex: '#E94F37',
    textColor: '#FFFFFF',
    badge: 'Dojo Best Seller ★ Real Belt Photo',
    imageType: 'photo',
    imageSrc: 'assets/images/belt-red-folded.png',
    desc: 'The official crimson "Aka" competition belt used in state, national, and Zanshin Karate-Do Kai sanctioned tournament rings. Featuring real photograph presentation taken right at our Barabelun Academy dojo floor. Crafted with an extra heavy-duty canvas core that stays locked tight during intense sparring exchanges.',
    specs: [
      'Fabric: Heavyweight 100% Woven Cotton Canvas (Official WKF Tournament Standard)',
      'Stitching: 10 Heavy-Duty rows of industrial grade stitching',
      'Core: Thick composite canvas layer preventing knot slip during kumite matches',
      'Finish: Deep crimson colorfast dye &mdash; zero stain transfer to white karate gi',
      'Inspection: Hand checked and certified by Sensei SK Solaman (1st Dan Japan)'
    ],
    curriculum: 'Tournament Kumite (Sparring) standard. Worn by competitor "Aka" (Red) in points fighting and kata division rounds.',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r2-orange': {
    id: 'r2-orange',
    name: 'Sunset Orange Karate Belt',
    kanji: '空手帯 &bull; 橙帯',
    collection: 'Row 2: Warm Sunset Collection',
    rank: '7th - 8th Kyu Grade',
    price: 290,
    mrp: 350,
    colorHex: '#F9844A',
    textColor: '#FFFFFF',
    badge: 'Real Belt Photo Featured',
    imageType: 'photo',
    imageSrc: 'assets/images/belt-red-hanging.png',
    imageFilter: 'hue-rotate(25deg)',
    desc: 'The Orange belt represents the first warm rays of the sunrise, indicating a student whose foundational stances and punches are taking solid form. Photographed from genuine hanging stock at the academy.',
    specs: [
      'Fabric: 100% Pure Woven Cotton with comfortable break-in feel',
      'Stitching: 8 precise linear seams with reinforced end folds',
      'Core: Medium-density inner cotton batting',
      'Width: Standard 4.5 cm width',
      'Standard: Zanshin Karate-Do Kai Kyu examination compliant'
    ],
    curriculum: 'Focus Kata: Heian Nidan. Mastery of double block (Morote Uke), side snap kick (Yoko Geri Keage), and spear hand (Nukite).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r2-yellow': {
    id: 'r2-yellow',
    name: 'Golden Yellow Karate Belt',
    kanji: '空手帯 &bull; 黄帯',
    collection: 'Row 2: Warm Sunset Collection',
    rank: '9th Kyu Grade (First Exam Rank)',
    price: 270,
    mrp: 340,
    colorHex: '#F9C74F',
    textColor: '#574005',
    badge: 'First Kyu Exam',
    imageType: 'strap',
    strapText: '基本',
    desc: 'The Yellow belt is awarded upon passing the student’s very first official dojo examination. It signifies the seed of martial spirit being planted in fertile ground.',
    specs: [
      'Fabric: 100% Breathable Woven Cotton',
      'Stitching: 8 longitudinal reinforced rows',
      'Core: Soft flexible core ideal for beginner waist sizes',
      'Width: 4.5 cm',
      'Longevity: Holds shape through multiple weekly washing cycles'
    ],
    curriculum: 'Focus Kata: Heian Shodan. Understanding Zenkutsu Dachi (forward stance), Oi Zuki (lunge punch), and Gedan Barai (downward block).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r2-peach': {
    id: 'r2-peach',
    name: 'Warm Peach Novice Belt',
    kanji: '空手帯 &bull; 桃帯',
    collection: 'Row 2: Warm Sunset Collection',
    rank: 'Junior Prep / Introductory Grade',
    price: 260,
    mrp: 320,
    colorHex: '#FDD9B5',
    textColor: '#7C4410',
    badge: 'Novice Friendly',
    imageType: 'strap',
    strapText: '初歩',
    desc: 'Designed for young students and kindergarten novices entering the dojo. Softened cotton weave prevents chafing while introducing children to the pride of wearing a martial arts uniform.',
    specs: [
      'Fabric: Ultra-gentle 100% natural cotton',
      'Stitching: 8 smooth rows with rounded hemmed tips',
      'Core: Light and pliable for simple square-knot tying',
      'Width: 4.2 cm junior proportion',
      'Care: Pre-shrunk fabric to retain exact length'
    ],
    curriculum: 'Focus: Dojo etiquette (Reigi), listening skills, motor balance, safe falling (Ukemi), and counting in Japanese (Ichi, Ni, San, Shi...).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r3-purple': {
    id: 'r3-purple',
    name: 'Deep Imperial Purple Belt',
    kanji: '空手帯 &bull; 紫帯',
    collection: 'Row 3: Purple Gradient Collection',
    rank: '3rd Kyu Grade (Brown Belt Gate)',
    price: 360,
    mrp: 440,
    colorHex: '#5E4B8B',
    textColor: '#FFFFFF',
    badge: 'Senior Kyu Gate',
    imageType: 'strap',
    strapText: '気魄',
    desc: 'Deep Imperial Purple represents the dawn of serious budo dedication. Students at this stage have mastered the basics and are preparing to enter the advanced Brown Belt ranks under direct examination by Sensei SK Solaman.',
    specs: [
      'Fabric: 100% Heavyweight Premium Cotton',
      'Stitching: 10 rows of heavy-duty industrial stitching',
      'Core: Extra-dense canvas core for a crisp, snappy feel when turning hips',
      'Width: Standard 4.5 cm dojo width',
      'Certification: Official Zanshin Karate-Do Kai Kyu syllabus'
    ],
    curriculum: 'Focus Kata: Heian Godan & Bassai Dai intro. Controlled free sparring (Jiyu Kumite) and rapid counter-attacks.',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r3-violet': {
    id: 'r3-violet',
    name: 'Royal Violet Karate Belt',
    kanji: '空手帯 &bull; 菫帯',
    collection: 'Row 3: Purple Gradient Collection',
    rank: 'Intermediate Kyu Grade',
    price: 340,
    mrp: 420,
    colorHex: '#7D6CC4',
    textColor: '#FFFFFF',
    badge: 'Advanced Grade',
    imageType: 'strap',
    strapText: '道',
    desc: 'The Royal Violet belt honors the relentless polishing of technique (Renma). Made with rich color saturation and robust stiffness that withstands daily sweat, throws, and rigorous dojo sessions.',
    specs: [
      'Fabric: 100% Pure Woven Cotton',
      'Stitching: 9 longitudinal rows',
      'Core: Balanced canvas batting that softens with sweat and training',
      'Width: 4.5 cm',
      'Color: Fade-resistant deep violet'
    ],
    curriculum: 'Focus Kata: Tekki Shodan. Iron horse stance (Kiba Dachi) fighting, close-quarter grappling blocks, and hook punches (Kagi Zuki).',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r3-lilac': {
    id: 'r3-lilac',
    name: 'Soft Lilac Kyu Belt',
    kanji: '空手帯 &bull; 藤色帯',
    collection: 'Row 3: Purple Gradient Collection',
    rank: 'Senior Kyu Rank',
    price: 310,
    mrp: 380,
    colorHex: '#B9A7E0',
    textColor: '#2D1B54',
    badge: 'Senior Kyu',
    imageType: 'strap',
    strapText: '心',
    desc: 'Soft Lilac brings a distinct aesthetic balance to intermediate karate training. Sturdy, comfortable, and tailored for growing youth martial artists.',
    specs: [
      'Fabric: 100% Natural Cotton fabric',
      'Stitching: 8 rows of precision chain-stitch',
      'Core: Medium weight core',
      'Width: 4.5 cm',
      'Origin: Dispatched direct from Barabelun Academy'
    ],
    curriculum: 'Focus Kata: Heian Sandan & Yondan transitions. Developing kick-and-punch combinations without pausing.',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r3-lavender': {
    id: 'r3-lavender',
    name: 'Pale Lavender Grade Belt',
    kanji: '空手帯 &bull; 薄藤帯',
    collection: 'Row 3: Purple Gradient Collection',
    rank: 'Specialty Grade Belt',
    price: 300,
    mrp: 360,
    colorHex: '#E7D6F7',
    textColor: '#4B3670',
    badge: 'Specialty Progression',
    imageType: 'strap',
    strapText: '練',
    desc: 'Pale Lavender is a specialty motivator belt used in modern progressive dojo syllabi to celebrate steady attendance and perseverance.',
    specs: [
      'Fabric: 100% Breathable Woven Cotton',
      'Stitching: 8 rows of tight stitching',
      'Core: Flexible cotton interior',
      'Width: 4.2 cm / 4.5 cm',
      'Care: Machine washable (cold water, air dry recommended)'
    ],
    curriculum: 'Focus: Clean execution of Mae Geri (front kick), Mawashi Geri (roundhouse kick) chambering, and posture alignment.',
    sizes: ['Size 2 (220 cm)', 'Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r4-black': {
    id: 'r4-black',
    name: 'Charcoal Black Belt (1st Dan Shodan)',
    kanji: '空手帯 &bull; 黒帯 (有段者・初段)',
    collection: 'Row 4: Charcoal & Gold Master Collection',
    rank: 'Yudansha (Black Belt 1st Dan Japan Standard)',
    price: 650,
    mrp: 850,
    colorHex: '#2B2B2B',
    textColor: '#F0C94C',
    badge: 'Master Dan Grade ★ Japan Lineage',
    imageType: 'strap',
    strapText: '初段',
    desc: 'The pinnacle of martial achievement. The Kuro-Obi (Black Belt) represents a practitioner who has shed self-doubt, mastered fundamental techniques, and begun their true journey as a Yudansha. Modeled after the prestigious standards of Japanese Black Belts as worn by Sensei SK Solaman (1st Degree Black Belt from Japan). Designed to age gracefully, gradually revealing the white canvas beneath as years of sweat and kata wear in.',
    specs: [
      'Fabric: Extra-Heavyweight 100% Pure Japanese-grade Woven Cotton',
      'Stitching: 12 Industrial Longitudinal Rows of ultra-tight chain stitching',
      'Core: Double-layered heavy unbleached canvas core providing unmatched heft and firmness',
      'Aging: Engineered for authentic aging ("wabi-sabi") where white fibers subtly show through decades of training',
      'Standard: Full Zanshin Karate-Do Kai Dan Examination & Tournament Referee Approved'
    ],
    curriculum: 'Advanced Dan Syllabus: Bassai Dai, Kanku Dai, Jion, Enpi, Hangetsu. Mastery of Bunkai (practical combat applications) and dojo leadership.',
    sizes: ['Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r4-gold': {
    id: 'r4-gold',
    name: 'Master Gold Traditional Belt',
    kanji: '空手帯 &bull; 黄金帯 (師範)',
    collection: 'Row 4: Charcoal & Gold Master Collection',
    rank: 'Master Dan / Senior Instructor Grade',
    price: 850,
    mrp: 1100,
    colorHex: '#D4A017',
    textColor: '#2B2B2B',
    badge: 'Master Dan Rank',
    imageType: 'strap',
    strapText: '師範',
    desc: 'The Master Gold traditional belt represents wisdom, honor, and teaching responsibility (Shihan). Awarded to senior practitioners who assist Sensei in mentoring and grading junior batches.',
    specs: [
      'Fabric: 100% Heavy-Duty Cotton with brilliant golden luster',
      'Stitching: 10 reinforced stitch lines',
      'Core: Dense canvas core providing solid abdominal support',
      'Width: Standard 4.5 cm dojo width',
      'Origin: Hand inspected at Barabelun Dojo'
    ],
    curriculum: 'Dojo Instructor training: Pedagogy of kihon, injury prevention, tournament judging rules, and advanced kata analysis.',
    sizes: ['Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r4-ribbon': {
    id: 'r4-ribbon',
    name: 'Bright Gold Ribbon Belt',
    kanji: '空手帯 &bull; 武徳帯',
    collection: 'Row 4: Charcoal & Gold Master Collection',
    rank: 'Honor Award / Martial Virtue',
    price: 700,
    mrp: 890,
    colorHex: '#F0C94C',
    textColor: '#2B2B2B',
    badge: 'Honor Award',
    imageType: 'strap',
    strapText: '武徳',
    desc: 'Bright Gold ribbon belt stands for dedication to martial tradition and tireless service to the dojo. Exceptional knot retention even during hours of continuous instruction.',
    specs: [
      'Fabric: 100% Premium Cotton canvas',
      'Stitching: 9 continuous parallel rows',
      'Core: Heavyweight interior batting',
      'Width: 4.5 cm',
      'Durability: Reinforced boxed ends'
    ],
    curriculum: 'Advanced Bunkai: Defense against multiple attackers, joint locks (Kansetsu Waza), and situational self-defense.',
    sizes: ['Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  },
  'r4-ivory': {
    id: 'r4-ivory',
    name: 'Ivory Silk Embroidered Belt',
    kanji: '空手帯 &bull; 無心 (カスタム刺繍)',
    collection: 'Row 4: Charcoal & Gold Master Collection',
    rank: 'Custom Silk / Mushin Grade',
    price: 950,
    mrp: 1250,
    colorHex: '#F7E7B5',
    textColor: '#2B2B2B',
    badge: 'Custom Embroidered',
    imageType: 'strap',
    strapText: '無心',
    desc: 'Custom Ivory Silk belt embroidered with "Mushin" (Clear Mind). A prized collector and presentation Obi for senior practitioners, masters, and tournament medalists.',
    specs: [
      'Fabric: 100% Pure Natural Raw Silk / Heavy Cotton blend',
      'Stitching: 10 Rows of balanced silk-stitched embroidery',
      'Core: Ultra-dense resilient core',
      'Width: Standard 4.5 cm dojo width',
      'Affiliation: Official presentation belt of Barabelun Budo Academy'
    ],
    curriculum: 'Mastery of Mushin: Moving without hesitation, instinctive counter-timing, and embodiment of Budo spirit.',
    sizes: ['Size 3 (240 cm)', 'Size 4 (260 cm)', 'Size 5 (280 cm)', 'Size 6 (300 cm)']
  }
};

let currentModalProductId = null;
let currentModalQty = 1;

function openProductModal(productId) {
  const item = PRODUCTS_DATA[productId];
  if (!item) return;

  currentModalProductId = productId;
  currentModalQty = 1;

  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('productModalOverlay');
  const body = document.getElementById('productModalBody');

  if (!modal || !overlay || !body) return;

  // Render Visual Left Box
  let visualHtml = '';
  if (item.imageType === 'photo') {
    const filterStyle = item.imageFilter ? `style="filter: ${item.imageFilter};"` : '';
    visualHtml = `
      <div class="modal-photo-wrap">
        <img src="${item.imageSrc}" alt="${item.name}" class="modal-real-img" ${filterStyle}>
      </div>
    `;
  } else {
    visualHtml = `
      <div class="modal-strap-wrap" style="background:var(--bg-card-subtle);">
        <div class="modal-strap-render" style="background-color:${item.colorHex}; color:${item.textColor};">
          <span class="m-stitch"></span>
          <span class="m-kanji">${item.strapText}</span>
          <span class="m-stitch"></span>
        </div>
      </div>
    `;
  }

  // Size Options
  const sizeOptionsHtml = item.sizes.map((s, idx) => `
    <option value="${s}" ${idx === 1 ? 'selected' : ''}>${s}</option>
  `).join('');

  // Specs List
  const specsHtml = item.specs.map(sp => `
    <li>
      <svg viewBox="0 0 20 20" width="16" height="16" fill="#29ADB2">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
      <span>${sp}</span>
    </li>
  `).join('');

  body.innerHTML = `
    <div class="prod-modal-grid">
      <!-- LEFT COLUMN: Product Visuals & Trust Guarantee -->
      <div class="prod-modal-left">
        <div class="prod-modal-img-card">
          <div class="modal-badge-row">
            <span class="modal-badge">${item.badge}</span>
            <span class="modal-kanji-sub">${item.kanji}</span>
          </div>
          ${visualHtml}
          <div class="modal-authenticity-banner">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:#29ADB2; flex-shrink:0;">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z"/>
            </svg>
            <div>
              <strong>100% Genuine Dojo Equipment</strong>
              <p>Inspected &amp; approved directly at Barabelun Dojo</p>
            </div>
          </div>
        </div>

        <!-- DOJO HIGHLIGHT CARD: KNOW MORE ABOUT WEBSITE & ACADEMY -->
        <div class="modal-dojo-info-card">
          <div class="dojo-card-header">
            <span class="dojo-crest-mini">🥋</span>
            <div>
              <strong>About Barabelun Budo Academy</strong>
              <span>Branch of Zanshin Karate-Do Kai</span>
            </div>
          </div>
          <p class="dojo-card-text">
            Under the instruction of <strong>Sensei SK Solaman</strong> (Black Belt 1st Degree from Japan). We train students in authentic traditional Shotokan martial discipline, practical self-defense, and tournament kumite.
          </p>
          <div class="dojo-quick-links">
            <a href="#schedule" onclick="closeProductModal()" class="dojo-link-chip">📅 Training Timetable</a>
            <a href="#sensei" onclick="closeProductModal()" class="dojo-link-chip">👤 Meet Sensei</a>
            <a href="#blog" onclick="closeProductModal()" class="dojo-link-chip">📖 Dojo Journal</a>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Specifications, Rank Details, Size & WhatsApp Action -->
      <div class="prod-modal-right">
        <div class="prod-modal-header">
          <span class="modal-collection-tag">${item.collection} &bull; ${item.rank}</span>
          <h2 class="modal-prod-title">${item.name}</h2>
          <div class="modal-price-row">
            <div class="modal-price-stack">
              <span class="modal-curr-price">₹${item.price}</span>
              <span class="modal-mrp-price">₹${item.mrp}</span>
              <span class="modal-save-pill">Save ₹${item.mrp - item.price}</span>
            </div>
            <div class="modal-stock-status">
              <span class="stock-dot"></span> In Stock at Dojo
            </div>
          </div>
        </div>

        <!-- Description Paragraph -->
        <div class="modal-section-box">
          <h4 class="modal-box-title">Description &amp; Budo Philosophy</h4>
          <p class="modal-desc-p">${item.desc}</p>
        </div>

        <!-- Fabric & Craftsmanship Specs -->
        <div class="modal-section-box">
          <h4 class="modal-box-title">Material &amp; Craftsmanship Specifications</h4>
          <ul class="modal-specs-list">
            ${specsHtml}
          </ul>
        </div>

        <!-- Curriculum & Kata Info -->
        <div class="modal-section-box syllabus-box">
          <h4 class="modal-box-title">Rank Progression Syllabus</h4>
          <p class="curriculum-text">${item.curriculum}</p>
        </div>

        <!-- Sizing & Ordering Controls -->
        <div class="modal-order-panel">
          <div class="modal-selectors-row">
            <div class="modal-selector-group size-group">
              <label for="modalSizeSelect">Choose Belt Size:</label>
              <select id="modalSizeSelect" class="modal-size-select">
                ${sizeOptionsHtml}
              </select>
            </div>
            <div class="modal-selector-group qty-group">
              <label>Quantity:</label>
              <div class="modal-qty-control">
                <button type="button" class="modal-qty-btn" onclick="modalChangeQty(-1)">&minus;</button>
                <span class="modal-qty-val" id="modalQtyVal">1</span>
                <button type="button" class="modal-qty-btn" onclick="modalChangeQty(1)">&plus;</button>
              </div>
            </div>
          </div>

          <!-- Direct CTA Buttons -->
          <div class="modal-cta-row">
            <button type="button" class="btn btn-teal btn-modal-cart" onclick="addModalProductToCart()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              <span>Add to Cart &bull; ₹<span id="modalTotalBtnPrice">${item.price}</span></span>
            </button>
            <button type="button" class="btn btn-modal-whatsapp" onclick="orderModalProductWhatsApp()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.182 8.182 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/>
              </svg>
              <span>Order Directly on WhatsApp</span>
            </button>
          </div>

          <div class="modal-footer-note">
            <span>Dispatched from Barabelun, Purba Bardhaman &bull; Fast shipping across West Bengal &amp; India &bull; Sensei Direct: +91 8515082913</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('productModalOverlay');
  if (modal && overlay) {
    modal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProductId = null;
  }
}

function modalChangeQty(delta) {
  if (!currentModalProductId) return;
  const item = PRODUCTS_DATA[currentModalProductId];
  if (!item) return;

  currentModalQty = Math.max(1, currentModalQty + delta);
  const qtyVal = document.getElementById('modalQtyVal');
  const btnTotal = document.getElementById('modalTotalBtnPrice');

  if (qtyVal) qtyVal.textContent = currentModalQty;
  if (btnTotal) btnTotal.textContent = currentModalQty * item.price;
}

function addModalProductToCart() {
  if (!currentModalProductId) return;
  const item = PRODUCTS_DATA[currentModalProductId];
  if (!item) return;

  const sizeSelect = document.getElementById('modalSizeSelect');
  const size = sizeSelect ? sizeSelect.value : 'Size 3 (240 cm)';

  addToCart({
    name: item.name,
    price: item.price,
    size: size,
    qty: currentModalQty
  });

  closeProductModal();
}

function orderModalProductWhatsApp() {
  if (!currentModalProductId) return;
  const item = PRODUCTS_DATA[currentModalProductId];
  if (!item) return;

  const sizeSelect = document.getElementById('modalSizeSelect');
  const size = sizeSelect ? sizeSelect.value : 'Size 3 (240 cm)';
  const total = item.price * currentModalQty;

  const text = `Hello Sensei SK Solaman, I would like to order from Barabelun Budo Store:\n\n🥋 Item: ${item.name} (${item.rank})\n📏 Size: ${size}\n🔢 Qty: ${currentModalQty}\n💰 Total: ₹${total}\n\nPlease share delivery confirmation and payment / UPI details. Thank you!`;

  window.open(`https://wa.me/${SENSEI_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

/* ==========================================================================
   BLOG ARTICLE MODAL
   ========================================================================== */
function openArticleModal(articleKey) {
  const data = ARTICLES[articleKey];
  const modal = document.getElementById('articleModal');
  const overlay = document.getElementById('articleModalOverlay');
  const body = document.getElementById('articleModalBody');

  if (!data || !modal || !overlay || !body) return;

  body.innerHTML = `
    <h2>${data.title}</h2>
    <div class="meta">${data.meta}</div>
    <div class="article-text">${data.content}</div>
  `;

  modal.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  const overlay = document.getElementById('articleModalOverlay');
  if (modal && overlay) {
    modal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeArticleModal();
    closeCart();
  }
});

/* ==========================================================================
   SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    let activeId = '';

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        activeId = sec.getAttribute('id');
      }
    });

    if (activeId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   THEME MODE CONTROLLER (LIGHT / DARK)
   ========================================================================== */
let isThemeToggling = false;

function initTheme() {
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('barabelun_theme') || 'light';
  } catch (e) {}
  applyTheme(savedTheme);

  const desktopBtn = document.getElementById('themeToggleBtn');
  const mobileBtn = document.getElementById('mobileThemeToggleBtn');

  if (desktopBtn) {
    desktopBtn.onclick = toggleTheme;
  }
  if (mobileBtn) {
    mobileBtn.onclick = toggleTheme;
  }
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) {
    document.body.setAttribute('data-theme', theme);
  }
  try { localStorage.setItem('barabelun_theme', theme); } catch (e) {}

  // Update button labels to show current state
  const desktopText = document.getElementById('themeToggleText');
  const mobileText = document.getElementById('mobileThemeToggleText');
  if (desktopText) {
    desktopText.textContent = isDark ? 'Dark' : 'Light';
  }
  if (mobileText) {
    mobileText.textContent = isDark ? 'Dark' : 'Light';
  }

  // Update accessibility attributes & tooltips
  const desktopBtn = document.getElementById('themeToggleBtn');
  if (desktopBtn) {
    desktopBtn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    desktopBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    desktopBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }

  const mobileBtn = document.getElementById('mobileThemeToggleBtn');
  if (mobileBtn) {
    mobileBtn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    mobileBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    mobileBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }
}

function toggleTheme(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  if (isThemeToggling) return;
  isThemeToggling = true;
  setTimeout(() => { isThemeToggling = false; }, 200);

  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}


