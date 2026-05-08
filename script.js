// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close menu when link clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== MENU FILTER =====
function filterMenu(category) {
  const cards = document.querySelectorAll('.menu-card');
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeInUp 0.4s ease forwards';
    } else {
      card.classList.add('hidden');
    }
  });
}

// ===== CART =====
let cart = [];

function addToOrder(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
  showToast(`${name} ditambahkan ke keranjang!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const totalPrice = document.getElementById('totalPrice');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Belum ada item. Tambahkan dari menu!</p>';
    cartTotal.style.display = 'none';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    html += `
      <div class="cart-item">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">x${item.qty}</span>
        <span class="cart-item-price">${formatRupiah(subtotal)}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Hapus">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  cartTotal.style.display = 'flex';
  totalPrice.textContent = formatRupiah(total);
}

function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// ===== ORDER FORM =====
const orderTypeSelect = document.getElementById('orderType');
const addressGroup = document.getElementById('addressGroup');

orderTypeSelect.addEventListener('change', () => {
  addressGroup.style.display = orderTypeSelect.value === 'delivery' ? 'block' : 'none';
});

document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const orderType = orderTypeSelect.value;
  const address = document.getElementById('custAddress').value.trim();
  const note = document.getElementById('custNote').value.trim();

  if (!name || !phone) {
    alert('Mohon isi nama dan nomor WhatsApp Anda.');
    return;
  }

  if (cart.length === 0) {
    alert('Keranjang masih kosong! Silakan pilih menu terlebih dahulu.');
    return;
  }

  // Build WhatsApp message
  let orderTypeLabel = '';
  if (orderType === 'dine-in') orderTypeLabel = 'Makan di Tempat';
  else if (orderType === 'takeaway') orderTypeLabel = 'Bawa Pulang';
  else orderTypeLabel = 'Antar ke Rumah';

  let itemList = '';
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    itemList += `• ${item.name} x${item.qty} = ${formatRupiah(subtotal)}\n`;
  });

  let message = `🍽️ *PESANAN BARU - Warung Nusantara*\n\n`;
  message += `👤 *Nama:* ${name}\n`;
  message += `📱 *No. HP:* ${phone}\n`;
  message += `🛵 *Jenis Pesanan:* ${orderTypeLabel}\n`;
  if (orderType === 'delivery' && address) {
    message += `📍 *Alamat:* ${address}\n`;
  }
  message += `\n📋 *Detail Pesanan:*\n${itemList}`;
  message += `\n💰 *Total: ${formatRupiah(total)}*\n`;
  if (note) {
    message += `\n📝 *Catatan:* ${note}\n`;
  }
  message += `\nTerima kasih! 🙏`;

  const waNumber = '6285182169946';
  const encodedMessage = encodeURIComponent(message);
  const waURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;

  window.open(waURL, '_blank');
});

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1a1a1a;
    color: #fff;
    padding: 14px 24px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-family: 'Poppins', sans-serif;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    opacity: 0;
    transition: all 0.3s ease;
  `;
  toast.querySelector('i').style.color = '#25D366';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ===== SCROLL REVEAL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.menu-card, .testi-card, .stat-item, .gallery-item, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-link');
    }
  });
});
