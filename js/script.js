const githubProjectsEl = document.getElementById('github-projects');
const btnGH = document.getElementById('use-github');
const btnGL = document.getElementById('use-gitlab');

const GITHUB_USERNAME = 'leandrelegrand';
const GITLAB_USERNAME = 'leandre.legrand.etu';

async function fetchGitHub(username = GITHUB_USERNAME) {
  if (!githubProjectsEl) return;
  githubProjectsEl.innerHTML = '<p style="text-align:center;color:var(--muted)">Chargement...</p>';
  
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      githubProjectsEl.innerHTML = '<p style="text-align:center;color:var(--muted)">Aucun projet.</p>';
      return;
    }
    
    githubProjectsEl.innerHTML = '';
    data.forEach(repo => {
      githubProjectsEl.appendChild(createCard({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        updated: new Date(repo.updated_at).toLocaleDateString('fr-FR')
      }));
    });
  } catch (e) {
    githubProjectsEl.innerHTML = `<p style="color:#dc2626;text-align:center">❌ GitHub: ${e.message}</p>`;
  }
}

async function fetchGitLab(username = GITLAB_USERNAME) {
  if (!githubProjectsEl) return;
  githubProjectsEl.innerHTML = '<p style="text-align:center;color:var(--muted)">Chargement...</p>';
  
  try {
    const res = await fetch(`https://gitlab.com/api/v4/users/${username}/projects`);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      githubProjectsEl.innerHTML = '<p style="text-align:center;color:var(--muted)">Aucun projet.</p>';
      return;
    }
    githubProjectsEl.innerHTML = '';
    data.forEach(project => {
      githubProjectsEl.appendChild(createCard({
        name: project.name,
        description: project.description,
        url: project.web_url,
        language: null,
        stars: project.star_count,
        updated: new Date(project.last_activity_at).toLocaleDateString('fr-FR')
      }));
    });
  } catch (e) {
    githubProjectsEl.innerHTML = `<p style="color:#dc2626;text-align:center">❌ GitLab: ${e.message}</p>`;
  }
}

function createCard({ name, description, url, language, stars, updated }) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <h3><a href="${url}" target="_blank" rel="noopener">${escapeHtml(name)}</a></h3>
    <p class="description">${escapeHtml(description || 'Pas de description')}</p>
    <div class="project-meta">
      ${language ? `<span class="language">📝 ${language}</span>` : ''}
      <span class="stars">⭐ ${stars}</span>
      <span class="updated">🕐 ${updated}</span>
    </div>
  `;
  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (btnGH) {
  btnGH.addEventListener('click', () => {
    fetchGitHub();
    btnGH.classList.add('active');
    if (btnGL) btnGL.classList.remove('active');
  });
}

if (btnGL) {
  btnGL.addEventListener('click', () => {
    fetchGitLab();
    btnGL.classList.add('active');
    if (btnGH) btnGH.classList.remove('active');
  });
}

if (githubProjectsEl) fetchGitHub();