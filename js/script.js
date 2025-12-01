const githubProjectsEl = document.getElementById('github-projects');
const btnGH = document.getElementById('use-github');
const btnGL = document.getElementById('use-gitlab');

const GITHUB_USERNAME = 'leandrelegrand';

async function fetchGitHub(username = GITHUB_USERNAME) {
  githubProjectsEl.innerHTML = '<p>Chargement des projets GitHub...</p>';
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('Utilisateur GitHub non trouvé');
    
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Aucun repo trouvé');
    
    githubProjectsEl.innerHTML = '';
    
    if (data.length === 0) {
      githubProjectsEl.innerHTML = '<p>Aucun projet trouvé.</p>';
      return;
    }
    
    data.forEach(repo => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
        <p class="description">${repo.description || '<em>Pas de description</em>'}</p>
        <div class="project-meta">
          ${repo.language ? `<span class="language">📝 ${repo.language}</span>` : ''}
          <span class="stars">⭐ ${repo.stargazers_count}</span>
          <span class="updated">🕐 ${new Date(repo.updated_at).toLocaleDateString('fr-FR')}</span>
        </div>
      `;
      githubProjectsEl.appendChild(projectCard);
    });
  } catch (e) {
    githubProjectsEl.innerHTML = `<p style="color: red;">Erreur GitHub: ${e.message}</p>`;
  }
}

async function fetchGitLab(userId = 'USER_ID_GITLAB') {
  githubProjectsEl.innerHTML = '<p>Chargement des projets GitLab...</p>';
  try {
    const res = await fetch(`https://gitlab.com/api/v4/users/${userId}/projects?archived=false&per_page=100`);
    if (!res.ok) throw new Error('Utilisateur GitLab non trouvé');
    
    const data = await res.json();
    githubProjectsEl.innerHTML = '';
    
    if (data.length === 0) {
      githubProjectsEl.innerHTML = '<p>Aucun projet trouvé.</p>';
      return;
    }
    
    data.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <h3><a href="${project.web_url}" target="_blank" rel="noopener">${project.name}</a></h3>
        <p class="description">${project.description || '<em>Pas de description</em>'}</p>
        <div class="project-meta">
          <span class="stars">⭐ ${project.star_count}</span>
          <span class="updated">🕐 ${new Date(project.last_activity_at).toLocaleDateString('fr-FR')}</span>
        </div>
      `;
      githubProjectsEl.appendChild(projectCard);
    });
  } catch (e) {
    githubProjectsEl.innerHTML = `<p style="color: red;">Erreur GitLab: ${e.message}</p>`;
  }
}

if (btnGH) btnGH.addEventListener('click', () => fetchGitHub());
if (btnGL) btnGL.addEventListener('click', () => fetchGitLab());

// Charge GitHub par défaut
if (githubProjectsEl) fetchGitHub();