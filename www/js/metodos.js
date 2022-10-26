    var IdUsuario = localStorage.getItem("IdUsuario");
    $("#IdUsuario").val(IdUsuario);
    //Borrar variables de sesión y regresar a el Log-in
    function logaout(){
        window.localStorage.clear();
        window.location.href = "index.html";
    }

    function deleteForm() {
        document.getElementById("demo-form").reset();
    }
    
    function rotate(){
        if(localStorage.getItem("currentOrientation") == "portrait"){
            screen.orientation.lock('landscape');
            localStorage.setItem("currentOrientation", "landscape");
        } else {
            screen.orientation.lock('portrait');
            localStorage.setItem("currentOrientation", "portrait");
        }
    }
    function validateScan(){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                var texto =  result.text;
                var camera = app.popup.create({
                    content: `
                    <div class="popup" id="camera">
                        <div class="headerPopupPhoto" style="width: 90%;display: flex;justify-content: end;padding-left: 20px;margin-top:20px">
                            <a class="link popup-close">Cerrar</a>
                        </div>
                        <div id="log"></div>
                        <div class="app">
                            <div id="deviceready">
                                <pre style="display: inline-block;white-space: break-spaces;">${result.text}</pre>
                                <p>Formato: ${result.format}</p>
                            </div>
                        </div>
                    </div>
                    `,
                    on: {
                        open: function (popup) {},
                    }
                });
                camera.open();
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera : false,
                showFlipCameraButton : true,
                showTorchButton : true,
                torchOn: false,
                saveHistory: false,
                prompt : "Coloca el codigo de barras en la zona marcada",
                resultDisplayDuration: 500,
                orientation : "portrait",
                disableAnimations : true,
                disableSuccessBeep: false
            }
          );
    }
    function restorientation(){
        screen.orientation.lock('portrait');
        localStorage.setItem("currentOrientation", "portrait");
    }
  
    // Funcion global Inicio
    function eliminaCache(){
        var success = function(status) {
            console.log('Message: ' + status);
            $("#process").hide();
            updateData();
        };
        var error = function(status) {
          $("#process").hide();
          console.log('Error: ' + status);
        };
        window.CacheClear(success, error);
    }
    function changeCamera(check){
        if(check.includes('0')){
            localStorage.setItem("camera", "0");
            swal("","Se cambio exitosamente la configuracion de la camara.","success");
        } else {
            localStorage.setItem("camera", "1");
            swal("","Se cambio exitosamente la configuracion de la camara.","success");
        }
    }
    function capturePhoto() {
        var camera = localStorage.getItem("camera");
        if(camera == 0){
            var camera = app.popup.create({
                content: `
                <div class="popup" id="camera">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">
                        <div class="camera">
                            <div class="take" id="take" onclick="onTake()">
                                <div class="bubble-take"></div>
                            </div>
                            <div class="select" id="select" style="display: none;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                        </div>
                        <div class="left-action">
                            <div class="cancel popup-close" id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            <div class="cancel " id="cancelPicure" onClick="onCancelPicture()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                        </div>
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()"><img id="flash" src="img/flash_off.svg" width="30px"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        <div class="right-action">
                            <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                        </div>
                        <audio id="audio" controls style="display: none;">
                            <source type="audio/mp3" src="img/camera.mp3">
                        </audio>
                        <input type="hidden" id="deviceOrientation" name="deviceOrientation"/>
                    </div>
                    <fwm></fwm>
                    </div>
                </div>
                `,
                on: {
                    open: function (popup) {
                        var permissions = cordova.plugins.permissions;
                        permissions.checkPermission(permissions.CAMERA, function( status ){
                            if (status.hasPermission){
                                cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                function empresaCargada(){
                                    cameraStart(onPhotoDataSuccess)
                                }
                                function cargarEmpresa(url, callback){
                                    var pie = document.getElementsByTagName('fwm')[0];
                                    var script = document.createElement('script');
                                    script.type = 'text/javascript';
                                    script.src = url;
                                    script.id = "cameraSource";
                                    script.onload = callback;
                                    pie.appendChild(script);
                                }
                            }else{
                                permissions.requestPermission(permissions.CAMERA, success, error);
                                function error() {
                                    app.sheet.close('.popup')
                                    swal("Field Requiere los permisos","Para poder tomar las evidencias fotograficas necesitamos el permiso.","warning");
                                }
                                function success( status ){
                                    if(!status.hasPermission){
                                        error();
                                    } else {
                                        cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                        function empresaCargada(){
                                            cameraStart(onPhotoDataSuccess)
                                        }
                                        function cargarEmpresa(url, callback){
                                            var pie = document.getElementsByTagName('fwm')[0];
                                            var script = document.createElement('script');
                                            script.type = 'text/javascript';
                                            script.src = url;
                                            script.id = "cameraSource";
                                            script.onload = callback;
                                            pie.appendChild(script);
                                        }
                                    }

                                }
                            }
                        });
                    },
                    opened: function (popup) {
                      localStorage.setItem("cameraField", "Active");
                    },
                    closed: function (popup) {
                      window.localStorage.removeItem("cameraField");
                    },
                }
            });
            camera.open();
        } else {
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                quality: 100,
                destinationType: destinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 500,
                correctOrientation: true,
            });
        }
    }
    //Opcion para ir a menu
    function checkStatus(check){
        if(check.includes('1')){
            var valCheck = document.getElementById(check).checked;
            if(valCheck ==true){
                var name = check.replace('1','');
                var otherCheck = name + '0';
                document.getElementById(otherCheck).checked = false;
            }
        } else {
            var valCheck = document.getElementById(check).checked;
            if(valCheck ==true){
                var name = check.replace('0','');
                var otherCheck = name + '1';
                document.getElementById(otherCheck).checked = false;
            }
        }
    }
    function moveMenu() {
        var empresa = localStorage.getItem("nombre_empresa");
        localStorage.setItem("Opcion", '1');
        app.views.main.router.navigate({ name: 'yallegue'});
    }
    function EliminarActualizacionesAntiguas(){
        var IdUsuario = localStorage.getItem("id_usuario");
        var fecha = new Date();
        var fecha_ingreso = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate();
        fecha_eliminar = editar_fecha(fecha_ingreso, "-30", "d","-");
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT * FROM Actualizaciones  WHERE Fecha < ? AND IdUsuario = ?",
                    [fecha_eliminar,IdUsuario],
                    function(tx5, results){
                        var length = results.rows.length;
                        for(var i = 0; i< length; i++){
                            var item2 = results.rows.item(i);
                            var IdEliminar = item2.idActualizacion;
                            databaseHandler.db.transaction(
                                function(tx4){
                                    tx4.executeSql(
                                        "DELETE FROM Actualizaciones WHERE idActualizacion = ?",
                                        [IdEliminar],
                                        function(tx4, results){
                                        },
                                        function(tx4, error){
                                            console.errror("Error al eliminar: " + error.message);
                                        }
                                    );
                                },
                                function(error){
                                    console.error("Error al seleccionar actualzaciones:" + error.message)
                                },
                                function(){}
                            );
                        }
                    }
                )
            }
        );
    }
    function inputLleno(id,value){
        id = "#"+id;
        if (value == "") {
            $(id).css("background-color","#ffffff");
        } else if(value == "0"){
            $(id).css("background-color","#ffffff");
        } else {
            $(id).css("background-color","#E0F8F7");
        }
    }
    function DeleteDatos(){
        var id_empresa = localStorage.getItem("id_empresa");
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql(
                    "Select * from cedulas_general where estatus in (1,2)",
                    [],
                    function(tx5, results){
                        let length = results.rows.length;
                        console.log('length',length);
                        if(length == 0){
                            databaseHandler.db.transaction(
                                function(tx5){
                                    tx5.executeSql(
                                        "Select * from cedulas_general where estatus in (0)",
                                        [],
                                        function(tx5, results){
                                            let length = results.rows.length;
                                            console.log('length',length);
                                            if(length == 0){
                                                app.dialog.prompt("Para eliminar los datos de la app, por favor escribe 'Eliminar'", 'FIELD',function (name) {
                                                    if(name == "Eliminar"){
                                                      swal({
                                                          title: "Aviso",
                                                          text: "¿Estas Seguro de querer eliminar los datos de la aplicación?",
                                                          icon: "warning",
                                                          buttons: true,
                                                          dangerMode: true,
                                                      })
                                                        .then((RESP) => {
                                                            if (RESP == true) {
                                                                window.sqlitePlugin.deleteDatabase({name: "field.db", location:'default'});
                                                                location.reload();
                                                            } else {}
                                                        });
                                                    }else{}
                                                });
                                            }else{
                                                swal("","Favor de concluir o eliminar las cedulas pendientes para poder eliminar los datos de la app","warning");
                                            }
                                        },
                                        function(tx5, error){
                                            console.log("Error al consultar registro: " + error.message);
                                            app.preloader.hide();
                                        }
                                    );
                                },
                                function(error){console.log("Error al consultar registro: " + error.message);},
                                function(){}
                            );
                        }else{
                            swal({
                                title: "Aviso",
                                text: "¿Aun tienes cedulas pendientes por enviar estas seguro que deseas realizar esta accción? Se perderan los datos de tu visita!",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                              .then((RESP) => {
                                  if (RESP == true) {
                                    databaseHandler.db.transaction(
                                        function(tx5){
                                            tx5.executeSql(
                                                "Select * from cedulas_general where estatus in (0)",
                                                [],
                                                function(tx5, results){
                                                    let length = results.rows.length;
                                                    console.log('length',length);
                                                    if(length == 0){
                                                        app.dialog.prompt("Para eliminar los datos de la app, por favor escribe 'Eliminar'", 'FIELD',function (name) {
                                                            if(name == "Eliminar"){
                                                              swal({
                                                                  title: "Aviso",
                                                                  text: "¿Estas Seguro de querer eliminar los datos de la aplicación?",
                                                                  icon: "warning",
                                                                  buttons: true,
                                                                  dangerMode: true,
                                                              })
                                                                .then((RESP) => {
                                                                    if (RESP == true) {
                                                                        window.sqlitePlugin.deleteDatabase({name: "field.db", location:'default'});
                                                                        location.reload();
                                                                    } else {}
                                                                });
                                                            }else{}
                                                          });
                                                    }else{
                                                        swal("","Favor de concluir o eliminar las cedulas pendientes para poder eliminar los datos de la app","warning");
                                                    }
                                                },
                                                function(tx5, error){
                                                    console.log("Error al consultar registro: " + error.message);
                                                    app.preloader.hide();
                                                }
                                            );
                                        },
                                        function(error){console.log("Error al consultar registro: " + error.message);},
                                        function(){}
                                    );
                                  } else {}
                              });
                        }
                    },
                    function(tx5, error){
                        console.log("Error al consultar registro: " + error.message);
                        app.preloader.hide();
                    }
                );
            },
            function(error){console.log("Error al consultar registro: " + error.message);},
            function(){}
        );
    }
    // Funcion global Fin
    //Pantalla vertical
    function vertical(){
        screen.orientation.lock('portrait');
        screen.orientation.unlock();
    }
    //Pantalla horizontal
    function landsca(){
        screen.orientation.lock('landscape');
        //screen.orientation.unlock();
    }
    // Cerrar Popup
    function gClose(){
        screen.orientation.lock('portrait');
        screen.orientation.unlock();
    }
    var testFirma;

    function createFirma(){
        screen.orientation.lock('landscape');
        var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(6, 62, 127)'
        });
        testFirma = signaturePad;
    }

    function cleanFirma(){
        var signaturePad = testFirma;
        signaturePad.clear();
    }

    // Tomar foto firma
    function capturaFirma() {
        var camera = localStorage.getItem("camera");
            if(camera == 0){
            var camera = app.popup.create({
                content: `
                <div class="popup" id="camera">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">
                        <div class="camera">
                            <div class="take" id="take" onclick="onTake()">
                                <div class="bubble-take"></div>
                            </div>
                            <div class="select" id="select" style="display: none;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                        </div>
                        <div class="left-action">
                            <div class="cancel popup-close" id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            <div class="cancel" id="cancelPicure" onClick="onCancelPicture()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                        </div>
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()"><img id="flash" src="img/flash_off.svg" width="30px"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        <div class="right-action">
                            <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                        </div>
                        <audio id="audio" controls style="display: none;">
                            <source type="audio/mp3" src="img/camera.mp3">
                        </audio>
                        <input type="hidden" id="deviceOrientation" name="deviceOrientation"/>
                    </div>
                    <fwm></fwm>
                    </div>
                </div>
            `,
            on: {
                open: function (popup) {
                    var permissions = cordova.plugins.permissions;
                    permissions.checkPermission(permissions.CAMERA, function( status ){
                        if (status.hasPermission){
                            cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                            function empresaCargada(){
                                cameraStart(onPhotoSingSuccess)
                            }
                            function cargarEmpresa(url, callback){
                                var pie = document.getElementsByTagName('fwm')[0];
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        }else{
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close('.popup')
                                swal("Field Requiere los permisos","Para poder tomar las evidencias fotograficas necesitamos el permiso.","warning");
                            }
                            function success( status ){
                                if(!status.hasPermission){
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada(){
                                        cameraStart(onPhotoSingSuccess)
                                    }
                                    function cargarEmpresa(url, callback){
                                        var pie = document.getElementsByTagName('fwm')[0];
                                        var script = document.createElement('script');
                                        script.type = 'text/javascript';
                                        script.src = url;
                                        script.id = "cameraSource";
                                        script.onload = callback;
                                        pie.appendChild(script);
                                    }
                                }

                            }
                        }
                    });
                },
                opened: function (popup) {
                localStorage.setItem("cameraField", "Active");
                },
                closed: function (popup) {
                window.localStorage.removeItem("cameraField");
                },
            }
                });
                camera.open();
            } else {
            navigator.camera.getPicture(onPhotoSingSuccess,onFail, {
                quality: 100,
                destinationType: destinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 500,
                correctOrientation: true
            });
            }
        $('#FotoYaLLegue').attr('src', "img/camara.png");
    }
    // Funcion si se logra tomar la foto a la firma
    function onPhotoSingSuccess(imageData) {
        var camera = localStorage.getItem("camera");
        if(camera == 0){
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'flex';
            var nameima = imageData;
            smallImage.src = imageData;
            $('#imgSigPhoto').val(nameima);
            $("#photoIcon").attr("src","img/reload.svg");
        }else{
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'flex';
            var nameima = "data:image/jpeg;base64," + imageData;
            smallImage.src = "data:image/jpeg;base64," + imageData;
            $('#imgSigPhoto').val(nameima);
            $("#photoIcon").attr("src","img/reload.svg");
        }
    }

