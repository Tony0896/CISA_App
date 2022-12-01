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
            //console.log('Message: ' + status);
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
                                    swal("Se Requiere los permisos","Para poder tomar las evidencias fotograficas necesitamos el permiso.","warning");
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
        var Modulos = localStorage.getItem("Modulos");
        localStorage.setItem("Opcion", '1');
        if(Modulos == "Limpieza"){
            app.views.main.router.navigate({ name: 'yallegueLimp'});
        }else if(Modulos == "Imagen"){
            app.views.main.router.navigate({ name: 'yallegue'});
        }
    }
    function EliminarActualizacionesAntiguas(){
        var IdUsuario = localStorage.getItem("Usuario");
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
                                swal("Se requiere los permisos","Para poder tomar las evidencias fotograficas necesitamos el permiso.","warning");
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
    if (TipoC == "checklist" || TipoC == "Limpieza") {
        localStorage.setItem("IdCed", IdCed);
        localStorage.setItem("TipoC", TipoC);
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
function cambiaimgempresa(val){
    if(val == 1){
        $("#img_logo").attr("src","img/ACHSA.png");
    } else if(val == 35){
        $("#img_logo").attr("src","img/AMTM.png");
    } else if(val == 2){
        $("#img_logo").attr("src","img/ATROL.png");
    } else if(val == 37){
        $("#img_logo").attr("src","img/AULSA.png");
    } else if(val == 20){
        $("#img_logo").attr("src","img/BUSSI.png");
    } else if(val == 3){
        $("#img_logo").attr("src","img/CCA.png");
    } else if(val == 4){
        $("#img_logo").attr("src","img/CISA.png");
    } else if(val == 5){
        $("#img_logo").attr("src","img/COAVE.png");
    } else if(val == 41){
        $("#img_logo").attr("src","img/CODIV.png");
    } else if(val == 6){
        $("#img_logo").attr("src","img/COPE.png");
    } else if(val == 7){
        $("#img_logo").attr("src","img/CORENSA.png");
    } else if(val == 8){
        $("#img_logo").attr("src","img/COREV.png");
    } else if(val == 9){
        $("#img_logo").attr("src","img/COTAN.png");
    } else if(val == 10){
        $("#img_logo").attr("src","img/COTOBUSA.png");
    } else if(val == 39){
        $("#img_logo").attr("src","img/COTXS.png");
    } else if(val == 22){
        $("#img_logo").attr("src","img/ESASA.png");
    } else if(val == 11){
        $("#img_logo").attr("src","img/MIHSA.png");
    } else if(val == 12){
        $("#img_logo").attr("src","img/RECSA.png");
    } else if(val == 13){
        $("#img_logo").attr("src","img/SIMES.png");
    } else if(val == 14){
        $("#img_logo").attr("src","img/SKYBUS.png");
    } else if(val == 15){
        $("#img_logo").attr("src","img/STMP.png");
    } else if(val == 16){
        $("#img_logo").attr("src","img/TCGSA.png");
    } else if(val == 17){
        $("#img_logo").attr("src","img/TREPSA.png");
    } else if(val == 19){
        $("#img_logo").attr("src","img/TUZOBUS.png");
    } else if(val == 18){
        $("#img_logo").attr("src","img/VYCSA.png");
    } else{
        $("#img_logo").attr("src","img/logo1.png");
    }
}
function recarga_history(mes_pdfs,year_pdfs){
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    if(localStorage.getItem("Modulos") == 'Imagen'){
        var tipo = "checklist";
    } else if(localStorage.getItem("Modulos") == 'Limpieza'){
        var tipo = "Limpieza";
    }
    app.request.get('http://189.254.4.243/CISAApp/Archivos/App/historial.php', { IdUsuario: IdU, mes_pdfs : mes_pdfs, year_pdfs: year_pdfs, tipo:tipo}, function (data) {
        var content = JSON.parse(data);
        if(content == 0){
            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
        }else{
            if(data == 'null'){
                $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
            } else {
                if(content.length > 0){
                    var html = '';
                    for(var e=0; e < content.length; e++){
                        var fecha = content[e].FechaCaptura.split(' ');
                        //$("#cedul").html("<li><div class='item-content'><div class='item-media' style='font-size:12px'>"+TipoCed+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class='item-inner'><div class='item-title' style='font-size:12px'>"+unescape(content[e].Cliente)+ "</div><div class='item-after' style='font-size: 12px;color: black;display: flex;flex-direction: row;align-items: center'>"+resp[0]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='verpdf(\""+content[e].IdCte+"\","+content[e].IdCedula+",\""+content[e].TipoCed+"\")' style='border: none; outline:none;'><img src='img/ver.svg' width='40px' /></a></div></div></div></li>");
                        html = html + `<tr> <td><span>`+content[e].Cliente+`</span></td> <td><span>`+fecha[0]+`</span></td> <td><a href='#' onclick="verpdf('`+content[e].IdCte+`','`+content[e].IdCedula+`','`+content[e].TipoCed+`')" style='border: none; outline:none;'><i class="material-icons md-light" style="font-size: 30px;">description</i></a></td> </tr>`;
                    }
                    $("#cedul").html(html);
                } else {
                    $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                }
            }
        }
    },function (xhr) {
        $('.preloader').remove();
        $("#content-page").css('display','none');
        $("#nointernet-page").css('display','block');
    });
}
function recargacedulas(){
    $("#pendientes").html("");
    if(localStorage.getItem("Modulos") == 'Imagen'){
        var tipo = "checklist";
    } else if(localStorage.getItem("Modulos") == 'Limpieza'){
        var tipo = "Limpieza";
    }
      
    var estatus = 0;
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                [estatus, tipo],
                function(tx5, results){
                    var length = results.rows.length;
                    for(var i = 0; i< length; i++){
                        var item2 = results.rows.item(i);
                        var fechas = item2.fecha_entrada.split(" ");
                        if(item2.tipo_cedula == 'checklist'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Rev. Imagen</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,1);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        } else if(item2.tipo_cedula == 'Limpieza'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Rev. Limpieza</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,2);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        }
                    }
                },
                function(tx5, error){
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );  
        },
    function(error){},
    function(){}
    );
}
//inicio checklist
function continuarCed(id_cedula,tipo){
    localStorage.setItem("IdCedula",id_cedula);
    localStorage.setItem("Opcion", '1');
    localStorage.setItem("page", 1);
    if(tipo == 1){
        app.views.main.router.back('/formCheck1/', {force: true, ignoreCache: true, reload: true});
    }else if(tipo == 2){
        app.views.main.router.back('/formLimp1/', {force: true, ignoreCache: true, reload: true});
    }
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
        var fecha_revision =  $("#fecha_revision").val();
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = localStorage.getItem("empresa");
        var tipo_cedula = 'checklist';
        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    //app.dialog.progress('Generando CheckList','red');
                    var progress = 0;
                    var dialog = app.dialog.progress('Generando CheckList', progress, 'red');
                    var empresa = localStorage.getItem("empresa");
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    productHandler.addDatosGenerales(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision);
                    var NomJson = 'datos_check_desc'+empresa;
                    app.request({
                        url: cordova.file.dataDirectory + "jsons/"+NomJson+".json",
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            var aux = 0;
                            var aux2 = 0;
                            for (var j = 0; j < data.length; j++) {
                                if(data[j].modelos == id_modelo_check){
                                    aux ++;
                                }
                            }
                            if(aux == 0){
                                app.dialog.close();
                                swal("","Algo salió mal.","warning");
                            }else{
                                dialog.setText('1 de ' + aux);
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].modelos == id_modelo_check){
                                        aux2++;
                                        productHandler.insertPreguntas(id_cedula,data[j].id_pregunta,data[j].revision,data[j].nombre_fase,data[j].nombre_seccion,data[j].fase,data[j].obligatorio,data[j].no_pregunta,1,data[j].modelos,aux,aux2,data[j].multiple);
                                    }
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
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels1).addClass("checked");
                $("#"+labels2).removeClass("checked");
            }
        }else if(check.includes('2')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels2).addClass("checked");
                $("#"+labels1).removeClass("checked");
                var id_pregunta = ids[0].replace('radio','');
                SeleccionarDanos(id_pregunta);
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
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio','');
        $("#span-"+id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist SET respuesta = ?,comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta,comentarios,id_cedula,id_pregunta],
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
    }else if(check.includes('2')){
        var respuesta = 2;var id_pregunta = ids[0].replace('radio','');
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
}

