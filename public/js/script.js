const body = document.querySelector('body'),
    sidebar = body.querySelector('.sidebar'),
    toggle = body.querySelector('.toggle'),
    searchBtn = body.querySelector('.search-box'),
    modeSwitch = body.querySelector('.toggle-switch'),
    modeText = body.querySelector('.mode-text');

modeSwitch.addEventListener('click', () => {
    body.classList.toggle('dark');
    modeSwitch.classList.toggle('active');
    modeText.textContent = body.classList.contains('dark') ? 'Spider Mode' : 'Venom Mode';
});

toggle.addEventListener('click', () => {
    sidebar.classList.toggle('close');
});

function iconHoverOut(iconid) {
    var icon = document.getElementById(iconid);
    icon.setAttribute("color","#fff");
}

function iconHoverIn(iconid) {
  var icon = document.getElementById(iconid);
  icon.setAttribute("color", "");
}

function imgHoverOut(imgid) {
    var img = document.getElementById(imgid);
    img.setAttribute("src", img.getAttribute("src").replace("-black.png", "-white.png"));
}

function imgHoverIn(imgid) {
    var img = document.getElementById(imgid);
    img.setAttribute("src", img.getAttribute("src").replace("-white.png", "-black.png"));
}

function checkError() {
    fetch('/getError')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error,
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

function checkSuccess() {
    fetch('/getSuccess')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: data.success,
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

function checkMessages(){
    checkError();
    checkSuccess();
}

function sair(){
    Swal.fire({
        title: 'Deseja realmente sair?',
        showDenyButton: true,
        confirmButtonText: `Sim`,
        denyButtonText: `Não`,
        icon: 'info'
      }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/logout";
        }
      })

}

// Chamada à função quando a página carrega
window.onload = checkMessages;