function verpdf(IdCte, IdCed, TipoC) {
    var id_empresa = localStorage.getItem("id_empresa");
    if (TipoC == "levantamiento" || TipoC == "mantenimiento") {
        localStorage.setItem("IdBennetts", IdCed);
        localStorage.setItem("TipoCedula", TipoC);
        app.views.main.router.navigate({
            name: "visualizar",
        });
    }
  }
function clientSelected(clientName){
    var mes = $("#month").val();
    localStorage.setItem("id_cliente",clientName);
    localStorage.setItem("mes_detalle",mes);
    app.views.main.router.navigate({name: 'verVisita'});
}
function clientSelected2(clientName,fecha){
    let fechaDetalle = fecha.split("-");
    localStorage.setItem("id_cliente",clientName);
    localStorage.setItem("year_detalle",fechaDetalle[0]);
    localStorage.setItem("month_detalle",fechaDetalle[1]);
    localStorage.setItem("day_detalle",fechaDetalle[2]);
    app.views.main.router.navigate({name: 'calendar-page'});
}

function horizontal(){
    screen.orientation.lock('landscape');
}

function Results(){
    $( "#Resultados" ) .show( "fast");
    $( "#LimSani" )    .hide( "fast");
    $( "#ManAli" )     .hide( "fast");
    $( "#higPerso" )   .hide( "fast");
    $( "#ContTemp" )   .hide( "fast");
    $( "#ContPlag" )   .hide( "fast");
    var valCheckuno = document.getElementById("uno").checked;
  //  alert(valCheckuno);
    var valCheckdos = document.getElementById("dos").checked;
  //  alert(valCheckdos);
    if(valCheckuno == true){var n1 = 10;}
    if(valCheckdos == true){ var n2 = 10;}

    var suma = parseInt(n1) + parseInt(n2);
   // alert("La suma es: "+suma);
    $("#res").html("<span>La suma es: "+suma+"</span");
}

