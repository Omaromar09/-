/**
 * El Veranda Workspace - Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSpaceTabs();
  initMenuSystem();
  initGalleryLightbox();
  initFAQAccordion();
  initFocusSoundPlayer();
});

/* ==========================================================================
   1. Navbar & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

  // Sticky header with blur & scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Drawer Toggle
  if (mobileToggle && drawer && overlay) {
    const openDrawer = () => {
      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Active Link Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   2. Space & Zones Tabs
   ========================================================================== */
function initSpaceTabs() {
  const tabButtons = document.querySelectorAll('.space-tab-btn');
  const spaceCards = document.querySelectorAll('.space-card');

  if (!tabButtons.length || !spaceCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      spaceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Café & Menu System with Live Search and Calculator
   ========================================================================== */
const menuData = [
  // Hot Drinks
  { id: 1, cat: 'hot', name: 'شاي فاخر (أحمر / أخضر / بالنعناع)', price: 10, desc: 'شاي فتلة أو كشري بالنعناع الأخضر الطازج في كوباية مظبوطة', popular: true },
  { id: 2, cat: 'hot', name: 'قهوة تركي مخصوص (سادة / محوجة)', price: 15, desc: 'بن برازيلي محمص ومطحون طازة مع وش مظبوط وتحويجة شرقية تعدل دماغك', popular: true },
  { id: 3, cat: 'hot', name: 'هوت شوكليت بلجيكي فاخر', price: 35, desc: 'شوكولاتة غنية بالحليب الساخن والكريمة ولمسة مارشميلو مبهجة', popular: true },
  { id: 4, cat: 'hot', name: 'قهوة فرنساوي بالحليب', price: 25, desc: 'مزيج ناعم ومتناغم بين البن المحوج والحليب الساخن المبخر', popular: false },
  { id: 5, cat: 'hot', name: 'إسبريسو سينجل / دبل', price: 20, desc: 'شوت قهوة مركز يعطيك طاقة وتركيز للمذاكرة والشغل', popular: false },
  { id: 6, cat: 'hot', name: 'كابتشينو إيطالي بالفوم', price: 30, desc: 'إسبريسو غني مع فوم حليب كريمي كثيف ورشة كاكاو', popular: false },
  { id: 7, cat: 'hot', name: 'كافيه لاتيه بالكراميل أو الفانيليا', price: 35, desc: 'قهوة حليبية ناعمة مع صوص كراميل ذهبي محلى', popular: false },
  { id: 8, cat: 'hot', name: 'مشروبات أعشاب (ينسون، كركديه، نعناع، قرفة)', price: 15, desc: 'مشروبات دافئة مريحة للأعصاب لتهدئة التوتر أثناء الامتحانات', popular: false },

  // Cold Drinks
  { id: 9, cat: 'cold', name: 'آيس كوفي فرابيه الفارانده', price: 35, desc: 'قهوة باردة مثلجة ممزوجة بالثلج المجروش وصوص الشوكولاتة', popular: true },
  { id: 10, cat: 'cold', name: 'سبانيش لاتيه مثلج', price: 40, desc: 'حليب مكثف محلى مع شوت إسبريسو دبل ومكعبات ثلج منعشة', popular: true },
  { id: 11, cat: 'cold', name: 'موهيتو ليمون نعناع / بلو لاجون', price: 30, desc: 'انتعاش الصودا والنعناع الأخضر والليمون المثلج للريلاكس', popular: true },
  { id: 12, cat: 'cold', name: 'سموذي مانجو وفراولة طبيعي', price: 35, desc: 'فاكهة طازجة 100% مثلجة بدون مواد حافظة لصفاء الذهن', popular: false },
  { id: 13, cat: 'cold', name: 'ميلك شيك أوريو بالآيس كريم', price: 40, desc: 'بسكويت أوريو مقرمش ممزوج بآيس كريم فانيليا غني', popular: false },
  { id: 14, cat: 'cold', name: 'عصير برتقال فريش عصارة', price: 25, desc: 'فيتامين سي طبيعي طازج بدون سكر مضاف', popular: false },

  // Desserts
  { id: 15, cat: 'dessert', name: 'ماونتن كيك الفارانده الشهير (Mountain Cake)', price: 50, desc: 'طبقات كيك الشوكولاتة الهرمية مع صوص الفدج الغني وحشو الكريمة الساحر', popular: true },
  { id: 16, cat: 'dessert', name: 'مولتن كيك بالشوكولاتة السائلة', price: 45, desc: 'كيك الشوكولاتة الساخن ينفجر بصوص الشوكولاتة الذائب مع بولة آيس كريم فانيليا', popular: true },
  { id: 17, cat: 'dessert', name: 'نيويورك تشيز كيك (توت / لوتس / كراميل)', price: 45, desc: 'قوام كريمي مخملي على قاعدة بسكويت مقرمشة مع صوص اختياري', popular: false },
  { id: 18, cat: 'dessert', name: 'فادج براونيز دافئ بالمكسرات', price: 35, desc: 'براونيز شوكولاتة داكنة مقرمش من بره وطري وفادجي من جوه', popular: false },
  { id: 19, cat: 'dessert', name: 'وافل نوتيلا وموز ومكسرات', price: 45, desc: 'وافل مقرمش ذهبي طازج مغطى بشوكولاتة نوتيلا وشرائح موز', popular: false },
  { id: 20, cat: 'dessert', name: 'كرواسون زبدة فرنسي / بالجبنة', price: 25, desc: 'سناك خفيف ومقرمش مثالي مع كوباية الشاي الصباحية', popular: false }
];

let selectedCart = {};

function initMenuSystem() {
  const grid = document.getElementById('menu-items-container');
  const searchInput = document.getElementById('menu-search');
  const catButtons = document.querySelectorAll('.menu-cat-btn');

  if (!grid) return;

  function renderItems(items) {
    grid.innerHTML = '';
    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
          <i class="fa-solid fa-mug-saucer" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--color-primary);"></i>
          <p style="font-size: 1.1rem; font-weight: 700;">لا توجد عناصر مطابقة لبحثك</p>
          <span style="font-size: 0.9rem;">جرب البحث بكلمة ثانية مثل "شاي"، "كيك"، أو "قهوة"</span>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-item-card';
      card.setAttribute('data-category', item.cat);

      const isAdded = selectedCart[item.id] ? selectedCart[item.id].qty : 0;

      card.innerHTML = `
        <div class="menu-item-info">
          <div class="menu-item-title-row">
            <h4 class="menu-item-name">${item.name}</h4>
            ${item.popular ? '<span class="badge-bestseller"><i class="fa-solid fa-fire"></i> الأكثر طلباً</span>' : ''}
          </div>
          <p class="menu-item-desc">${item.desc}</p>
        </div>
        <div class="menu-item-action">
          <div class="menu-item-price">${item.price} <span>ج.م</span></div>
          <button class="btn-add-tray" data-id="${item.id}" title="أضف لحاسبة الطلب" aria-label="أضف ${item.name}">
            <i class="fa-solid ${isAdded ? 'fa-check' : 'fa-plus'}"></i>
          </button>
        </div>
      `;

      // Add to tray event
      const addBtn = card.querySelector('.btn-add-tray');
      addBtn.addEventListener('click', () => {
        addToTray(item);
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        addBtn.style.background = 'var(--color-primary)';
        addBtn.style.color = '#ffffff';
      });

      grid.appendChild(card);
    });
  }

  // Filter & Search handler
  let activeCat = 'all';
  function filterMenu() {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = menuData.filter(item => {
      const matchesCat = activeCat === 'all' || item.cat === activeCat;
      const matchesSearch = item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term);
      return matchesCat && matchesSearch;
    });
    renderItems(filtered);
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.getAttribute('data-cat');
      filterMenu();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterMenu);
  }

  // Initial render
  renderItems(menuData);
}

