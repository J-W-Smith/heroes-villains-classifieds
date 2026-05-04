/* extras.js - adds login system, avatars, and leaderboards */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = loadCurrentUser();
  updateUserBar(currentUser);
  addAvatarsToListings();
  renderLeaderboards();

  // update leaderboards and avatars after support clicks
  document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('support-btn')) {
      setTimeout(() => {
        addAvatarsToListings();
        renderLeaderboards();
      }, 0);
    }
  });

  // update after new listing submission
  const newListingForm = document.querySelector('#new-listing form');
  if (newListingForm) {
    newListingForm.addEventListener('submit', () => {
      setTimeout(() => {
        addAvatarsToListings();
        renderLeaderboards();
      }, 0);
    });
  }
});

function loadCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  } catch (e) {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('currentUser');
  updateUserBar(null);
}

function generateAvatar(name) {
  const initials = name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
  const hue = Math.floor(Math.random() * 360);
  return `<span class="avatar" style="background-color: hsl(${hue},70%,60%);">${initials}</span>`;
}

function updateUserBar(user) {
  const bar = document.getElementById('user-bar');
  if (!bar) return;
  bar.innerHTML = '';
  if (user) {
    bar.innerHTML = `${generateAvatar(user.name)} <strong>${user.name}</strong> (<span class="role">${capitalize(user.role)}</span>) <button id="logout-btn">Logout</button>`;
    const newListing = document.getElementById('new-listing');
    if (newListing) newListing.style.display = '';
    document.getElementById('logout-btn').addEventListener('click', () => {
      logout();
      updateUserBar(null);
      renderLeaderboards();
    });
  } else {
    bar.innerHTML = `
      <form id="login-form">
        <input type="text" id="login-name" placeholder="Alias" required>
        <select id="login-role">
          <option value="hero">Hero</option>
          <option value="villain">Villain</option>
          <option value="merc">Merc</option>
        </select>
        <button type="submit">Login</button>
      </form>
    `;
    const newListing = document.getElementById('new-listing');
    if (newListing) newListing.style.display = 'none';
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('login-name').value.trim();
      const role = document.getElementById('login-role').value;
      if (name) {
        const userObj = { name, role };
        saveCurrentUser(userObj);
        updateUserBar(userObj);
        renderLeaderboards();
      }
    });
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function addAvatarsToListings() {
  ['hero','villain','merc'].forEach(role => {
    const container = document.getElementById(`${role}-list`);
    if (!container) return;
    container.querySelectorAll('.listing').forEach(card => {
      const header = card.querySelector('h3');
      if (header && !header.querySelector('.avatar')) {
        const name = header.textContent.trim();
        const span = document.createElement('span');
        span.innerHTML = generateAvatar(name);
        header.prepend(span);
      }
    });
  });
}

function renderLeaderboards() {
  const heroes = JSON.parse(localStorage.getItem('heroes')) || [];
  const villains = JSON.parse(localStorage.getItem('villains')) || [];
  heroes.sort((a,b) => (b.support || 0) - (a.support || 0));
  villains.sort((a,b) => (b.support || 0) - (a.support || 0));
  const heroUl = document.getElementById('hero-leaderboard');
  const villainUl = document.getElementById('villain-leaderboard');
  if (heroUl) {
    heroUl.innerHTML = heroes.slice(0,5).map(item => `<li>${generateAvatar(item.name)} ${item.name} – ${item.support || 0} Trust</li>`).join('');
  }
  if (villainUl) {
    villainUl.innerHTML = villains.slice(0,5).map(item => `<li>${generateAvatar(item.name)} ${item.name} – ${item.support || 0} Henchmen</li>`).join('');
  }
}

}

// Override renderLeaderboards with correct implementation
function renderLeaderboards() {
  const heroes = JSON.parse(localStorage.getItem('heroes')) || [];
  const villains = JSON.parse(localStorage.getItem('villains')) || [];
  heroes.sort((a,b) => (b.support || 0) - (a.support || 0));
  villains.sort((a,b) => (b.support || 0) - (a.support || 0));
  const heroUl = document.getElementById('hero-leaderboard');
  const villainUl = document.getElementById('villain-leaderboard');
  if (heroUl) {
    heroUl.innerHTML = heroes.slice(0,5).map(item => `<li>${generateAvatar(item.name)} ${item.name} – ${item.support || 0} Trust</li>`).join('');
  }
  if (villainUl) {
    villainUl.innerHTML = villains.slice(0,5).map(item => `<li>${generateAvatar(item.name)} ${item.name} – ${item.support || 0} Henchmen</li>`).join('');
  }
}