function TerminarCheckList(){
    app.views.main.router.back('/formCheck3/', {force: true, ignoreCache: true, reload: true});
}

function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function agregaComentarios(id_pregunta,mul){
    if(mul == 1 || mul == 2){
        var seleccionados = $("#opts_modal").val();
        if(seleccionados.length == 0){
            swal("","Selecciona al menos una opción del desplegable.","warning");
            return false;
        }else{
            var opts = '';
            $("#opts_modal option").each(function(){
                if(this.selected){
                    opts = opts +", "+ capitalizarPrimeraLetra($(this).text());
                }
            });
            opts = opts.slice(1);
            opts = opts+":";
        }
    }else{
        var opts = '';
    }
    var campos;
    var comentarios = '';
    
    campos = document.querySelectorAll('#div_cboxs .obligatorio');
    var valido = false;

    [].slice.call(campos).forEach(function(campo) {
        if (campo.checked == true) {
            valido = true;
            comentarios = comentarios+", "+campo.value;
        }
    });

    if (valido) {
        var str = comentarios;
        var name = str.slice(1);
        name = opts+""+name;
        name = name.trim();
        name = capitalizarPrimeraLetra(name);
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist SET comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [name,id_cedula,id_pregunta],
                    function(tx, results){
                        $("#span-"+id_pregunta).html(name);
                        app.sheet.close('#sheet-modal');
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
    } else {
        swal("","Selecciona almenos un daño para poder guardar","warning");
    }
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
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar el checklist?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
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
    });
}

