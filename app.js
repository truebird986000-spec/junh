// 홈 화면의 날짜와 하단 메뉴 반응만 담당합니다.
// 실제 미션·포인트·회원 데이터는 이후 단계에서 별도 모듈로 추가합니다.
const todayLabel = document.querySelector('#today-label');
const navItems = document.querySelectorAll('.nav-item');
let screenGroups;
const toast = document.querySelector('#toast');
const noticeButton = document.querySelector('[data-action="notice"]');
const airconCard = document.querySelector('#aircon-card');
const airconButtons = document.querySelectorAll('[data-aircon-state]');
const airconBadge = document.querySelector('#aircon-badge');
const powerState = document.querySelector('#power-state');
const statusCopy = document.querySelector('#aircon-status-copy');
const modeValue = document.querySelector('#mode-value');
const temperatureValue = document.querySelector('#temperature-value');
const fanValue = document.querySelector('#fan-value');
const runtimeValue = document.querySelector('#runtime-value');
const filterValue = document.querySelector('#filter-value');
const missionCard = document.querySelector('#mission-card');
const missionChip = document.querySelector('#mission-chip');
const missionProgressText = document.querySelector('#mission-progress-text');
const missionProgressNumber = document.querySelector('#mission-progress-number');
const missionProgressTrack = document.querySelector('.mission-progress-track');
const missionProgressBar = document.querySelector('#mission-progress-bar');
const missionMessage = document.querySelector('#mission-message');
const missionWarning = document.querySelector('#mission-warning');
const missionStartButton = document.querySelector('#mission-start');
const missionSimulateButton = document.querySelector('#mission-simulate');
const missionResetButton = document.querySelector('#mission-reset');
const pointBalanceElement = document.querySelector('#point-balance');
const walletNote = document.querySelector('#wallet-note');
const transactionTabs = document.querySelectorAll('[data-transaction-type]');
const transactionList = document.querySelector('#transaction-list');
const rewardCategories = document.querySelectorAll('[data-reward-category]');
const rewardGrid = document.querySelector('#reward-grid');
const rewardDetail = document.querySelector('#reward-detail');
const rewardDetailIcon = document.querySelector('#reward-detail-icon');
const rewardDetailCategory = document.querySelector('#reward-detail-category');
const rewardDetailTitle = document.querySelector('#reward-detail-title');
const rewardDetailDescription = document.querySelector('#reward-detail-description');
const rewardDetailPrice = document.querySelector('#reward-detail-price');
const rewardPurchaseNote = document.querySelector('#reward-purchase-note');
const rewardPurchaseButton = document.querySelector('#reward-purchase');
const rewardDetailClose = document.querySelector('#reward-detail-close');
const purchaseList = document.querySelector('#purchase-list');
const authButton = document.querySelector('#auth-button');
const authBackdrop = document.querySelector('#auth-backdrop');
const authClose = document.querySelector('#auth-close');
const authTabs = document.querySelectorAll('[data-auth-mode]');
const authForm = document.querySelector('#auth-form');
const authNameField = document.querySelector('#auth-name-field');
const authName = document.querySelector('#auth-name');
const authEmail = document.querySelector('#auth-email');
const authPassword = document.querySelector('#auth-password');
const authMessage = document.querySelector('#auth-message');
const authCaption = document.querySelector('#auth-caption');
const authSubmit = document.querySelector('#auth-submit');
const profileAvatar = document.querySelector('#profile-avatar');
const profileGreeting = document.querySelector('#profile-greeting');
const profileName = document.querySelector('#profile-name');
const profileLoginButton = document.querySelector('#profile-login-button');
const greenLevelTitle = document.querySelector('#green-level-title');
const greenLevelDescription = document.querySelector('#green-level-description');
const reportMissions = document.querySelector('#report-missions');
const reportEarned = document.querySelector('#report-earned');
const reportOrders = document.querySelector('#report-orders');
const reportMessage = document.querySelector('#report-message');
const logoutButton = document.querySelector('#logout-button');
const weatherIcon = document.querySelector('#weather-icon');
const weatherCondition = document.querySelector('#weather-condition');
const weatherMessage = document.querySelector('#weather-message');
const weatherTemperature = document.querySelector('#weather-temperature');
const weatherHumidity = document.querySelector('#weather-humidity');
const weatherSamples = document.querySelectorAll('[data-weather]');
const weatherSource = document.querySelector('#weather-source');
const weatherRefresh = document.querySelector('#weather-refresh');
const weatherMissionCondition = document.querySelector('#weather-mission-condition');
let toastTimer;

// 별도 이미지 파일을 사용하는 캐릭터 카드는 홈 화면에만 표시합니다.
const characterCard = document.createElement('aside');
characterCard.className = 'character-card';
characterCard.dataset.screen = 'home';
characterCard.setAttribute('aria-label', 'GreenON 캐릭터');
const characterImage = document.createElement('img');
characterImage.src = '/assets/greenon-mascot-v2.png';
characterImage.alt = '새싹을 든 GreenON 에어컨 로봇 캐릭터';
const characterCopy = document.createElement('span');
characterCopy.innerHTML = 'GreenON 친구가<br />오늘의 쿨링을 함께해요';
characterCard.append(characterImage, characterCopy);
document.querySelector('.weather-card')?.before(characterCard);

// 기존 마크업을 보존하면서 메뉴별 콘텐츠를 실제 앱 화면 단위로 묶습니다.
const screenSelectors = {
  홈:['#today-label', 'h1', '.intro', '.character-card', '.weather-card', '#aircon-card', '.simulation-panel', '.getting-started'],
  미션:['#mission-card'],
  리워드:['.wallet-card', '#reward-shop'],
  마이:['#my-page'],
};
screenGroups = Object.fromEntries(Object.entries(screenSelectors).map(([name, selectors]) => [name, selectors.map((selector) => document.querySelector(selector)).filter(Boolean)]));
Object.entries(screenGroups).forEach(([name, elements]) => elements.forEach((element) => element.dataset.screen = name === '홈' ? 'home' : name === '미션' ? 'mission' : name === '리워드' ? 'reward' : 'my'));

