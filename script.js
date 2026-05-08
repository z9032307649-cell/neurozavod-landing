/* ============================================================
   НЕЙРОЗАВОД — Main script
   Hero animation, scroll reveals, contact modal
   ============================================================ */

// ============================================================
// Hero phone mock — auto-playing chat preview
// ============================================================
const HERO_DIALOG = [
  { type: 'bot', text: 'Здравствуйте, Иван! Я Анна, ИИ-Консультант агентства недвижимости.' },
  { type: 'bot', text: 'Увидела что вы подписаны на наш канал. Подскажите, ищете для себя или как инвестицию?' },
  { type: 'user', text: 'А вы человек или бот?' },
  { type: 'bot', text: 'Я ИИ-Консультант — но не «просто бот»: меня обучали под недвижимость в Раменках, я знаю ЖК, цены, специфику.' },
  { type: 'bot', text: 'Если что-то выйдет за рамки — сразу передам вас Юлии, нашему старшему риелтору. Так удобно?' }
];

function playHeroDialog() {
  const chat = document.getElementById('hero-chat');
  if (!chat) return;
  chat.innerHTML = '';

  let delay = 400;
  HERO_DIALOG.forEach((msg, i) => {
    setTimeout(() => {
      if (msg.type === 'bot' && i > 0) {
        // typing indicator before bot
        const t = document.createElement('div');
        t.className = 'bubble-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        chat.appendChild(t);
        chat.scrollTop = chat.scrollHeight;

        setTimeout(() => {
          t.remove();
          appendBubble(chat, msg);
        }, 700);
      } else {
        appendBubble(chat, msg);
      }
    }, delay);
    delay += msg.type === 'bot' ? 1700 : 1100;
  });

  // restart loop
  setTimeout(() => playHeroDialog(), delay + 4000);
}

function appendBubble(chat, msg) {
  const b = document.createElement('div');
  b.className = 'bubble ' + (msg.type === 'bot' ? 'bubble-bot' : 'bubble-user');
  b.textContent = msg.text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}

// ============================================================
// Scroll reveals
// ============================================================
function initScrollReveals() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('section h2, .product-card, .price-card, .guarantee-card, .step-card, .legal-card, .quote-card, .case-card, .bundle-card, .founder-portrait').forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });
}

// ============================================================
// Contact modal
// ============================================================
function openContactForm() {
  document.getElementById('contact-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = document.querySelector('#contact-modal input[name="name"]');
    if (first) first.focus();
  }, 300);
}

function closeContactForm() {
  document.getElementById('contact-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function submitContact(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    name: form.name.value.trim(),
    contact: form.contact.value.trim(),
    agency: form.agency.value.trim()
  };

  // На v1 лендинга — отправляем в Telegram через простую mailto/redirect-ссылку.
  // Когда будет бэкенд — заменить на fetch к webhook.
  const tgText = encodeURIComponent(
    `🟢 Заявка с лендинга НЕЙРОЗАВОДА\n\n` +
    `Имя: ${data.name}\n` +
    `Контакт: ${data.contact}\n` +
    (data.agency ? `Агентство: ${data.agency}\n` : '')
  );

  // Показываем благодарность
  const content = document.querySelector('#contact-modal .contact-modal-content');
  content.innerHTML = `
    <button onclick="closeContactForm()" class="demo-close" aria-label="Закрыть">×</button>
    <div class="text-center py-6">
      <div class="text-5xl mb-4">🎉</div>
      <h3 class="font-display text-3xl font-bold text-emerald-deep mb-3">Спасибо, ${data.name}!</h3>
      <p class="text-ash mb-6">Я получила вашу заявку. Свяжусь с вами в течение часа в&nbsp;Telegram или по&nbsp;контакту, который вы оставили.</p>
      <p class="text-sm text-ash mb-8">А пока можете написать мне напрямую:</p>
      <a href="https://t.me/zaveruhaprofi?text=${tgText}" target="_blank" rel="noopener" class="cta-primary inline-flex">
        <span>Написать в Telegram</span>
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </a>
    </div>
  `;

  // Логируем в localStorage чтобы Юлия могла собрать заявки на v1
  try {
    const log = JSON.parse(localStorage.getItem('nzv_leads') || '[]');
    log.push({ ...data, ts: new Date().toISOString() });
    localStorage.setItem('nzv_leads', JSON.stringify(log));
  } catch (e) {}
}

// ============================================================
// Smooth scroll for nav links
// ============================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  if (id === '#' || id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  setTimeout(playHeroDialog, 800);
});
