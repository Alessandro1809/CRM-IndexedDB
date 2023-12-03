(function(){
  
    let idCliente;
    const nombreInput=document.querySelector('#nombre');
    const emailInput=document.querySelector('#email');
    const telefonoInput=document.querySelector('#telefono');
    const empresaInput=document.querySelector('#empresa');
    const formulario= document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded',()=>{
        abrirConexionDB();

    //verificar el id de la url
    const parametrosUrl = new URLSearchParams(window.location.search);
    //extraer el id de la url
     idCliente=parametrosUrl.get('id');

    if(idCliente){
        setTimeout(() => {
            obtenerCliente(idCliente); 
        }, 100);
       
    }
    formulario.addEventListener('submit',actualizarCliente);
});

function obtenerCliente(id){
    const transaction= DB.transaction(['crm'],'readwrite');
    const objectStore=transaction.objectStore('crm');

    const cliente=objectStore.openCursor();

      cliente.onsuccess=function(e){
        const cursor=e.target.result;
        if(cursor){
            if(cursor.value.id===Number(id)){
                llenarFormulario(cursor.value);
            }
            cursor.continue();
        }else{
            console.log('No hay mas registros');
        }
      
      }
    


}

function llenarFormulario(datosCliente){
    const {nombre,email,telefono,empresa}= datosCliente;
    nombreInput.value=nombre;
    emailInput.value=email;
    telefonoInput.value=telefono;
    empresaInput.value=empresa;

 
}


function actualizarCliente(e){
    e.preventDefault();

    if(nombreInput.value===''||emailInput.value===''||telefonoInput.value===''||empresa.value==='' ){
        imprimirAlerta('Ningun campo a actualizar puede ir vacio','error');
        return;
    }


    const clienteActualizado={
        nombre: nombreInput.value,
        email: emailInput.value,
        empresa: empresaInput.value,
        telefono: telefonoInput.value,
        id: Number(idCliente),
        
    };

    

    const transaction=DB.transaction(['crm'],'readwrite');
    const objectStore = transaction.objectStore('crm');

    objectStore.put(clienteActualizado);
    console.log(clienteActualizado);

    transaction.oncomplete=function(){
        console.log('Cliente editado correctamente');
        imprimirAlerta('Cliente editado Correctamente');

        setTimeout(() => {
            window.location.href='index.html';
        }, 3000);
    }
    
    transaction.onerror=function(){
        imprimirAlerta('Cliente no editado', 'error');
    }
}

})();