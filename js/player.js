// משתנים גלובליים
let player;
let currentPlaylistIndex = 0;
let isShuffle = false;

// פונקציה להצגת שגיאות
function showError(message) {
    console.error(message);
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    const playlistName = document.getElementById('playlistName');
    if (playlistName) {
        playlistName.textContent = '❌ שגיאה בטעינת הנגן';
    }
}

// פונקציה לטעינת נגן חדש
function loadNewPlayer() {
    try {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            playerVars: {
                'autoplay': 1,
                'controls': 1,
                'enablejsapi': 1,
                'origin': window.location.origin,
                'rel': 0,
                'modestbranding': 1,
                'fs': 1,
                'iv_load_policy': 3,
                'playsinline': 1,
                'listType': 'playlist',
                'list': playlists[0].id
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } catch (error) {
        showError('שגיאה באתחול הנגן: ' + error.message);
    }
}

// פונקציית אתחול השחקן
function onYouTubeIframeAPIReady() {
    console.log('YouTube API is ready');
    try {
        if (typeof YT === 'undefined' || !YT.Player) {
            throw new Error('YouTube Player API לא זמין');
        }
        
        // בדיקה שהפלייליסטים טעונים
        if (typeof playlists === 'undefined' || !Array.isArray(playlists) || playlists.length === 0) {
            throw new Error('לא נמצאו פלייליסטים זמינים');
        }
        
        loadNewPlayer();
    } catch (error) {
        showError('שגיאה בטעינת נגן הווידאו: ' + error.message);
    }
}

// פונקציה שנקראת כאשר השחקן מוכן
function onPlayerReady(event) {
    try {
        console.log('השחקן מוכן');
        document.getElementById('error-message').style.display = 'none';
        updatePlaylistName();
        
        // הפעלת ערבוב אם נבחר
        if (isShuffle) {
            setTimeout(shufflePlaylist, 1000);
        }
        
        // הפעלת אירועי מקלדת
        initKeyboardControls();
        
        // עדכון מצב הכפתורים
        updateButtonStates();
    } catch (error) {
        showError('שגיאה בהכנת הנגן: ' + error.message);
    }
}

// פונקציה שמטפלת בשינויי מצב של הנגן
function onPlayerStateChange(event) {
    // ניתן להוסיף טיפול באירועים שונים של הנגן
    // כמו סיום שיר, השמעה, השהיה וכו'
}

// פונקציה לטיפול בשגיאות
function onPlayerError(error) {
    let errorMessage = 'אירעה שגיאה בנגן: ';
    
    // תרגום קודי שגיאה של יוטיוב
    switch(error.data) {
        case 2:
            errorMessage += 'מזהה וידאו לא תקין';
            break;
        case 5:
            errorMessage += 'שגיאה בטעינת HTML5';
            break;
        case 100:
            errorMessage += 'הסרטון אינו זמין או הוסר';
            break;
        case 101:
        case 150:
            errorMessage += 'ההטמעה של הסרטון אינה מותרת';
            break;
        default:
            errorMessage += 'קוד שגיאה: ' + error.data;
    }
    
    showError(errorMessage);
    console.error('שגיאה בנגן:', error);
}

// פונקציה להפעלת השיר הנוכחי
function playVideo() {
    try {
        if (!player) {
            throw new Error('הנגן לא זמין');
        }
        
        if (typeof player.playVideo === 'function') {
            player.playVideo();
            updateButtonStates();
        } else {
            throw new Error('פונקציית ההשמעה לא זמינה');
        }
    } catch (error) {
        showError('לא ניתן להפעיל את הנגן: ' + error.message);
    }
}

// פונקציה להשהיית השיר הנוכחי
function pauseVideo() {
    try {
        if (!player) {
            throw new Error('הנגן לא זמין');
        }
        
        if (typeof player.pauseVideo === 'function') {
            player.pauseVideo();
            updateButtonStates();
        } else {
            throw new Error('פונקציית ההשהיה לא זמינה');
        }
    } catch (error) {
        showError('לא ניתן להשהות את הנגן: ' + error.message);
    }
}

// פונקציה למעבר לשיר הבא
function nextTrack() {
    try {
        if (!player) {
            throw new Error('הנגן לא זמין');
        }
        
        if (typeof player.nextVideo === 'function') {
            player.nextVideo();
            showMessage('⏭️ מעבר לשיר הבא');
        } else {
            throw new Error('פונקציית מעבר לשיר הבא לא זמינה');
        }
    } catch (error) {
        showError('לא ניתן לעבור לשיר הבא: ' + error.message);
    }
}

// פונקציה למעבר לשיר הקודם
function previousTrack() {
    try {
        if (!player) {
            throw new Error('הנגן לא זמין');
        }
        
        if (typeof player.previousVideo === 'function') {
            player.previousVideo();
            showMessage('⏮️ חזרה לשיר הקודם');
        } else {
            throw new Error('פונקציית חזרה לשיר הקודם לא זמינה');
        }
    } catch (error) {
        showError('לא ניתן לחזור לשיר הקודם: ' + error.message);
    }
}

// פונקציה לערבוב השירים בפלייליסט
function shufflePlaylist() {
    try {
        if (!player) {
            throw new Error('הנגן לא זמין');
        }
        
        if (typeof player.getPlaylist === 'function') {
            const playlist = player.getPlaylist();
            if (playlist && playlist.length > 0) {
                const randomIndex = Math.floor(Math.random() * playlist.length);
                player.playVideoAt(randomIndex);
                showMessage('🔀 ערבוב מופעל');
            } else {
                throw new Error('הפלייליסט ריק');
            }
        } else {
            throw new Error('פונקציית הערבוב לא זמינה');
        }
    } catch (error) {
        showError('לא ניתן לערבב את הפלייליסט: ' + error.message);
    }
}

// פונקציה להפעלת/כיבוי מצב ערבוב
function toggleShuffle() {
    try {
        isShuffle = !isShuffle;
        updateButtonStates();
        
        if (isShuffle) {
            shufflePlaylist();
        } else {
            showMessage('⏩ ערבוב כבוי');
        }
    } catch (error) {
        showError('לא ניתן לשנות את מצב הערבוב: ' + error.message);
        isShuffle = false; // מחזירים את המצב המקורי במקרה של שגיאה
        updateButtonStates();
    }
}

// פונקציה לטעינת פלייליסט חדש
function loadPlaylist(playlistId, playlistName = '') {
    try {
        if (!player) {
            throw new Error('הנגן לא זמין');
        }
        
        if (typeof player.loadPlaylist === 'function') {
            showMessage('🔄 טוען פלייליסט...');
            
            player.loadPlaylist({
                list: playlistId,
                listType: 'playlist',
                index: 0,
                startSeconds: 0,
                suggestedQuality: 'default'
            });
            
            // עדכון שם הפלייליסט אם סופק
            if (playlistName) {
                updatePlaylistName(playlistName);
            }
            
            // איפוס מצב הערבוב בעת טעינת פלייליסט חדש
            isShuffle = false;
            updateButtonStates();
            
        } else {
            throw new Error('פונקציית טעינת הפלייליסט לא זמינה');
        }
    } catch (error) {
        showError('לא ניתן לטעון את הפלייליסט: ' + error.message);
    }
}

// פונקציה לעדכון מצב הכפתורים
function updateButtonStates() {
    try {
        const shuffleBtn = document.getElementById('shuffleBtn');
        if (shuffleBtn) {
            if (isShuffle) {
                shuffleBtn.classList.add('active');
            } else {
                shuffleBtn.classList.remove('active');
            }
        }
    } catch (error) {
        console.error('שגיאה בעדכון מצב הכפתורים:', error);
    }
}

// פונקציה לטעינת פלייליסט הבא
function nextPlaylist() {
    try {
        currentPlaylistIndex = (currentPlaylistIndex + 1) % playlists.length;
        const playlist = playlists[currentPlaylistIndex];
        loadPlaylist(playlist.id, playlist.name);
    } catch (error) {
        showError('לא ניתן לטעון את הפלייליסט הבא: ' + error.message);
    }
}

// פונקציה לטעינת הפלייליסט הקודם
function previousPlaylist() {
    try {
        currentPlaylistIndex = (currentPlaylistIndex - 1 + playlists.length) % playlists.length;
        const playlist = playlists[currentPlaylistIndex];
        loadPlaylist(playlist.id, playlist.name);
    } catch (error) {
        showError('לא ניתן לטעון את הפלייליסט הקודם: ' + error.message);
    }
}

// פונקציה לעדכון שם הפלייליסט
function updatePlaylistName(customName = '') {
    try {
        const playlistNameElement = document.getElementById('playlistName');
        if (!playlistNameElement) return;
        
        if (customName) {
            playlistNameElement.textContent = customName;
        } else if (playlists && playlists.length > 0 && currentPlaylistIndex >= 0 && currentPlaylistIndex < playlists.length) {
            playlistNameElement.textContent = playlists[currentPlaylistIndex].name;
        }
    } catch (error) {
        console.error('שגיאה בעדכון שם הפלייליסט:', error);
    }
}

// פונקציה לניווט חזרה לדף הראשי
function goBack() {
    try {
        // עצירת הנגן לפני עזיבת הדף
        if (player && typeof player.pauseVideo === 'function') {
            player.pauseVideo();
        }
        window.location.href = "index.html";
    } catch (error) {
        console.error('שגיאה בחזרה לדף הראשי:', error);
        window.location.href = "index.html";
    }
}

// פונקציה להצגת הודעות למשתמש
function showMessage(message, duration = 3000) {
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message';
    messageElement.textContent = message;
    
    // עיצוב בסיסי להודעות
    messageElement.style.position = 'fixed';
    messageElement.style.bottom = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    messageElement.style.animation = 'fadeIn 0.3s';
    
    document.body.appendChild(messageElement);
    
    // הסרת ההודעה לאחר הזמן שצוין
    setTimeout(() => {
        messageElement.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            if (document.body.contains(messageElement)) {
                document.body.removeChild(messageElement);
            }
        }, 300);
    }, duration);
}

// הוספת אנימציות CSS להודעות
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);

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

// ייצוא פונקציות לשימוש גלובלי
window.showMessage = showMessage;
window.playVideo = playVideo;
window.pauseVideo = pauseVideo;
window.nextTrack = nextTrack;
window.previousTrack = previousTrack;
window.toggleShuffle = toggleShuffle;
window.nextPlaylist = nextPlaylist;
window.previousPlaylist = previousPlaylist;
window.goBack = goBack;