// 사용자가 읽기 편한 한국어 날짜를 홈 화면 상단에 표시합니다.
const today = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(new Date());
todayLabel.textContent = `${today} · GREEN COOLING LIFE`;

// 아직 구현되지 않은 메뉴도 선택 상태와 안내 메시지는 정상적으로 작동하게 합니다.
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

// 한 화면을 길게 스크롤하는 대신, 하단 메뉴마다 독립적인 앱 화면처럼 전환합니다.
function showScreen(viewName) {
  Object.entries(screenGroups).forEach(([screenName, elements]) => {
    elements.forEach((element) => {
      const isCurrent = screenName === viewName;
      element.hidden = !isCurrent;
      element.classList.toggle('screen-active', isCurrent);
    });
  });
  navItems.forEach((navItem) => {
    const isCurrent = navItem.dataset.view === viewName;
    navItem.classList.toggle('active', isCurrent);
    navItem.toggleAttribute('aria-current', isCurrent);
  });
  window.scrollTo({ top:0, behavior:'smooth' });
}

navItems.forEach((item) => item.addEventListener('click', () => {
  navItems.forEach((navItem) => { navItem.classList.remove('active'); navItem.removeAttribute('aria-current'); });
  item.classList.add('active');
  item.setAttribute('aria-current', 'page');
  const viewName = item.dataset.view;
  showScreen(viewName);
  showToast(`${viewName} 화면으로 이동했어요.`);
}));

// MDN의 PointerEvent 패턴을 응용해 마우스가 있는 PC에서만 은은한 빛과 캐릭터 움직임을 더합니다.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelector('.app-shell').addEventListener('pointermove', (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  });
}

noticeButton.addEventListener('click', () => showToast('새로운 알림이 없어요. 오늘도 시원한 하루 되세요!'));

// 실제 Carrier API가 아니라, 교육용으로 준비한 가상 IoT 상태 데이터입니다.
const airconStates = {
  normal: { danger:false, badge:'CARRIER IoT · 연결됨', power:'ON', mode:'냉방', temperature:'24', fan:'자동', runtime:'2시간 10분', filter:'정상 · 깨끗해요', message:'쾌적하게 냉방 중이에요. 오늘도 그린 쿨링을 이어가요!', toast:'정상 냉방 상태로 변경했어요.' },
  filter: { danger:true, badge:'점검 알림 · 필터', power:'ON', mode:'냉방', temperature:'24', fan:'약풍', runtime:'2시간 10분', filter:'점검 필요 · 먼지 감지', message:'필터 점검이 필요해요. 청소 후 더 건강하게 냉방해요.', toast:'필터 점검 상태를 시뮬레이션하고 있어요.' },
  sensor: { danger:true, badge:'오류 알림 · 센서', power:'ON', mode:'확인 필요', temperature:'--', fan:'확인 필요', runtime:'2시간 10분', filter:'센서 확인 필요', message:'온도 센서 데이터를 읽을 수 없어요. 제품 상태를 확인해 주세요.', toast:'센서 오류 상태를 시뮬레이션하고 있어요.' },
  off: { danger:true, badge:'연결 알림 · 전원', power:'OFF', mode:'대기', temperature:'--', fan:'정지', runtime:'2시간 10분', filter:'전원 켜짐 후 확인', message:'에어컨 전원이 꺼져 있어요. 필요할 때만 켜는 습관도 멋져요!', toast:'전원 OFF 상태를 시뮬레이션하고 있어요.' },
};
let currentAirconState = 'normal';
let remoteTargetTemperature = 24;
let remoteFanMode = '자동';
let missionStatus = 'ready';
let missionMinutes = 0;
const missionTotalMinutes = 120;

// 어느 메뉴에서도 에어컨을 조작할 수 있도록 앱 셸에 공통 리모컨을 한 번만 추가합니다.
const remoteControl = document.createElement('aside');
remoteControl.className = 'remote-control';
remoteControl.setAttribute('aria-label', '에어컨 공통 리모컨');
remoteControl.innerHTML = `
  <button class="remote-toggle" type="button" aria-expanded="true"><span aria-hidden="true">⌁</span> 리모컨</button>
  <div class="remote-panel">
    <div class="remote-display"><span>COOL</span><strong id="remote-temperature">24°</strong><small id="remote-fan">자동</small></div>
    <div class="remote-buttons">
      <button type="button" data-remote-action="power" aria-label="전원 켜기 또는 끄기">⏻</button>
      <button type="button" data-remote-action="temperature-down" aria-label="온도 낮추기">−</button>
      <button type="button" data-remote-action="temperature-up" aria-label="온도 높이기">＋</button>
      <button type="button" data-remote-action="fan" aria-label="바람 세기 변경">♧</button>
    </div>
  </div>`;
document.querySelector('.app-shell').append(remoteControl);
const remoteTemperature = remoteControl.querySelector('#remote-temperature');
const remoteFan = remoteControl.querySelector('#remote-fan');

remoteControl.querySelector('.remote-toggle').addEventListener('click', (event) => {
  const isCollapsed = remoteControl.classList.toggle('collapsed');
  event.currentTarget.setAttribute('aria-expanded', String(!isCollapsed));
});
// PHASE 4에서는 Supabase 연결 전까지 브라우저 localStorage를 임시 지갑으로 사용합니다.
const walletStorageKeys = { balance:'greenon-point-balance', transactions:'greenon-point-transactions', rewardedDay:'greenon-mission-rewarded-day', orders:'greenon-reward-orders', profile:'greenon-demo-profile', session:'greenon-demo-session' };
let selectedTransactionType = 'earn';
let selectedRewardCategory = 'ALL';
let selectedRewardId = null;
let rewards = [
  { id:'coffee-coupon', category:'FOOD', icon:'☕', title:'친환경 카페 쿠폰', description:'텀블러와 함께 즐기는 시원한 음료 쿠폰이에요.', price:120 },
  { id:'snack-set', category:'FOOD', icon:'🍪', title:'그린 간식 세트', description:'가벼운 휴식에 어울리는 친환경 간식이에요.', price:180 },
  { id:'eco-bag', category:'LIFE', icon:'👜', title:'리유저블 에코백', description:'일상에서 오래 사용할 수 있는 가벼운 에코백이에요.', price:260 },
  { id:'plant-kit', category:'LIFE', icon:'🪴', title:'미니 플랜트 키트', description:'내 공간을 푸르게 채우는 작은 식물 키트예요.', price:340 },
  { id:'filter-care', category:'CARRIER', icon:'❄', title:'필터 케어 알림 서비스', description:'쾌적한 냉방을 위한 필터 관리 리마인더예요.', price:200 },
  { id:'carrier-care', category:'CARRIER', icon:'✦', title:'Carrier 케어 패키지', description:'그린 쿨링을 위한 캐리어 케어 혜택이에요.', price:500 },
];

