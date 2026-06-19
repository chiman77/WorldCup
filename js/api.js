const Api = (() => {
  const FIXTURES_URL = 'https://www.thestatsapi.com/world-cup/data/fixtures.json';
  const ESPN_SCOREBOARD_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
  const ESPN_SUMMARY = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary';

  let fixturesCache = null;
  let allScoreboardEvents = [];
  let lastScoreboardFetch = 0;

  const NAME_MAP = {
    'IR Iran': 'Iran',
    'Cabo Verde': 'Cape Verde',
    'Korea Republic': 'South Korea',
    'Czechia': 'Czechia',
    'Cote d\'Ivoire': 'Ivory Coast',
    'Turkiye': 'Turkiye',
    'Congo DR': 'DR Congo',
    'United States': 'United States',
    'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
  };

  const NAME_MAP_REVERSE = {};
  Object.entries(NAME_MAP).forEach(([key, val]) => {
    NAME_MAP_REVERSE[val.toLowerCase()] = key;
  });

  function normalizeTeamName(name) { return NAME_MAP[name] || name; }
  function reverseMapName(espnName) { return NAME_MAP_REVERSE[espnName.toLowerCase()] || espnName; }
  function normalizeForMatch(s) { return (s || '').toLowerCase().replace(/[^a-z]/g, ''); }

  function formatDateParam(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}${m}${d}`;
  }

  async function fetchFixtures() {
    if (fixturesCache) return fixturesCache;
    try {
      console.log('[API] Fetching fixtures from', FIXTURES_URL);
      const resp = await fetch(FIXTURES_URL);
      if (!resp.ok) throw new Error(`Fixtures HTTP ${resp.status}`);
      const data = await resp.json();
      fixturesCache = data.fixtures || [];
      console.log('[API] Fixtures loaded:', fixturesCache.length);
      return fixturesCache;
    } catch (e) {
      console.error('[API] Failed to fetch fixtures:', e);
      return [];
    }
  }

  async function fetchScoreboardForDate(dateStr) {
    try {
      console.log('[API] Fetching scoreboard for', dateStr);
      const resp = await fetch(`${ESPN_SCOREBOARD_BASE}?dates=${dateStr}`);
      if (!resp.ok) throw new Error(`Scoreboard HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] Scoreboard', dateStr, ':', (data.events || []).length, 'events');
      return data.events || [];
    } catch (e) {
      console.error(`[API] Failed to fetch scoreboard for ${dateStr}:`, e);
      return [];
    }
  }

  const TOURNAMENT_START = new Date(2026, 5, 11);

  async function fetchScoreboard() {
    const now = Date.now();
    if (allScoreboardEvents.length > 0 && (now - lastScoreboardFetch) < 30000) {
      return allScoreboardEvents;
    }
    const today = new Date();
    const dates = [];
    const start = new Date(TOURNAMENT_START);
    const end = new Date(today);
    end.setDate(end.getDate() + 1);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(formatDateParam(d));
    }
    const results = await Promise.all(dates.map(d => fetchScoreboardForDate(d)));
    allScoreboardEvents = results.flat();
    console.log(`[API] Total scoreboard events: ${allScoreboardEvents.length} (dates: ${dates[0]}..${dates[dates.length-1]})`);
    lastScoreboardFetch = now;
    return allScoreboardEvents;
  }

  async function fetchMatchSummary(eventId) {
    try {
      const resp = await fetch(`${ESPN_SUMMARY}?event=${eventId}`);
      const data = await resp.json();
      return data;
    } catch (e) {
      console.error('Failed to fetch match summary:', e);
      return null;
    }
  }

  function extractGoalEvents(details, homeTeamId, awayTeamId) {
    if (!details || !Array.isArray(details)) return [];
    return details
      .filter(d => d.scoringPlay)
      .map(d => {
        const athlete = d.athletesInvolved?.[0];
        const teamId = d.team?.id;
        const isHome = String(teamId) === String(homeTeamId);
        return {
          type: d.type?.text || 'Goal',
          minute: d.clock?.displayValue || '?',
          clockSeconds: d.clock?.value || 0,
          playerName: athlete?.displayName || '',
          jersey: athlete?.jersey || '',
          position: athlete?.position || '',
          isPenalty: d.penaltyKick === true,
          isOwnGoal: d.ownGoal === true,
          isHome: d.ownGoal ? !isHome : isHome,
        };
      });
  }

  function extractCardEvents(details, homeTeamId, awayTeamId) {
    if (!details || !Array.isArray(details)) return [];
    return details
      .filter(d => d.yellowCard || d.redCard)
      .map(d => {
        const athlete = d.athletesInvolved?.[0];
        const teamId = d.team?.id;
        const isHome = String(teamId) === String(homeTeamId);
        return {
          type: d.redCard ? 'red' : 'yellow',
          minute: d.clock?.displayValue || '?',
          playerName: athlete?.displayName || '',
          jersey: athlete?.jersey || '',
          isHome,
        };
      });
  }

  function mergeData(fixtures, scoreboard) {
    const espnByDay = {};
    scoreboard.forEach(evt => {
      const comp = evt.competitions?.[0];
      if (!comp) return;
      const homeTeam = comp.competitors?.find(c => c.homeAway === 'home');
      const awayTeam = comp.competitors?.find(c => c.homeAway === 'away');
      if (!homeTeam || !awayTeam) return;

      const espnHome = homeTeam.team?.displayName || '';
      const espnAway = awayTeam.team?.displayName || '';
      const d = new Date(evt.date);
      const day = d.getUTCDate();
      const month = d.getUTCMonth();

      const statusType = comp.status?.type;
      const statusName = statusType?.name || '';
      const isCompleted = statusType?.completed === true;

      let normalizedStatus = 'scheduled';
      if (isCompleted || statusName === 'STATUS_FINAL' || statusName === 'STATUS_FULL_TIME') {
        normalizedStatus = 'finished';
      } else if (statusName === 'STATUS_IN_PROGRESS' || statusName === 'STATUS_HALFTIME' || statusType?.state === 'in') {
        normalizedStatus = 'in';
      } else if (statusType?.state === 'post') {
        normalizedStatus = 'finished';
      }

      const goals = extractGoalEvents(comp.details, homeTeam.id, awayTeam.id);
      const cards = extractCardEvents(comp.details, homeTeam.id, awayTeam.id);

      const entry = {
        espnId: evt.id,
        status: normalizedStatus,
        statusDetail: statusType?.shortDetail || '',
        progress: comp.status?.displayClock || '',
        period: comp.status?.period || 0,
        homeScore: parseInt(homeTeam.score) || 0,
        awayScore: parseInt(awayTeam.score) || 0,
        homePen: parseInt(homeTeam.penalties) || 0,
        awayPen: parseInt(awayTeam.penalties) || 0,
        attendance: comp.attendance,
        venueName: comp.venue?.fullName || '',
        espnHome,
        espnAway,
        homeTeamLogo: homeTeam.team?.logos?.[0]?.href || '',
        awayTeamLogo: awayTeam.team?.logos?.[0]?.href || '',
        homeTeamAbbr: homeTeam.team?.abbreviation || '',
        awayTeamAbbr: awayTeam.team?.abbreviation || '',
        goals,
        cards,
      };

      const keys = [
        `${normalizeForMatch(espnHome)}_${normalizeForMatch(espnAway)}_${day}_${month}`,
        `${normalizeForMatch(espnHome)}_${normalizeForMatch(espnAway)}_${day}`,
      ];
      keys.forEach(k => { if (!espnByDay[k]) espnByDay[k] = entry; });
    });

    console.log(`[Merge] ESPN events fetched: ${Object.keys(espnByDay).length} (${scoreboard.length} events from API)`);
    const unmatched = [];

    const results = fixtures.map(f => {
      const tz = f.hostCity ? (Utils.venueTz(f.hostCity) || 'America/New_York') : 'America/New_York';
      const venueDate = Utils.formatVenueDate(f.kickoffUtc, tz);
      const day = venueDate.day;
      const month = venueDate.month;
      const espnHomeName = normalizeTeamName(f.homeTeam);
      const espnAwayName = normalizeTeamName(f.awayTeam);

      let espn = null;
      const tryKeys = [
        `${normalizeForMatch(espnHomeName)}_${normalizeForMatch(espnAwayName)}_${day}_${month}`,
        `${normalizeForMatch(espnHomeName)}_${normalizeForMatch(espnAwayName)}_${day}`,
      ];
      if (f.kickoffUtc) {
        const utcD = new Date(f.kickoffUtc);
        const utcDay = utcD.getUTCDate();
        const utcMonth = utcD.getUTCMonth();
        if (utcDay !== day || utcMonth !== month) {
          tryKeys.push(
            `${normalizeForMatch(espnHomeName)}_${normalizeForMatch(espnAwayName)}_${utcDay}_${utcMonth}`,
            `${normalizeForMatch(espnHomeName)}_${normalizeForMatch(espnAwayName)}_${utcDay}`,
          );
        }
      }
      for (const k of tryKeys) {
        if (espnByDay[k]) { espn = espnByDay[k]; break; }
      }
      if (!espn) {
        for (const key in espnByDay) {
          const e = espnByDay[key];
          const eHome = reverseMapName(e.espnHome);
          const eAway = reverseMapName(e.espnAway);
          if (normalizeForMatch(eHome) === normalizeForMatch(f.homeTeam) &&
              normalizeForMatch(eAway) === normalizeForMatch(f.awayTeam)) {
            espn = e;
            break;
          }
        }
      }
      if (!espn && !/^(winner|loser)\s/i.test(f.homeTeam) && !/^(winner|loser)\s/i.test(f.awayTeam)) {
        const fixtureNorms = [normalizeForMatch(espnHomeName), normalizeForMatch(espnAwayName)];
        for (const key in espnByDay) {
          if (!key.endsWith(`_${day}_${month}`) && !key.endsWith(`_${day}`)) continue;
          const e = espnByDay[key];
          const espnNorms = [normalizeForMatch(e.espnHome), normalizeForMatch(e.espnAway)];
          if (fixtureNorms.some(t => espnNorms.includes(t))) {
            espn = e; break;
          }
        }
      }

      if (!espn) {
        console.log(`[Merge] NO MATCH for #${f.matchNumber}: ${f.homeTeam} vs ${f.awayTeam} (${f.date}) — normalized: ${normalizeForMatch(espnHomeName)} vs ${normalizeForMatch(espnAwayName)}, day=${day}, month=${month}`);
        unmatched.push(`#${f.matchNumber} ${f.homeTeam} vs ${f.awayTeam}`);
      }

      return {
        id: f.matchNumber,
        homeTeam: f.homeTeam,
        awayTeam: f.awayTeam,
        group: f.group,
        stage: f.stage,
        date: Utils.formatBeijingDateStr(f.kickoffUtc) || f.date,
        kickoffUtc: f.kickoffUtc,
        stadium: f.stadium,
        hostCity: f.hostCity,
        espnId: espn?.espnId || null,
        status: resolveStatus(espn, f.kickoffUtc),
        statusDetail: espn?.statusDetail || '',
        progress: espn?.progress || '',
        period: espn?.period || 0,
        homeScore: espn?.homeScore ?? null,
        awayScore: espn?.awayScore ?? null,
        homePen: espn?.homePen ?? 0,
        awayPen: espn?.awayPen ?? 0,
        attendance: espn?.attendance || null,
        venue: f.stadium || espn?.venueName || '',
        hostCity: f.hostCity || '',
        homeTeamLogo: espn?.homeTeamLogo || '',
        awayTeamLogo: espn?.awayTeamLogo || '',
        homeTeamAbbr: espn?.homeTeamAbbr || '',
        awayTeamAbbr: espn?.awayTeamAbbr || '',
        goals: espn?.goals || [],
        cards: espn?.cards || [],
      };
    });
    if (unmatched.length > 0) {
      console.log(`[Merge] ${unmatched.length} / ${fixtures.length} fixtures unmatched: ${unmatched.join(', ')}`);
    }
    return results;
  }

  function isLive(status) {
    return ['in', 'in_progress', 'live', 'LIVE', 'IN_PLAY', 'PAUSED', 'STATUS_IN_PROGRESS', 'STATUS_HALFTIME'].includes(status);
  }

  function isFinished(status) {
    return ['post', 'finished', 'ft', 'FT', 'FINISHED', 'STATUS_FINAL', 'STATUS_FULL_TIME'].includes(status);
  }

  function resolveStatus(espn, kickoffUtc) {
    if (espn?.status && espn.status !== 'scheduled') return espn.status;
    const kickoff = new Date(kickoffUtc);
    const now = Date.now();
    const elapsed = now - kickoff.getTime();
    if (elapsed < 0) return 'scheduled';
    if (elapsed < 15 * 60 * 1000) return 'waiting';
    return 'nodata';
  }

  return {
    fetchFixtures, fetchScoreboard, fetchMatchSummary, mergeData, isLive, isFinished, resolveStatus,
  };
})();
