// Script to add interactivity to the Heroes & Villains Classifieds site.
// Listings are persisted in localStorage so counts and new posts survive page reloads.

document.addEventListener('DOMContentLoaded', () => {
  const heroList = document.getElementById('hero-list');
  const villainList = document.getElementById('villain-list');
  const mercList = document.getElementById('merc-list');
  const form = document.getElementById('new-listing-form');

  // Default listings populate the board on first load.
  const defaultData = {
    hero: [
      {
        name: 'Solaris Prime',
        description:
          'Seeking a cunning villain who loves elaborate plots and dramatic showdowns. Must enjoy rooftop monologues.',
        location: 'Metro City',
        count: 1204
      },
      {
        name: 'Night Sentinel',
        description:
          'Brooding vigilante in need of a worthy nemesis. Prefer geniuses with a penchant for riddles.',
        location: 'Gotham‑like Alleyways',
        count: 982
      }
    ],
    villain: [
      {
        name: 'Dr. Cataclysm',
        description:
          'Evil mastermind seeks loyal henchmen and a righteous foe. Benefits include lair access, dental and occasional world domination.',
        location: 'Secret Volcano Base',
        count: 87
      },
      {
        name: 'Baroness Boom',
        description:
          'Explosives expert looking for a hero to thwart her heists. Must appreciate fireworks and witty banter.',
        location: 'Bay City',
        count: 42
      }
    ],
    merc: [
      {
        name: 'Shadow Operative',
        description:
          'Discreet mercenary available for hire. Specializes in stealth operations, information extraction and dramatic entrances. Neutral alignment.',
        location: 'Unknown',
        count: 18 // endorsements
      },
      {
        name: 'Chaos Crew',
        description:
          'Small team of mercs ready for anything from distraction gigs to rescue missions. Flexible rates. Will travel.',
        location: 'Various',
        count: 6
      }
    ]
  };

  /**
   * Retrieve listing data from localStorage. If none exists, seed with defaults.
   * @returns {Object} listings object with hero, villain and merc arrays
   */
  function getData() {
    const raw = window.localStorage.getItem('hvListings');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        // ensure all three roles exist
        ['hero', 'villain', 'merc'].forEach(role => {
          if (!Array.isArray(data[role])) data[role] = [];
        });
        return data;
      } catch (_) {
        // fall through to default
      }
    }
    // No valid data found – seed defaults
    window.localStorage.setItem('hvListings', JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }

  /**
   * Persist listing data back to localStorage.
   * @param {Object} data
   */
  function saveData(data) {
    window.localStorage.setItem('hvListings', JSON.stringify(data));
  }

  /**
   * Determine a rank/title based on role and support count.
   * Heroes: <500 = Vigilante, ≥500 = Pro Hero
   * Villains: <50 = Villain, ≥50 = Supervillain
   * Mercs: <10 = Freelancer, ≥10 = Elite Contractor
   * @param {string} role
   * @param {number} count
   * @returns {string}
   */
  function getRank(role, count) {
    if (role === 'hero') {
      return count >= 500 ? 'Pro Hero' : 'Vigilante';
    }
    if (role === 'villain') {
      return count >= 50 ? 'Supervillain' : 'Villain';
    }
    // merc
    return count >= 10 ? 'Elite Contractor' : 'Freelancer';
  }

  /**
   * Get the label for the support count based on role.
   * @param {string} role
   * @returns {string}
   */
  function getLabel(role) {
    if (role === 'hero') return 'Public Trust';
    if (role === 'villain') return 'Henchmen';
    return 'Endorsements';
  }

  /**
   * Get the action label for the support button based on role.
   * @param {string} role
   * @returns {string}
   */
  function getButtonLabel(role) {
    if (role === 'hero') return 'Boost Trust';
    if (role === 'villain') return 'Join Henchmen';
    return 'Endorse';
  }

  /**
   * Render the listings for all roles.
   */
  function renderListings() {
    const data = getData();
    // Clear containers
    heroList.innerHTML = '';
    villainList.innerHTML = '';
    mercList.innerHTML = '';
    ['hero', 'villain', 'merc'].forEach(role => {
      data[role].forEach((item, index) => {
        const article = document.createElement('article');
        article.className = 'listing';
        const titleEl = document.createElement('h3');
        titleEl.textContent = item.name;
        const descEl = document.createElement('p');
        descEl.textContent = item.description;
        const metaEl = document.createElement('p');
        metaEl.className = 'meta';
        const rankSpan = document.createElement('span');
        rankSpan.className = 'rank';
        rankSpan.textContent = getRank(role, item.count);
        // Compose meta text
        const label = getLabel(role);
        metaEl.appendChild(rankSpan);
        metaEl.appendChild(document.createTextNode(`Location: ${item.location} · ${label}: ${item.count}`));
        // Support button
        const btn = document.createElement('button');
        btn.className = 'support-btn';
        btn.textContent = getButtonLabel(role);
        btn.dataset.role = role;
        btn.dataset.index = index.toString();
        btn.addEventListener('click', () => {
          const currentData = getData();
          const r = btn.dataset.role;
          const i = parseInt(btn.dataset.index, 10);
          currentData[r][i].count += 1;
          saveData(currentData);
          renderListings();
        });
        article.appendChild(titleEl);
        article.appendChild(descEl);
        article.appendChild(metaEl);
        article.appendChild(btn);
        if (role === 'hero') heroList.appendChild(article);
        else if (role === 'villain') villainList.appendChild(article);
        else mercList.appendChild(article);
      });
    });
  }

  // Handle new listing submissions
  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const role = formData.get('role');
    const name = (formData.get('name') || '').toString().trim();
    const description = (formData.get('description') || '').toString().trim();
    const location = (formData.get('location') || '').toString().trim();
    if (!role || !name || !description || !location) {
      return;
    }
    const data = getData();
    data[role].unshift({ name, description, location, count: 0 });
    saveData(data);
    form.reset();
    renderListings();
  });

  // Initial render
  renderListings();
});