function addToTray(item) {
  if (selectedCart[item.id]) {
    selectedCart[item.id].qty += 1;
  } else {
    selectedCart[item.id] = {
      name: item.name,
      price: item.price,
      qty: 1
    };
  }
  updateTrayUI();
}

function updateTrayUI() {
  const countEl = document.getElementById('calc-item-count');
  const totalEl = document.getElementById('calc-total-sum');
  const resetBtn = document.getElementById('btn-reset-tray');
  const orderWaBtn = document.getElementById('btn-order-wa');

  let totalItems = 0;
  let totalPrice = 0;

  for (const id in selectedCart) {
    totalItems += selectedCart[id].qty;
    totalPrice += selectedCart[id].price * selectedCart[id].qty;
  }

  if (countEl) countEl.textContent = `${totalItems} عناصر محددة`;
  if (totalEl) totalEl.textContent = `${totalPrice} ج.م`;

  if (resetBtn) {
    resetBtn.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    resetBtn.onclick = () => {
      selectedCart = {};
      updateTrayUI();
      const addBtns = document.querySelectorAll('.btn-add-tray');
      addBtns.forEach(btn => {
        btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        btn.style.background = '#ffffff';
        btn.style.color = 'var(--color-charcoal-800)';
      });
    };
  }

  if (orderWaBtn) {
    orderWaBtn.onclick = () => {
      if (totalItems === 0) {
        alert('من فضلك اختر بعض المشروبات أو الكيك أولاً بالضغط على زر (+) بجانب الصنف!');
        return;
      }
      const itemsList = Object.values(selectedCart)
        .map(i => `• ${i.name} (عدد ${i.qty}) = ${i.price * i.qty} ج.م`)
        .join('\n');
      
      const message = `مرحباً الفارانده! ☕🌿\nأنا جاي المكان وحابب تجهزولي الطلبات دي:\n\n${itemsList}\n\nالإجمالي التقريبي: ${totalPrice} ج.م`;
      const waUrl = `https://api.whatsapp.com/send?phone=201024824760&text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    };
  }
}

/* ==========================================================================
   4. Gallery Lightbox Modal
   ========================================================================== */
function initGalleryLightbox() {
  const tiles = document.querySelectorAll('.gallery-tile');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!tiles.length || !modal) return;

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const img = tile.querySelector('img');
      const caption = tile.querySelector('.tile-caption')?.textContent || 'الفارانده ورك سبيس';
      const subcaption = tile.querySelector('.tile-subcaption')?.textContent || '';

      if (img && modalImg) {
        modalImg.src = img.src;
        modalCaption.textContent = `${caption} - ${subcaption}`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   6. Focus Ambient Sound Synthesizer
   ========================================================================== */
let audioCtx = null;
let currentSound = null;
let isPlaying = false;

function initFocusSoundPlayer() {
  const toggleBtn = document.getElementById('sound-cafe-btn');
  const rainBtn = document.getElementById('sound-rain-btn');

  if (!toggleBtn) return;

  function stopAllSounds() {
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (err) {}
      audioCtx = null;
    }
    isPlaying = false;
    currentSound = null;
    document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
      btn.classList.remove('playing');
    });
  }

  function playCafeAmbience() {
    stopAllSounds();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.06;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.15;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    whiteNoise.start();
    isPlaying = true;
    currentSound = 'cafe';
    toggleBtn.classList.add('playing');
  }

  function playRainAmbience() {
    stopAllSounds();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.8;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.12;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    whiteNoise.start();
    isPlaying = true;
    currentSound = 'rain';
    if (rainBtn) rainBtn.classList.add('playing');
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying && currentSound === 'cafe') {
      stopAllSounds();
    } else {
      playCafeAmbience();
    }
  });

  if (rainBtn) {
    rainBtn.addEventListener('click', () => {
      if (isPlaying && currentSound === 'rain') {
        stopAllSounds();
      } else {
        playRainAmbience();
      }
    });
  }
}
