const loginValue = document.getElementById('login_var').innerText.trim();
const comLoginForm = document.getElementById('com_login');
const comSessionLoginForm = document.getElementById('com_session_login');
    
if (loginValue === "1") {
    comLoginForm.style.display = 'none';
    comSessionLoginForm.style.display = 'block';
} else {
    comLoginForm.style.display = 'block';
          comSessionLoginForm.style.display = 'none';
}