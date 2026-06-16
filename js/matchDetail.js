const MatchDetail = (() => {
  function render(match) {
    if (!match) return '';
    const isFinished = Api.isFinished(match.status);
    const isLive = Api.isLive(match.status);
    const showScore = isFinished || isLive;
    const hp = match.homeScore ?? 0;
    const ap = match.awayScore ?? 0;
    const homeFlag = Schedule.renderTeamLogo(match.homeTeamLogo, match.homeTeam, 48);
    const awayFlag = Schedule.renderTeamLogo(match.awayTeamLogo, match.awayTeam, 48);

    let statusLine = '';
    if (isLive) {
      statusLine = `<span class="text-red-400 font-semibold">${I18n.t('live')}</span> ${match.progress || ''}`;
    } else if (isFinished) {
      statusLine = `<span class="text-gray-400">${I18n.t('finished')}</span>`;
    } else if (match.status === 'nodata') {
      statusLine = `<span class="text-gray-500">${I18n.t('nodata')}</span>`;
    } else if (match.status === 'waiting') {
      statusLine = `<span class="text-gray-500">${I18n.t('waiting')}</span>`;
    } else {
      const tz = Utils.venueTz(match.hostCity);
      const bjTime = Utils.formatBeijingDateTime(match.kickoffUtc);
      const venueTime = tz && match.hostCity ? Utils.formatVenueDateTime(match.kickoffUtc, tz) : '';
      if (venueTime) {
        statusLine = `<div class="text-gray-400 text-sm">${bjTime}<span class="text-gray-500 ml-1">（${I18n.isZh() ? '北京时间' : 'Beijing' }）</span></div><div class="text-gray-500 text-xs">${venueTime}<span class="text-gray-600 ml-1">（${I18n.isZh() ? '当地' : 'local' }）</span></div>`;
      } else {
        statusLine = `<span class="text-gray-400">${bjTime}</span>`;
      }
    }

    let scoreHtml = '';
    if (showScore) {
      const penLine = match.homePen > 0 ? `<div class="text-sm text-gray-400">${I18n.t('penalties')}: ${match.homePen} - ${match.awayPen}</div>` : '';
      scoreHtml = `
        <div class="flex items-center gap-4 my-4">
          <div class="flex-1 text-right text-3xl font-bold">${homeFlag}</div>
          <div class="text-4xl font-bold text-amber-400 px-4">${hp} - ${ap}</div>
          <div class="flex-1 text-left text-3xl font-bold">${awayFlag}</div>
        </div>
        <div class="text-center">${penLine}</div>
      `;
    } else {
      scoreHtml = `
        <div class="flex items-center gap-4 my-4">
          <div class="flex-1 text-right text-3xl font-bold">${homeFlag}</div>
          <div class="text-2xl text-gray-500 px-4">${I18n.t('vs')}</div>
          <div class="flex-1 text-left text-3xl font-bold">${awayFlag}</div>
        </div>
      `;
    }

    const goalsHtml = renderGoalTimeline(match);
    const cardsHtml = renderCards(match);
    const infoHtml = renderMatchInfo(match);

    return `
      <div class="mb-2">
        <div class="text-xs text-gray-500 mb-1">${Utils.getGroupName(match.group)} · ${Utils.getStageLabel(match.stage, match.group)}</div>
        <div class="text-lg font-bold mb-1">${Utils.getTeamName(match.homeTeam)} ${I18n.t('vs')} ${Utils.getTeamName(match.awayTeam)}</div>
        <div class="text-sm">${statusLine}</div>
      </div>
      ${scoreHtml}
      ${goalsHtml}
      ${cardsHtml}
      ${infoHtml}
    `;
  }

  function renderGoalTimeline(match) {
    if (!match.goals || match.goals.length === 0) return '';
    const events = [...match.goals].sort((a, b) => {
      const ma = parseInt(a.minute) || 0;
      const mb = parseInt(b.minute) || 0;
      return ma - mb;
    });

    let html = `<div class="border-t border-white/10 pt-3 mt-3"><div class="text-sm font-semibold text-gray-400 mb-2">⚽ ${I18n.t('goal_timeline')}</div>`;
    events.forEach(g => {
      const side = g.isHome ? 'home' : 'away';
      const penTag = g.isPenalty ? ` <span class="text-yellow-400 text-[10px] font-bold">(${I18n.t('penalty_abbr')})</span>` : '';
      const ownTag = g.isOwnGoal ? ` <span class="text-yellow-400 text-[10px] font-bold">(${I18n.t('own_goal_abbr')})</span>` : '';
      const jersey = g.jersey ? `<span class="text-gray-500 text-[10px] font-mono mr-1">#${g.jersey}</span>` : '';
      const pos = g.position ? `<span class="text-gray-600 text-[9px]">(${g.position})</span>` : '';
      const typeIcon = g.isPenalty ? '🎯' : '⚽';

      if (side === 'home') {
        html += `
          <div class="flex items-center gap-2 py-1.5 text-sm">
            <span class="text-sm">${typeIcon}</span>
            <span class="font-semibold text-white">${jersey}${Utils.escape(g.playerName)}${penTag}${ownTag}${pos}</span>
            <span class="text-gray-400 text-[10px]">${g.minute}</span>
          </div>
        `;
      } else {
        html += `
          <div class="flex items-center gap-2 py-1.5 text-sm justify-end">
            <span class="text-gray-400 text-[10px]">${g.minute}</span>
            <span class="font-semibold text-white">${jersey}${Utils.escape(g.playerName)}${penTag}${ownTag}${pos}</span>
            <span class="text-sm">${typeIcon}</span>
          </div>
        `;
      }
    });
    html += '</div>';
    return html;
  }

  function renderCards(match) {
    if (!match.cards || match.cards.length === 0) return '';
    const events = [...match.cards].sort((a, b) => {
      const ma = parseInt(a.minute) || 0;
      const mb = parseInt(b.minute) || 0;
      return ma - mb;
    });

    let html = `<div class="border-t border-white/10 pt-3 mt-3"><div class="text-sm font-semibold text-gray-400 mb-2">${I18n.t('cards')}</div>`;
    events.forEach(c => {
      const icon = c.type === 'red' ? '🟥' : '🟨';
      const jersey = c.jersey ? `<span class="text-gray-500 text-[10px] font-mono mr-1">#${c.jersey}</span>` : '';
      if (c.isHome) {
        html += `
          <div class="flex items-center gap-2 py-1 text-sm">
            <span>${icon}</span>
            <span class="text-white">${jersey}${Utils.escape(c.playerName)}</span>
            <span class="text-gray-400 text-[10px]">${c.minute}</span>
          </div>
        `;
      } else {
        html += `
          <div class="flex items-center gap-2 py-1 text-sm justify-end">
            <span class="text-gray-400 text-[10px]">${c.minute}</span>
            <span class="text-white">${jersey}${Utils.escape(c.playerName)}</span>
            <span>${icon}</span>
          </div>
        `;
      }
    });
    html += '</div>';
    return html;
  }

  function renderMatchInfo(match) {
    const items = [];
    if (match.hostCity) items.push({ label: I18n.t('city'), value: I18n.cityName(match.hostCity) });
    if (match.venue) items.push({ label: I18n.t('venue'), value: I18n.venueName(match.venue) });
    if (match.attendance) items.push({ label: I18n.t('attendance'), value: match.attendance.toLocaleString() });
    if (match.statusDetail) items.push({ label: I18n.t('status'), value: I18n.translateStatusDetail(match.statusDetail) });
    if (items.length === 0) return '';

    let html = '<div class="border-t border-white/10 pt-3 mt-3 text-xs text-gray-400 space-y-1">';
    items.forEach(item => {
      html += `<div class="flex justify-between"><span>${item.label}</span><span class="text-gray-300">${item.value}</span></div>`;
    });
    html += '</div>';
    return html;
  }

  return { render };
})();