const rewardImageBySlug = {
  'coffee-coupon':'/reward/eco-coffee-coupon.png', 'snack-set':'/reward/eco-snack-set.png',
  'eco-bag':'/reward/reusable-eco-bag.png', 'plant-kit':'/reward/mini-plant-kit.png',
  'filter-care':'/reward/filter-care-kit.png', 'carrier-care':'/reward/carrier-care-package.png',
};
const getRewardImage = (slug) => rewardImageBySlug[slug] || '/reward/carrier-care-package.png';

function loadTemporaryWallet() {
  try {
    const storedBalance = Number(localStorage.getItem(walletStorageKeys.balance));
    const storedTransactions = JSON.parse(localStorage.getItem(walletStorageKeys.transactions) || '[]');
    return { balance:Number.isFinite(storedBalance) ? storedBalance : 0, transactions:Array.isArray(storedTransactions) ? storedTransactions : [] };
  } catch {
    // 저장소를 사용할 수 없는 브라우저에서도 화면은 0P 상태로 계속 이용할 수 있습니다.
    return { balance:0, transactions:[] };
  }
}

const temporaryWallet = loadTemporaryWallet();
let pointBalance = temporaryWallet.balance;
let pointTransactions = temporaryWallet.transactions;
let rewardOrders = loadTemporaryOrders();

function loadTemporaryOrders() {
  try {
    const storedOrders = JSON.parse(localStorage.getItem(walletStorageKeys.orders) || '[]');
    return Array.isArray(storedOrders) ? storedOrders : [];
  } catch {
    return [];
  }
}

// PHASE 6의 계정은 Supabase 연결 전까지 사용하는 체험용 프로필/세션입니다.
// 비밀번호는 브라우저 저장소에 기록하지 않고 입력 유효성 확인에만 사용합니다.
function loadTemporaryUser(storageKey) {
  try {
    const user = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return user && typeof user.name === 'string' && typeof user.email === 'string' ? user : null;
  } catch {
    return null;
  }
}

let currentUser = loadTemporaryUser(walletStorageKeys.session);
let authMode = 'login';
let supabaseClient = null;
let usingSupabase = false;
let activeMissionId = null;
const weatherSamplesData = {
  sunny: { icon:'☀', condition:'맑고 더워요', temperature:31, humidity:55, message:'시원하고 알뜰한 24°C 냉방을 추천해요.', mission:'맑은 날: 알뜰한 24°C 냉방 실천' },
  rainy: { icon:'☂', condition:'비가 오고 습해요', temperature:26, humidity:82, message:'자동 FAN으로 습도를 편안하게 관리해요.', mission:'습한 날: 자동 FAN과 필터 정상 상태 유지' },
  heatwave: { icon:'♨', condition:'폭염 주의', temperature:35, humidity:63, message:'급격히 낮추지 말고 24°C를 유지해요.', mission:'폭염: 설정 온도 24°C를 지켜 에너지를 아껴요' },
};
let selectedWeather = 'sunny';

function saveTemporaryUser(user) {
  try {
    localStorage.setItem(walletStorageKeys.profile, JSON.stringify(user));
    localStorage.setItem(walletStorageKeys.session, JSON.stringify(user));
  } catch {
    // 체험용 저장소를 쓸 수 없어도 현재 화면에서 로그인 상태를 사용할 수 있습니다.
  }
}

function clearTemporarySession() {
  try { localStorage.removeItem(walletStorageKeys.session); } catch { /* 저장소 미지원 환경 */ }
}

function saveTemporaryWallet() {
  try {
    localStorage.setItem(walletStorageKeys.balance, String(pointBalance));
    localStorage.setItem(walletStorageKeys.transactions, JSON.stringify(pointTransactions));
    localStorage.setItem(walletStorageKeys.orders, JSON.stringify(rewardOrders));
  } catch {
    // 개인정보나 비밀키를 저장하지 않으므로, 저장 실패 시에도 현재 화면의 상태는 유지합니다.
  }
}

function formatPoint(value) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

function getGreenLevel(points) {
  if (points >= 500) return { name:'FOREST', description:'지속 가능한 냉방 습관을 넓게 퍼뜨리고 있어요!' };
  if (points >= 200) return { name:'LEAF', description:'꾸준한 그린 실천이 아름답게 자라고 있어요.' };
  return { name:'SEED', description:'첫 번째 친환경 습관을 시작해 보세요.' };
}

// 로그인 여부에 맞춰 MY 페이지와 GREEN REPORT를 갱신합니다.
function renderMyPage() {
  const level = getGreenLevel(pointBalance);
  const earnedPoints = pointTransactions.filter((transaction) => transaction.type === 'earn').reduce((total, transaction) => total + transaction.amount, 0);
  const missionCount = pointTransactions.filter((transaction) => transaction.type === 'earn' && transaction.title.includes('GREEN MISSION')).length;
  greenLevelTitle.textContent = level.name;
  greenLevelDescription.textContent = level.description;
  reportMissions.textContent = String(missionCount);
  reportEarned.textContent = `${formatPoint(earnedPoints)}P`;
  reportOrders.textContent = String(rewardOrders.length);

  if (!currentUser) {
    authButton.textContent = '로그인';
    profileAvatar.textContent = 'G';
    profileGreeting.textContent = 'GreenON 친구, 반가워요!';
    profileName.textContent = '로그인하고 나만의 그린 기록을 시작해요';
    profileLoginButton.hidden = false;
    profileLoginButton.textContent = '로그인';
    logoutButton.hidden = true;
    reportMessage.textContent = '로그인하면 나만의 그린 리포트를 확인할 수 있어요.';
    return;
  }
  authButton.textContent = 'MY';
  profileAvatar.textContent = currentUser.name.trim().slice(0, 1).toUpperCase();
  profileGreeting.textContent = `${currentUser.name}님, 오늘도 반가워요!`;
  profileName.textContent = currentUser.email;
  profileLoginButton.hidden = true;
  logoutButton.hidden = false;
  reportMessage.textContent = `${currentUser.name}님의 그린 쿨링 실천이 지구를 더 시원하게 만들고 있어요.`;
}