function editar_fecha(fecha, intervalo, dma, separador) {
    var separador = separador || "-";
    var arrayFecha = fecha.split(separador);
    var dia = arrayFecha[2];
    var mes = arrayFecha[1];
    var anio = arrayFecha[0];

    var fechaInicial = new Date(anio, mes - 1, dia);
    var fechaFinal = fechaInicial;
    if(dma=="m" || dma=="M"){
      fechaFinal.setMonth(fechaInicial.getMonth()+parseInt(intervalo));
    }else if(dma=="y" || dma=="Y"){
      fechaFinal.setFullYear(fechaInicial.getFullYear()+parseInt(intervalo));
    }else if(dma=="d" || dma=="D"){
      fechaFinal.setDate(fechaInicial.getDate()+parseInt(intervalo));
    }else{
       return fecha;
    }
    dia = fechaFinal.getDate();
    mes = fechaFinal.getMonth() + 1;
    anio = fechaFinal.getFullYear();
    dia = (dia.toString().length == 1) ? "0" + dia.toString() : dia;
    mes = (mes.toString().length == 1) ? mes.toString() : mes;
    return anio + "-" + mes + "-" + dia;
}
//inicio checklist
function continuarCed(id_cedula,tipo){
    localStorage.setItem("IdCedula",id_cedula);
    localStorage.setItem("Opcion", '1');
    localStorage.setItem("page", 1);
    app.views.main.router.back('/formCheck1/', {force: true, ignoreCache: true, reload: true});
}

