/* ============================================================
   НЕЙРОЗАВОД — Demo dialogs (interactive simulation)
   Два сценария: ИИ-Охотник (активный) и ИИ-Дежурный (реактивный)
   ============================================================ */

const DEMO_SCENARIOS = {
  hunter: {
    title: 'ИИ-Охотник · Анна',
    avatar: 'А',
    intro: 'Сейчас я покажу как работает <strong>ИИ-Охотник</strong>. Я — ИИ-Консультант элитного агентства недвижимости. Сейчас я напишу первой подписчику нашего канала. <em>Ваша задача — отвечать как обычный клиент. Выбирайте варианты ниже.</em>',
    steps: [
      {
        bot: 'Здравствуйте, Иван! Меня зовут Анна, я ИИ-Консультант агентства «Премиум-Недвижимость». Увидела что вы подписаны на наш канал по элитной недвижимости в Раменках. Подскажите, ищете для себя или присматриваете как инвестицию?',
        options: [
          { label: '«Пока просто смотрю»', next: 1 },
          { label: '«Думаю об инвестиции»', next: 2 },
          { label: '«А вы человек или бот?»', next: 3 }
        ]
      },
      {
        user: 'Пока просто смотрю',
        bot: 'Понимаю — на таком рынке торопиться не стоит. А что именно интересует — конкретный ЖК или район? Я могу присылать вам раз в месяц короткую сводку: какие квартиры в Раменках выставили, какие ушли, по какой цене. Без спама, только полезное.',
        options: [
          { label: '«Да, было бы интересно»', next: 4 },
          { label: '«Не сейчас, спасибо»', next: 5 }
        ]
      },
      {
        user: 'Думаю об инвестиции',
        bot: 'Тогда вам точно есть смысл познакомиться с нашим основателем — Юлией. У неё 20 лет в недвижимости, из них 7 лет — своя компания в Турции в Аланье. Она лично сопровождает инвесторов в премиум-сегменте. Бесплатное 15-минутное знакомство — она расскажет про текущие точки входа в ЖК Раменок. Удобно в Telegram или созвон?',
        options: [
          { label: '«Telegram, давайте»', next: 6 },
          { label: '«Созвон лучше»', next: 6 }
        ]
      },
      {
        user: 'А вы человек или бот?',
        bot: 'Хороший вопрос — отвечу честно. Я ИИ-Консультант агентства «Премиум-Недвижимость». Не «просто бот»: меня обучали под нашу нишу, я знаю наши ЖК, цены, специфику инвесторов. Но если в какой-то момент вам понадобится живой риелтор — я сразу передам вас Юлии или одному из менеджеров. Хорошо?',
        options: [
          { label: '«Окей, продолжаем»', next: 1 },
          { label: '«Хочу сразу к человеку»', next: 7 }
        ]
      },
      {
        user: 'Да, было бы интересно',
        bot: 'Отлично! Записала вас в рассылку. Первый апдейт пришлю в начале следующего месяца. И сразу маленький бонус: на этой неделе в ЖК «Настоящее» вышла квартира 84 м², которую владельцы продают с торгом. Прислать карточку?',
        options: [
          { label: '«Да, пришлите»', next: 8 },
          { label: '«Спасибо, потом»', next: 8 }
        ]
      },
      {
        user: 'Не сейчас, спасибо',
        bot: 'Понимаю, не буду навязываться. Если вдруг появится интерес — я в этом канале. Хорошего дня, Иван! 🤝',
        options: [
          { label: '🔄 Попробовать ещё раз', next: 'restart' },
          { label: '📞 Хочу такого в своё агентство', next: 'cta' }
        ]
      },
      {
        user: 'Давайте',
        bot: 'Записала вас на 15-минутное знакомство с Юлией. Она напишет вам в Telegram сегодня до конца дня. Готовлю короткое введение по вашему запросу — так вы не потратите эти 15 минут на «расскажите что у вас вообще». Если что-то срочное — напишите мне сюда.',
        options: [
          { label: '🔄 Попробовать ещё раз', next: 'restart' },
          { label: '📞 Хочу такого в своё агентство', next: 'cta' }
        ]
      },
      {
        user: 'Хочу сразу к человеку',
        bot: 'Понимаю, без вопросов. Передаю вас Юлии, основателю агентства, — она риелтор с 20-летним опытом, лично сопровождает инвесторов в премиум. Она напишет в течение часа. Я остаюсь на связи если будут вопросы по логистике.',
        options: [
          { label: '🔄 Попробовать ещё раз', next: 'restart' },
          { label: '📞 Хочу такого в своё агентство', next: 'cta' }
        ]
      },
      {
        user: 'Окей',
        bot: 'Отправила. И буду на связи. Если нужна будет встреча с менеджером для просмотра — пишите, согласую слот. Хорошего дня! 🤝',
        options: [
          { label: '🔄 Попробовать ещё раз', next: 'restart' },
          { label: '📞 Хочу такого в своё агентство', next: 'cta' }
        ]
      }
    ]
  },

  dispatcher: {
    title: 'ИИ-Дежурный · Сергей',
    avatar: 'С',
    intro: 'Сейчас вы увидите <strong>ИИ-Дежурного</strong> в действии. Это реактивный сотрудник: <em>он не пишет первым, а 24/7 принимает входящие заявки</em>. Представьте — час ночи, вы оставляете заявку с сайта агентства. Что произойдёт?',
    steps: [
      {
        user: 'Здравствуйте, оставил заявку у вас на сайте по ЖК Настоящее. Это работает в час ночи?',
        bot: '<em>Через 7 секунд после заявки…</em><br/><br/>Здравствуйте! Я Сергей, ИИ-Ассистент агентства «Премиум-Недвижимость». Да, я работаю 24/7. Спасибо что оставили заявку. Чтобы быстро понять что вам предложить — пара коротких вопросов. Покупка для жизни или как инвестиция?',
        options: [
          { label: '«Для жизни»', next: 1 },
          { label: '«Инвестиция»', next: 2 },
          { label: '«Сейчас не готов отвечать»', next: 3 }
        ]
      },
      {
        user: 'Для жизни',
        bot: 'Понятно. Какой бюджет рассматриваете и сколько комнат? И когда планируете заехать — в этом году, в следующем?',
        options: [
          { label: '«До 50 млн, 3 комнаты, в 2027»', next: 4 },
          { label: '«80–100 млн, 4+ комнаты, в этом году»', next: 5 }
        ]
      },
      {
        user: 'Инвестиция',
        bot: 'Понял. Тогда важна доходность. Что для вас приоритет — рост капитала на горизонте 5 лет или арендная доходность сейчас?',
        options: [
          { label: '«Рост капитала»', next: 5 },
          { label: '«Аренда сейчас»', next: 4 }
        ]
      },
      {
        user: 'Сейчас не готов отвечать',
        bot: 'Без проблем. Когда вам удобно — напишите мне сюда или ответьте на это сообщение. Я буду здесь круглосуточно. И небольшая просьба: в каком виде удобнее получить информацию — короткой PDF-сводкой или голосом созвоном с менеджером?',
        options: [
          { label: '«PDF-сводка»', next: 6 },
          { label: '«Хочу созвон»', next: 7 }
        ]
      },
      {
        user: 'До 50 млн, 3 комнаты, в 2027',
        bot: 'Отлично, у меня в базе есть 3 варианта под ваш запрос в ЖК «Настоящее» и 2 в соседнем «Раменки-Парк». Назначаю вам встречу с Юлией — нашим старшим риелтором, 20 лет опыта. Удобно в среду в 11:00 или в четверг в 16:00?',
        options: [
          { label: '«Среда 11:00»', next: 8 },
          { label: '«Четверг 16:00»', next: 8 }
        ]
      },
      {
        user: 'Премиальный сегмент',
        bot: 'Отлично, это профильная задача нашего основателя. Юлия лично ведёт всех инвесторов и покупателей в премиум-сегменте. У неё свободны два слота на этой неделе: вторник 14:00 или пятница 12:00. И заранее: если вы за рубежом — она работает на двух языках (русский, английский) и настроена на международных инвесторов, у неё 7 лет опыта на рынке Турции.',
        options: [
          { label: '«Вторник 14:00»', next: 8 },
          { label: '«Пятница 12:00»', next: 8 }
        ]
      },
      {
        user: 'PDF-сводка',
        bot: 'Хорошо. Готовлю и пришлю вам в течение 30 минут. Туда войдут: 5 актуальных вариантов под Раменки, цены, сравнение метража, расчёт ипотеки если интересно. Куда удобно получить — на этот же чат или email?',
        options: [
          { label: '«Сюда в чат»', next: 9 },
          { label: '«На email»', next: 9 }
        ]
      },
      {
        user: 'Хочу созвон',
        bot: 'Понял. Передаю вас Юлии — она наш основатель и старший риелтор, 20 лет в недвижимости. Она перезвонит вам в первый рабочий слот, который у неё свободен (с 9:00 до 19:00 МСК). На какой номер удобно?',
        options: [
          { label: '«Запишу в форму»', next: 9 }
        ]
      },
      {
        user: 'Записал слот',
        bot: 'Отлично, записал! Юлия вас ждёт. Я отправил ей заранее ваши ответы — она не будет тратить эти 15 минут на «давайте познакомимся». Сразу к делу, по вашим параметрам. До встречи! 🤝',
        options: [
          { label: '🔄 Попробовать другой сценарий', next: 'restart' },
          { label: '📞 Хочу такого в своё агентство', next: 'cta' }
        ]
      },
      {
        user: 'Готово',
        bot: 'Принял. Жду от вас письмо или сообщение, когда будете готовы продолжить. Я здесь круглосуточно. Хорошего вечера! 🌙',
        options: [
          { label: '🔄 Попробовать другой сценарий', next: 'restart' },
          { label: '📞 Хочу такого в своё агентство', next: 'cta' }
        ]
      }
    ]
  }
};

