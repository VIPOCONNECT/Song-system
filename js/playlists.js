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
        name: "🎵 פלייליסט 3 - מוזיקה מרגיעה 🎵", 
        id: "PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj" 
    },
    { 
        name: "🎵 פלייליסט 4 - להיטי שנות ה-80 🎸", 
        id: "PLMf7VY8L5t5k0Kk-NSoNT9KGX1N6aQRZs" 
    }
];

// המשתנים הגלובליים מוגדרים בקובץ player.js

// פונקציה לקבלת הפלייליסט הנוכחי
function getCurrentPlaylist() {
    return playlists[currentPlaylistIndex];
}

// פונקציות אלו מוגדרות בקובץ player.js כדי למנוע כפילות

// אתחול אירועים - הפונקציות מוגדרות בקובץ player.js
function initPlaylistEvents() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('פלייליסטים נטענו בהצלחה');
        // הפונקציות updatePlaylistName ו-updateButtonStates מוגדרות בקובץ player.js
    });
}

// אתחול ראשוני
initPlaylistEvents();
