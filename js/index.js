const tracks = [
  { title: 'drama', duration: '1:53', file: 'audio/drama.mp3' },
  { title: 'new era', duration: '1:22', file: 'audio/new-era.mp3' },
  { title: '90s', duration: '1:11', file: 'audio/90s.mp3' },
  { title: 'the message', duration: '1:07', file: 'audio/the-message.mp3' },
  { title: 'check', duration: '1:15', file: 'audio/check.mp3' },
  { title: 'frankenstein', duration: '0:44', file: 'audio/frankenstein.mp3' },
  { title: 'plastična', duration: '1:21', file: 'audio/plasticna.mp3' },
  { title: 'rnb', duration: '0:56', file: 'audio/rnb.mp3' },
  { title: 'find you', duration: '2:12', file: 'audio/find-you.mp3' },
  { title: 'the fall', duration: '1:48', file: 'audio/the-fall.mp3' },
];

document.addEventListener('DOMContentLoaded', () => {
  const tracklistEl = document.getElementById('tracklist');
  const playerEl = document.getElementById('player');
  const currentTrackTitleEl = document.getElementById('current-track-title');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const progressBar = document.getElementById('progress-bar');
  const audio = new Audio();

  let currentTrackIndex = -1;
  let isPlaying = false;

  tracks.forEach((track, index) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.index = index;

    row.innerHTML = `
            <div class="track-controls">
                <button class="play-btn"><i class="fa-sharp fa-solid fa-play"></i></button>
            </div>
            <div class="track-info">
                <span class="track-title">${track.title}</span>
            </div>
            <div class="track-duration">${track.duration}</div>
        `;

    row.addEventListener('click', () => playTrack(index));
    tracklistEl.appendChild(row);
  });

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const volumeSlider = document.getElementById('volume-slider');

  prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    } else {
      playTrack(tracks.length - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < tracks.length - 1) {
      playTrack(currentTrackIndex + 1);
    } else {
      playTrack(0);
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });

  function playTrack(index) {
    if (currentTrackIndex === index) {
      togglePlay();
      return;
    }

    if (currentTrackIndex !== -1) {
      const prevRow = tracklistEl.children[currentTrackIndex];
      prevRow.classList.remove('active');
      prevRow.querySelector('.play-btn').innerHTML =
        '<i class="fa-sharp fa-solid fa-play"></i>';
    }

    currentTrackIndex = index;
    const track = tracks[index];

    audio.src = track.file;
    audio
      .play()
      .catch((e) => console.log('Audio file not found or playback failed', e));
    isPlaying = true;

    const currentRow = tracklistEl.children[index];
    currentRow.classList.add('active');
    currentRow.querySelector('.play-btn').innerHTML =
      '<i class="fa-sharp fa-solid fa-pause"></i>';

    playerEl.classList.add('visible');
    currentTrackTitleEl.textContent = track.title;
    playPauseBtn.innerHTML = '<i class="fa-sharp fa-solid fa-pause"></i>';
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fa-sharp fa-solid fa-play"></i>';
      if (currentTrackIndex !== -1) {
        tracklistEl.children[currentTrackIndex].querySelector(
          '.play-btn',
        ).innerHTML = '<i class="fa-sharp fa-solid fa-play"></i>';
      }
    } else {
      audio.play();
      isPlaying = true;
      playPauseBtn.innerHTML = '<i class="fa-sharp fa-solid fa-pause"></i>';
      if (currentTrackIndex !== -1) {
        tracklistEl.children[currentTrackIndex].querySelector(
          '.play-btn',
        ).innerHTML = '<i class="fa-sharp fa-solid fa-pause"></i>';
      }
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);

  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  const progressContainer = document.querySelector('.progress-container');
  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalDurationEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration);
    currentTimeEl.textContent = '0:00';
  });

  audio.addEventListener('ended', () => {
    if (currentTrackIndex < tracks.length - 1) {
      playTrack(currentTrackIndex + 1);
    } else {
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fa-sharp fa-solid fa-play"></i>';
      if (currentTrackIndex !== -1) {
        tracklistEl.children[currentTrackIndex].querySelector(
          '.play-btn',
        ).innerHTML = '<i class="fa-sharp fa-solid fa-play"></i>';
        tracklistEl.children[currentTrackIndex].classList.remove('active');
      }
      currentTrackIndex = -1;
      playerEl.classList.remove('visible');
    }
  });

  const infoIcon = document.getElementById('info-icon');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const infoOverlay = document.getElementById('info-overlay');
  const closeOverlay = document.getElementById('close-overlay');

  function openOverlay() {
    infoOverlay.classList.add('active');
  }

  function closeOverlayFunc() {
    infoOverlay.classList.remove('active');
  }

  infoIcon.addEventListener('click', openOverlay);
  hamburgerMenu.addEventListener('click', openOverlay);
  closeOverlay.addEventListener('click', closeOverlayFunc);

  // Close overlay on background click
  infoOverlay.addEventListener('click', (e) => {
    if (e.target === infoOverlay) {
      closeOverlayFunc();
    }
  });
});
