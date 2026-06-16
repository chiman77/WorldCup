const Schedule = (() => {
  const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  function renderTeamLogo(logoUrl, teamName, size = 24) {
    const url = logoUrl || I18n.teamLogoUrl(teamName);
    if (url) {
      return `<img src="${url}" alt="${teamName}" style="width:${size}px;height:${size}px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';" loading="lazy"><span style="display:none;">${Utils.flag(teamName)}</span>`;
    }
    return Utils.flag(teamName);
  }

  function getMatchStatus(match) {
    if (match.status === 'nodata') {
      return { class: 'nodata', text: I18n.t('nodata') };
    }
    if (match.status === 'waiting') {
      return { class: 'nodata', text: I18n.t('waiting') };
    }
    if (Api.isLive(match.status)) {
      return { class: 'live', text: match.progress || I18n.t('live') };
    }
    if (Api.isFinished(match.status)) {
      return { class: 'finished', text: match.homePen > 0 ? I18n.t('ft_pen') : I18n.t('finished') };
    }
    const bjTime = Utils.formatBeijingTime(match.kickoffUtc);
    const tz = Utils.venueTz(match.hostCity);
    const venueTime = tz && match.hostCity ? Utils.formatVenueShort(match.kickoffUtc, tz, match.hostCity) : '';
    const text = venueTime ? `${bjTime}<span class="text-gray-600 font-normal"> (北京)</span><br><span class="text-[10px] text-gray-600">${venueTime}</span>` : bjTime;
    return { class: 'scheduled', text };
  }

  function renderMatchCard(match) {
    const status = getMatchStatus(match);
    const isLive = Api.isLive(match.status);
    const isFinished = Api.isFinished(match.status);
    const homeFlag = renderTeamLogo(match.homeTeamLogo, match.homeTeam, 28);
    const awayFlag = renderTeamLogo(match.awayTeamLogo, match.awayTeam, 28);
    const liveDot = isLive ? '<span class="live-dot"></span>' : '';

    let scoreHtml = '';
    if (isFinished || isLive) {
      const hp = match.homeScore ?? 0;
      const ap = match.awayScore ?? 0;
      const penStr = match.homePen > 0 ? ` <span class="text-gray-400 text-xs">(${match.homePen}-${match.awayPen})</span>` : '';
      scoreHtml = `<div class="match-score ${isLive ? 'score-live' : ''}">${hp} - ${ap}${penStr}</div>`;
    } else {
      scoreHtml = `<div class="match-score score-scheduled">${I18n.t('vs')}</div>`;
    }

    const goalEvents = (match.goals || []).slice(-3).map(g => {
      const penTag = g.isPenalty ? ` <span class="text-yellow-400 text-[10px]">(${I18n.t('penalty_abbr')})</span>` : '';
      const ownTag = g.isOwnGoal ? ` <span class="text-yellow-400 text-[10px]">(${I18n.t('own_goal_abbr')})</span>` : '';
      const jersey = g.jersey ? `<span class="text-gray-400 text-[10px] mr-0.5">#${g.jersey}</span>` : '';
      return `<div class="text-[11px] leading-tight text-gray-300"><span class="text-gray-500 mr-1">${g.minute}</span>${jersey}${Utils.escape(g.playerName)}${penTag}${ownTag}</div>`;
    }).join('');

    const cardEvents = (match.cards || []).slice(-3).map(c => {
      const color = c.type === 'red' ? 'text-red-400' : 'text-yellow-400';
      const icon = c.type === 'red' ? '🟥' : '🟨';
      return `<div class="text-[11px] leading-tight text-gray-300"><span class="text-gray-500 mr-1">${c.minute}</span>${icon} ${Utils.escape(c.playerName)}</div>`;
    }).join('');

    const eventBadges = (isLive || isFinished) && (goalEvents || cardEvents) ?
      `<div class="mt-1.5 pt-1.5 border-t border-white/5 space-y-0.5">${goalEvents}${cardEvents}</div>` : '';

    return `
      <div class="match-card hover:border-amber-500/30 transition-all cursor-pointer ${isLive ? 'border-red-500/30' : ''}"
           onclick="App.showMatchDetail(${match.id})">
        <div class="match-card-top">
          <div class="match-stage">${Utils.getStageLabel(match.stage, match.group)}</div>
          <div class="match-status ${status.class}">${liveDot}${status.text}</div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0 flex-1 justify-end">
            <span class="text-sm truncate">${Utils.getTeamName(match.homeTeam)}</span>
            <span class="text-lg flex-shrink-0">${homeFlag}</span>
          </div>
          ${scoreHtml}
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span class="text-lg flex-shrink-0">${awayFlag}</span>
            <span class="text-sm truncate">${Utils.getTeamName(match.awayTeam)}</span>
          </div>
        </div>
        ${eventBadges}
      </div>
    `;
  }

  function toLocalDateStr(d) {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function renderByDate(matches, currentDate) {
    const matchDates = [...new Set(matches.map(m => m.date).filter(Boolean))].sort();
    const dateObjs = matchDates.map(ds => {
      const parts = ds.split('-');
      return { date: new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])), dateStr: ds };
    });
    const todayStr = toLocalDateStr(new Date());
    const todayMatchCount = matches.filter(m => m.date === todayStr).length;

    let html = '<div class="flex flex-wrap items-center gap-2 mb-6">';
    dateObjs.forEach(({ date, dateStr }) => {
      const label = Utils.formatDateShort(date);
      const active = dateStr === toLocalDateStr(currentDate);
      const hasResult = matches.some(m => m.date === dateStr && (Api.isFinished(m.status) || m.status === 'nodata'));
      const matchCount = matches.filter(m => m.date === dateStr).length;
      html += `<button onclick="Schedule.handleDateFilter('${dateStr}')" class="date-btn ${active ? 'active' : ''} ${hasResult ? 'has-result' : ''}">${label}<span class="date-count">${matchCount}</span></button>`;
    });
    if (todayMatchCount > 0) {
      html += `<button onclick="Schedule.handleDateFilter('${todayStr}')" class="date-btn-today">${I18n.t('today')}</button>`;
    }
    html += '</div>';

    const dateStr = toLocalDateStr(currentDate);
    const dayMatches = matches.filter(m => m.date === dateStr);

    if (dayMatches.length === 0) {
      return html + `<div class="text-center text-gray-400 py-12">${I18n.t('no_matches')}</div>`;
    }

    const groups = [...new Set(dayMatches.map(m => m.group))].sort();
    let cardsHtml = '';
    groups.forEach(g => {
      cardsHtml += `<h3 class="text-lg font-semibold text-amber-400 mb-3 mt-4">${Utils.getGroupName(g)}</h3>`;
      cardsHtml += '<div class="grid gap-3">';
      dayMatches.filter(m => m.group === g).forEach(m => {
        cardsHtml += renderMatchCard(m);
      });
      cardsHtml += '</div>';
    });
    return html + cardsHtml;
  }

  function renderByGroup(matches, selectedGroup) {
    let html = '<div class="flex flex-wrap gap-2 mb-6">';
    html += `<button onclick="Schedule.handleGroupFilter('all')" class="date-btn ${!selectedGroup || selectedGroup === 'all' ? 'active' : ''}">${I18n.t('all_groups')}</button>`;
    GROUPS.forEach(g => {
      html += `<button onclick="Schedule.handleGroupFilter('${g}')" class="date-btn ${selectedGroup === g ? 'active' : ''}">${Utils.getGroupName(g)}</button>`;
    });
    html += '</div>';

    const filtered = selectedGroup && selectedGroup !== 'all'
      ? matches.filter(m => m.group === selectedGroup)
      : matches;

    const groups = [...new Set(filtered.map(m => m.group))].sort();
    let cardsHtml = '';
    groups.forEach(g => {
      cardsHtml += `<h3 class="text-lg font-semibold text-amber-400 mb-3 mt-4">${Utils.getGroupName(g)}</h3>`;
      cardsHtml += '<div class="grid gap-3">';
      filtered.filter(m => m.group === g).forEach(m => {
        cardsHtml += renderMatchCard(m);
      });
      cardsHtml += '</div>';
    });
    return html + cardsHtml;
  }

  function render(matches, viewMode, currentDate, selectedGroup) {
    if (viewMode === 'byDate') {
      return renderByDate(matches, currentDate);
    }
    return renderByGroup(matches, selectedGroup);
  }

  function handleDateFilter(dateStr) {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (!isNaN(d.getTime())) App.setDate(d);
  }

  function handleGroupFilter(group) {
    App.setGroup(group);
  }

  return { render, renderMatchCard, renderTeamLogo, handleDateFilter, handleGroupFilter };
})();
