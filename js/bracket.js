const Bracket = (() => {
  const stages = [
    { key: 'round-of-32', labelKey: 'round_of_32', range: [73, 88], teamCount: 32, advance: 16 },
    { key: 'round-of-16', labelKey: 'round_of_16', range: [89, 96], teamCount: 16, advance: 8 },
    { key: 'quarter-finals', labelKey: 'quarter_final', range: [97, 100], teamCount: 8, advance: 4 },
    { key: 'semi-finals', labelKey: 'semi_final', range: [101, 102], teamCount: 4, advance: 2 },
    { key: 'third-place', labelKey: 'third_place', range: [103, 103], teamCount: 2, advance: 1 },
    { key: 'final', labelKey: 'final', range: [104, 104], teamCount: 2, advance: 1 },
  ];

  function buildParentMap(matches) {
    const parentMap = {};
    matches.forEach(m => {
      const wm1 = m.homeTeam && m.homeTeam.match(/^(Winner|Loser) Match (\d+)$/);
      if (wm1) parentMap[parseInt(wm1[2])] = m.id;
      const wm2 = m.awayTeam && m.awayTeam.match(/^(Winner|Loser) Match (\d+)$/);
      if (wm2) parentMap[parseInt(wm2[2])] = m.id;
    });
    return parentMap;
  }

  function getStageById(id) {
    for (const s of stages) {
      if (id >= s.range[0] && id <= s.range[1]) return s;
    }
    return null;
  }

  function render(matches, selectedRound) {
    const parentMap = buildParentMap(matches);
    const winnerMap = {};
    const loserMap = {};

    matches.forEach(m => {
      if (!Api.isFinished(m.status)) return;
      if (m.homeScore == null || m.awayScore == null) return;
      const hs = parseInt(m.homeScore);
      const as = parseInt(m.awayScore);
      if (hs > as) {
        winnerMap[m.id] = m.homeTeam;
        loserMap[m.id] = m.awayTeam;
      } else if (as > hs) {
        winnerMap[m.id] = m.awayTeam;
        loserMap[m.id] = m.homeTeam;
      } else if ((m.homePen || 0) > (m.awayPen || 0)) {
        winnerMap[m.id] = m.homeTeam;
        loserMap[m.id] = m.awayTeam;
      } else if ((m.awayPen || 0) > (m.homePen || 0)) {
        winnerMap[m.id] = m.awayTeam;
        loserMap[m.id] = m.homeTeam;
      }
    });

    const standings = Utils.computeStandings(matches);
    const groupWinners = {};
    const groupRunners = {};
    const groupThirds = {};
    Object.keys(standings).forEach(g => {
      const teams = standings[g];
      if (teams.length >= 1) groupWinners[g] = teams[0].team;
      if (teams.length >= 2) groupRunners[g] = teams[1].team;
      if (teams.length >= 3) groupThirds[g] = teams[2].team;
    });

    const thirdEntries = [];
    Object.keys(standings).forEach(g => {
      if (standings[g].length < 3) return;
      const totalPlayed = standings[g].reduce((sum, t) => sum + (t.played || 0), 0);
      if (totalPlayed / 2 < 4) return;
      thirdEntries.push({ group: g, entry: standings[g][2] });
    });
    thirdEntries.sort((a, b) =>
      b.entry.points - a.entry.points ||
      b.entry.goalDifference - a.entry.goalDifference ||
      b.entry.goalsFor - a.entry.goalsFor
    );
    const thirdRankings = thirdEntries.map(t => t.group);
    const qualifyingThirds = new Set(thirdRankings.slice(0, 8));

    const resolve = {
      winnerMap,
      loserMap,
      groupWinners,
      groupRunners,
      groupThirds,
      thirdRankings,
      qualifyingThirds,
    };

    const available = stages.filter(s => matches.some(m => m.stage === s.key));
    if (!selectedRound || !available.some(s => s.key === selectedRound)) {
      selectedRound = available.length > 0 ? available[0].key : null;
    }

    let html = '<div class="bracket-view">';

    html += renderTabs(available, selectedRound);

    if (selectedRound) {
      html += renderContent(selectedRound, matches, resolve, parentMap);
    } else {
      html += `<div class="text-center text-gray-500 py-12">${I18n.t('no_matches')}</div>`;
    }

    html += '</div>';
    return html;
  }

  function renderTabs(available, activeKey) {
    let html = '<div class="bracket-tabs">';
    available.forEach(s => {
      const matchCount = 1 + s.range[1] - s.range[0];
      const label = I18n.t(s.labelKey);
      const active = s.key === activeKey ? ' active' : '';
      html += `<button class="bracket-tab${active}" data-round="${s.key}" onclick="Bracket.switchRound('${s.key}')">${label}<span class="bracket-tab-count">${matchCount}</span></button>`;
    });
    html += '</div>';
    return html;
  }

  function renderContent(roundKey, matches, resolve, parentMap) {
    const stage = stages.find(s => s.key === roundKey);
    if (!stage) return '';

    const stageMatches = matches.filter(m =>
      m.stage === stage.key &&
      m.id >= stage.range[0] &&
      m.id <= stage.range[1]
    ).sort((a, b) => a.id - b.id);

    if (stageMatches.length === 0) {
      return `<div class="text-center text-gray-500 py-12">${I18n.t('no_matches')}</div>`;
    }

    const isZh = I18n.isZh();
    const subtitle = renderSubtitle(stage);

    const allKeys = stages.filter(s => matches.some(m => m.stage === s.key)).map(s => s.key);
    const currentIdx = allKeys.indexOf(roundKey);
    const prevKey = currentIdx > 0 ? allKeys[currentIdx - 1] : null;
    const nextKey = currentIdx < allKeys.length - 1 ? allKeys[currentIdx + 1] : null;

    let html = '<div class="bracket-content">';

    html += `<div class="bracket-info">${subtitle}</div>`;

    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">';
    stageMatches.forEach(m => {
      html += renderCard(m, stage, resolve, parentMap);
    });
    html += '</div>';

    html += '<div class="bracket-pager">';
    if (prevKey) {
      html += `<button class="bracket-page-btn" onclick="Bracket.switchRound('${prevKey}')">‹ ${I18n.t(stages.find(s=>s.key===prevKey).labelKey)}</button>`;
    } else {
      html += '<span></span>';
    }
    if (nextKey) {
      html += `<button class="bracket-page-btn" onclick="Bracket.switchRound('${nextKey}')">${I18n.t(stages.find(s=>s.key===nextKey).labelKey)} ›</button>`;
    } else {
      html += '<span></span>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderSubtitle(stage) {
    const isZh = I18n.isZh();
    const count = 1 + stage.range[1] - stage.range[0];
    if (isZh) {
      let s = `${count}场 · ${stage.teamCount}队`;
      if (stage.advance > 1) s += ` → ${stage.advance}队`;
      return s;
    }
    let s = `${count} matches · ${stage.teamCount} teams`;
    if (stage.advance > 1) s += ` → ${stage.advance}`;
    return s;
  }

  function renderCard(m, stage, resolve, parentMap) {
    const isLive = Api.isLive(m.status);
    const isFinished = Api.isFinished(m.status);
    const hasScore = isLive || isFinished;

    const homeResolved = resolveTeam(m.homeTeam, m.id, null, resolve);
    const awayResolved = resolveTeam(m.awayTeam, m.id, null, resolve);

    const homeLogo = Schedule.renderTeamLogo(m.homeTeamLogo, homeResolved, 28);
    const awayLogo = Schedule.renderTeamLogo(m.awayTeamLogo, awayResolved, 28);
    const homeName = getLabel(homeResolved, m.id);
    const awayName = getLabel(awayResolved, m.id);

    const hs = parseInt(m.homeScore) || 0;
    const as = parseInt(m.awayScore) || 0;
    let homeWin = hasScore && hs > as;
    let awayWin = hasScore && as > hs;

    const penStr = (m.homePen > 0 || m.awayPen > 0) && isFinished && hs === as
      ? ` <span class="bracket-penalty">(PEN ${m.homePen}-${m.awayPen})</span>` : '';

    if (isFinished && hs === as && (m.homePen > 0 || m.awayPen > 0)) {
      if (m.homePen > m.awayPen) homeWin = true;
      else if (m.awayPen > m.homePen) awayWin = true;
    }

    let topRight = '';
    if (isLive) {
      topRight = `<span class="text-red-400 text-xs font-bold animate-pulse">● ${I18n.t('live')}</span>`;
    } else if (isFinished) {
      topRight = `<span class="text-green-400 text-xs font-semibold">${m.homePen > 0 ? I18n.t('ft_pen') : I18n.t('finished')}</span>`;
    } else if (m.status === 'nodata' || m.status === 'waiting') {
      topRight = `<span class="text-gray-600 text-xs">${I18n.t(m.status)}</span>`;
    } else {
      const bj = Utils.formatBeijingDateTime(m.kickoffUtc);
      const tz = Utils.venueTz(m.hostCity);
      const vt = tz && m.hostCity ? Utils.formatVenueShort(m.kickoffUtc, tz, m.hostCity) : '';
      topRight = `<span class="text-gray-400 text-xs">${bj}</span>`;
      if (vt) topRight += `<span class="text-gray-600 text-[10px] ml-1">${vt}</span>`;
    }

    const matchNum = I18n.tParam('match_num', { n: m.id });
    const stageLabel = I18n.t(stage.labelKey);

    let nextLabel = '';
    const nextId = parentMap[m.id];
    if (nextId) {
      const ns = getStageById(nextId);
      if (ns) {
        const sl = I18n.t(ns.labelKey);
        nextLabel = I18n.isZh() ? `→ ${sl} 第${nextId}场` : `→ ${sl} M${nextId}`;
      }
    }

    const isChampion = isFinished && stage.key === 'final' && (homeWin || awayWin);

    const cardLive = isLive ? ' border-red-500/30' : '';

    return `
      <div class="match-card bracket-card${cardLive} cursor-pointer" onclick="App.showMatchDetail(${m.id})">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs text-amber-400 font-semibold">${stageLabel} · ${matchNum}</div>
          <div class="flex items-center gap-1">${topRight}</div>
        </div>
        <div class="flex items-center justify-between gap-3 py-1">
          <div class="flex items-center gap-2 min-w-0 flex-1 justify-end ${homeWin ? 'text-amber-400 font-bold' : ''}">
            <span class="text-sm truncate">${homeName}</span>
            <span class="flex-shrink-0">${homeLogo}</span>
          </div>
          <div class="flex-shrink-0 text-center min-w-[3rem]">
            ${hasScore
              ? `<span class="text-xl font-extrabold ${isLive ? 'text-red-400' : 'text-gray-100'}">${hs}-${as}</span>${penStr}`
              : `<span class="text-lg text-gray-500">${I18n.t('vs')}</span>`}
          </div>
          <div class="flex items-center gap-2 min-w-0 flex-1 ${awayWin ? 'text-amber-400 font-bold' : ''}">
            <span class="flex-shrink-0">${awayLogo}</span>
            <span class="text-sm truncate">${awayName}</span>
          </div>
        </div>
        ${isChampion ? `<div class="text-center text-amber-400 text-xs mt-1 border-t border-white/10 pt-1">👑 ${I18n.t('champion')}</div>` : ''}
        ${nextLabel ? `<div class="text-right text-gray-500 text-[11px] mt-1 border-t border-white/5 pt-1">${nextLabel}</div>` : ''}
      </div>`;
  }

  function resolveTeam(team, matchId, stage, resolve) {
    if (!team) return team;

    const wm = team.match(/^Winner Match (\d+)$/);
    if (wm) {
      const winner = resolve.winnerMap[wm[1]];
      return winner || team;
    }

    const lm = team.match(/^Loser Match (\d+)$/);
    if (lm) {
      const loser = resolve.loserMap[lm[1]];
      return loser || team;
    }

    const gw = team.match(/^Group ([A-L]) winners$/);
    if (gw) {
      return resolve.groupWinners[gw[1]] || team;
    }

    const gr = team.match(/^Group ([A-L]) runners-up$/);
    if (gr) {
      return resolve.groupRunners[gr[1]] || team;
    }

    const tp = team.match(/^Group ([A-L/]+) third place$/);
    if (tp) {
      const groups = tp[1].split('/');
      if (groups.length === 1) return resolve.groupThirds[groups[0]] || team;
      const qualified = groups.filter(g => resolve.qualifyingThirds?.has(g));
      if (qualified.length > 0) {
        if (resolve.thirdRankings) {
          qualified.sort((a, b) => resolve.thirdRankings.indexOf(a) - resolve.thirdRankings.indexOf(b));
        }
        return resolve.groupThirds[qualified[0]] || team;
      }
      return team;
    }

    return team;
  }

  function getLabel(team, matchId) {
    if (!team || team === 'TBD') return I18n.t('tbd');

    const isZh = I18n.isZh();

    const wm = team.match(/^Winner Match (\d+)$/);
    if (wm) return isZh ? `M${wm[1]}胜者` : `W M${wm[1]}`;

    const lm = team.match(/^Loser Match (\d+)$/);
    if (lm) return isZh ? `M${lm[1]}负者` : `L M${lm[1]}`;

    const gw = team.match(/^Group ([A-L]) winners$/);
    if (gw) return isZh ? `${gw[1]}组第1` : `Group ${gw[1]} 1st`;

    const gr = team.match(/^Group ([A-L]) runners-up$/);
    if (gr) return isZh ? `${gr[1]}组第2` : `Group ${gr[1]} 2nd`;

    const tp = team.match(/^Group ([A-L/]+) third place$/);
    if (tp) {
      const g = tp[1];
      if (isZh) return `${g}组第3`;
      return `Group ${g} 3rd`;
    }

    return I18n.team(team);
  }

  function getDefaultRound(matches) {
    const available = stages.filter(s => matches.some(m => m.stage === s.key));
    if (available.length === 0) return null;
    let target = available[0].key;
    for (const s of available) {
      const sm = matches.filter(m => m.stage === s.key && Api.isFinished(m.status));
      if (sm.length > 0) target = s.key;
    }
    return target;
  }

  function switchRound(key) {
    if (window.App && window.App.setBracketRound) {
      window.App.setBracketRound(key);
    }
  }

  return { render, switchRound, getDefaultRound };
})();
