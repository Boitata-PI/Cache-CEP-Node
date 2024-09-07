const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
  

$("#cep").on("input change", function(){
    var cep = this.value.replace(/[^0-9]/, "");

    if(cep.length != 8){
        return false;
    }
    else{
        getCEP(cep)
        .then(response => {
            $("#logradouro").val(response.logradouro);
            $("#bairro").val(response.bairro);
            $("#cidade").val(response.localidade);
            $("#estado").val(response.uf);

            Toast.fire({
                icon: "success",
                title: "Tipo: " + response.tipo
            });
        })
        .catch(e => {
            alert("Erro");
            console.error('Erro:', e);
        }); 
    }
});


async function getCEP(cep){
    return new Promise((resolve, reject) => {
        fetch("/index.php/api/getCEP/" + cep)
        .then(response => response.json())
        .then(response => {
            console.log("Dados: " + response);
            console.log(response.data)
    
            if (!response.success) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else{
                resolve(response.data);
            }
        })
        .catch(e => {
            reject(e);
        });
    });
}