function SeleccionarDanos(id){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM checklist WHERE id_pregunta = ? AND id_cedula = ?",
                [id,id_cedula],
                function(tx5, results){
                    var item2 = results.rows.item(0);
                    if(item2.multiple == 1){
                        var text = item2.revision;
                        let result = text.includes("(");
                        if(result){
                            var resultados = text.split("(");
                            var titulo_modal = resultados[0].trim();
                            var divididos = resultados[1].split(",");
                            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                            var quitapar = '';
                            for(i=0; i<divididos.length; i++){
                                quitapar = divididos[i].replace("(","");
                                quitapar = quitapar.replace(")","");
                                quitapar = capitalizarPrimeraLetra(quitapar);
                                opciones = opciones +`<option value=`+quitapar.trim()+`>`+quitapar.trim()+`</option>`;
                            }
                            opciones = opciones+'</select>';
                            CreaModalOption(id,opciones,1,titulo_modal);
                        }else{
                            var titulo_modal = "";
                            var divididos = text.split(",");
                            var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                            var quitapar = '';
                            for(i=0; i<divididos.length; i++){
                                quitapar = divididos[i].replace("(","");
                                quitapar = quitapar.replace(")","");
                                quitapar = capitalizarPrimeraLetra(quitapar);
                                opciones = opciones +`<option value=`+quitapar.trim()+`>`+quitapar.trim()+`</option>`;
                            }
                            opciones = opciones+'</select>';
                            var titulo_modal = "";    
                            CreaModalOption(id,opciones,2,titulo_modal);
                        }
                        
                    }else{
                        var opciones = false;
                        var titulo_modal = "";
                        CreaModalOption(id,opciones,3,titulo_modal);
                    }
                }
            )
        }
    );
}

