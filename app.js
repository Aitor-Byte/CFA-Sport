const filters = document.querySelectorAll('.filter');
const entriesContainer = document.querySelector('#entries');

// Perfil local del lector.
const profileForm = document.querySelector('#profile-form');
const usernameInput = document.querySelector('#username');
const avatar = document.querySelector('.avatar');
const savedUsername = localStorage.getItem('usuario');

if (savedUsername) {
  usernameInput.value = savedUsername;
  avatar.textContent = savedUsername.charAt(0).toUpperCase();
}

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();

  if (!username) {
    localStorage.removeItem('usuario');
    avatar.textContent = 'U';
    return;
  }

  localStorage.setItem('usuario', username);
  avatar.textContent = username.charAt(0).toUpperCase();
});

// Filtra las noticias por disciplina sin recargar la página.
function filterEntries(selectedType) {
  entriesContainer.querySelectorAll('.entry').forEach((entry) => {
    entry.hidden = selectedType !== 'all' && entry.dataset.type !== selectedType;
  });
}

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    filterEntries(filter.dataset.filter);
  });
});

// Permite publicar un anuncio local en la parte superior del listado.
const form = document.querySelector('#entry-form');
const openFormButton = document.querySelector('#open-form');

openFormButton.addEventListener('click', () => {
  form.hidden = !form.hidden;
  if (!form.hidden) form.querySelector('input').focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const activity = document.querySelector('#activity').value;
  const announcement = document.querySelector('#feeling').value.trim();
  const labels = { futbol: 'Fútbol', running: 'Running', basket: 'Básquet', mar: 'Mar' };
  const label = labels[activity];
  const entry = document.createElement('article');
  const safeAnnouncement = announcement.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character]);

  entry.className = 'entry';
  entry.dataset.type = activity;
  entry.innerHTML = `<div class="entry-image image-${activity}"><span>${label.toUpperCase()}</span></div><div class="entry-main"><div class="entry-top"><p class="entry-date">Ahora</p><span class="entry-type">Anuncio local</span></div><h3>${label}: nueva información de la comunidad</h3><p class="entry-note">“${safeAnnouncement}”</p><div class="entry-meta"><span>◷ enviado por la comunidad</span><span>↗ CFA Sports</span></div></div><button class="more" aria-label="Más opciones">•••</button>`;
  entriesContainer.prepend(entry);
  form.reset();
  form.hidden = true;
});
