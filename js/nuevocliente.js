(function(){
    

    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded', ()=>{
        abrirConexionDB();
        formulario.addEventListener('submit', validarClientes);
    });
   

   

    function validarClientes(e){
        e.preventDefault();
        //leer lo que esta escribiendo el usuario
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        //validar so los camposa estan vacios
        if(nombre===''|| email===''|| telefono===''|| empresa===''){
            imprimirAlerta('Todos los campos son obligatorios','error');
            return;
        }
        const cliente={
            nombre,
            email,
            telefono,
            empresa,
        }

        cliente.id = Date.now();

        crearNuevoCliente(cliente);

    };
    
    function crearNuevoCliente(cliente){

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        
        objectStore.add(cliente);

        transaction.onerror=function(){
            console.log('error en la transaccion');
            imprimirAlerta('Hubo un error al agregar','error');
        }
        transaction.oncomplete=function(){
            console.log('Cliente agregado correctamente');
            imprimirAlerta('Cliente agregado Correctamente');
        }

        setTimeout(() => {
            window.location.href='index.html';
        }, 3000);


    }


        



})();