// 인증이 끝난 직후 MY 화면으로 이동해 로그인 성공 상태를 분명하게 보여 줍니다.
function revealLoggedInMyPage() {
  renderMyPage();
  showScreen('마이');
}

function renderAuthMode() {
  const isSignup = authMode === 'signup';
  authTabs.forEach((tab) => {
    const isSelected = tab.dataset.authMode === authMode;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
  });
  authNameField.hidden = !isSignup;
  authSubmit.textContent = isSignup ? '회원가입하고 시작하기' : '로그인하기';
  authCaption.textContent = isSignup
    ? '체험용 프로필만 이 기기에 저장되며, 비밀번호는 저장하지 않아요.'
    : '가입한 체험용 이메일과 4자 이상의 비밀번호를 입력해 주세요.';
  authMessage.hidden = true;
}

function openAuth(mode = 'login') {
  authMode = mode;
  renderAuthMode();
  authBackdrop.hidden = false;
  setTimeout(() => (authMode === 'signup' ? authName : authEmail).focus(), 0);
}

function showAuthError(message) {
  authMessage.textContent = message;
  authMessage.hidden = false;
}

// 교육용 날씨 데이터와 외부 API 데이터를 같은 화면 형식으로 표시합니다.
function renderWeather(weather, source = 'sample') {
  weatherIcon.textContent = weather.icon || '☀';
  weatherCondition.textContent = weather.condition || '현재 날씨';
  weatherTemperature.textContent = String(Math.round(Number(weather.temperature)));
  weatherHumidity.textContent = String(Math.round(Number(weather.humidity)));
  weatherMessage.textContent = weather.message || '오늘의 날씨에 맞는 친환경 냉방을 추천해요.';
  weatherMissionCondition.textContent = weather.mission || '오늘 날씨에 맞춘 친환경 냉방 실천';
  weatherSource.textContent = source === 'api' ? '연결된 날씨 API 데이터를 표시하고 있어요.' : '현재는 교육용 샘플 날씨 데이터예요.';
  weatherSamples.forEach((button) => button.classList.toggle('active', button.dataset.weather === selectedWeather));
}

async function refreshWeatherFromApi() {
  const weatherApiUrl = window.__GREENON_CONFIG?.weatherApiUrl;
  if (!weatherApiUrl) {
    renderWeather(weatherSamplesData[selectedWeather]);
    showToast('WEATHER_API_URL이 없어 샘플 날씨를 보여드려요.');
    return;
  }
  try {
    const response = await fetch(weatherApiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    // Open-Meteo 형식과 간단한 커스텀 API 형식을 모두 받을 수 있게 둡니다.
    const temperature = payload.temperature ?? payload.current?.temperature_2m;
    const humidity = payload.humidity ?? payload.current?.relative_humidity_2m;
    if (!Number.isFinite(Number(temperature)) || !Number.isFinite(Number(humidity))) throw new Error('온도 또는 습도 값이 없습니다.');
    renderWeather({
      icon: payload.icon || '☀',
      condition: payload.condition || '실시간 날씨',
      temperature,
      humidity,
      message: payload.message || '실시간 날씨에 맞춰 쾌적한 냉방을 추천해요.',
      mission: payload.mission || '실시간 날씨: 24°C 알뜰 냉방 실천',
    }, 'api');
    showToast('현재 날씨를 새로 불러왔어요.');
  } catch (error) {
    renderWeather(weatherSamplesData[selectedWeather]);
    showToast(`날씨 API 연결에 실패해 샘플 데이터를 보여드려요: ${error.message}`);
  }
}

function toCurrentUser(user) {
  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'GreenON 사용자',
    email: user.email || '',
  };
}

function formatRemoteDate(value) {
  if (!value) return '방금 전';
  return new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric' }).format(new Date(value));
}

function clearLegacyLocalData() {
  try {
    [walletStorageKeys.balance, walletStorageKeys.transactions, walletStorageKeys.rewardedDay, walletStorageKeys.orders, walletStorageKeys.profile, walletStorageKeys.session]
      .forEach((key) => localStorage.removeItem(key));
  } catch { /* 저장소 미지원 환경 */ }
}

// Supabase에 저장된 사용자별 미션·포인트·구매·에어컨 데이터를 한 번에 불러옵니다.
async function loadSupabaseData() {
  if (!supabaseClient || !currentUser?.id) return;
  const [profileResult, missionResult, pointResult, rewardResult, orderResult, airconResult] = await Promise.all([
    supabaseClient.from('profiles').select('full_name, green_level').eq('id', currentUser.id).maybeSingle(),
    supabaseClient.from('missions').select('id, slug, title, description, target_minutes, target_temperature, reward_points').eq('is_active', true).limit(1),
    supabaseClient.from('point_transactions').select('transaction_type, amount, reason, created_at').eq('user_id', currentUser.id).order('created_at', { ascending:false }),
    supabaseClient.from('rewards').select('id, slug, category, title, description, point_price').eq('is_active', true).order('id'),
    supabaseClient.from('reward_orders').select('id, point_price, created_at, rewards(title, category)').eq('user_id', currentUser.id).order('created_at', { ascending:false }),
    supabaseClient.from('aircon_status').select('*').eq('user_id', currentUser.id).maybeSingle(),
  ]);
  const firstError = [profileResult, missionResult, pointResult, rewardResult, orderResult, airconResult].find((result) => result.error)?.error;
  if (firstError) {
    showToast(`Supabase 데이터를 불러오지 못했어요: ${firstError.message}`);
    return;
  }
  if (profileResult.data?.full_name) currentUser.name = profileResult.data.full_name;
  activeMissionId = missionResult.data?.[0]?.id || null;
  pointTransactions = (pointResult.data || []).map((item) => ({ type:item.transaction_type, title:item.reason, date:formatRemoteDate(item.created_at), amount:item.amount }));
  pointBalance = pointTransactions.reduce((total, item) => total + (item.type === 'earn' ? item.amount : -item.amount), 0);
  if (rewardResult.data?.length) {
    rewards = rewardResult.data.map((item) => ({
      id:item.id, category:item.category, title:item.title, description:item.description, price:item.point_price, image:getRewardImage(item.slug),
      icon:item.category === 'FOOD' ? '☕' : item.category === 'LIFE' ? '🪴' : '❄',
    }));
  }
  rewardOrders = (orderResult.data || []).map((item) => ({
    title:item.rewards?.title || '리워드', category:item.rewards?.category || 'GREENON', icon:item.rewards?.category === 'FOOD' ? '☕' : item.rewards?.category === 'LIFE' ? '🪴' : '❄', price:item.point_price, date:formatRemoteDate(item.created_at),
  }));
  if (airconResult.data) {
    const status = airconResult.data;
    const stateName = !status.power_on ? 'off' : status.filter_status === 'sensor_error' ? 'sensor' : status.filter_status === 'check_required' ? 'filter' : 'normal';
    renderAirconState(stateName, true);
  }
  clearLegacyLocalData();
  renderWallet();
  renderRewardShop();
  renderPurchaseHistory();
  renderMyPage();
}

