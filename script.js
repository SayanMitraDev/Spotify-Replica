const songs = [
  {
    title: 'Summer Breeze',
    artist: 'Luna Waves',
    album: 'Coastal Dreams',
    duration: '3:42',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'Midnight City',
    artist: 'Neon Skyline',
    album: 'After Hours',
    duration: '4:12',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: 'Golden Hour',
    artist: 'Mosaic',
    album: 'Sunset Sounds',
    duration: '3:29',
    cover: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=300&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    title: 'City Lights',
    artist: 'Paper Trails',
    album: 'Neon Nights',
    duration: '3:56',
    cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=300&q=80',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

const audio = document.getElementById('audio-player');
const songList = document.getElementById('song-list');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const seek = document.getElementById('seek');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const muteBtn = document.getElementById('mute-btn');

let currentIndex = 0;
let isPlaying = false;
let isMuted = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function loadTrack(index) {
  const song = songs[index];
  if (!song) return;

  audio.src = song.src;
  playerCover.src = song.cover;
  playerTitle.textContent = song.title;
  playerArtist.textContent = `${song.artist} · ${song.album}`;
  durationLabel.textContent = song.duration;
  seek.value = 0;
  currentTimeLabel.textContent = '0:00';
  document.querySelectorAll('.track-item').forEach((item, idx) => {
    item.classList.toggle('active', idx === index);
  });
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = '❚❚';
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = '▶';
}

function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function setTrack(index) {
  currentIndex = index;
  loadTrack(currentIndex);
  playTrack();
}

function playPrev() {
  currentIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
  setTrack(currentIndex);
}

function playNext() {
  currentIndex = currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
  setTrack(currentIndex);
}

function renderSongList() {
  songList.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('li');
    item.className = 'track-item';
    item.innerHTML = `
      <span>${song.title}</span>
      <span>${song.artist}</span>
      <span>${song.album}</span>
      <span>${song.duration}</span>
    `;
    item.addEventListener('click', () => setTrack(index));
    songList.appendChild(item);
  });
}

playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);

seek.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (seek.value / 100) * audio.duration;
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const progress = (audio.currentTime / audio.duration) * 100;
  seek.value = progress;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', playNext);

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
  if (audio.volume === 0) {
    muteBtn.textContent = '🔇';
    isMuted = true;
  } else {
    muteBtn.textContent = '🔊';
    isMuted = false;
  }
});

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
});

// Navigation handlers
const navLinks = document.querySelectorAll('.main-nav a, .secondary-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('active'));
    // Add active class to clicked link
    link.classList.add('active');
    
    const text = link.textContent.trim();
    console.log(`Navigated to: ${text}`);
    
    // Update topbar heading based on section
    const topbarH1 = document.querySelector('.topbar h1');
    const topbarP = document.querySelector('.topbar p');
    
    switch(text) {
      case 'Home':
        topbarH1.textContent = 'Good Afternoon';
        topbarP.textContent = 'Listen to your favorite songs and discover new playlists.';
        break;
      case 'Search':
        topbarH1.textContent = 'Search';
        topbarP.textContent = 'Find songs, artists, albums, and playlists.';
        break;
      case 'Your Library':
        topbarH1.textContent = 'Your Library';
        topbarP.textContent = 'Access your saved music and playlists.';
        break;
      case 'Liked Songs':
        topbarH1.textContent = 'Liked Songs';
        topbarP.textContent = 'Your collection of favorite tracks.';
        break;
      case 'Made For You':
        topbarH1.textContent = 'Made For You';
        topbarP.textContent = 'Personalized playlists based on your taste.';
        break;
      case 'Charts':
        topbarH1.textContent = 'Charts';
        topbarP.textContent = 'Top songs and trending tracks worldwide.';
        break;
    }
  });
});

// Preview card click handlers
const previewCards = document.querySelectorAll('.preview-card');
previewCards.forEach((card, index) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const title = card.querySelector('h2').textContent;
    console.log(`Opened: ${title}`);
    alert(`Playing playlist: ${title}\n\nSelect a song from the list to start playing.`);
  });
});

renderSongList();
loadTrack(currentIndex);
volumeControl.value = 0.8;
audio.volume = 0.8;
