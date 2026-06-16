const Utils = (() => {
  function utcToLocal(utcString) {
    const d = new Date(utcString);
    return d;
  }

  function formatTime(dateOrStr) {
    const d = dateOrStr instanceof Date ? dateOrStr : new Date(dateOrStr);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  function formatDate(date) {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return I18n.lang() === 'zh' ? `${m}月${d}日` : `${date.toLocaleString('en', { month: 'short' })} ${d}`;
  }

  function formatDateFull(date) {
    const weekdays = I18n.lang() === 'zh'
      ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const m = date.getMonth() + 1;
    const d = date.getDate();
    if (I18n.lang() === 'zh') {
      return `${m}月${d}日 ${weekdays[date.getDay()]}`;
    }
    return `${weekdays[date.getDay()]}, ${date.toLocaleString('en', { month: 'long' })} ${d}`;
  }

  function getDateKey(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getRelativeDay(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / 86400000);
    if (diff === 0) return I18n.t('today');
    if (diff === 1) return I18n.t('tomorrow');
    if (diff === -1) return I18n.t('yesterday');
    return formatDate(date);
  }

  function groupKey(g) {
    return `group_${g}`;
  }

  function stageName(stage) {
    const map = {
      'group-stage': 'group_stage',
      'round-of-32': 'round_of_32',
      'round-of-16': 'round_of_16',
      'quarter-finals': 'quarter_final',
      'semi-finals': 'semi_final',
      'third-place': 'third_place',
      'final': 'final',
    };
    return I18n.t(map[stage] || stage);
  }

  function groupName(g) {
    if (!g || g === 'null') return '';
    return `${I18n.t('group_prefix')}${I18n.lang() === 'zh' ? '' : ' '}${g}`;
  }

  function statusText(status, progress = null) {
    if (status === 'nodata') return I18n.t('nodata');
    if (status === 'waiting') return I18n.t('waiting');
    if (status === 'in' || status === 'in_progress' || status === 'LIVE' || status === 'IN_PLAY' || status === 'PAUSED') {
      if (progress) return progress;
      return I18n.t('live');
    }
    if (status === 'post' || status === 'finished' || status === 'FT' || status === 'FINISHED') return I18n.t('finished');
    return I18n.t('scheduled');
  }

  function statusClass(status) {
    if (status === 'nodata' || status === 'waiting') return 'nodata';
    if (status === 'in' || status === 'in_progress' || status === 'LIVE' || status === 'IN_PLAY' || status === 'PAUSED') return 'live';
    if (status === 'post' || status === 'finished' || status === 'FT' || status === 'FINISHED') return 'finished';
    return 'scheduled';
  }

  function groupMatchesByDate(matches) {
    const map = {};
    matches.forEach(m => {
      const date = m.date || (m.kickoffUtc ? new Date(m.kickoffUtc).toISOString().split('T')[0] : null);
      if (!date) return;
      if (!map[date]) map[date] = [];
      map[date].push(m);
    });
    return map;
  }

  function groupMatchesByGroup(matches) {
    const map = {};
    matches.forEach(m => {
      const g = m.group || 'knockout';
      if (!map[g]) map[g] = [];
      map[g].push(m);
    });
    return map;
  }

  function sortByDate(matches) {
    return [...matches].sort((a, b) => {
      const da = new Date(a.kickoffUtc || a.date);
      const db = new Date(b.kickoffUtc || b.date);
      return da - db;
    });
  }

  function computeStandings(matches) {
    const standings = {};
    const teamLogos = {};
    const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];

    matches.forEach(m => {
      const g = m.group;
      if (!g || g === 'null' || !groups.includes(g)) return;
      if (!standings[g]) standings[g] = [];
      if (m.homeTeam && !standings[g].find(s => s.team === m.homeTeam)) {
        standings[g].push({
          team: m.homeTeam,
          teamLogo: m.homeTeamLogo || '',
          played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
          form: []
        });
      }
      if (m.awayTeam && !standings[g].find(s => s.team === m.awayTeam)) {
        standings[g].push({
          team: m.awayTeam,
          teamLogo: m.awayTeamLogo || '',
          played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
          form: []
        });
      }
      if (m.homeTeam && m.homeTeamLogo) teamLogos[m.homeTeam] = m.homeTeamLogo;
      if (m.awayTeam && m.awayTeamLogo) teamLogos[m.awayTeam] = m.awayTeamLogo;
    });

    Object.keys(standings).forEach(g => {
      standings[g].forEach(s => {
        if (!s.teamLogo && teamLogos[s.team]) s.teamLogo = teamLogos[s.team];
      });
    });

    const allResults = [];
    matches.forEach(m => {
      const g = m.group;
      if (!g || g === 'null' || !standings[g]) return;
      if (!Api.isFinished(m.status)) return;
      const home = m.homeTeam;
      const away = m.awayTeam;
      const hs = parseInt(m.homeScore ?? 0);
      const as = parseInt(m.awayScore ?? 0);
      if (isNaN(hs) || isNaN(as)) return;
      allResults.push({ g, home, away, hs, as, kickoff: new Date(m.kickoffUtc) });
    });
    allResults.sort((a, b) => a.kickoff - b.kickoff);

    allResults.forEach(m => {
      const homeEntry = standings[m.g].find(s => s.team === m.home);
      const awayEntry = standings[m.g].find(s => s.team === m.away);
      if (!homeEntry || !awayEntry) return;

      homeEntry.played++;
      awayEntry.played++;
      homeEntry.goalsFor += m.hs;
      homeEntry.goalsAgainst += m.as;
      awayEntry.goalsFor += m.as;
      awayEntry.goalsAgainst += m.hs;

      if (m.hs > m.as) {
        homeEntry.won++; homeEntry.points += 3; homeEntry.form.unshift('W');
        awayEntry.lost++; awayEntry.form.unshift('L');
      } else if (m.hs < m.as) {
        awayEntry.won++; awayEntry.points += 3; awayEntry.form.unshift('W');
        homeEntry.lost++; homeEntry.form.unshift('L');
      } else {
        homeEntry.drawn++; awayEntry.drawn++;
        homeEntry.points++; awayEntry.points++;
        homeEntry.form.unshift('D'); awayEntry.form.unshift('D');
      }
    });

    Object.keys(standings).forEach(g => {
      standings[g].forEach(s => {
        s.goalDifference = s.goalsFor - s.goalsAgainst;
        s.form = s.form.slice(0, 5);
      });
      standings[g].sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
    });

    return standings;
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  function getStageLabel(stage, group) {
    if (stage === 'group-stage') return groupName(group);
    return stageName(stage);
  }

  function getGroupName(g) {
    return groupName(g);
  }

  function formatDateShort(date) {
    return getRelativeDay(date);
  }

  function isZh() {
    return I18n.lang() === 'zh';
  }

  const TOURNAMENT_START = new Date(2026, 5, 11);
  const TOURNAMENT_END = new Date(2026, 6, 19);

  function getNearestDates(count, referenceDate) {
    const dates = [];
    const start = new Date(referenceDate);
    start.setHours(0,0,0,0);
    const offset = Math.floor(count / 2);
    for (let i = -offset; i < count - offset; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      if (d < TOURNAMENT_START || d > TOURNAMENT_END) continue;
      dates.push({ date: d, label: getRelativeDay(d) });
    }
    if (dates.length === 0) {
      dates.push({ date: new Date(TOURNAMENT_START), label: getRelativeDay(TOURNAMENT_START) });
    }
    return dates;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function flag(teamName) {
    return I18n.teamFlag(teamName);
  }

  function getTeamName(teamName) {
    return I18n.team(teamName);
  }

  function formatDateTime(utcString) {
    const d = new Date(utcString);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return I18n.lang() === 'zh' ? `${m}月${day}日 ${h}:${min}` : `${d.toLocaleString('en', { month: 'short' })} ${day}, ${h}:${min}`;
  }

  const VENUE_TIMEZONES = {
    'atlanta': 'America/New_York',
    'boston': 'America/New_York',
    'dallas': 'America/Chicago',
    'guadalajara': 'America/Mexico_City',
    'houston': 'America/Chicago',
    'kansas-city': 'America/Chicago',
    'los-angeles': 'America/Los_Angeles',
    'mexico-city': 'America/Mexico_City',
    'miami': 'America/New_York',
    'monterrey': 'America/Monterrey',
    'new-york': 'America/New_York',
    'philadelphia': 'America/New_York',
    'san-francisco': 'America/Los_Angeles',
    'seattle': 'America/Los_Angeles',
    'toronto': 'America/Toronto',
    'vancouver': 'America/Vancouver',
  };

  function venueTz(hostCity) {
    if (!hostCity) return '';
    return VENUE_TIMEZONES[hostCity] || '';
  }

  function formatVenueTime(utcStr, tz) {
    if (!utcStr || !tz) return '';
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return '';
    const h = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    return h;
  }

  function formatVenueDate(utcStr, tz) {
    if (!utcStr || !tz) return { month: 0, day: 0 };
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return { month: 0, day: 0 };
    const month = parseInt(d.toLocaleDateString('en-CA', { month: 'numeric', timeZone: tz })) - 1;
    const day = parseInt(d.toLocaleDateString('en-CA', { day: 'numeric', timeZone: tz }));
    return { month, day };
  }

  function formatVenueDateTime(utcStr, tz) {
    if (!utcStr || !tz) return '';
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return '';
    const isZh = I18n.isZh();
    const month = d.toLocaleDateString('en', { month: isZh ? 'numeric' : 'short', timeZone: tz });
    const day = d.toLocaleDateString('en', { day: 'numeric', timeZone: tz });
    const time = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    if (isZh) return `${month}月${day}日 ${time}`;
    return `${month} ${day}, ${time}`;
  }

  function formatBeijingTime(utcStr) {
    if (!utcStr) return '';
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' });
  }

  function formatBeijingDateTime(utcStr) {
    if (!utcStr) return '';
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return '';
    const m = parseInt(d.toLocaleDateString('en-CA', { month: 'numeric', timeZone: 'Asia/Shanghai' }));
    const day = parseInt(d.toLocaleDateString('en-CA', { day: 'numeric', timeZone: 'Asia/Shanghai' }));
    const time = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' });
    if (I18n.isZh()) return `${m}月${day}日 ${time}`;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[m - 1]} ${day}, ${time}`;
  }

  function formatVenueShort(utcStr, tz, hostCity) {
    if (!utcStr || !tz || !hostCity) return '';
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return '';
    const time = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    const venueMonth = parseInt(d.toLocaleDateString('en-CA', { month: 'numeric', timeZone: tz }));
    const venueDay = parseInt(d.toLocaleDateString('en-CA', { day: 'numeric', timeZone: tz }));
    const bjMonth = parseInt(d.toLocaleDateString('en-CA', { month: 'numeric', timeZone: 'Asia/Shanghai' }));
    const bjDay = parseInt(d.toLocaleDateString('en-CA', { day: 'numeric', timeZone: 'Asia/Shanghai' }));
    const isZh = I18n.isZh();
    const cityLabel = isZh ? '当地' : 'local';
    let datePart = '';
    if (venueMonth !== bjMonth || venueDay !== bjDay) {
      datePart = isZh ? `（${venueMonth}月${venueDay}日）` : ` (${venueMonth}/${venueDay})`;
    }
    return `${time}${datePart} ${cityLabel}`;
  }

  function formatBeijingDateStr(utcStr) {
    if (!utcStr) return '';
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return '';
    const y = d.toLocaleDateString('en-CA', { year: 'numeric', timeZone: 'Asia/Shanghai' });
    const m = d.toLocaleDateString('en-CA', { month: '2-digit', timeZone: 'Asia/Shanghai' });
    const day = d.toLocaleDateString('en-CA', { day: '2-digit', timeZone: 'Asia/Shanghai' });
    return `${y}-${m}-${day}`;
  }

  return {
    utcToLocal, formatTime, formatDate, formatDateFull, getDateKey,
    getRelativeDay, groupKey, stageName, groupName, statusText, statusClass,
    groupMatchesByDate, groupMatchesByGroup, sortByDate, computeStandings, debounce,
    getStageLabel, getGroupName, formatDateShort, isZh, getNearestDates, escape: escapeHtml,
    flag, getTeamName, formatDateTime, formatVenueTime, formatVenueDate, formatVenueDateTime,
    formatBeijingTime, formatBeijingDateTime, formatVenueShort, formatBeijingDateStr,
    venueTz, VENUE_TIMEZONES,
  };
})();