async function syncAirconToSupabase() {
  if (!supabaseClient || !currentUser?.id) return;
  const status = airconStates[currentAirconState];
  const payload = {
    user_id: currentUser.id,
    power_on: status.power === 'ON',
    mode: status.power === 'OFF' ? 'off' : 'cool',
    target_temperature: status.temperature === '--' ? 24 : Number(status.temperature),
    fan_mode: status.fan === '약풍' ? 'low' : 'auto',
    usage_minutes: 130 + missionMinutes,
    filter_status: currentAirconState === 'filter' ? 'check_required' : currentAirconState === 'sensor' ? 'sensor_error' : 'normal',
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabaseClient.from('aircon_status').upsert(payload, { onConflict:'user_id' });
  if (error) showToast(`에어컨 상태 저장 실패: ${error.message}`);
}

async function completeMissionInSupabase() {
  if (!supabaseClient || !activeMissionId) {
    showToast('활성 미션 정보를 찾지 못했어요.');
    return;
  }
  const { data, error } = await supabaseClient.rpc('complete_green_mission', { p_mission_id:activeMissionId });
  if (error) {
    missionMessage.textContent = `미션 저장 실패: ${error.message}`;
    return;
  }
  await loadSupabaseData();
  missionMessage.textContent = data.awarded ? `GREEN POINT ${data.reward_points}P가 지갑에 적립되었어요!` : '오늘의 GREEN POINT 보상은 이미 지급되었어요.';
  showToast(data.awarded ? '미션 성공과 포인트 적립을 저장했어요!' : '오늘 미션은 이미 완료했어요.');
}

async function purchaseRewardInSupabase(reward) {
  const { error } = await supabaseClient.rpc('purchase_green_reward', { p_reward_id:reward.id });
  if (error) {
    openRewardDetail(reward.id);
    rewardPurchaseNote.textContent = error.message.includes('Insufficient') ? '포인트가 부족해요.' : `구매 처리 실패: ${error.message}`;
    rewardDetail.classList.add('insufficient');
    return;
  }
  await loadSupabaseData();
  rewardDetail.hidden = true;
  showToast(`${reward.title} 구매가 완료되었어요!`);
}

async function initializeSupabase() {
  const config = window.__GREENON_CONFIG;
  if (!config?.supabaseUrl || !config?.supabasePublishableKey) return;
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.57.0');
    supabaseClient = createClient(config.supabaseUrl, config.supabasePublishableKey);
    usingSupabase = true;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
      currentUser = toCurrentUser(session.user);
      await loadSupabaseData();
    } else {
      currentUser = null;
      pointBalance = 0;
      pointTransactions = [];
      rewardOrders = [];
      renderWallet();
      renderPurchaseHistory();
      renderMyPage();
    }
    // 인증 이벤트 안에서 데이터를 기다리면 화면 갱신이 늦어질 수 있습니다.
    // 먼저 로그인 표시를 바꾸고, 사용자 데이터는 뒤에서 안전하게 불러옵니다.
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user ? toCurrentUser(session.user) : null;
      if (currentUser) {
        renderMyPage();
        void loadSupabaseData();
      }
      else renderMyPage();
    });
  } catch (error) {
    usingSupabase = false;
    console.error('Supabase 초기화 실패', error);
    showToast('Supabase 연결을 시작하지 못해 체험 모드로 실행 중이에요.');
  }
}