function CreaModalOption(id,opciones,mul,titulo_modal){
    if(mul==3){
        var display = "none";//div_opt
        var display1 = "none";//titulo_modal
    }else if(mul == 2){
        var display = "block";//div_opt
        var display1 = "none";//titulo_modal
    }else if(mul == 1){
        var display = "block";//div_opt
        var display1 = "block";//titulo_modal
    }

    var NomDescCli = "danios";
    var html = '';

    app.request.get(cordova.file.dataDirectory + "jsons/"+NomDescCli+".json", function (data) {
        var content2 = JSON.parse(data);
        for(var x = 0; x < content2.length; x++) {
            html = html + `<label class="label_modal"><input class="cbox_modal obligatorio" type="checkbox" id="cbox`+content2[x].id_danio+`" value="`+content2[x].tipo_danio+`">`+content2[x].tipo_danio+`</label><br>`;
        }
        var popEvidencia = app.popup.create({
            content: `
            <div class="sheet-modal my-sheet" id="sheet-modal" name="sheet">
            <div class="toolbar">
                <div class="toolbar-inner">
                    <div class="left"></div>
                    <div class="right"><a class="link" id="close_sheet" href="#">Cerrar</a></div>
                </div>
            </div>
            <div class="sheet-modal-inner" style="overflow-y: scroll;">
                <div class="block">
                    <h3 class="FWN-titulo-2">¿Que tipo de daño es?</h3><hr>
                    <span id="titulo_modal" style="display:`+display1+`;color: #FF0037;" class="span FWM-span-form">`+titulo_modal+`</span>
                    <div id="div_opt" style="display:`+display+`; padding-top: 10px;margin-bottom: 20px;">
                    `+opciones+`
                    </div>
                    <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                        <input type="hidden" id="inputEvidencia" value=`+id+`>
                        <input type="hidden" id="pasa" value="0">
                            `+html+`
                        <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                            <div class="row align-items-stretch" style="text-align: center;">
                                <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                    <span class="resize-handler"></span>
                                    <a href="#" onclick="agregaComentarios(`+id+`,`+mul+`);" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        swipeToClose:false,
        closeByOutsideClick:false,
        closeByBackdropClick:false,
        closeOnEscape:false,
                on: {
                    open: function (popup) {
    
                        $('#close_sheet').click(function () {
                            if($('#pasa').val()!=0){
                                app.sheet.close('#sheet-modal');
                            }else{
                                swal({
                                    title: "Aviso",
                                    text: "Aún no seleccionas o guardas una opción, ¿Estas seguro que deseas regresar?",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: false,
                                }).then((willGoBack) => {
                                    if (willGoBack){
                                        var otherCheck = "radio"+ id + "-2";
                                        document.getElementById(otherCheck).checked = false;
                                        var Check = "radio"+ id + "-1";
                                        document.getElementById(Check).checked = true;
                                        var labels1 = Check.replace('radio','label');
                                        var labels2 = otherCheck.replace('radio','label');
                                        $("#"+labels1).addClass("checked");
                                        $("#"+labels2).removeClass("checked");
                                        actualizacheck(Check);
                                        app.sheet.close('#sheet-modal');
                                    } else {}
                                });
                            }
                        });
                    },
                }
        });
       
        popEvidencia.open();
    });
}
//fin checklist
//inicio de Revision Limpieza
function IniciaCheckListLimp(){
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
        var fecha_revision =  $("#fecha_revision").val();
        var id_usuario = localStorage.getItem("Usuario");
        var nombre_usuario = localStorage.getItem("nombre");
        var fecha = new Date();
        var fecha_llegada = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
        var horario_programado = fecha_llegada;
        var nombre_cliente = Unidad;
        var estatus = 0;
        var geolocation = '';
        var id_cliente = localStorage.getItem("empresa");
        var tipo_cedula = 'Limpieza';
        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    //app.dialog.progress('Generando CheckList','red');
                    var progress = 0;
                    var dialog = app.dialog.progress('Generando CheckList', progress, 'red');
                    var empresa = localStorage.getItem("empresa");
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    productHandler.addDatosGenerales_limp(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision);
                    var NomJson = 'datos_check_desc'+empresa;
                    app.request({
                        url: cordova.file.dataDirectory + "jsons_limp/"+NomJson+".json",
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            var aux = 0;
                            var aux2 = 0;
                            for (var j = 0; j < data.length; j++) {
                                if(data[j].modelos == id_modelo_check){
                                    aux ++;
                                }
                            }
                            if(aux == 0){
                                app.dialog.close();
                                swal("","Algo salió mal.","warning");
                            }else{
                                dialog.setText('1 de ' + aux);
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].modelos == id_modelo_check){
                                        aux2++;
                                        productHandler.insertPreguntas_limp(id_cedula,data[j].id_pregunta,data[j].revision,data[j].nombre_fase,data[j].nombre_seccion,data[j].fase,data[j].obligatorio,data[j].no_pregunta,1,data[j].modelos,aux,aux2,data[j].multiple);
                                    }
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

function moveChecklist_limp(fase){
    localStorage.setItem("fase", fase);
    var page = localStorage.getItem("page");
    if(page == 1){
        app.views.main.router.back('/formLimp2/', {force: true, ignoreCache: true, reload: true});
    }else if(page == 2){
        app.views.main.router.back('/formLimp1/', {force: true, ignoreCache: true, reload: true});
    }
}

function validaradios_limp(id, numero){
    if(numero == 3){
        var ids = id.split("-");
        var check = ids[1];
        if(check.includes('1')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-2";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels1).addClass("checked");
                $("#"+labels2).removeClass("checked");
            }
        }else if(check.includes('2')){
            var valCheck = document.getElementById(ids[0]+"-"+ids[1]).checked;
            if(valCheck ==true){
                var otherCheck = ids[0] + "-1";
                document.getElementById(otherCheck).checked = false;
                var labels1 = ids[0].replace('radio','label') +"-1";
                var labels2 = ids[0].replace('radio','label') +"-2";
                $("#"+labels2).addClass("checked");
                $("#"+labels1).removeClass("checked");
            }
        }       
        actualizacheck_limp(id);
    }
}
function actualizacheck_limp(id){
    var id_cedula = localStorage.getItem("IdCedula");
    var ids = id.split("-");
    var check = ids[1];
    if(check.includes('1')){
        var respuesta = 1;
        var comentarios = '';
        var id_pregunta = ids[0].replace('radio','');
        $("#span-"+id_pregunta).html(comentarios);
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist_revlimp SET respuesta = ?,comentarios = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [respuesta,comentarios,id_cedula,id_pregunta],
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
    }else if(check.includes('2')){
        var respuesta = 2;var id_pregunta = ids[0].replace('radio','');
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("UPDATE checklist_revlimp SET respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
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
}
function TerminarCheckList_limp(){
    app.views.main.router.back('/formLimp3/', {force: true, ignoreCache: true, reload: true});
}
function guardaComentarios_generales_limp(val){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datos_generales_revlimp SET comentarios_generales = ? WHERE id_cedula = ?",
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