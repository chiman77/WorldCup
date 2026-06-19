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
    },
    'zh-tw': {
      title: 'FIFA 世界盃 2026',
      nav_schedule: '賽程',
      nav_standings: '積分榜',
      nav_bracket: '對陣圖',
      filter_by_date: '按日期',
      filter_by_group: '按分組',
      all_groups: '所有分組',
      loading: '載入中...',
      no_matches: '暫無比賽',
      vs: 'vs',
      finished: '已結束',
      live: '進行中',
      scheduled: '未開始',
      nodata: '暫無數據',
      waiting: '等待數據',
      halftime: '中場休息',
      extra_time: '加時',
      penalties: '罰球',
      group_stage: '小組賽',
      round_of_32: '32 強',
      round_of_16: '16 強',
      quarter_final: '8 強',
      semi_final: '4 強',
      third_place: '季軍賽',
      final: '決賽',
      attendance: '觀眾',
      venue: '球場',
      goals: '進球',
      goal: '進球',
      assists: '助攻',
      assist: '助攻',
      yellow_card: '黃牌',
      red_card: '紅牌',
      substitution: '換人',
      own_goal: '烏龍球',
      penalty_goal: '罰球',
      match_detail: '比賽詳情',
      goal_timeline: '進球時間線',
      events: '事件',
      match_num: '第{n}場',
      bracket_hint: '← 滑動 →',
      group_prefix: '第',
      winner: '勝',
      draw: '平',
      loser: '負',
      pts: '積分',
      gf: '進球',
      ga: '失球',
      gd: '淨勝',
      p: '場次',
      team: '球隊',
      form: '近5場',
      qualification: '晉級區',
      today: '今天',
      tomorrow: '明天',
      yesterday: '昨天',
      date_format: 'M月D日',
      kickoff: '開球',
      group_matchday: '小組賽第{day}輪',
      penalties: '罰球大戰',
      cards: '紅黃牌',
      city: '主辦城市',
      status: '狀態',
      champion: '冠軍',
      ft_pen: '罰球完賽',
      penalty_abbr: 'P',
      own_goal_abbr: 'OG',
      teams_and_matches: '{n}隊，每隊{m}輪',
      error_title: '數據加載失敗',
      error_detail: '請檢查網絡後刷新',
      tbd: '待定',
    }
  };

  const teamNames = {
    'Mexico': { zh: '墨西哥', en: 'Mexico', flag: '🇲🇽', espn: 'mex', info: { apps: 18, best: { zh: '1/4决赛（1970、1986）', en: 'Quarter-finals (1970, 1986)' }, intro: { zh: '中北美及加勒比海地区传统霸主，迄今已参赛18届，两次打入八强。1970年和1986年两次主办世界杯，有着狂热而忠诚的球迷文化。', en: 'Traditional CONCACAF powerhouse with 18 appearances and two quarter-final finishes. Hosted the World Cup in 1970 and 1986, known for passionate fan culture.' } } },
    'South Africa': { zh: '南非', en: 'South Africa', flag: '🇿🇦', espn: 'rsa', info: { apps: 4, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '非洲足球代表之一，1998年首次参赛。2010年成为首个主办世界杯的非洲国家，曾夺得非洲国家杯冠军。', en: 'African football representative, debuted in 1998. First African nation to host the World Cup in 2010.' } } },
    'Korea Republic': { zh: '韩国', 'zh-tw': '韓國', en: 'Korea Republic', flag: '🇰🇷', espn: 'kor', info: { apps: 12, best: { zh: '第4名（2002）', en: '4th place (2002)' }, intro: { zh: '亚洲足球强国，连续11届入围世界杯决赛圈。2002年作为东道主闯入四强，创亚洲球队最佳战绩，以顽强拼搏精神著称。', en: 'Asian football powerhouse with 11 consecutive World Cup appearances. Reached semi-finals as co-host in 2002, the best ever by an Asian team.' } } },
    'Czechia': { zh: '捷克', en: 'Czechia', flag: '🇨🇿', espn: 'cze', info: { apps: 10, best: { zh: '亚军（1934、1962，含捷克斯洛伐克时期）', en: 'Runners-up (1934, 1962 as Czechoslovakia)' }, intro: { zh: '东欧传统劲旅，前身捷克斯洛伐克曾两度闯入世界杯决赛。以严谨战术和青训体系闻名，培养出切赫、罗西基等球星。', en: 'Eastern European traditional power. As Czechoslovakia, reached two World Cup finals. Known for tactical discipline and youth development.' } } },
    'Canada': { zh: '加拿大', en: 'Canada', flag: '🇨🇦', espn: 'can', info: { apps: 3, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '北美洲新兴力量，2026年与美国、墨西哥联合主办世界杯。足球近年来发展迅速，拥有戴维斯等明星球员，上升势头强劲。', en: 'Emerging North American force, co-hosting 2026 World Cup. Football rapidly growing, featuring stars like Alphonso Davies.' } } },
    'Bosnia and Herzegovina': { zh: '波黑', 'zh-tw': '波赫', en: 'Bosnia & Herz.', flag: '🇧🇦', espn: 'bih', info: { apps: 2, best: { zh: '小组赛（2014）', en: 'Group stage (2014)' }, intro: { zh: '巴尔干地区的足球新军，2014年首次参赛即展现技术流风格。拥有哲科、皮亚尼奇等知名球星，足球潜力巨大。', en: 'Balkan football talent, debuted in 2014 with technical style. Produced stars like Džeko and Pjanić.' } } },
    'Switzerland': { zh: '瑞士', en: 'Switzerland', flag: '🇨🇭', espn: 'sui', info: { apps: 13, best: { zh: '1/4决赛（1934、1938、1954）', en: 'Quarter-finals (1934, 1938, 1954)' }, intro: { zh: '欧洲传统中坚力量，以防守组织严密著称。多次打入淘汰赛，青训体系完善，近年来持续产出优秀球员，国际排名稳居前列。', en: 'Solid European side with strong defensive organization. Consistent tournament participants with excellent youth development.' } } },
    'Qatar': { zh: '卡塔尔', 'zh-tw': '卡塔爾', en: 'Qatar', flag: '🇶🇦', espn: 'qat', info: { apps: 2, best: { zh: '小组赛（2022）', en: 'Group stage (2022)' }, intro: { zh: '2022年首次以东道主身份参赛，投入巨资发展足球。2023年亚洲杯冠军，近年进步显著，是亚洲足坛新贵。', en: 'Debuted as 2022 host nation with massive football investment. 2023 Asian Cup champions, showing rapid progress.' } } },
    'United States': { zh: '美国', 'zh-tw': '美國', en: 'USA', flag: '🇺🇸', espn: 'usa', info: { apps: 12, best: { zh: '第3名（1930）', en: '3rd place (1930)' }, intro: { zh: '北美足球代表，1930年首届世界杯即获季军。2026年联合主办，足球氛围持续升温，拥有普利西奇等新一代球星。', en: 'North American representative, finished 3rd in 1930 inaugural tournament. Co-hosting 2026 with growing soccer culture.' } } },
    'Paraguay': { zh: '巴拉圭', en: 'Paraguay', flag: '🇵🇾', espn: 'par', info: { apps: 9, best: { zh: '1/4决赛（2010）', en: 'Quarter-finals (2010)' }, intro: { zh: '南美传统劲旅，以坚韧防守著称。2010年闯入八强创最佳战绩，曾夺得美洲杯冠军，足球底蕴深厚。', en: 'Traditional South American side known for tenacious defense. Reached quarter-finals in 2010, their best-ever finish.' } } },
    'Australia': { zh: '澳大利亚', 'zh-tw': '澳洲', en: 'Australia', flag: '🇦🇺', espn: 'aus', info: { apps: 7, best: { zh: '16强（2006、2022）', en: 'Round of 16 (2006, 2022)' }, intro: { zh: '大洋洲转亚洲的足球代表，身体对抗出色。2006年和2022年打入十六强，多次参加世界杯正赛。', en: 'Transferred from Oceania to Asia, known for physical play. Reached Round of 16 in 2006 and 2022.' } } },
    'Turkiye': { zh: '土耳其', en: 'Türkiye', flag: '🇹🇷', espn: 'tur', info: { apps: 3, best: { zh: '第3名（2002）', en: '3rd place (2002)' }, intro: { zh: '欧亚交汇之处的足球强国，2002年世界杯勇夺季军，创造历史最佳战绩。以狂热球迷和激情球风闻名于世。', en: 'Cross-continental football power, finished 3rd in 2002 World Cup. Known for passionate fans and fiery style.' } } },
    'Brazil': { zh: '巴西', en: 'Brazil', flag: '🇧🇷', espn: 'bra', info: { apps: 23, best: { zh: '冠军（1958、1962、1970、1994、2002）', en: 'Champions (1958, 1962, 1970, 1994, 2002)' }, intro: { zh: '足球王国，五夺世界杯冠军，唯一全勤参赛国。以桑巴风格和华丽的个人技术闻名，贝利、罗纳尔多、内马尔等传奇的祖国，世界足球的象征。', en: 'Football kingdom, record 5 World Cup titles, only nation to play in every tournament. Famous for samba style and legendary players like Pelé, Ronaldo, and Neymar.' } } },
    'Morocco': { zh: '摩洛哥', en: 'Morocco', flag: '🇲🇦', espn: 'mar', info: { apps: 7, best: { zh: '第4名（2022）', en: '4th place (2022)' }, intro: { zh: '北非足球旗帜，2022年世界杯历史性闯入四强，首支达到这一高度的非洲和阿拉伯球队。以防守坚韧和团队协作著称。', en: 'North African football pride, historic semi-final run in 2022 — first African and Arab team to reach that stage. Known for defensive solidity.' } } },
    'Scotland': { zh: '苏格兰', 'zh-tw': '蘇格蘭', en: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', espn: 'sco', info: { apps: 9, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '现代足球发源地之一，拥有悠久足球传统。多次入围世界杯但尚未突破小组赛，以狂热球迷文化和激情氛围闻名。', en: 'One of football\'s birthplaces with rich tradition. Multiple World Cup appearances but never past group stage. Famous for passionate fans.' } } },
    'Haiti': { zh: '海地', en: 'Haiti', flag: '🇭🇹', espn: 'hai', info: { apps: 2, best: { zh: '小组赛（1974）', en: 'Group stage (1974)' }, intro: { zh: '加勒比海地区的足球代表，1974年首次参赛即给世人留下深刻印象。时隔52年重返世界杯舞台，令人期待。', en: 'Caribbean football representative, made lasting impression in 1974 debut. Returning to World Cup stage after 52 years.' } } },
    'Germany': { zh: '德国', 'zh-tw': '德國', en: 'Germany', flag: '🇩🇪', espn: 'ger', info: { apps: 21, best: { zh: '冠军（1954、1974、1990、2014）', en: 'Champions (1954, 1974, 1990, 2014)' }, intro: { zh: '欧洲足球霸主，四夺世界杯冠军，以钢铁意志和严谨战术著称。贝肯鲍尔、马特乌斯等传奇的祖国，是世界足球的标杆之一。', en: 'European football powerhouse with 4 World Cup titles, known for iron will and tactical precision. Home to legends like Beckenbauer and Matthäus.' } } },
    'Cote d\'Ivoire': { zh: '科特迪瓦', en: "Côte d'Ivoire", flag: '🇨🇮', espn: 'civ', info: { apps: 5, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '西非足球强国，21世纪初以德罗巴、亚亚·图雷等黄金一代球员崛起。曾夺非洲杯冠军，多次入围世界杯正赛。', en: 'West African football power that rose with the golden generation of Drogba and Yaya Touré. Regular World Cup participants.' } } },
    'Curacao': { zh: '库拉索', en: 'Curaçao', flag: '🇨🇼', espn: 'cuw', info: { apps: 1, best: { zh: '首次参赛', en: 'Debut' }, intro: { zh: '加勒比海岛国，首次参加世界杯正赛。足球近年来发展迅速，青训体系逐步完善，是国际足坛值得关注的新面孔。', en: 'Caribbean island nation making World Cup debut. Football developing rapidly, a new face on the global stage.' } } },
    'Ecuador': { zh: '厄瓜多尔', 'zh-tw': '厄瓜多爾', en: 'Ecuador', flag: '🇪🇨', espn: 'ecu', info: { apps: 5, best: { zh: '16强（2006）', en: 'Round of 16 (2006)' }, intro: { zh: '南美洲高原劲旅，利用高原主场优势闻名。2006年首次打入淘汰赛，近年来持续保持竞争力，青训产出稳定。', en: 'South American high-altitude powerhouse. Reached Round of 16 in 2006, consistently competitive in CONMEBOL.' } } },
    'Netherlands': { zh: '荷兰', 'zh-tw': '荷蘭', en: 'Netherlands', flag: '🇳🇱', espn: 'ned', info: { apps: 12, best: { zh: '亚军（1974、1978、2010）', en: 'Runners-up (1974, 1978, 2010)' }, intro: { zh: '欧洲足球劲旅，三次打入决赛均屈居亚军，被誉为"无冕之王"。全攻全守足球的代表，克鲁伊夫、范巴斯滕等传奇的祖国。', en: 'European giant, three-time World Cup runners-up — the "greatest never to win". Pioneers of Total Football, home to Cruyff and van Basten.' } } },
    'Japan': { zh: '日本', en: 'Japan', flag: '🇯🇵', espn: 'jpn', info: { apps: 8, best: { zh: '16强（2002、2010、2018、2022）', en: 'Round of 16 (2002, 2010, 2018, 2022)' }, intro: { zh: '亚洲足球标杆，连续八届参赛，以技术细腻和团队纪律著称。多次打入十六强，曾与韩国合办2002年世界杯。', en: 'Asian football standard-bearer with 8 consecutive appearances. Known for technical skill and team discipline, co-hosted 2002 World Cup.' } } },
    'Sweden': { zh: '瑞典', en: 'Sweden', flag: '🇸🇪', espn: 'swe', info: { apps: 13, best: { zh: '亚军（1958）', en: 'Runners-up (1958)' }, intro: { zh: '北欧足球劲旅，1958年以东道主身份闯入决赛获亚军。以身体对抗和团队协作见长，培养出伊布等世界级球星。', en: 'Nordic football power, finished runners-up as 1958 host. Known for physical play and teamwork, produced global stars like Zlatan.' } } },
    'Tunisia': { zh: '突尼斯', en: 'Tunisia', flag: '🇹🇳', espn: 'tun', info: { apps: 7, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '北非足球代表，多次参赛但尚未突破小组赛。以防守组织和团队纪律为特色，是阿拉伯足球的重要力量。', en: 'North African football representative with multiple appearances. Known for defensive organization and discipline.' } } },
    'Spain': { zh: '西班牙', en: 'Spain', flag: '🇪🇸', espn: 'esp', info: { apps: 17, best: { zh: '冠军（2010）', en: 'Champions (2010)' }, intro: { zh: '欧洲技术流代表，2010年首夺世界杯冠军。以传控足球风格引领世界潮流，曾连夺三届大赛冠军（2008-2012），黄金一代载入史册。', en: 'Technical European powerhouse, 2010 World Cup champions. Pioneered tiki-taka style, won three consecutive major tournaments (2008-2012).' } } },
    'Cabo Verde': { zh: '佛得角', en: 'Cabo Verde', flag: '🇨🇻', espn: 'cpv', info: { apps: 1, best: { zh: '首次参赛', en: 'Debut' }, intro: { zh: '大西洋岛国，首次参加世界杯正赛。近年来足球水平快速提升，创造了该国体育史上的里程碑时刻。', en: 'Atlantic island nation making World Cup debut. Football rapidly improving, achieving a historic milestone for the country.' } } },
    'Saudi Arabia': { zh: '沙特阿拉伯', en: 'Saudi Arabia', flag: '🇸🇦', espn: 'ksa', info: { apps: 7, best: { zh: '16强（1994）', en: 'Round of 16 (1994)' }, intro: { zh: '亚洲传统强队，1994年首次参赛即闯入十六强。以技术风格和足球投资闻名，曾在世界杯上击败世界冠军阿根廷。', en: 'Traditional Asian powerhouse, reached Round of 16 in debut 1994 tournament. Known for technical style and football investment.' } } },
    'Uruguay': { zh: '乌拉圭', 'zh-tw': '烏拉圭', en: 'Uruguay', flag: '🇺🇾', espn: 'uru', info: { apps: 15, best: { zh: '冠军（1930、1950）', en: 'Champions (1930, 1950)' }, intro: { zh: '南美三强之一，1930年首届世界杯冠军。两次夺冠、15次参赛，以顽强战斗精神和出色青训闻名，苏亚雷斯等球星辈出。', en: 'South American giant, winners of the inaugural 1930 World Cup. Known for fighting spirit and excellent youth production.' } } },
    'IR Iran': { zh: '伊朗', en: 'IR Iran', flag: '🇮🇷', espn: 'irn', info: { apps: 7, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '亚洲传统强队，亚洲杯三连冠得主。以钢铁防守和坚韧意志著称，多次入围世界杯，是亚洲足坛不可忽视的力量。', en: 'Traditional Asian power, three-time Asian Cup winners. Known for steel defense and never-say-die attitude.' } } },
    'New Zealand': { zh: '新西兰', 'zh-tw': '紐西蘭', en: 'New Zealand', flag: '🇳🇿', espn: 'nzl', info: { apps: 3, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '大洋洲足球霸主，多次代表该地区参加世界杯。以身体对抗和团队精神为特点，2026年将第三次踏上世界杯赛场。', en: 'Oceania football powerhouse, regular regional representative. Known for physical play and team spirit.' } } },
    'Belgium': { zh: '比利时', 'zh-tw': '比利時', en: 'Belgium', flag: '🇧🇪', espn: 'bel', info: { apps: 15, best: { zh: '第3名（2018）', en: '3rd place (2018)' }, intro: { zh: '西欧足球强国，2018年世界杯获季军创最佳战绩。拥有阿扎尔、德布劳内等黄金一代球员，以技术全面和战术素养著称。', en: 'Western European football power, finished 3rd in 2018 — their best result. Known for golden generation and tactical quality.' } } },
    'Egypt': { zh: '埃及', en: 'Egypt', flag: '🇪🇬', espn: 'egy', info: { apps: 4, best: { zh: '小组赛', en: 'Group stage' }, intro: { zh: '北非足球旗帜，七次非洲杯冠军（历史最多）。以萨拉赫为代表的球星阵容强大，拥有深厚悠久的足球传统和文化。', en: 'North African football giant, record 7 African Cup of Nations titles. Boasts stars like Salah, with deep football tradition.' } } },
    'France': { zh: '法国', 'zh-tw': '法國', en: 'France', flag: '🇫🇷', espn: 'fra', info: { apps: 17, best: { zh: '冠军（1998、2018）', en: 'Champions (1998, 2018)' }, intro: { zh: '欧洲足球豪门，两次夺得世界杯冠军。以移民融合和多元化人才体系著称，齐达内、姆巴佩等世界级球星的祖国，青训独步天下。', en: 'European football powerhouse, two-time World Cup champions. Known for multicultural talent pipeline, home to Zidane and Mbappé.' } } },
    'Senegal': { zh: '塞内加尔', 'zh-tw': '塞內加爾', en: 'Senegal', flag: '🇸🇳', espn: 'sen', info: { apps: 4, best: { zh: '1/4决赛（2002）', en: 'Quarter-finals (2002)' }, intro: { zh: '西非足球劲旅，2002年首次参赛即闯入八强震惊世界。2022年首夺非洲杯冠军，马内等球星领衔，实力不容小觑。', en: 'West African football force, stunned the world by reaching QF in 2002 debut. Won first AFCON in 2022, led by stars like Mané.' } } },
    'Iraq': { zh: '伊拉克', en: 'Iraq', flag: '🇮🇶', espn: 'irq', info: { apps: 2, best: { zh: '小组赛（1986）', en: 'Group stage (1986)' }, intro: { zh: '中东足球代表，2007年亚洲杯冠军。历经战乱仍坚持足球发展，时隔40年重返世界杯舞台，展现坚韧不拔的精神。', en: 'Middle Eastern football representative, 2007 Asian Cup champions. Continued football development through adversity.' } } },
    'Norway': { zh: '挪威', en: 'Norway', flag: '🇳🇴', espn: 'nor', info: { apps: 4, best: { zh: '16强（1998）', en: 'Round of 16 (1998)' }, intro: { zh: '北欧足球力量，以身体素质和高空优势闻名。1998年打入十六强，培养出哈兰德等世界级前锋，时隔多年重返世界杯。', en: 'Nordic football force known for physical prowess. Reached Round of 16 in 1998, produced global stars like Haaland.' } } },
    'Argentina': { zh: '阿根廷', en: 'Argentina', flag: '🇦🇷', espn: 'arg', info: { apps: 19, best: { zh: '冠军（1978、1986、2022）', en: 'Champions (1978, 1986, 2022)' }, intro: { zh: '南美足球豪门，三夺世界杯冠军，现任世界冠军。以天才球星辈出闻名，马拉多纳和梅西的祖国，足球热情融入民族血液。', en: 'South American giant, three-time World Cup champions and current title holders. Home to Maradona and Messi, football runs in the national blood.' } } },
    'Algeria': { zh: '阿尔及利亚', 'zh-tw': '阿爾及利亞', en: 'Algeria', flag: '🇩🇿', espn: 'alg', info: { apps: 5, best: { zh: '16强（2014）', en: 'Round of 16 (2014)' }, intro: { zh: '北非技术流代表，2014年世界杯打入十六强创最佳战绩。曾两夺非洲杯冠军，以流畅传控风格著称，足球文化浓厚。', en: 'North African technical side, reached Round of 16 in 2014 — their best finish. Two-time AFCON winners, known for fluid passing.' } } },
    'Austria': { zh: '奥地利', 'zh-tw': '奧地利', en: 'Austria', flag: '🇦🇹', espn: 'aut', info: { apps: 8, best: { zh: '第3名（1954）', en: '3rd place (1954)' }, intro: { zh: '中欧传统劲旅，1954年世界杯获季军。以严谨战术和技术风格著称，与德国足球渊源深厚，曾培养出多名世界级球星。', en: 'Central European traditional power, finished 3rd in 1954. Known for tactical discipline and technical style.' } } },
    'Jordan': { zh: '约旦', 'zh-tw': '約旦', en: 'Jordan', flag: '🇯🇴', espn: 'jor', info: { apps: 1, best: { zh: '首次参赛', en: 'Debut' }, intro: { zh: '中东足球新生力量，首次参加世界杯正赛。近年来进步迅速，创造了国家足球历史的里程碑时刻，亚洲足坛新势力。', en: 'Middle Eastern football emerging force making World Cup debut. Rapid recent progress, a historic milestone for the nation.' } } },
    'England': { zh: '英格兰', 'zh-tw': '英格蘭', en: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', espn: 'eng', info: { apps: 17, best: { zh: '冠军（1966）', en: 'Champions (1966)' }, intro: { zh: '现代足球发源地，1966年本土夺冠。英超联赛世界第一，拥有深厚足球传统和狂热球迷文化，近年连续两届欧洲杯亚军。', en: 'Birthplace of modern football, 1966 World Cup champions. Home to the Premier League, the world\'s most-watched football league.' } } },
    'Ghana': { zh: '加纳', en: 'Ghana', flag: '🇬🇭', espn: 'gha', info: { apps: 5, best: { zh: '1/4决赛（2010）', en: 'Quarter-finals (2010)' }, intro: { zh: '西非足球强国，2010年闯入八强追平非洲最佳战绩。以身体对抗和技术结合的风格著称，青训体系在非洲名列前茅。', en: 'West African football power, reached QF in 2010 matching Africa\'s best. Known for combining physicality with technique.' } } },
    'Croatia': { zh: '克罗地亚', 'zh-tw': '克羅地亞', en: 'Croatia', flag: '🇭🇷', espn: 'cro', info: { apps: 7, best: { zh: '亚军（2018）、季军（2022）', en: 'Runners-up (2018), 3rd place (2022)' }, intro: { zh: '巴尔干足球强国，2018年世界杯历史性闯入决赛获亚军，2022年再获季军。以中场大师辈出和技术实力闻名，莫德里奇领衔黄金一代。', en: 'Balkan football powerhouse, stunned the world as 2018 runners-up and 2022 third place. Known for world-class midfield production.' } } },
    'Panama': { zh: '巴拿马', 'zh-tw': '巴拿馬', en: 'Panama', flag: '🇵🇦', espn: 'pan', info: { apps: 2, best: { zh: '小组赛（2018）', en: 'Group stage (2018)' }, intro: { zh: '中美洲足球代表，2018年首次参赛即打入一球留下印记。以顽强拼搏精神著称，时隔八年重返世界杯舞台。', en: 'Central American football representative, scored their first World Cup goal in 2018 debut. Known for fighting spirit.' } } },
    'Portugal': { zh: '葡萄牙', en: 'Portugal', flag: '🇵🇹', espn: 'por', info: { apps: 9, best: { zh: '第3名（1966）', en: '3rd place (1966)' }, intro: { zh: '伊比利亚半岛足球强国，1966年世界杯获季军。2016年欧洲杯冠军，以C罗为代表的黄金一代闻名于世，青训体系享誉全球。', en: 'Iberian football power, finished 3rd in 1966. 2016 European champions, famous for golden generation led by Cristiano Ronaldo.' } } },
    'Congo DR': { zh: '刚果(金)', 'zh-tw': '剛果(金)', en: 'DR Congo', flag: '🇨🇩', espn: 'cod', info: { apps: 2, best: { zh: '小组赛（1974，以扎伊尔名义）', en: 'Group stage (1974 as Zaire)' }, intro: { zh: '中非足球代表，1974年以扎伊尔名义成为首支参赛的撒哈拉以南非洲球队。时隔52年重返世界杯，足球传统深厚。', en: 'Central African representative, first sub-Saharan African team at a World Cup (1974 as Zaire). Returning after 52 years.' } } },
    'Uzbekistan': { zh: '乌兹别克斯坦', 'zh-tw': '烏茲別克', en: 'Uzbekistan', flag: '🇺🇿', espn: 'uzb', info: { apps: 1, best: { zh: '首次参赛', en: 'Debut' }, intro: { zh: '中亚足球新生力量，首次参加世界杯正赛。近年来强势崛起，青训体系成效显著，是国际足坛值得关注的新面孔。', en: 'Central Asian football emerging force making historic World Cup debut. Rising power on the global stage.' } } },
    'Colombia': { zh: '哥伦比亚', 'zh-tw': '哥倫比亞', en: 'Colombia', flag: '🇨🇴', espn: 'col', info: { apps: 7, best: { zh: '1/4决赛（2014）', en: 'Quarter-finals (2014)' }, intro: { zh: '南美技术流代表，2014年闯入八强创历史最佳。以华丽进攻和球星J罗闻名，足球文化深厚，球迷热情奔放。', en: 'South American technical side, reached QF in 2014 — their best result. Known for flair, attacking football, and James Rodríguez.' } } },
  };

  const ESPN_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/countries/500/';

  function teamLogoUrl(name) {
    const normalized = teamAliases[name] || name;
    const info = teamNames[normalized];
    if (info && info.espn) return `${ESPN_LOGO_BASE}${info.espn}.png`;
    return '';
  }

  const cityNames = {
    'mexico-city': { zh: '墨西哥城', 'zh-tw': '墨西哥城', en: 'Mexico City' },
    'guadalajara': { zh: '瓜达拉哈拉', 'zh-tw': '瓜達拉哈拉', en: 'Guadalajara' },
    'monterrey': { zh: '蒙特雷', 'zh-tw': '蒙特雷', en: 'Monterrey' },
    'toronto': { zh: '多伦多', 'zh-tw': '多倫多', en: 'Toronto' },
    'vancouver': { zh: '温哥华', 'zh-tw': '溫哥華', en: 'Vancouver' },
    'los-angeles': { zh: '洛杉矶', 'zh-tw': '洛杉磯', en: 'Los Angeles' },
    'san-francisco': { zh: '旧金山', 'zh-tw': '舊金山', en: 'San Francisco' },
    'seattle': { zh: '西雅图', 'zh-tw': '西雅圖', en: 'Seattle' },
    'houston': { zh: '休斯顿', 'zh-tw': '休士頓', en: 'Houston' },
    'dallas': { zh: '达拉斯', 'zh-tw': '達拉斯', en: 'Dallas' },
    'kansas-city': { zh: '堪萨斯城', 'zh-tw': '堪薩斯城', en: 'Kansas City' },
    'chicago': { zh: '芝加哥', 'zh-tw': '芝加哥', en: 'Chicago' },
    'boston': { zh: '波士顿', 'zh-tw': '波士頓', en: 'Boston' },
    'new-york': { zh: '纽约', 'zh-tw': '紐約', en: 'New York' },
    'philadelphia': { zh: '费城', 'zh-tw': '費城', en: 'Philadelphia' },
    'atlanta': { zh: '亚特兰大', 'zh-tw': '亞特蘭大', en: 'Atlanta' },
    'miami': { zh: '迈阿密', 'zh-tw': '邁阿密', en: 'Miami' },
  };

  const statusDetailMap = {
    'Final': { zh: '完赛', 'zh-tw': '完賽', en: 'Final' },
    'Full Time': { zh: '完赛', 'zh-tw': '完賽', en: 'Full Time' },
    'FT': { zh: '完赛', 'zh-tw': '完賽', en: 'FT' },
    '1st Half': { zh: '上半场', 'zh-tw': '上半場', en: '1st Half' },
    '2nd Half': { zh: '下半场', 'zh-tw': '下半場', en: '2nd Half' },
    'Half Time': { zh: '中场休息', 'zh-tw': '中場休息', en: 'Half Time' },
    'Extra Time': { zh: '加时赛', 'zh-tw': '延長賽', en: 'Extra Time' },
    'Penalty': { zh: '点球大战', 'zh-tw': '罰球大戰', en: 'Penalty' },
    'Scheduled': { zh: '未开始', 'zh-tw': '未開始', en: 'Scheduled' },
    'Postponed': { zh: '延期', 'zh-tw': '延期', en: 'Postponed' },
    'Cancelled': { zh: '取消', 'zh-tw': '取消', en: 'Cancelled' },
    'Suspended': { zh: '暂停', 'zh-tw': '暫停', en: 'Suspended' },
    'Delayed': { zh: '延迟', 'zh-tw': '延遲', en: 'Delayed' },
    'Starts': { zh: '即将开始', 'zh-tw': '即將開始', en: 'Starts' },
    'In Progress': { zh: '进行中', 'zh-tw': '進行中', en: 'In Progress' },
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
    'Estadio Azteca': { zh: '阿兹特克体育场', 'zh-tw': '阿茲特克體育場', en: 'Estadio Azteca' },
    'Estadio Akron': { zh: '阿克伦体育场', 'zh-tw': '阿克倫體育場', en: 'Estadio Akron' },
    'Estadio BBVA': { zh: 'BBVA体育场', 'zh-tw': 'BBVA體育場', en: 'Estadio BBVA' },
    'Mercedes-Benz Stadium': { zh: '梅赛德斯-奔驰体育场', 'zh-tw': '梅賽德斯-賓士體育場', en: 'Mercedes-Benz Stadium' },
    'Gillette Stadium': { zh: '吉列体育场', 'zh-tw': '吉列體育場', en: 'Gillette Stadium' },
    'AT&T Stadium': { zh: 'AT&T体育场', 'zh-tw': 'AT&T體育場', en: 'AT&T Stadium' },
    'NRG Stadium': { zh: 'NRG体育场', 'zh-tw': 'NRG體育場', en: 'NRG Stadium' },
    'Arrowhead Stadium': { zh: '箭头体育场', 'zh-tw': '箭頭體育場', en: 'Arrowhead Stadium' },
    'SoFi Stadium': { zh: 'SoFi体育场', 'zh-tw': 'SoFi體育場', en: 'SoFi Stadium' },
    'Hard Rock Stadium': { zh: '硬石体育场', 'zh-tw': '硬石體育場', en: 'Hard Rock Stadium' },
    'MetLife Stadium': { zh: '大都会体育场', 'zh-tw': '大都會體育場', en: 'MetLife Stadium' },
    'Lincoln Financial Field': { zh: '林肯金融体育场', 'zh-tw': '林肯金融體育場', en: 'Lincoln Financial Field' },
    'Levi\'s Stadium': { zh: '李维斯体育场', 'zh-tw': '李維斯體育場', en: "Levi's Stadium" },
    'Lumen Field': { zh: '流明体育场', 'zh-tw': '流明體育場', en: 'Lumen Field' },
    'BMO Field': { zh: 'BMO体育场', 'zh-tw': 'BMO體育場', en: 'BMO Field' },
    'BC Place': { zh: 'BC广场', 'zh-tw': 'BC廣場', en: 'BC Place' },
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
    const val = info[currentLang];
    if (val) return val;
    if (currentLang === 'zh-tw') return info.zh || info.en || name;
    return info.en || name;
  }

  function teamFlag(name) {
    const normalized = teamAliases[name] || name;
    return (teamNames[normalized] || {}).flag || '🏳️';
  }

  function teamInfo(name) {
    const normalized = teamAliases[name] || name;
    const entry = teamNames[normalized];
    if (!entry || !entry.info) return '';
    const { apps, best, intro } = entry.info;
    const teamName = entry[currentLang] || (currentLang === 'zh-tw' ? entry.zh : null) || entry.en || normalized;
    const bestStr = best[currentLang] || best.zh || best.en;
    const introStr = intro[currentLang] || intro.zh || intro.en;
    const header = `${teamName} | ${apps} ${currentLang.startsWith('zh') ? '次參賽' : 'appearances'} | ${bestStr}`;
    const body = introStr;
    return header + '\n' + body;
  }

  function lang() { return currentLang; }
  function isZh() { return currentLang === 'zh' || currentLang === 'zh-tw'; }
  function setLang(l) {
    if (!['zh', 'zh-tw', 'en'].includes(l)) return;
    currentLang = l;
    localStorage.setItem('wc_lang', l);
  }
  function toggleLang() {
    const ORDER = ['zh', 'zh-tw', 'en'];
    const idx = ORDER.indexOf(currentLang);
    setLang(ORDER[(idx + 1) % ORDER.length]);
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
    const btnLabels = { 'zh': '繁', 'zh-tw': 'EN', 'en': '中' };
    if (langBtn) langBtn.textContent = btnLabels[currentLang] || 'EN';
  }

  return { t, tParam, team, teamFlag, teamInfo, lang, isZh, setLang, toggleLang, applyTranslations, teamNames, teamAliases, teamLogoUrl, cityName, venueName, translateStatusDetail };
})();
