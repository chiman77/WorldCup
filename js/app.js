(function App() {
  const TOURNAMENT_START = new Date(2026, 5, 11);
  const TOURNAMENT_END = new Date(2026, 6, 19);

  const state = {
    fixtures: [],
    scoreboard: [],
    merged: [],
    viewMode: 'byDate',
    currentDate: new Date(),
    selectedGroup: null,
    bracketRound: null,
  };

  const scheduleView = document.getElementById('scheduleView');
  const standingsView = document.getElementById('standingsView');
  const bracketView = document.getElementById('bracketView');
  const scheduleList = document.getElementById('scheduleList');
  const scheduleLoading = document.getElementById('scheduleLoading');
  const standingsLoading = document.getElementById('standingsLoading');
  const bracketLoading = document.getElementById('bracketLoading');
  const standingsContent = document.getElementById('standingsContent');
  const bracketContent = document.getElementById('bracketContent');

  I18n.applyTranslations();
  setupNav();
  setupFilters();
  setupLangToggle();
  setupMobileMenu();
  setupModal();

  loadAll();
  setInterval(pollScoreboard, 60000);

  async function loadAll() {
    showLoading(true);
    try {
      state.fixtures = await Api.fetchFixtures();
      state.scoreboard = await Api.fetchScoreboard();
      state.merged = Api.mergeData(state.fixtures, state.scoreboard);
      renderCurrentView();
      showLoading(false);
    } catch (e) {
      console.error('Failed to load data:', e);
      showLoading(false);
      scheduleList.innerHTML = `<div class="text-center text-gray-400 py-12 p-4"><p class="mb-2 font-bold">${I18n.t('error_title')}</p><p class="text-xs text-gray-500">${I18n.t('error_detail')}</p></div>`;
    }
  }

  async function pollScoreboard() {
    try {
      state.scoreboard = await Api.fetchScoreboard();
      state.merged = Api.mergeData(state.fixtures, state.scoreboard);
      renderCurrentView();
    } catch (e) {
      console.error('Poll error:', e);
    }
  }

  function renderCurrentView() {
    const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab || 'schedule';
    if (activeTab === 'schedule') {
      scheduleList.innerHTML = Schedule.render(state.merged, state.viewMode, state.currentDate, state.selectedGroup);
    } else if (activeTab === 'standings') {
      standingsContent.innerHTML = Standings.render(state.merged, state.selectedGroup);
    } else if (activeTab === 'bracket') {
      if (!state.bracketRound) {
        state.bracketRound = Bracket.getDefaultRound(state.merged);
      }
      bracketContent.innerHTML = Bracket.render(state.merged, state.bracketRound);
    }
  }

  function showLoading(show) {
    scheduleLoading.classList.toggle('hidden', !show);
    standingsLoading.classList.toggle('hidden', !show);
    bracketLoading.classList.toggle('hidden', !show);
    if (show) {
      scheduleList.innerHTML = '';
      standingsContent.innerHTML = '';
      bracketContent.innerHTML = '';
    }
  }

  function setupNav() {
    document.querySelectorAll('.nav-tab, .mobile-nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll(`.nav-tab[data-tab="${target}"]`).forEach(t => t.classList.add('active'));
        document.querySelectorAll(`.mobile-nav-tab[data-tab="${target}"]`).forEach(t => t.classList.add('active'));

        scheduleView.classList.toggle('hidden', target !== 'schedule');
        standingsView.classList.toggle('hidden', target !== 'standings');
        bracketView.classList.toggle('hidden', target !== 'bracket');

        renderCurrentView();
        if (target !== 'bracket') state.bracketRound = null;
        document.getElementById('mobileNav')?.classList.add('hidden');
      });
    });
  }

  function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.viewMode = btn.dataset.filter;
        renderCurrentView();
      });
    });
  }

  function setupLangToggle() {
    document.getElementById('langToggle')?.addEventListener('click', () => {
      I18n.toggleLang();
      I18n.applyTranslations();
      renderCurrentView();
    });
  }

  function setupMobileMenu() {
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('mobileNav')?.classList.toggle('hidden');
    });
  }

  function setupModal() {
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  }

  function closeModal() {
    document.getElementById('matchModal')?.classList.add('hidden');
  }

  window.App = {
    showMatchDetail(matchId) {
      const match = state.merged.find(m => m.id === matchId);
      if (!match) return;
      const modal = document.getElementById('matchModal');
      const body = document.getElementById('modalBody');
      body.innerHTML = MatchDetail.render(match);
      modal.classList.remove('hidden');
    },
    closeMatchDetail: closeModal,
    setDate(d) {
      const clamped = new Date(Math.max(TOURNAMENT_START.getTime(), Math.min(TOURNAMENT_END.getTime(), d.getTime())));
      state.currentDate = clamped;
      renderCurrentView();
    },
    setGroup(g) {
      state.selectedGroup = (g === 'all' || !g) ? null : g;
      renderCurrentView();
    },
    setBracketRound(key) {
      state.bracketRound = key;
      renderCurrentView();
    },
  };
})();
