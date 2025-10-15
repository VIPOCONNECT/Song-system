// פלייליסטים זמינים
const playlists = [
    { 
        name: "🎵 פלייליסט 1 - שירים ישראלים 🇮🇱 (שי גבסו)", 
        id: "PLDJKwqXlb9lMPxPZ0j6wtf3xnvzIVXgw7" 
    },
    { 
        name: "🎵 פלייליסט 2 - שלמה ארצי 🎤", 
        id: "PLy-VLzLFflkGbbgRpL_oiUzmtV89yegEm" 
    },
    { 
ame: "🎵 פלייליסט 3 - מוזיקה מרגיעה 🎵", 
        id: "PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj" 
    },
    { 
        name: "🎵 פלייליסט 4 - להיטי שנות ה-80 🎸", 
        id: "PLMf7VY8L5t5k0Kk-NSoNT9KGX1N6aQRZs" 
    }
];

// משתנים גלובליים
let currentPlaylistIndex = 0;
let isShuffle = false;

// פונקציה לקבלת הפלייליסט הנוכחי
function getCurrentPlaylist() {
    return playlists[currentPlaylistIndex];
}

// פונקציה לעדכון שם הפלייליסט בתצוגה
function updatePlaylistName() {
    const playlistNameElement = document.getElementById('playlistName');
    if (playlistNameElement) {
        playlistNameElement.textContent = playlists[currentPlaylistIndex].name;
    }
}

// פונקציה לעדכון מצב הכפתורים
function updateButtonStates() {
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) {
        if (isShuffle) {
            shuffleBtn.classList.add('active');
        } else {
            shuffleBtn.classList.remove('active');
        }
    }
}

// פונקציה לטעינת פלייליסט חדש
function loadPlaylist(index) {
    if (index >= 0 && index < playlists.length) {
        currentPlaylistIndex = index;
        updatePlaylistName();
        updateButtonStates();
        
        if (window.player) {
            window.player.loadPlaylist({
                list: playlists[currentPlaylistIndex].id,
                listType: 'playlist'
            });
            
            if (isShuffle) {
                setTimeout(shufflePlaylist, 1000);
            }
        }
    }
}

// פונקציה לטעינת הפלייליסט הבא
function nextPlaylist() {
    const nextIndex = (currentPlaylistIndex + 1) % playlists.length;
    loadPlaylist(nextIndex);
}

// פונקציה לטעינת הפלייליסט הקודם
function previousPlaylist() {
    const prevIndex = (currentPlaylistIndex - 1 + playlists.length) % playlists.length;
    loadPlaylist(prevIndex);
}

// אתחול אירועים
function initPlaylistEvents() {
    document.addEventListener('DOMContentLoaded', () => {
        updatePlaylistName();
        updateButtonStates();
    });
}

// אתחול ראשוני
initPlaylistEvents();
