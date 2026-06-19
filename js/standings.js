const Standings = (() => {
  const GROUP_TOTAL = 6;

  function render(matchData, selectedGroup) {
    const groups = Utils.computeStandings(matchData);
    let html = '<div class="flex flex-wrap gap-2 mb-6">';
    html += `<button onclick="Standings.handleGroupFilter('all')" class="date-btn ${!selectedGroup || selectedGroup === 'all' ? 'active' : ''}">${I18n.t('all_groups')}</button>`;
    Object.keys(groups).sort().forEach(g => {
      html += `<button onclick="Standings.handleGroupFilter('${g}')" class="date-btn ${selectedGroup === g ? 'active' : ''}">${Utils.getGroupName(g)}</button>`;
    });
    html += '</div>';

    const keys = selectedGroup && selectedGroup !== 'all'
      ? [selectedGroup]
      : Object.keys(groups).sort();

    keys.forEach(g => {
      if (!groups[g]) return;
      const standings = groups[g];
      const maxPlayed = standings.length > 0 ? Math.max(...standings.map(s => s.played)) : 0;

      html += `<div class="mb-8">`;
      html += `<h3 class="text-xl font-bold text-amber-400 mb-1">${Utils.getGroupName(g)}</h3>`;
      if (maxPlayed > 0) {
        html += `<div class="text-xs text-gray-500 mb-3">${I18n.tParam('teams_and_matches', { n: standings.length, m: standings.length - 1 })}</div>`;
      }
      html += `<div class="overflow-x-auto">`;
      html += `<table class="standings-table w-full">`;
      html += `<thead><tr>`;
      html += `<th class="text-left pl-4">#</th>`;
      html += `<th class="text-left">${I18n.t('team')}</th>`;
      html += `<th class="text-center">${I18n.t('p')}</th>`;
      html += `<th class="text-center">${I18n.t('winner')}</th>`;
      html += `<th class="text-center">${I18n.t('draw')}</th>`;
      html += `<th class="text-center">${I18n.t('loser')}</th>`;
      html += `<th class="text-center">${I18n.t('gf')}</th>`;
      html += `<th class="text-center">${I18n.t('ga')}</th>`;
      html += `<th class="text-center">${I18n.t('gd')}</th>`;
      html += `<th class="text-center font-bold">${I18n.t('pts')}</th>`;
      html += `<th class="text-center">${I18n.t('form')}</th>`;
      html += `</tr></thead><tbody>`;

      standings.forEach((row, idx) => {
        const isQualified = idx < 2;
        const teamName = Utils.getTeamName(row.team);
        const logo = Schedule.renderTeamLogo(row.teamLogo || '', row.team, 20);
        const posClass = idx === 0 ? 'first' : idx === 1 ? 'second' : idx >= standings.length - 2 ? 'eliminated' : '';
        const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
        const formHtml = renderForm(row.form);

        html += `<tr class="standings-row ${posClass} ${isQualified ? 'qualified' : ''}">`;
        html += `<td class="pl-4 ${idx < 3 ? 'text-amber-400 font-bold' : 'text-gray-500'}">${rankBadge || (idx + 1)}</td>`;
        const infoText = I18n.teamInfo(row.team);
        const infoAttr = infoText ? `data-info="${Utils.escape(infoText)}"` : '';
        html += `<td><div class="flex items-center gap-2 min-w-0 has-tip" ${infoAttr}>${logo}<span class="font-medium truncate">${teamName}</span></div></td>`;
        html += `<td class="text-center font-medium">${row.played}</td>`;
        html += `<td class="text-center text-green-400">${row.won || ''}</td>`;
        html += `<td class="text-center text-gray-400">${row.drawn || ''}</td>`;
        html += `<td class="text-center text-red-400">${row.lost || ''}</td>`;
        html += `<td class="text-center">${row.goalsFor}</td>`;
        html += `<td class="text-center">${row.goalsAgainst}</td>`;
        html += `<td class="text-center font-semibold ${row.goalDifference > 0 ? 'text-green-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}">${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}</td>`;
        html += `<td class="text-center font-bold text-amber-400 text-base">${row.points}</td>`;
        html += `<td class="text-center"><div class="flex items-center justify-center gap-0.5">${formHtml}</div></td>`;
        html += `</tr>`;
      });

      html += `</tbody></table></div></div>`;
    });

    return html;
  }

  function renderForm(form) {
    if (!form || form.length === 0) return '<span class="text-gray-600 text-[10px]">-</span>';
    return form.map(r => {
      const color = r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-gray-400' : 'bg-red-500';
      return `<span class="inline-block w-3.5 h-3.5 rounded-full ${color} text-white text-[8px] leading-none flex items-center justify-center font-bold" title="${r === 'W' ? I18n.t('winner') : r === 'D' ? I18n.t('draw') : I18n.t('loser')}">${r}</span>`;
    }).join('');
  }

  function handleGroupFilter(group) {
    App.setGroup(group);
  }

  return { render, handleGroupFilter };
})();