// ============================================================
// State
// ============================================================
let currentScenario = null;
let currentStep = 0;

// ============================================================
// API
// ============================================================
function openDemo(scenarioKey) {
  currentScenario = DEMO_SCENARIOS[scenarioKey];
  currentStep = 0;
  if (!currentScenario) return;

  document.getElementById('demo-title').textContent = currentScenario.title;
  document.getElementById('demo-avatar').textContent = currentScenario.avatar;
  document.getElementById('demo-chat').innerHTML = '';
  document.getElementById('demo-input-area').innerHTML = '';
  document.getElementById('demo-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // intro + первый шаг
  setTimeout(() => addBotBubble(currentScenario.intro, () => {
    setTimeout(() => playStep(0), 600);
  }), 300);
}

function closeDemo() {
  document.getElementById('demo-modal').classList.add('hidden');
  document.body.style.overflow = '';
  currentScenario = null;
}

function playStep(index) {
  if (index === 'restart') { openDemo(currentScenario === DEMO_SCENARIOS.hunter ? 'hunter' : 'dispatcher'); return; }
  if (index === 'cta') {
    closeDemo();
    setTimeout(() => document.getElementById('cta').scrollIntoView({behavior: 'smooth'}), 200);
    return;
  }

  const step = currentScenario.steps[index];
  if (!step) return;
  currentStep = index;

  // Сначала пользовательская реплика (если есть)
  if (step.user) addUserBubble(step.user);

  // Очищаем старые опции
  document.getElementById('demo-input-area').innerHTML = '';

  // Затем typing → ответ бота
  setTimeout(() => showTyping(() => {
    addBotBubble(step.bot, () => {
      if (step.options && step.options.length) renderOptions(step.options);
    });
  }), step.user ? 700 : 200);
}

function renderOptions(options) {
  const area = document.getElementById('demo-input-area');
  const wrap = document.createElement('div');
  wrap.className = 'demo-options';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'demo-option-btn';
    btn.textContent = opt.label;
    btn.onclick = () => { wrap.querySelectorAll('button').forEach(b => b.disabled = true); playStep(opt.next); };
    wrap.appendChild(btn);
  });
  area.appendChild(wrap);
}

function addBotBubble(text, after) {
  const chat = document.getElementById('demo-chat');
  const b = document.createElement('div');
  b.className = 'bubble bubble-bot';
  b.innerHTML = text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
  if (after) setTimeout(after, 200);
}

function addUserBubble(text) {
  const chat = document.getElementById('demo-chat');
  const b = document.createElement('div');
  b.className = 'bubble bubble-user';
  b.textContent = text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping(after) {
  const chat = document.getElementById('demo-chat');
  const t = document.createElement('div');
  t.className = 'bubble-typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(t);
  chat.scrollTop = chat.scrollHeight;

  const typingDelay = 900 + Math.random() * 700;
  setTimeout(() => { t.remove(); after && after(); }, typingDelay);
}

// Esc to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDemo();
    closeContactForm();
  }
});