function IniciaCheckList(){
    if($("#autocomplete-dropdown-ajax").val()){
        var Unidad = $("#autocomplete-dropdown-ajax").val();
        var Chasis = $("#Chasis").val();
        var Familia = $("#Familia").val();
        var marca = $("#marca").val();
        var Empresa = $("#Empresa").val();
        var FK_id_unidad = $("#FK_unidad").val();
        var id_unidad_vs = $("#id_unidad").val();
        var FK_id_empresa = $("#FK_unidad_danos_empresa").val();
        var id_modelo_check = $("#modelo_check").val();
        var id_usuario = localStorage.getItem("id_usuario");
        var nombre_usuario = localStorage.getItem("nombre") + " " + localStorage.getItem("apellido_paterno");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = 0;
        var tipo_cedula = 'checklist';
        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    app.preloader.show('red');
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    productHandler.addDatosGenerales(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check);
                    var NomJson = 'datos_check_desc';
                    app.request({
                        url: cordova.file.dataDirectory + "jsons/"+NomJson+".json",
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            var aux = 0;
                            var aux2 = 0;
                            for (var j = 0; j < data.length; j++) {
                                if(data[j].modelos == 1){
                                    aux ++;
                                }
                            }
                            //console.log(aux);
                            for (var j = 0; j < data.length; j++) {
                                if(data[j].modelos == id_modelo_check){
                                    aux2++;
                                    productHandler.insertPreguntas(id_cedula,data[j].id_pregunta,data[j].revision,data[j].nombre_fase,data[j].nombre_seccion,data[j].fase,data[j].obligatorio,data[j].no_pregunta,1,data[j].modelos,aux,aux2);
                                }
                            }
                        }
                    });
                },
                function (tx, error) {
                  console.log("Error al guardar cedula: " + error.message);
                }
              );
            },
            function (error) {},
            function () {}
          );
    }else{
        swal("","Selecciona una unidad para poder ingresar.","warning");
    }
}

