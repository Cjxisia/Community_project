var register = document.getElementById('register');         //폼 가져오기
var register_password = document.getElementById('register_password');   //패스워드 가져오기
var register_correct = document.getElementById('register_correct');     //확인용 패스워드 가져오기

register.addEventListener('submit', function(event){
    if(register_password.value !== register_correct.value){         //확인용 패스워드와 입력한 패스워드가 다를 때
        event.preventDefault();
        alert("입력한 패스워드와 확인용 패스워드의 값이 다릅니다!");
    }
});