// 적립/사용 내역을 탭별로 안전하게 DOM 요소로 만들어 표시합니다.
function renderWallet() {
  pointBalanceElement.textContent = formatPoint(pointBalance);
  walletNote.textContent = pointBalance > 0 ? '친환경 냉방 실천으로 모은 소중한 포인트예요.' : '미션을 성공하면 GREEN POINT가 적립돼요.';
  transactionTabs.forEach((tab) => {
    const isSelected = tab.dataset.transactionType === selectedTransactionType;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
  });
  const transactions = pointTransactions.filter((transaction) => transaction.type === selectedTransactionType);
  transactionList.replaceChildren();
  if (transactions.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'transaction-empty';
    empty.innerHTML = `<span aria-hidden="true">${selectedTransactionType === 'earn' ? '✦' : '○'}</span>${selectedTransactionType === 'earn' ? '아직 적립 내역이 없어요.' : '아직 사용 내역이 없어요.'}`;
    transactionList.append(empty);
    return;
  }
  transactions.slice(0, 5).forEach((transaction) => {
    const item = document.createElement('li');
    item.className = 'transaction-item';
    const icon = document.createElement('span');
    icon.className = 'transaction-icon';
    icon.textContent = transaction.type === 'earn' ? '＋' : '−';
    const copy = document.createElement('span');
    copy.className = 'transaction-copy';
    const title = document.createElement('strong');
    title.textContent = transaction.title;
    const date = document.createElement('span');
    date.textContent = transaction.date;
    const amount = document.createElement('strong');
    amount.className = 'transaction-amount';
    amount.textContent = `${transaction.type === 'earn' ? '+' : '-'}${formatPoint(transaction.amount)}P`;
    copy.append(title, date);
    item.append(icon, copy, amount);
    transactionList.append(item);
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// 같은 날 같은 미션 보상은 한 번만 지급해 중복 적립을 방지합니다.
function awardMissionPoint() {
  if (usingSupabase) {
    void completeMissionInSupabase();
    return 'remote';
  }
  try {
    if (localStorage.getItem(walletStorageKeys.rewardedDay) === todayKey()) return false;
    localStorage.setItem(walletStorageKeys.rewardedDay, todayKey());
  } catch {
    // 저장소가 없으면 현재 세션의 보상만 처리하며, 포인트 중복 지급은 뒤 단계의 DB에서 보장합니다.
  }
  const reward = 120;
  pointBalance += reward;
  pointTransactions.unshift({ type:'earn', title:'오늘의 GREEN MISSION 성공', date:'방금 전', amount:reward });
  saveTemporaryWallet();
  renderWallet();
  renderMyPage();
  return true;
}

function formatOrderDate() {
  return new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric' }).format(new Date());
}

// 선택된 카테고리에 맞는 리워드 상품 목록을 안전한 DOM 요소로 렌더링합니다.
function renderRewardShop() {
  rewardCategories.forEach((category) => {
    const isSelected = category.dataset.rewardCategory === selectedRewardCategory;
    category.classList.toggle('active', isSelected);
    category.setAttribute('aria-selected', String(isSelected));
  });
  rewardGrid.replaceChildren();
  rewards.filter((reward) => selectedRewardCategory === 'ALL' || reward.category === selectedRewardCategory).forEach((reward) => {
    const card = document.createElement('article');
    card.className = 'reward-product';
    const icon = document.createElement('img'); icon.className = 'reward-product-icon'; icon.src = reward.image || getRewardImage(reward.id); icon.alt = `${reward.title} 상품 이미지`;
    const category = document.createElement('p'); category.className = 'reward-product-category'; category.textContent = reward.category;
    const title = document.createElement('h3'); title.textContent = reward.title;
    const price = document.createElement('p'); price.className = 'reward-product-price'; price.textContent = `${formatPoint(reward.price)}P`;
    const button = document.createElement('button'); button.className = 'reward-product-button'; button.type = 'button'; button.textContent = '상품 상세';
    button.addEventListener('click', () => openRewardDetail(reward.id));
    card.append(icon, category, title, price, button);
    rewardGrid.append(card);
  });
}

function openRewardDetail(rewardId) {
  const reward = rewards.find((item) => item.id === rewardId);
  if (!reward) return;
  selectedRewardId = reward.id;
  const shortage = reward.price - pointBalance;
  rewardDetailIcon.replaceChildren();
  const detailImage = document.createElement('img');
  detailImage.src = reward.image || getRewardImage(reward.id);
  detailImage.alt = `${reward.title} 상품 이미지`;
  rewardDetailIcon.append(detailImage);
  rewardDetailCategory.textContent = reward.category;
  rewardDetailTitle.textContent = reward.title;
  rewardDetailDescription.textContent = reward.description;
  rewardDetailPrice.textContent = formatPoint(reward.price);
  rewardDetail.classList.toggle('insufficient', shortage > 0);
  rewardPurchaseNote.textContent = shortage > 0 ? `포인트가 ${formatPoint(shortage)}P 부족해요.` : `현재 ${formatPoint(pointBalance)}P로 구매할 수 있어요.`;
  rewardPurchaseButton.textContent = shortage > 0 ? '포인트가 부족해요' : '포인트로 구매하기';
  rewardDetail.hidden = false;
  rewardDetail.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function renderPurchaseHistory() {
  purchaseList.replaceChildren();
  if (rewardOrders.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'purchase-empty';
    empty.textContent = '아직 구매한 리워드가 없어요.';
    purchaseList.append(empty);
    return;
  }
  rewardOrders.slice(0, 5).forEach((order) => {
    const item = document.createElement('li'); item.className = 'purchase-item';
    const icon = document.createElement('span'); icon.className = 'purchase-item-icon'; icon.textContent = order.icon;
    const copy = document.createElement('span'); copy.className = 'purchase-copy';
    const title = document.createElement('strong'); title.textContent = order.title;
    const date = document.createElement('span'); date.textContent = `${order.category} · ${order.date}`;
    const price = document.createElement('strong'); price.className = 'purchase-price'; price.textContent = `-${formatPoint(order.price)}P`;
    copy.append(title, date); item.append(icon, copy, price); purchaseList.append(item);
  });
}

// 구매 시 잔액을 확인한 뒤 포인트 사용 내역과 구매 내역을 함께 기록합니다.
function purchaseSelectedReward() {
  const reward = rewards.find((item) => item.id === selectedRewardId);
  if (!reward) return;
  if (usingSupabase) {
    void purchaseRewardInSupabase(reward);
    return;
  }
  if (pointBalance < reward.price) {
    openRewardDetail(reward.id);
    showToast('포인트가 부족해요. 미션을 완료하고 다시 도전해 주세요.');
    return;
  }
  pointBalance -= reward.price;
  pointTransactions.unshift({ type:'use', title:`${reward.title} 구매`, date:'방금 전', amount:reward.price });
  rewardOrders.unshift({ title:reward.title, category:reward.category, icon:reward.icon, price:reward.price, date:formatOrderDate() });
  saveTemporaryWallet();
  renderWallet();
  renderPurchaseHistory();
  renderMyPage();
  rewardDetail.hidden = true;
  showToast(`${reward.title} 구매가 완료되었어요!`);
}

// 선택한 가상 상태를 모든 카드 항목에 반영하고, 비정상인 경우에만 Red UI로 전환합니다.
function renderAirconState(stateName, silent = false) {
  const state = airconStates[stateName];
  currentAirconState = stateName;
  airconCard.classList.toggle('status-danger', state.danger);
  airconCard.classList.toggle('status-normal', !state.danger);
  airconBadge.textContent = state.badge;
  powerState.textContent = state.power;
  statusCopy.textContent = state.message;
  modeValue.textContent = state.mode;
  temperatureValue.textContent = stateName === 'normal' ? remoteTargetTemperature : state.temperature;
  fanValue.textContent = stateName === 'normal' ? remoteFanMode : state.fan;
  runtimeValue.textContent = state.runtime;
  filterValue.textContent = state.filter;
  remoteTemperature.textContent = stateName === 'off' ? '--°' : `${stateName === 'normal' ? remoteTargetTemperature : state.temperature}°`;
  remoteFan.textContent = stateName === 'normal' ? remoteFanMode : state.power;
  remoteControl.classList.toggle('is-off', stateName === 'off');
  airconButtons.forEach((button) => button.classList.toggle('active', button.dataset.airconState === stateName));
  // 진행 중에 조건이 바뀌면 즉시 Red 경고를 보여 주고, 다음 시간 진행에서 실패 처리합니다.
  if (missionStatus === 'running' && stateName !== 'normal') {
    missionWarning.textContent = '미션 조건 위반: 정상 냉방 상태로 되돌린 뒤 시간을 진행해 주세요.';
    missionWarning.hidden = false;
  }
  if (!silent) showToast(state.toast);
  if (usingSupabase && currentUser) void syncAirconToSupabase();
}

airconButtons.forEach((button) => button.addEventListener('click', () => renderAirconState(button.dataset.airconState)));

// 리모컨 입력은 현재 보이는 카드와 같은 상태 데이터를 바꾸므로 메뉴를 이동해도 조작 결과가 유지됩니다.
remoteControl.querySelectorAll('[data-remote-action]').forEach((button) => button.addEventListener('click', () => {
  const action = button.dataset.remoteAction;
  if (action === 'power') {
    renderAirconState(currentAirconState === 'off' ? 'normal' : 'off');
    return;
  }
  if (currentAirconState !== 'normal') renderAirconState('normal', true);
  if (action === 'temperature-down') remoteTargetTemperature = Math.max(18, remoteTargetTemperature - 1);
  if (action === 'temperature-up') remoteTargetTemperature = Math.min(30, remoteTargetTemperature + 1);
  if (action === 'fan') remoteFanMode = remoteFanMode === '자동' ? '강풍' : remoteFanMode === '강풍' ? '약풍' : '자동';
  renderAirconState('normal', true);
  showToast(action === 'fan' ? `바람 세기를 ${remoteFanMode}(으)로 바꿨어요.` : `희망 온도를 ${remoteTargetTemperature}°C로 바꿨어요.`);
}));

// 현재 가상 에어컨 상태가 미션의 정상 냉방 조건을 만족하는지 확인합니다.
function hasMissionCondition() {
  return currentAirconState === 'normal' && remoteTargetTemperature === 24;
}

function getMissionFailureMessage() {
  const reasons = { filter:'필터 점검이 필요한 상태입니다.', sensor:'온도 센서 오류가 감지되었습니다.', off:'에어컨 전원이 꺼져 있습니다.' };
  if (currentAirconState === 'normal' && remoteTargetTemperature !== 24) return '미션 실패: 리모컨의 희망 온도를 24°C로 맞춰 주세요.';
  return `미션 실패: ${reasons[currentAirconState] || '냉방 조건을 확인해 주세요.'}`;
}

// 진행 상태에 맞춰 버튼, 진행률, 안내 문구를 한곳에서 갱신합니다.
function renderMission(message) {
  const percent = Math.round((missionMinutes / missionTotalMinutes) * 100);
  missionCard.classList.remove('mission-ready', 'mission-running', 'mission-success', 'mission-failed');
  missionCard.classList.add(`mission-${missionStatus}`);
  missionProgressBar.style.width = `${percent}%`;
  missionProgressTrack.setAttribute('aria-valuenow', String(percent));
  missionProgressNumber.textContent = `${percent}%`;
  missionStartButton.hidden = missionStatus !== 'ready';
  missionSimulateButton.hidden = missionStatus !== 'running';
  missionResetButton.hidden = !['success', 'failed'].includes(missionStatus);
  missionWarning.hidden = missionStatus !== 'running' || hasMissionCondition();

  if (missionStatus === 'ready') {
    missionChip.textContent = '참여 전';
    missionProgressText.textContent = '미션 참여를 시작해 주세요';
    missionMessage.textContent = message || '정상 냉방 상태에서만 시간을 진행할 수 있어요.';
  } else if (missionStatus === 'running') {
    missionChip.textContent = '진행 중';
    missionProgressText.textContent = `${missionMinutes}분 / ${missionTotalMinutes}분 유지 중`;
    missionMessage.textContent = message || '정상 냉방 상태를 유지하며 시간을 진행해 보세요.';
  } else if (missionStatus === 'success') {
    missionChip.textContent = '성공';
    missionProgressText.textContent = '오늘의 미션을 달성했어요!';
    missionMessage.textContent = '다음 단계에서 GREEN POINT 120P를 지갑에 적립해 드려요.';
    missionResetButton.textContent = '완료 · 내일 다시 만나요';
    const awardResult = awardMissionPoint();
    missionMessage.textContent = awardResult === 'remote'
      ? '미션 성공 기록과 GREEN POINT 적립을 안전하게 저장하고 있어요.'
      : awardResult
        ? 'GREEN POINT 120P가 지갑에 적립되었어요!'
        : '오늘의 GREEN POINT 보상은 이미 지급되었어요.';
  } else {
    missionChip.textContent = '실패';
    missionProgressText.textContent = '미션 조건을 충족하지 못했어요';
    missionMessage.textContent = message || '조건을 확인한 뒤 다시 도전해 주세요.';
    missionResetButton.textContent = '다시 도전하기';
  }
}

missionStartButton.addEventListener('click', () => {
  if (!hasMissionCondition()) {
    missionStatus = 'failed';
    renderMission(getMissionFailureMessage());
    showToast('정상 냉방 상태에서 미션을 시작해 주세요.');
    return;
  }
  missionStatus = 'running';
  missionMinutes = 0;
  renderMission('미션에 참여했어요. +30분 버튼으로 냉방 시간을 시뮬레이션해 보세요.');
  showToast('오늘의 GREEN MISSION을 시작했어요!');
});

missionSimulateButton.addEventListener('click', () => {
  if (!hasMissionCondition()) {
    missionStatus = 'failed';
    renderMission(getMissionFailureMessage());
    showToast('미션 조건 위반으로 이번 미션이 종료되었어요.');
    return;
  }
  missionMinutes += 30;
  runtimeValue.textContent = `${Math.floor((130 + missionMinutes) / 60)}시간 ${(130 + missionMinutes) % 60}분`;
  if (missionMinutes >= missionTotalMinutes) {
    missionStatus = 'success';
    renderMission();
    showToast('미션 성공! GREEN POINT 적립을 준비하고 있어요.');
    return;
  }
  renderMission();
  showToast(`냉방 시간을 +30분 진행했어요. (${missionMinutes}분)`);
});

missionResetButton.addEventListener('click', () => {
  if (missionStatus === 'success') {
    showToast('오늘의 미션 보상은 이미 지급되었어요. 내일 다시 만나요!');
    return;
  }
  missionStatus = 'ready';
  missionMinutes = 0;
  runtimeValue.textContent = airconStates[currentAirconState].runtime;
  missionWarning.hidden = true;
  renderMission();
  showToast('오늘의 미션을 다시 준비했어요.');
});

transactionTabs.forEach((tab) => tab.addEventListener('click', () => {
  selectedTransactionType = tab.dataset.transactionType;
  renderWallet();
}));

rewardCategories.forEach((category) => category.addEventListener('click', () => {
  selectedRewardCategory = category.dataset.rewardCategory;
  renderRewardShop();
}));

rewardPurchaseButton.addEventListener('click', purchaseSelectedReward);
rewardDetailClose.addEventListener('click', () => { rewardDetail.hidden = true; });

authButton.addEventListener('click', () => {
  if (currentUser) {
    showScreen('마이');
    return;
  }
  openAuth('login');
});

profileLoginButton.addEventListener('click', () => openAuth('login'));
authClose.addEventListener('click', () => { authBackdrop.hidden = true; });
authTabs.forEach((tab) => tab.addEventListener('click', () => {
  authMode = tab.dataset.authMode;
  renderAuthMode();
}));

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = authName.value.trim();
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showAuthError('올바른 이메일 주소를 입력해 주세요.');
    return;
  }
  // Supabase Email 인증의 최소 비밀번호 길이는 6자이므로 화면 안내도 동일하게 맞춥니다.
  if (password.length < 6) {
    showAuthError('비밀번호는 6자 이상 입력해 주세요.');
    return;
  }
  if (usingSupabase) {
    if (authMode === 'signup') {
      if (name.length < 2) {
        showAuthError('이름은 두 글자 이상 입력해 주세요.');
        return;
      }
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name:name } },
      });
      if (error) {
        showAuthError(error.message);
        return;
      }
      authForm.reset();
      if (!data.session) {
        authCaption.textContent = '가입 확인 이메일을 보냈어요. 이메일 인증 후 로그인해 주세요.';
        showToast('이메일 인증을 완료하면 GreenON을 시작할 수 있어요.');
        return;
      }
      currentUser = toCurrentUser(data.user);
      authBackdrop.hidden = true;
      // 네트워크 응답을 기다리지 않고 즉시 로그인 상태를 화면에 보여 줍니다.
      revealLoggedInMyPage();
      void loadSupabaseData();
      showToast(`${name}님, GreenON 회원가입을 환영해요!`);
      return;
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      showAuthError(error.message);
      return;
    }
    currentUser = toCurrentUser(data.user);
    authBackdrop.hidden = true;
    authForm.reset();
    // 로그인 성공을 즉시 보이게 한 뒤, 지갑·미션 데이터는 비동기로 갱신합니다.
    revealLoggedInMyPage();
    void loadSupabaseData();
    showToast(`${currentUser.name}님, 다시 만나서 반가워요!`);
    return;
  }
  if (authMode === 'signup') {
    if (name.length < 2) {
      showAuthError('이름은 두 글자 이상 입력해 주세요.');
      return;
    }
    currentUser = { name, email };
    saveTemporaryUser(currentUser);
    authBackdrop.hidden = true;
    authForm.reset();
    renderMyPage();
    showToast(`${name}님, GreenON 회원가입을 환영해요!`);
    return;
  }
  const savedProfile = loadTemporaryUser(walletStorageKeys.profile);
  if (!savedProfile || savedProfile.email !== email) {
    showAuthError('가입한 체험 계정을 찾지 못했어요. 회원가입부터 진행해 주세요.');
    return;
  }
  currentUser = savedProfile;
  try { localStorage.setItem(walletStorageKeys.session, JSON.stringify(currentUser)); } catch { /* 저장소 미지원 환경 */ }
  authBackdrop.hidden = true;
  authForm.reset();
  renderMyPage();
  showToast(`${currentUser.name}님, 다시 만나서 반가워요!`);
});

logoutButton.addEventListener('click', async () => {
  if (usingSupabase) {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      showToast(`로그아웃 실패: ${error.message}`);
      return;
    }
    currentUser = null;
    pointBalance = 0;
    pointTransactions = [];
    rewardOrders = [];
    renderWallet();
    renderPurchaseHistory();
    renderMyPage();
    showToast('로그아웃했어요. 다음에 다시 만나요!');
    return;
  }
  currentUser = null;
  clearTemporarySession();
  renderMyPage();
  showToast('로그아웃했어요. 다음에 다시 만나요!');
});

weatherSamples.forEach((button) => button.addEventListener('click', () => {
  selectedWeather = button.dataset.weather;
  renderWeather(weatherSamplesData[selectedWeather]);
  showToast(`${weatherSamplesData[selectedWeather].condition} 샘플 날씨를 적용했어요.`);
}));

weatherRefresh.addEventListener('click', () => { void refreshWeatherFromApi(); });

// 처음 화면을 열었을 때에도 localStorage에 남아 있던 지갑 내역을 보여 줍니다.
renderWallet();
renderRewardShop();
renderPurchaseHistory();
renderMyPage();
renderWeather(weatherSamplesData[selectedWeather]);
showScreen('홈');
void initializeSupabase();
