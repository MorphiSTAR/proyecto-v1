/* ------------------------------------------------------------------------------------------------------------------------------
        VARIABLES
------------------------------------------------------------------------------------------------------------------------------ */
    
var config = {
    apiKey: "AIzaSyDdMvt6RCAiq1vyG3Cd9K-HC7Tx43WyPLY",
    authDomain: "jame01-a5d50.firebaseapp.com",
    databaseURL: "https://jame01-a5d50.firebaseio.com",
    storageBucket: "jame01-a5d50.appspot.com",
    messagingSenderId: "1079567449998"
}
firebase.initializeApp(config);
var db = firebase.database();
var ref =db.ref("padel_users")

/* ------------------------------------------------------------------------------------------------------------------------------
        FUNCIONES
------------------------------------------------------------------------------------------------------------------------------ */

/*
    recoge los valores introducidos en el form de alta
    forma un objeto con todos los valores del usuario
    lo introduce en la tabla de firebase que se pasa por referencia
*/
function AddUser(){
    var nom = $("#nombretxt").val();
    var ape = $("#apellidotxt").val();
    var sex = $("#sexotxt").val();
    var fna = $("#fNacimientotxt").val();
    var tel = $("#telefonotxt").val();
    var ema = $("#emailtxt").val();
    var pas = $("#passwordtxt").val();
    var pos = $("#posiciontxt").val();
    //var hor = $("#horariotxt").val();

    var user = {
        nombre: nom.toString(),
        apellidos: ape.toString(),
        sexo: sex.toString(),
        fnac: fna.toString(),
        telefono: tel.toString(),
        email: ema.toString(),
        passwd: pas.toString(),
        posicion: pos.toString(),
        // horario: hor.toString()
    }
    var ref =db.ref("padel_users")
    var nwUserRef = ref.push();
    nwUserRef.set(user);
    return nwUserRef;
}
/*
    recoge los valores introducidos en el form de modificacion y modifica la tabla firebase
*/
function modUser(indice){
    var nom = $("#nombretxt").val();
    var ape = $("#apellidotxt").val();
    var sex = $("#sexotxt").val();
    var fna = $("#fNacimientotxt").val();
    var tel = $("#telefonotxt").val();
    var ema = $("#emailtxt").val();
    var pas = $("#passwordtxt").val();
    var pos = $("#posiciontxt").val();
    //var hor = $("#horariotxt").val();

    var user = {
        nombre: nom.toString(),
        apellidos: ape.toString(),
        sexo: sex.toString(),
        fnac: fna.toString(),
        telefono: tel.toString(),
        email: ema.toString(),
        passwd: pas.toString(),
        posicion: pos.toString(),
        // horario: hor.toString()
    }
    var ref5 = db.ref("padel_users/"+indice);
    ref5.update(user);
}

