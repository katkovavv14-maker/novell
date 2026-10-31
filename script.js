// ================= СОСТОЯНИЕ =================
const state = { name: 'Гость', trust: 0, scene: null, line: 0 };

const $ = id => document.getElementById(id);
const bgLayer = $('bg-layer');

const BACKGROUNDS = {
  street: 'bg_street.jpg',
  shop:   'bg_shop.jpg',
  road:   'bg_road.jpg'
};

// ================= СЦЕНАРИЙ =================
const scenes = {

  intro: {
    loc: 'street', chars: ['girl'],
    lines: [
      ['Девочка', 'Эй! Эй! *машет рукой*'],
      ['Девочка', 'Мне скучно. Сходишь со мной в магазин?'],
      ['Ты', 'Эмм, девочка, ты кто?'],
      ['Девочка', 'Ой, да важно ли, как меня зовут? *отмахивается*'],
      ['Ты', 'Меня зовут {name}.'],
      ['Девочка', 'Вот и познакомились! Пошли!']
    ],
    next: 'walk'
  },

  walk: {
    loc: 'street', chars: ['girl'],
    lines: [
      ['Рассказчик', 'Вы идёте по залитой солнцем улице. {name} и болтливая попутчица.'],
      ['Девочка', 'А ты знаешь, что кошки видят сны? Вот моя бы видела сосиски!'],
      ['Рассказчик', 'Вдруг из-за урны выходит кошка и садится прямо перед вами.']
    ],
    next: 'cat_meet'
  },

  cat_meet: {
    loc: 'street', chars: ['girl', 'cat'],
    lines: [['Девочка', 'Оооо, смотри какая! Погладим?']],
    choices: [
      { text: '🐾 Погладить кошку', trust: +10, next: 'cat_good' },
      { text: '🤢 «Фу, вдруг она больная»', trust: -10, next: 'cat_bad' }
    ]
  },

  cat_good: {
    loc: 'street', chars: ['girl', 'cat'],
    lines: [
      ['Рассказчик', 'Вы гладите кошку вдвоём. Она мурчит, как маленький мотор.'],
      ['Девочка', 'Ты классный. С тобой не скучно!']
    ],
    next: 'shop_enter'
  },

  cat_bad: {
    loc: 'street', chars: ['girl', 'cat'],
    lines: [
      ['Рассказчик', 'Девочка гладит кошку одна и осуждающе смотрит на тебя.'],
      ['Девочка', 'Она не больная. Больные — те, кто так говорит. Хм.']
    ],
    next: 'shop_enter'
  },

  shop_enter: {
    loc: 'shop', chars: ['girl'],
    lines: [
      ['Рассказчик', 'Магазин. Пахнет свежим хлебом и приключениями.'],
      ['Рассказчик', 'Попутчица садится на корточки у полки и долго выбирает.'],
      ['Девочка', 'Что лучше купить: шоколадку или сухарики?']
    ],
    choices: [
      { text: '🍫🥨 «Возьми и то, и другое»', trust: +10, next: 'snack_both' },
      { text: '🍫 «Шоколадку»', trust: 0, next: 'snack_choco' },
      { text: '🥨 «Сухарики»', trust: 0, next: 'snack_rusks' }
    ]
  },

  snack_both: {
    loc: 'shop', chars: ['girl'],
    lines: [
      ['Девочка', 'Но у меня не хватит...'],
      ['Ты', 'Я заплачу.'],
      ['Девочка', 'Правда?! Ты самый лучший взрослый на свете!']
    ],
    next: 'cashier'
  },

  snack_choco: {
    loc: 'shop', chars: ['girl'],
    lines: [['Девочка', 'Хорошо. Шоколадка так шоколадка!']],
    next: 'cashier'
  },

  snack_rusks: {
    loc: 'shop', chars: ['girl'],
    lines: [['Девочка', 'Ладно. Хрустеть будем!']],
    next: 'cashier'
  },

  cashier: {
    loc: 'shop', chars: ['girl', 'seller'],
    lines: [
      ['Продавщица', 'Опять ты? И друг у тебя появился, гляжу.'],
      ['Девочка', 'Это {name}! Мы теперь команда!'],
      ['Продавщица', 'Ну-ну. С вас — вот столько. Пакет нужен?'],
      ['Рассказчик', 'Покупки оплачены. Вы выходите на улицу — к дороге, залитой закатом.']
    ],
    next: 'road'
  },

  road: {
    loc: 'road', chars: ['girl'],
    lines: [
      ['Рассказчик', 'Солнце садится. Небо горит красным и оранжевым.'],
      ['Рассказчик', 'Девочка смотрит на тебя...']
    ],
    next: 'ENDING' //特别的 маркер — движок выберет концовку
  }
};

