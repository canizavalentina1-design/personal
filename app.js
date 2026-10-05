const state = { cookbooks: [
  { name: 'Weeknight wins', count: 12, color: '#d7b195' },
  { name: 'Green & good', count: 8, color: '#9da886' },
  { name: 'Sweet things', count: 5, color: '#c8a278' },
  { name: 'High protein', count: 3, color: '#9b9ab1' }
] };
const $ = (s) => document.querySelector(s);
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function renderCookbooks() {
  $('#sidebarCookbooks').innerHTML = state.cookbooks.map(c => `<div class="side-cookbook"><i style="background:${c.color}"></i>${c.name}</div>`).join('');
  $('#cookbookSelect').innerHTML = state.cookbooks.map(c => `<option>${c.name}</option>`).join('') + '<option value="new">＋ Create new cookbook</option>';
  $('#cookbookCards').innerHTML = state.cookbooks.slice(0, 3).map(c => `<div class="cookbook-mini"><span class="mini-cover" style="background:${c.color}">✦</span><div><strong>${c.name}</strong><small>${c.count} recipes</small></div></div>`).join('');
  $('#cookbookGrid').innerHTML = state.cookbooks.map(c => `<article class="cookbook-card"><div class="cover-art" style="background:linear-gradient(135deg, ${c.color}, #796557)">${c.name}</div><div class="cookbook-info"><strong>${c.name}</strong><p>${c.count} saved recipes · Updated today</p></div></article>`).join('');
}
function navigate(view) { document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view')); $(`#${view}View`).classList.add('active-view'); document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view)); $('#breadcrumbCurrent').textContent = view === 'home' ? 'Import recipe' : 'My cookbooks'; }
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)));
$('#extractButton').addEventListener('click', () => { const button = $('#extractButton'); button.disabled = true; button.innerHTML = 'Listening for ingredients <span>…</span>'; setTimeout(() => { button.disabled = false; button.innerHTML = 'Extract recipe <span>→</span>'; showToast('Recipe extracted — review the details below.'); $('#recipeTitle').focus(); }, 1200); });
$('#videoFile').addEventListener('change', (event) => { if (event.target.files[0]) showToast(`${event.target.files[0].name} is ready to extract.`); });
$('#saveButton').addEventListener('click', () => showToast(`Saved to ${$('#cookbookSelect').value}.`));
$('#cookbookSelect').addEventListener('change', (event) => { if (event.target.value === 'new') createCookbook(); });
function createCookbook() { const name = window.prompt('Name your new cookbook'); if (!name) return; state.cookbooks.push({ name, count: 0, color: '#c58b72' }); renderCookbooks(); $('#cookbookSelect').value = name; showToast(`Created “${name}”.`); }
$('#addCookbookButton').addEventListener('click', createCookbook); $('#addCookbookSide').addEventListener('click', createCookbook); $('#printButton').addEventListener('click', () => window.print()); $('#helpButton').addEventListener('click', () => showToast('Paste a social video link or upload a cooking video to get started.'));
renderCookbooks();
