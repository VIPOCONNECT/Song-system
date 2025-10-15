// משתנה גלובלי לשחקן
let player;

// פונקציית אתחול השחקן
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'rel': 0, // מונע הצגת סרטונים קשורים בסיום
            'modestbranding': 1, // מסיר את הלוגו של יוטיוב
            'fs': 0, // מכבה את מצב מסך מלא
            'iv_load_policy': 3, // מסיר הערות וידאו
            'showinfo': 0, // מסיר מידע נוסף
            'disablekb': 1, // מכבה את המקלדת
            'playsinline': 1, // מאפשר השמעה בתוך הדפדפן בנייד
            'listType': 'playlist',
            'list': playlists[0].id // טוען את הפלייליסט הראשון כברירת מחדל
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

// פונקציה שנקראת כאשר השחקן מוכן
function onPlayerReady(event) {
    console.log('השחקן מוכן');
    updatePlaylistName();
    
    // הפעלת ערבוב אם נבחר
    if (isShuffle) {
        setTimeout(shufflePlaylist, 1000);
    }
    
    // הפעלת אירועי מקלדת
    initKeyboardControls();
}

// פונקציה שמטפלת בשינויי מצב של הנגן
function onPlayerStateChange(event) {
    // ניתן להוסיף טיפול באירועים שונים של הנגן
    // כמו סיום שיר, השמעה, השהיה וכו'
}

// פונקציה לטיפול בשגיאות
function onPlayerError(error) {
    console.error('שגיאה בנגן:', error);
    // אפשר להוסיף הודעת שגיאה למשתמש
}

// פונקציה להפעלת השיר הנוכחי
function playVideo() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

// פונקציה להשהיית השיר הנוכחי
function pauseVideo() {
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
}

// פונקציה למעבר לשיר הבא
function nextTrack() {
    if (player && typeof player.nextVideo === 'function') {
        player.nextVideo();
    }
}

// פונקציה למעבר לשיר הקודם
function previousTrack() {
    if (player && typeof player.previousVideo === 'function') {
        player.previousVideo();
    }
}

// פונקציה לערבוב השירים בפלייליסט
function shufflePlaylist() {
    if (player && typeof player.getPlaylist === 'function') {
        const playlist = player.getPlaylist();
        if (playlist && playlist.length > 0) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            player.playVideoAt(randomIndex);
        }
    }
}

// פונקציה להפעלת/כיבוי מצב ערבוב
function toggleShuffle() {
    isShuffle = !isShuffle;
    updateButtonStates();
    
    if (isShuffle) {
        shufflePlaylist();
    }
}

// פונקציה לטעינת פלייליסט חדש
function loadPlaylist(playlistId) {
    if (player && typeof player.loadPlaylist === 'function') {
        player.loadPlaylist({
            list: playlistId,
            listType: 'playlist',
            index: 0,
            startSeconds: 0,
            suggestedQuality: 'default'
        });
    }
}

// פונקציה לניווט חזרה לדף הראשי
function goBack() {
    window.location.href = "index.html";
}

// אתחול אירועי מקלדת
function initKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        // מקש רווח - השהה/המשך
        if (event.code === 'Space') {
            event.preventDefault();
            if (player && typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                if (state === YT.PlayerState.PLAYING) {
                    pauseVideo();
                } else {
                    playVideo();
                }
            }
        }
        
        // חץ ימינה - שיר הבא
        if (event.code === 'ArrowRight') {
            nextTrack();
        }
        
        // חץ שמאלה - שיר קודם
        if (event.code === 'ArrowLeft') {
            previousTrack();
        }
        
        // חץ למעלה - פלייליסט הבא
        if (event.code === 'ArrowUp') {
            nextPlaylist();
        }
        
        // חץ למטה - פלייליסט קודם
        if (event.code === 'ArrowDown') {
            previousPlaylist();
        }
        
        // מקש S - ערבוב
        if (event.code === 'KeyS') {
            toggleShuffle();
        }
    });
}

// אתחול אירועי מקלדת כאשר הדף נטען
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboardControls);
} else {
    initKeyboardControls();
}