// ================= КОНЦОВКИ =================
const endings = {
  good: {
    title: '🌅 ЗАКАТ НА ДВОИХ',
    text: 'Вы сидите на лавочке, делите шоколадку и сухарики, болтаете обо всём на свете. Солнце медленно тонет за домами. «Приходи завтра, ладно?» — говорит она. Иногда лучший день — тот, который начался со случайного «Эй!».',
    dark: false
  },
  neutral: {
    title: '👋 ДО ВСТРЕЧИ',
    text: 'Вы прощаетесь возле дороги. Девочка машет рукой и уходит в закат — маленькая фигурка на фоне огромного оранжевого неба. Может, вы ещё встретитесь. А может, она просто останется тёплым воспоминанием.',
    dark: false
  },
  bad: {
    title: '🚦 ОБОРВАННЫЙ РАЗГОВОР',
    text: 'Она машет рукой на прощание и шагает к дороге, не глядя по сторонам. Визг тормозов. Резкий звук. Экран гаснет. ...Ты так и не узнал её имени. Надо было погладить ту кошку. Надо было просто быть рядом.',
    dark: true
  }
};

// ================= ДВИЖОК =================
function setLocation(loc) {
  document.body.dataset.location = loc;
  bgLayer.style.setProperty('--bg-img', `url('${BACKGROUNDS[loc]}')`);
}

function setChars(list) {
  ['girl', 'cat', 'seller'].forEach(c => {
    const el = $('char-' + c);
    el.classList.toggle('visible', list.includes(c));
    if (list.includes(c)) el.style.display = '';
  });
}

function showTrustPopup(delta) {
  const p = $('trust-popup');
  p.textContent = (delta > 0 ? '+' : '') + delta + ' доверия';
  p.style.color = delta > 0 ? '#7dff9b' : '#ff7d7d';
  p.classList.remove('show'); void p.offsetWidth; p.classList.add('show');
}

function addTrust(delta) {
  if (!delta) return;
  state.trust += delta;
  $('trust-value').textContent = state.trust;
  showTrustPopup(delta);
}

function loadScene(key) {
  if (key === 'ENDING') return showEnding();
  const sc = scenes[key];
  state.scene = key; state.line = 0;
  setLocation(sc.loc);
  setChars(sc.chars);
  renderLine();
}

function renderLine() {
  const sc = scenes[state.scene];
  $('choices').classList.remove('active');
  $('choices').innerHTML = '';
  $('next-hint').style.display = 'block';

  if (state.line < sc.lines.length) {
    const [who, text] = sc.lines[state.line];
    $('speaker-name').textContent = who === 'Ты' ? state.name : who;
    $('dialogue-text').textContent = text.replaceAll('{name}', state.name);
  } else if (sc.choices) {
    $('next-hint').style.display = 'none';
    $('speaker-name').textContent = 'Выбор';
    $('dialogue-text').textContent = 'Что ты сделаешь?';
    const box = $('choices');
    sc.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = ch.text;
      btn.onclick = e => {
        e.stopPropagation();
        addTrust(ch.trust);
        loadScene(ch.next);
      };
      box.appendChild(btn);
    });
    box.classList.add('active');
  } else {
    loadScene(sc.next);
  }
}

function advance() {
  const sc = scenes[state.scene];
  if (state.line < sc.lines.length) { state.line++; renderLine(); }
  else if (!sc.choices) loadScene(sc.next);
}

function showEnding() {
  let key = state.trust >= 20 ? 'good' : state.trust >= 10 ? 'neutral' : 'bad';
  const e = endings[key];
  switchScreen('ending-screen');
  $('ending-title').textContent = e.title;
  $('ending-text').textContent = e.text;
  $('ending-score').textContent = `Итоговое доверие: ${state.trust} | ${state.name}`;
  $('ending-screen').classList.toggle('dark', e.dark);
}

function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ================= ЗАПУСК =================
$('start-btn').onclick = () => {
  const n = $('player-name').value.trim();
  state.name = n || 'Гость';
  state.trust = 0;
  $('hud-name').textContent = state.name;
  $('trust-value').textContent = '0';
  switchScreen('game-screen');
  loadScene('intro');
};

$('dialogue-box').onclick = advance;

$('restart-btn').onclick = () => {
  switchScreen('title-screen');
  document.body.dataset.location = 'street';
};

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && $('game-screen').classList.contains('active')) advance();
});