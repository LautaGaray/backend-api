const form = document.getElementById('loginForm');
const button = document.getElementById('buton');

button.addEventListener('click', function(){   
    alert("logueado");    
    let data = new FormData(form);
    let obj = {};
    data.forEach((value, key)=> obj[key]=value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    })
});