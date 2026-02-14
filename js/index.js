const tracks = [
  { title: 'CHECK', duration: '2:11', file: 'audio/CHECK.mp3' },
  { title: 'plasticnaLu', duration: '1:46', file: 'audio/PlasticnaLu.mp3' },
  { title: 'dramaic', duration: '1:55', file: 'audio/dramaic.mp3' },
  { title: 'AnewEraIsHere', duration: '1:37', file: 'audio/AnewEraIsHere.mp3' },
  { title: 'multipsample', duration: '1:53', file: 'audio/multipsample.mp3' },
  { title: 'haine', duration: '1:42', file: 'audio/haine.mp3' },
  { title: 'id3', duration: '1:17', file: 'audio/id3.mp3' },
  { title: 'buducnost', duration: '2:22', file: 'audio/buducnost.mp3' },
  { title: 'ti si moja', duration: '2:40', file: 'audio/ti_si_moja.mp3' },
  { title: 'ZeZhop', duration: '3:20', file: 'audio/ZeZhop.mp3' },
  { title: 'No back', duration: '1:23', file: 'audio/no_back.mp3' },
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
                <button class="play-btn">▶</button>
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
      prevRow.querySelector('.play-btn').textContent = '▶';
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
    currentRow.querySelector('.play-btn').textContent = '||';

    playerEl.classList.add('visible');
    currentTrackTitleEl.textContent = track.title;
    playPauseBtn.textContent = '||';
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
      if (currentTrackIndex !== -1) {
        tracklistEl.children[currentTrackIndex].querySelector(
          '.play-btn',
        ).textContent = '▶';
      }
    } else {
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = '||';
      if (currentTrackIndex !== -1) {
        tracklistEl.children[currentTrackIndex].querySelector(
          '.play-btn',
        ).textContent = '||';
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
      playPauseBtn.textContent = '▶';
      if (currentTrackIndex !== -1) {
        tracklistEl.children[currentTrackIndex].querySelector(
          '.play-btn',
        ).textContent = '▶';
        tracklistEl.children[currentTrackIndex].classList.remove('active');
      }
      currentTrackIndex = -1;
      playerEl.classList.remove('visible');
    }
  });
});