/* ------------------------------------------------------------------------------------------------------------------------------
elimina todo tr que contenga un td que a su vez contenga un data-indez
------------------------------------------------------------------------------------------------------------------------------ */
function VaciaTablaContactos(){
    $("#tabContactos td").each(function(){                                         //aqui modifico los data-idcelda por las nuevas fechas
        valor = $(this).attr("data-index"); 
        if(valor>-1){
            $(this).closest("tr").empty();
        }
    });
}
/* ------------------------------------------------------------------------------------------------------------------------------
    recibe un snapshot de firebase
    introduce un tr completo con los nuevos datos que se guardan
------------------------------------------------------------------------------------------------------------------------------ */
function addUserToTable(snapshot){
    var sna = snapshot.val();
    var key = snapshot.key;
    html="<tr data-key='"+key+"'>";
        html+="<td><button type=\"button\" class=\"btn btn-danger\" data-key='"+key+"' ><span class='glyphicon glyphicon-trash'></span></button></td>";
        html+="<td><button type=\"button\" class=\"btn btn-warning\" data-key='"+key+"' ><span class='glyphicon glyphicon-pencil'></span></button></td>";
    /*
        //de la siguiente manera también saldría pero es muy lento, lo dejo por culturilla
        datos=["nombre","apellidos","sexo","fnac","telefono","email","passwd","posicion","horario"];
        for (var d of datos){
            html+="<td>"+eval("sna."+d)+"</td>";
        }
    */
        html+="<td>"+sna.nombre+"</td>";
        html+="<td>"+sna.apellidos+"</td>";
        html+="<td>"+sna.sexo+"</td>";
        html+="<td>"+sna.fnac+"</td>";
        html+="<td>"+sna.telefono+"</td>";
        html+="<td>"+sna.email+"</td>";
        html+="<td>"+sna.passwd+"</td>";
        html+="<td>"+sna.posicion+"</td>";
        // html+="<td><button type=\"button\" class=\"btn btn-info\" data-key='"+key+"' ><span class='glyphicon glyphicon-eye-open'></span></button></td>";
        // html+="<td>"+sna.horario+"</td>";
    html+="</tr>";
    $('#Tcont').append(html);
}
/*
    recoge el indice de la celda que contiene el icono borrar y borro el nodo
*/
function delRow(indice){
    db.ref("/padel_users/"+indice).remove();
}
/* ------------------------------------------------------------------------------------------------------------------------------
encuentra un usuario y rellena el formulario modal para cambiar
------------------------------------------------------------------------------------------------------------------------------ */
function findUser(indice){
    ref = db.ref("/padel_users/"+indice);
    ref.once("value",function(snapshot){
        var fecha = snapshot.val().fnac;        //la fecha hay que cambiarla a aaaa-mm-dd para que se la trague el html5
        var nfec = fecha.split("/");
        var ofec = nfec[2]+"-"+nfec[1]+"-"+nfec[0];
        $("#nombretxt").val(snapshot.val().nombre);
        $("#apellidotxt").val(snapshot.val().apellidos);
        $("#sexotxt").val(snapshot.val().sexo);
        $("#fNacimientotxt").val(ofec);
        $("#telefonotxt").val(snapshot.val().telefono);
        $("#emailtxt").val(snapshot.val().email);
        $("#passwordtxt").val(snapshot.val().passwd);
        var posic = snapshot.val().posicion;
        $("#posiciontxt option[value=\""+posic+"\"]").attr("selected",true);
    })
}
/* ------------------------------------------------------------------------------------------------------------------------------
limpia el formulario modal
------------------------------------------------------------------------------------------------------------------------------ */
function cleanModal(){
    $("#nombretxt").val("");
    $("#apellidotxt").val("");
    $("#sexotxt").val("");
    $("#fNacimientotxt").val("");
    $("#telefonotxt").val("");
    $("#emailtxt").val("");
    $("#passwordtxt").val("");
    $("#posiciontxt").prop("selected",false); 
}


/*=============================================================================================================================*/
$(document).ready(function() {
    
    //Se ejecuta por cada valor existente en la BD
    //y cada que se agrega un valor nuevo a la base de datos
    ref.on("child_added", function(snapshot) {
        addUserToTable(snapshot);
    });
   
    ref.on("child_changed", function(snapshot) {
    //recuperamos una captura del objeto cambiado y modificamos el valor de los td si cambia el valor desde la tabla
        // datos=["nombre","apellidos","sexo","fnac","telefono","email","passwd","posicion","horario"];
        var sna = snapshot.val();
        var key = snapshot.key;
        //Agregamos los datos a la tabla
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(3)').html(sna.nombre);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(4)').html(sna.apellidos);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(5)').html(sna.sexo);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(6)').html(sna.fnac);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(7)').html(sna.telefono);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(8)').html(sna.email);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(9)').html(sna.passwd);
        $('#Tcont tr[data-key="'+key+'"] td:nth-child(10)').html(sna.posicion);
        //*** OJO, el horario no se actualiza en la tabla porque sino nos elimina el boton
        //$('#Tcont tr[data-key="'+key+'"] td:nth-child(11)').html(sna.horario);
    });
    
    $('#boton-abrirModal').click(function(){
        cleanModal();
        $("#mostrarmodal").modal("show");
        $("#nombretxt").focus();
    });   
    $('#boton-cerrarModal').click(function(){
        cleanModal();
    });   
    $('#boton-guardar').click(function(){
        if($("#userOculto").val()!=""){
            modUser(indice);
            $("#userOculto").val("");
        }else{    
            AddUser();
        }
        $("#mostrarmodal").modal("hide");
    });   
    $("#Tcont").on("click",".btn-danger", function(){        
        indice=$(this).attr('data-key');   //saco atributo data-key
        $(this).closest("tr").fadeOut(1000);
        delRow(indice);
    });
    //modificar   
    $("#Tcont").on("click",".btn-warning", function(){        
        indice=$(this).attr('data-key');   //saco atributo data-key
        $("#userOculto").val(indice);
        findUser(indice);
        $("#mostrarmodal").modal("show");
        
        // $(this).closest("tr").fadeOut(1000);
        // delRow(indice);
        // var nc = $("#numContact").val();
        // var nroContactos = nc - 1;
        // MsgContactos(nroContactos);
    });   

});