function validaradios(id, numero){
    if(numero == 3){
        var ids = id.split("-");
        var check = ids[1];
        if(check.includes('1')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var otherCheck2 = ids[0] + "-3";
                document.getElementById(otherCheck2).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                var labels3 = ids[0].replace('radio','label') +"-3";
                $("#"+labels1).addClass("checked");
                $("#"+labels2).removeClass("checked");
                $("#"+labels3).removeClass("checked");
            }
        }else if(check.includes('2')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var otherCheck2 = ids[0] + "-3";
                document.getElementById(otherCheck2).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                var labels3 = ids[0].replace('radio','label') +"-3";
                $("#"+labels2).addClass("checked");
                $("#"+labels1).removeClass("checked");
                $("#"+labels3).removeClass("checked");
            }
        }else if(check.includes('3')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck2 = ids[0] + "-1";
                document.getElementById(otherCheck2).checked = false;
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var labels3 = ids[0].replace('radio','label') +"-3";
                var labels2 = ids[0].replace('radio','label') +"-2";
                var labels1 = ids[0].replace('radio','label') +"-1";
                $("#"+labels3).addClass("checked");
                $("#"+labels2).removeClass("checked");
                $("#"+labels1).removeClass("checked");
            }
        }
        actualizacheck(id);
    }
}

