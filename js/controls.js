// פונקציה לאפקט לחיצה על כפתורים
function buttonClickEffect(button) {
    // הוספת מחלקת אפקט
    if (button) {
        button.classList.add('active-effect');
        
        // הסרת המחלקה לאחר סיום האנימציה
        setTimeout(() => {
            button.classList.remove('active-effect');
        }, 300);
    }
    
    // הפעלת ויברציה אם זמינה
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// פונקציה להצגת הודעות למשתמש
function showMessage(message, type = 'info') {
    // ניתן להוסיף הודעות למשתמש
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // אפשרות להוסיף הודעות למשתמש בממשק
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // הוספת ההודעה לדף
    document.body.appendChild(messageElement);
    
    // הסרת ההודעה לאחר 3 שניות
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}

// פונקציה לטעינת סגנונות להודעות
function loadMessageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0.95;
            transform: translateX(0);
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .message.info {
            background-color: #2196F3;
        }
        
        .message.success {
            background-color: #4CAF50;
        }
        
        .message.warning {
            background-color: #ff9800;
        }
        
        .message.error {
            background-color: #f44336;
        }
        
        .message.fade-out {
            opacity: 0;
            transform: translateX(100px);
        }
    `;
    
    document.head.appendChild(style);
}

// פונקציה לאתחול כל הפונקציונליות של הבקרות
function initControls() {
    // טעינת סגנונות להודעות
    loadMessageStyles();
    
    // הוספת אירועי לחיצה לכפתורים
    document.querySelectorAll('.control-btn, .back-btn').forEach(button => {
        button.addEventListener('click', function() {
            buttonClickEffect(this);
        });
    });
    
    // הוספת תמיכה במסכי מגע
    initTouchControls();
}

// פונקציה לאתחול בקרות מגע
function initTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // פונקציה לטיפול במגע התחלתי
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
    
    // פונקציה לטיפול בתנועת מגע
    function handleTouchMove(event) {
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
    }
    
    // פונקציה לטיפול בסיום מגע
    function handleTouchEnd() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // בדיקה אם זו החלקה אופקית (שירים) או אנכית (פלייליסטים)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // החלקה ימינה - שיר קודם
            if (deltaX > 50) {
                previousTrack();
            } 
            // החלקה שמאלה - שיר הבא
            else if (deltaX < -50) {
                nextTrack();
            }
        } else {
            // החלקה למעלה - פלייליסט הבא
            if (deltaY < -50) {
                nextPlaylist();
            } 
            // החלקה למטה - פלייליסט קודם
            else if (deltaY > 50) {
                previousPlaylist();
            }
        }
    }
    
    // הוספת מאזיני אירועי מגע
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);
}

// הפעלת אתחול הבקרות כאשר הדף נטען
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initControls);
} else {
    initControls();
}

// ייצוא פונקציות לשימוש חיצוני
window.showMessage = showMessage;
