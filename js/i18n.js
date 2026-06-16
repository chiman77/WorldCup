const I18n = (() => {
  let currentLang = localStorage.getItem('wc_lang') || 'zh';

  const uiStrings = {
    zh: {
      title: 'FIFA 世界杯 2026',
      nav_schedule: '赛程',
      nav_standings: '积分榜',
      nav_bracket: '对阵图',
      filter_by_date: '按日期',
      filter_by_group: '按分组',
      all_groups: '全部分组',
      loading: '加载中...',
      no_matches: '暂无比赛',
      vs: 'vs',
      finished: '已结束',
      live: '进行中',
      scheduled: '未开始',
      nodata: '暂无数据',
      waiting: '等待数据',
      halftime: '中场休息',
      extra_time: '加时',
      penalties: '点球',
      group_stage: '小组赛',
      round_of_32: '32 强',
      round_of_16: '16 强',
      quarter_final: '1/4 决赛',
      semi_final: '半决赛',
      third_place: '季军赛',
      final: '决赛',
      attendance: '观众',
      venue: '球场',
      goals: '进球',
      goal: '进球',
      assists: '助攻',
      assist: '助攻',
      yellow_card: '黄牌',
      red_card: '红牌',
      substitution: '换人',
      own_goal: '乌龙球',
      penalty_goal: '点球',
      match_detail: '比赛详情',
      goal_timeline: '进球时间线',
      events: '事件',
      match_num: '第{n}场',
      bracket_hint: '← 滑动 →',
      group_prefix: '小组',
      winner: '胜',
      draw: '平',
      loser: '负',
      pts: '积分',
      gf: '进球',
      ga: '失球',
      gd: '净胜',
      p: '场次',
      team: '球队',
      form: '近5场',
      qualification: '晋级区',
      today: '今天',
      tomorrow: '明天',
      yesterday: '昨天',
      date_format: 'M月D日',
      kickoff: '开球',
      group_matchday: '小组赛第{day}轮',
      penalties: '点球大战',
      cards: '红黄牌',
      city: '主办城市',
      status: '状态',
      champion: '冠军',
      ft_pen: '点球完赛',
      penalty_abbr: 'P',
      own_goal_abbr: 'OG',
      teams_and_matches: '{n}队，每队{m}轮',
      error_title: '数据加载失败',
      error_detail: '请检查网络后刷新',
      tbd: '待定',
    },
    en: {
      title: 'FIFA World Cup 2026',
      nav_schedule: 'Schedule',
      nav_standings: 'Standings',
      nav_bracket: 'Bracket',
      filter_by_date: 'By Date',
      filter_by_group: 'By Group',
      all_groups: 'All Groups',
      loading: 'Loading...',
      no_matches: 'No matches',
      vs: 'vs',
      finished: 'FT',
      live: 'LIVE',
      scheduled: 'SCHEDULED',
      nodata: 'No Data',
      waiting: 'Awaiting Data',
      halftime: 'HT',
      extra_time: 'ET',
      penalties: 'PEN',
      group_stage: 'Group Stage',
      round_of_32: 'Round of 32',
      round_of_16: 'Round of 16',
      quarter_final: 'Quarter-Final',
      semi_final: 'Semi-Final',
      third_place: 'Third Place',
      final: 'Final',
      attendance: 'Attendance',
      venue: 'Venue',
      goals: 'Goals',
      goal: 'Goal',
      assists: 'Assists',
      assist: 'Assist',
      yellow_card: 'Yellow Card',
      red_card: 'Red Card',
      substitution: 'Substitution',
      own_goal: 'Own Goal',
      penalty_goal: 'Penalty',
      match_detail: 'Match Detail',
      goal_timeline: 'Goal Timeline',
      events: 'Events',
      match_num: 'Match {n}',
      bracket_hint: '← Scroll →',
      group_prefix: 'Group',
      winner: 'W',
      draw: 'D',
      loser: 'L',
      pts: 'Pts',
      gf: 'GF',
      ga: 'GA',
      gd: 'GD',
      p: 'P',
      team: 'Team',
      form: 'Form',
      qualification: 'Qualification',
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      date_format: 'MMM D',
      kickoff: 'Kickoff',
      group_matchday: 'Group Stage MD{day}',
      penalties: 'Penalties',
      cards: 'Cards',
      city: 'Host City',
      status: 'Status',
      champion: 'Champion',
      ft_pen: 'FT (PEN)',
      penalty_abbr: 'P',
      own_goal_abbr: 'OG',
      teams_and_matches: '{n} teams, {m} matches each',
      error_title: 'Failed to load data',
      error_detail: 'Check network and refresh',
      tbd: 'TBD',
    }
  };

  const teamNames = {
    'Mexico': { zh: '墨西哥', en: 'Mexico', flag: '🇲🇽', espn: 'mex' },
    'South Africa': { zh: '南非', en: 'South Africa', flag: '🇿🇦', espn: 'rsa' },
    'Korea Republic': { zh: '韩国', en: 'Korea Republic', flag: '🇰🇷', espn: 'kor' },
    'Czechia': { zh: '捷克', en: 'Czechia', flag: '🇨🇿', espn: 'cze' },
    'Canada': { zh: '加拿大', en: 'Canada', flag: '🇨🇦', espn: 'can' },
    'Bosnia and Herzegovina': { zh: '波黑', en: 'Bosnia & Herz.', flag: '🇧🇦', espn: 'bih' },
    'Switzerland': { zh: '瑞士', en: 'Switzerland', flag: '🇨🇭', espn: 'sui' },
    'Qatar': { zh: '卡塔尔', en: 'Qatar', flag: '🇶🇦', espn: 'qat' },
    'United States': { zh: '美国', en: 'USA', flag: '🇺🇸', espn: 'usa' },
    'Paraguay': { zh: '巴拉圭', en: 'Paraguay', flag: '🇵🇾', espn: 'par' },
    'Australia': { zh: '澳大利亚', en: 'Australia', flag: '🇦🇺', espn: 'aus' },
    'Turkiye': { zh: '土耳其', en: 'Türkiye', flag: '🇹🇷', espn: 'tur' },
    'Brazil': { zh: '巴西', en: 'Brazil', flag: '🇧🇷', espn: 'bra' },
    'Morocco': { zh: '摩洛哥', en: 'Morocco', flag: '🇲🇦', espn: 'mar' },
    'Scotland': { zh: '苏格兰', en: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', espn: 'sco' },
    'Haiti': { zh: '海地', en: 'Haiti', flag: '🇭🇹', espn: 'hai' },
    'Germany': { zh: '德国', en: 'Germany', flag: '🇩🇪', espn: 'ger' },
    'Cote d\'Ivoire': { zh: '科特迪瓦', en: "Côte d'Ivoire", flag: '🇨🇮', espn: 'civ' },
    'Curacao': { zh: '库拉索', en: 'Curaçao', flag: '🇨🇼', espn: 'cuw' },
    'Ecuador': { zh: '厄瓜多尔', en: 'Ecuador', flag: '🇪🇨', espn: 'ecu' },
    'Netherlands': { zh: '荷兰', en: 'Netherlands', flag: '🇳🇱', espn: 'ned' },
    'Japan': { zh: '日本', en: 'Japan', flag: '🇯🇵', espn: 'jpn' },
    'Sweden': { zh: '瑞典', en: 'Sweden', flag: '🇸🇪', espn: 'swe' },
    'Tunisia': { zh: '突尼斯', en: 'Tunisia', flag: '🇹🇳', espn: 'tun' },
    'Spain': { zh: '西班牙', en: 'Spain', flag: '🇪🇸', espn: 'esp' },
    'Cabo Verde': { zh: '佛得角', en: 'Cabo Verde', flag: '🇨🇻', espn: 'cpv' },
    'Saudi Arabia': { zh: '沙特阿拉伯', en: 'Saudi Arabia', flag: '🇸🇦', espn: 'ksa' },
    'Uruguay': { zh: '乌拉圭', en: 'Uruguay', flag: '🇺🇾', espn: 'uru' },
    'IR Iran': { zh: '伊朗', en: 'IR Iran', flag: '🇮🇷', espn: 'irn' },
    'New Zealand': { zh: '新西兰', en: 'New Zealand', flag: '🇳🇿', espn: 'nzl' },
    'Belgium': { zh: '比利时', en: 'Belgium', flag: '🇧🇪', espn: 'bel' },
    'Egypt': { zh: '埃及', en: 'Egypt', flag: '🇪🇬', espn: 'egy' },
    'France': { zh: '法国', en: 'France', flag: '🇫🇷', espn: 'fra' },
    'Senegal': { zh: '塞内加尔', en: 'Senegal', flag: '🇸🇳', espn: 'sen' },
    'Iraq': { zh: '伊拉克', en: 'Iraq', flag: '🇮🇶', espn: 'irq' },
    'Norway': { zh: '挪威', en: 'Norway', flag: '🇳🇴', espn: 'nor' },
    'Argentina': { zh: '阿根廷', en: 'Argentina', flag: '🇦🇷', espn: 'arg' },
    'Algeria': { zh: '阿尔及利亚', en: 'Algeria', flag: '🇩🇿', espn: 'alg' },
    'Austria': { zh: '奥地利', en: 'Austria', flag: '🇦🇹', espn: 'aut' },
    'Jordan': { zh: '约旦', en: 'Jordan', flag: '🇯🇴', espn: 'jor' },
    'England': { zh: '英格兰', en: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', espn: 'eng' },
    'Ghana': { zh: '加纳', en: 'Ghana', flag: '🇬🇭', espn: 'gha' },
    'Croatia': { zh: '克罗地亚', en: 'Croatia', flag: '🇭🇷', espn: 'cro' },
    'Panama': { zh: '巴拿马', en: 'Panama', flag: '🇵🇦', espn: 'pan' },
    'Portugal': { zh: '葡萄牙', en: 'Portugal', flag: '🇵🇹', espn: 'por' },
    'Congo DR': { zh: '刚果(金)', en: 'DR Congo', flag: '🇨🇩', espn: 'cod' },
    'Uzbekistan': { zh: '乌兹别克斯坦', en: 'Uzbekistan', flag: '🇺🇿', espn: 'uzb' },
    'Colombia': { zh: '哥伦比亚', en: 'Colombia', flag: '🇨🇴', espn: 'col' },
  };

  const ESPN_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/countries/500/';

  function teamLogoUrl(name) {
    const normalized = teamAliases[name] || name;
    const info = teamNames[normalized];
    if (info && info.espn) return `${ESPN_LOGO_BASE}${info.espn}.png`;
    return '';
  }

  const cityNames = {
    'mexico-city': { zh: '墨西哥城', en: 'Mexico City' },
    'guadalajara': { zh: '瓜达拉哈拉', en: 'Guadalajara' },
    'monterrey': { zh: '蒙特雷', en: 'Monterrey' },
    'toronto': { zh: '多伦多', en: 'Toronto' },
    'vancouver': { zh: '温哥华', en: 'Vancouver' },
    'los-angeles': { zh: '洛杉矶', en: 'Los Angeles' },
    'san-francisco': { zh: '旧金山', en: 'San Francisco' },
    'seattle': { zh: '西雅图', en: 'Seattle' },
    'houston': { zh: '休斯顿', en: 'Houston' },
    'dallas': { zh: '达拉斯', en: 'Dallas' },
    'kansas-city': { zh: '堪萨斯城', en: 'Kansas City' },
    'chicago': { zh: '芝加哥', en: 'Chicago' },
    'boston': { zh: '波士顿', en: 'Boston' },
    'new-york': { zh: '纽约', en: 'New York' },
    'philadelphia': { zh: '费城', en: 'Philadelphia' },
    'atlanta': { zh: '亚特兰大', en: 'Atlanta' },
    'miami': { zh: '迈阿密', en: 'Miami' },
  };

  const statusDetailMap = {
    'Final': { zh: '完赛', en: 'Final' },
    'Full Time': { zh: '完赛', en: 'Full Time' },
    'FT': { zh: '完赛', en: 'FT' },
    '1st Half': { zh: '上半场', en: '1st Half' },
    '2nd Half': { zh: '下半场', en: '2nd Half' },
    'Half Time': { zh: '中场休息', en: 'Half Time' },
    'Extra Time': { zh: '加时赛', en: 'Extra Time' },
    'Penalty': { zh: '点球大战', en: 'Penalty' },
    'Scheduled': { zh: '未开始', en: 'Scheduled' },
    'Postponed': { zh: '延期', en: 'Postponed' },
    'Cancelled': { zh: '取消', en: 'Cancelled' },
    'Suspended': { zh: '暂停', en: 'Suspended' },
    'Delayed': { zh: '延迟', en: 'Delayed' },
    'Starts': { zh: '即将开始', en: 'Starts' },
    'In Progress': { zh: '进行中', en: 'In Progress' },
  };

  function translateStatusDetail(detail) {
    if (!detail) return '';
    const entry = statusDetailMap[detail];
    if (entry) return entry[currentLang] || entry.en;
    for (const key in statusDetailMap) {
      if (detail.startsWith(key)) {
        const entry = statusDetailMap[key];
        const suffix = detail.slice(key.length);
        return (entry[currentLang] || entry.en) + suffix;
      }
    }
    return detail;
  }

  const venueNames = {
    'Estadio Azteca': { zh: '阿兹特克体育场', en: 'Estadio Azteca' },
    'Estadio Akron': { zh: '阿克伦体育场', en: 'Estadio Akron' },
    'Estadio BBVA': { zh: 'BBVA体育场', en: 'Estadio BBVA' },
    'Mercedes-Benz Stadium': { zh: '梅赛德斯-奔驰体育场', en: 'Mercedes-Benz Stadium' },
    'Gillette Stadium': { zh: '吉列体育场', en: 'Gillette Stadium' },
    'AT&T Stadium': { zh: 'AT&T体育场', en: 'AT&T Stadium' },
    'NRG Stadium': { zh: 'NRG体育场', en: 'NRG Stadium' },
    'Arrowhead Stadium': { zh: '箭头体育场', en: 'Arrowhead Stadium' },
    'SoFi Stadium': { zh: 'SoFi体育场', en: 'SoFi Stadium' },
    'Hard Rock Stadium': { zh: '硬石体育场', en: 'Hard Rock Stadium' },
    'MetLife Stadium': { zh: '大都会体育场', en: 'MetLife Stadium' },
    'Lincoln Financial Field': { zh: '林肯金融体育场', en: 'Lincoln Financial Field' },
    'Levi\'s Stadium': { zh: '李维斯体育场', en: "Levi's Stadium" },
    'Lumen Field': { zh: '流明体育场', en: 'Lumen Field' },
    'BMO Field': { zh: 'BMO体育场', en: 'BMO Field' },
    'BC Place': { zh: 'BC广场', en: 'BC Place' },
  };

  function cityName(slug) {
    if (!slug) return '';
    const info = cityNames[slug];
    if (!info) return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return info[currentLang] || info.en;
  }

  function venueName(name) {
    if (!name) return '';
    const info = venueNames[name];
    return (info && info[currentLang]) || name;
  }

  const teamAliases = {
    'USA': 'United States',
    'Korea Republic': 'Korea Republic',
    'Czech Republic': 'Czechia',
    'Czech': 'Czechia',
    'South Korea': 'Korea Republic',
    'Iran': 'IR Iran',
    'Ivory Coast': "Cote d'Ivoire",
    'Côte d\'Ivoire': "Cote d'Ivoire",
    'DR Congo': 'Congo DR',
    'Congo': 'Congo DR',
    'Cabo Verde': 'Cabo Verde',
    'Cape Verde': 'Cabo Verde',
    'Cape Verde': 'Cabo Verde',
    'Iran': 'IR Iran',
    'New Zealand': 'New Zealand',
    'Saudi Arabia': 'Saudi Arabia',
  };

  function t(key) {
    return uiStrings[currentLang]?.[key] || uiStrings.en[key] || key;
  }

  function tParam(key, params) {
    let str = t(key);
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
      });
    }
    return str;
  }

  function team(name, field = null) {
    const normalized = teamAliases[name] || name;
    const info = teamNames[normalized] || { zh: name, en: name, flag: '🏳️' };
    if (field === 'flag') return info.flag;
    if (field) return info[field] || name;
    return info[currentLang] || info.en || name;
  }

  function teamFlag(name) {
    const normalized = teamAliases[name] || name;
    return (teamNames[normalized] || {}).flag || '🏳️';
  }

  function lang() { return currentLang; }
  function isZh() { return currentLang === 'zh'; }
  function setLang(l) {
    currentLang = l;
    localStorage.setItem('wc_lang', l);
  }
  function toggleLang() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
    return currentLang;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated) el.textContent = translated;
    });
    document.title = t('title');
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
  }

  return { t, tParam, team, teamFlag, lang, isZh, setLang, toggleLang, applyTranslations, teamNames, teamAliases, teamLogoUrl, cityName, venueName, translateStatusDetail };
})();