function moveChecklist(fase){
    localStorage.setItem("fase", fase);
    var page = localStorage.getItem("page");
    if(page == 1){
        app.views.main.router.back('/formCheck2/', {force: true, ignoreCache: true, reload: true});
    }else if(page == 2){
        app.views.main.router.back('/formCheck1/', {force: true, ignoreCache: true, reload: true});
    }
}

function actualizacheck(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
    }else if(check.includes('2')){
        var respuesta = 2;
    }else if(check.includes('3')){
        var respuesta = 3;
    }
    var id_pregunta = ids[0].replace('radio','');
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE checklist SET respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
                [respuesta,id_cedula,id_pregunta],
                function(tx, results){
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function TerminarCheckList(){
    app.views.main.router.back('/formCheck3/', {force: true, ignoreCache: true, reload: true});
}

function agregaComentarios(id_pregunta){
    var id_cedula = localStorage.getItem("IdCedula");
    app.dialog.prompt("Ingresa el comentario", 'CISAApp',function (name) {
        if(name){
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("UPDATE checklist SET comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                        [name,id_cedula,id_pregunta],
                        function(tx, results){
                            $("#span-"+id_pregunta).html(name);
                            swal("","Comentario guardado correctamente","success");
                        },
                        function(tx, error){
                            console.error("Error al guardar cierre: " + error.message);
                        }
                    );
                },
                function(error){},
                function(){}
            );
        }else{
            swal("","La operación se cancelo por falta del comentario.","warning");
        }
    });
}

function guardaComentarios_generales(val){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datos_generales_checklist SET comentarios_generales = ? WHERE id_cedula = ?",
                [val,id_cedula],
                function(tx, results){
                    swal("","Observaciones guardadas correctamente","success");
                },
                function(tx, error){
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function EnviarCheckList(){
    var id_cedula = localStorage.getItem("IdCedula");
    var fecha = new Date();
    var fecha_salida = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
    var estatus = 1;
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                [fecha_salida,estatus,id_cedula],
                function(tx, results){
                    window.location.href = "./menu.html";
                },
                function(tx, error){
                    swal("Error al guardar",error.message,"error");
                }
            );
        },
        function(error){},
        function(){}
    );
}
//fin checklist