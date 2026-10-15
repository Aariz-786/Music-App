
        // Songs Data Array
        const songsData = [
            {
                id: 1,
                name: "Electric Dreams",
                artist: "Synthwave Rider",
                img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300",
                genre: "Electronic",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            {
                id: 2,
                name: "Midnight City Groove",
                artist: "The Lunatics",
                img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
                genre: "Pop",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                id: 3,
                name: "Rock the Highway",
                artist: "Thunder Road",
                img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300",
                genre: "Rock",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            },
            {
                id: 4,
                name: "Urban Flow",
                artist: "MC Street",
                img: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=300",
                genre: "Hip-Hop",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            },
            {
                id: 5,
                name: "Neon Horizon",
                artist: "Cyber Pulse",
                img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300",
                genre: "Electronic",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
            }
        ];

        // App State
        let currentPlaylistView = null; // null means show all playlists list
        let currentSongIndex = 0;
        let isPlaying = false;
        
        const playlists = {
            "Favorites": [1, 3],
            "Workout Mix": [2, 4]
        };

        const audioPlayer = document.getElementById('audioPlayer');

        // 1. Toggle Theme Function
        function toggleTheme() {
            const htmlTag = document.documentElement;
            const currentTheme = htmlTag.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlTag.setAttribute('data-theme', newTheme);
        }

        // 2. Show Songs Function (with Genre & Search filter)
        function showSongs(filteredSongs = songsData) {
            const container = document.getElementById('songsListContainer');
            container.innerHTML = '';

            if (filteredSongs.length === 0) {
                container.innerHTML = `<p style="color:var(--text-muted); text-align:center; margin-top:20px;">No songs found.</p>`;
                return;
            }

            filteredSongs.forEach((song) => {
                const item = document.createElement('div');
                item.className = 'song-item';
                item.onclick = () => playSongById(song.id);
                item.innerHTML = `
                    <img src="${song.img}" alt="${song.name}">
                    <div class="song-info">
                        <h4>${song.name}</h4>
                        <p>${song.artist} • ${song.genre}</p>
                    </div>
                `;
                container.appendChild(item);
            });
        }

        function filterSongs() {
            const searchQuery = document.getElementById('songSearchInput').value.toLowerCase();
            const selectedGenre = document.getElementById('genreSelect').value;

            const filtered = songsData.filter(song => {
                const matchesSearch = song.name.toLowerCase().includes(searchQuery) || song.artist.toLowerCase().includes(searchQuery);
                const matchesGenre = selectedGenre === 'all' || song.genre === selectedGenre;
                return matchesSearch && matchesGenre;
            });

            showSongs(filtered);
        }

        // 3. Play Song by ID & Render Current Song Card
        function playSongById(id) {
            const index = songsData.findIndex(s => s.id === id);
            if (index !== -1) {
                currentSongIndex = index;
                renderCurrentSong();
                playAudio();
            }
        }

        function renderCurrentSong() {
            const song = songsData[currentSongIndex];
            if (!song) return;

            document.getElementById('currentSongImg').src = song.img;
            document.getElementById('currentSongTitle').textContent = song.name;
            document.getElementById('currentSongArtist').textContent = song.artist;
            audioPlayer.src = song.source;
        }

        function playAudio() {
            audioPlayer.play().then(() => {
                isPlaying = true;
                document.getElementById('playPauseBtn').textContent = '⏸';
            }).catch(e => console.log("Playback error:", e));
        }

        function togglePlayPause() {
            if (!audioPlayer.src) {
                renderCurrentSong();
            }
            if (isPlaying) {
                audioPlayer.pause();
                isPlaying = false;
                document.getElementById('playPauseBtn').textContent = '▶';
            } else {
                playAudio();
            }
        }

        function playNextSong() {
            currentSongIndex = (currentSongIndex + 1) % songsData.length;
            renderCurrentSong();
            playAudio();
        }

        function playPrevSong() {
            currentSongIndex = (currentSongIndex - 1 + songsData.length) % songsData.length;
            renderCurrentSong();
            playAudio();
        }

        // 4. Playlist Functions
        function createPlaylist() {
            const input = document.getElementById('playlistNameInput');
            const name = input.value.trim();

            if (name && !playlists[name]) {
                playlists[name] = [];
                input.value = '';
                renderPlaylists();
                updatePlaylistDropdown();
            } else if (playlists[name]) {
                alert("Playlist already exists!");
            }
        }

        function renderPlaylists(filterQuery = '') {
            const container = document.getElementById('playlistsContainer');
            container.innerHTML = '';

            // If viewing a specific playlist
            if (currentPlaylistView) {
                const playlistName = currentPlaylistView;
                const songIds = playlists[playlistName] || [];

                container.innerHTML = `
                    <button class="back-to-playlists" onclick="currentPlaylistView = null; renderPlaylists();">← Back to Playlists</button>
                    <h3 style="margin-bottom: 10px; font-size: 16px; color: var(--accent-color);">${playlistName}</h3>
                    <div class="playlist-songs-view" id="playlistSongsList"></div>
                `;

                const songsListContainer = document.getElementById('playlistSongsList');
                if (songIds.length === 0) {
                    songsListContainer.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">No songs in this playlist yet.</p>`;
                } else {
                    songIds.forEach(songId => {
                        const song = songsData.find(s => s.id === songId);
                        if (song) {
                            const songRow = document.createElement('div');
                            songRow.className = 'playlist-song-item';
                            songRow.innerHTML = `
                                <span>${song.name} - ${song.artist}</span>
                                <button class="remove-song-btn" onclick="removeSongFromPlaylist('${playlistName}', ${song.id})">Remove</button>
                            `;
                            songsListContainer.appendChild(songRow);
                        }
                    });
                }
                return;
            }

            // Otherwise, render all playlists list
            const playlistKeys = Object.keys(playlists).filter(name => name.toLowerCase().includes(filterQuery.toLowerCase()));

            if (playlistKeys.length === 0) {
                container.innerHTML = `<p style="color:var(--text-muted); text-align:center; margin-top:20px;">No playlists found.</p>`;
                return;
            }

            playlistKeys.forEach(name => {
                const card = document.createElement('div');
                card.className = 'playlist-card';
                card.onclick = () => {
                    currentPlaylistView = name;
                    renderPlaylists();
                };
                card.innerHTML = `
                    <span>📁 ${name}</span>
                    <span style="font-size:12px; color:var(--text-muted);">${playlists[name].length} songs</span>
                `;
                container.appendChild(card);
            });
        }

        function filterPlaylists() {
            const query = document.getElementById('playlistSearchInput').value;
            renderPlaylists(query);
        }

        function updatePlaylistDropdown() {
            const select = document.getElementById('playlistTargetSelect');
            select.innerHTML = `<option value="">Select Playlist</option>`;
            Object.keys(playlists).forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                select.appendChild(opt);
            });
        }

        function addCurrentSongToPlaylist() {
            const targetPlaylist = document.getElementById('playlistTargetSelect').value;
            const currentSong = songsData[currentSongIndex];

            if (!targetPlaylist) {
                alert("Please select a playlist first!");
                return;
            }

            if (!currentSong) {
                alert("No song currently selected!");
                return;
            }

            if (!playlists[targetPlaylist].includes(currentSong.id)) {
                playlists[targetPlaylist].push(currentSong.id);
                alert(`Added "${currentSong.name}" to "${targetPlaylist}"!`);
                renderPlaylists();
            } else {
                alert("Song is already in this playlist!");
            }
        }

        function removeSongFromPlaylist(playlistName, songId) {
            playlists[playlistName] = playlists[playlistName].filter(id => id !== songId);
            renderPlaylists();
        }

        // Initial Initialization
        window.onload = () => {
            showSongs();
            renderPlaylists();
            updatePlaylistDropdown();
            renderCurrentSong();
        };
    