    var IdUsuario = localStorage.getItem("IdUsuario");
    $("#IdUsuario").val(IdUsuario);
    //Borrar variables de sesión y regresar a el Log-in
    function logaout(){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("DELETE FROM Actualizaciones",
                    [],
                    function(tx5, results){
                        StatusBar.backgroundColorByHexString("#124F90");
                        window.localStorage.clear();
                        window.location.href = "index.html";
                    }
                )
            }
        );
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
        } else if(Modulos == "Desincorporaciones"){
            $("#demo-calendar-modal").trigger( "click" );
            //iniciarDesincorporaciones();
        } else if(Modulos == "Recaudo"){
            preingresoRecaudo();
        } else if(Modulos == "Diesel"){
            preingresoDiesel();
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
    if(TipoC){
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
    } else {
        var tipo = localStorage.getItem("Modulos");
    }

    var url = localStorage.getItem("url");
    app.request.get(url+'/historial.php', { IdUsuario: IdU, mes_pdfs : mes_pdfs, year_pdfs: year_pdfs, tipo:tipo}, function (data) {
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
    } else if(localStorage.getItem("Modulos") == 'Desincorporaciones'){
        var tipo = "Desincorporaciones";
    } else if(localStorage.getItem("Modulos") == 'Recaudo'){
        var tipo = "Recaudo";
    } else if(localStorage.getItem("Modulos") == 'Diesel'){
        var tipo = "Diesel";
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
                        } else if(item2.tipo_cedula == 'Desincorporaciones'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,3);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;</div></div></div></li>");
                        } else if(item2.tipo_cedula == 'Recaudo'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Recaudo</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,4);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
                        }  else if(item2.tipo_cedula == 'Diesel'){
                            $("#pendientes").append("<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Rev. Imagen</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,5);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>");
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

function eliminaTodo(){
    var success = function (status) {
        window.sqlitePlugin.deleteDatabase({name: "cisa.db", location:'default'});
        location.reload();
    };
    var error = function (status) {
        console.log('Error: ' + status);
    };
    window.CacheClear(success, error);
}


function preEliminaTodo(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer borrar toda la información guardada en la app?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            eliminaTodo()
        }
    });
}

//inicio checklist
function continuarCed(id_cedula,tipo){
    localStorage.setItem("IdCedula",id_cedula);
    localStorage.setItem("Opcion", '1');
    localStorage.setItem("page", 1);
    if(tipo == 1){
        app.views.main.router.back('/formCheck1/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 2){
        app.views.main.router.back('/formLimp1/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 3){
        app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 4){
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    } else if(tipo == 5){
        app.views.main.router.back('/yallegueDiesel/', {force: true, ignoreCache: true, reload: true});
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
//fin de Revision Limpieza
function getDateWhitZeros(){
    var MyDate = new Date();
    var MyDateString = MyDate.getFullYear() +"-"+ ('0' + (MyDate.getMonth()+1)).slice(-2) +"-"+ ('0' + MyDate.getDate()).slice(-2)+" "+('0' + MyDate.getHours()).slice(-2)+":"+('0' + MyDate.getMinutes()).slice(-2)+":"+('0' + MyDate.getSeconds()).slice(-2);
    return MyDateString;
}
function NombreEmpresa(val){
    if(val == 1){
        return "ACHSA";
    } else if(val == 2){
        return "ATROL";
    } else if(val == 3){
        return "CCA";
    } else if(val == 4){
        return "CISA";
    } else if(val == 5){
        return "COAVE";
    } else if(val == 6){
        return "COPE";
    } else if(val == 7){
        return "CORENSA";
    } else if(val == 8){
        return "COREV";
    } else if(val == 9){
        return "COTAN";
    } else if(val == 10){
        return "COTOBUSA";
    } else if(val == 11){
        return "MIHSA";
    } else if(val == 12){
        return "RECSA";
    } else if(val == 13){
        return "SIMES";
    } else if(val == 14){
        return "SKYBUS";
    } else if(val == 15){
        return "STMP";
    } else if(val == 16){
        return "TCGSA";
    } else if(val == 17){
        return "TREPSA";
    } else if(val == 18){
        return "VYCSA";
    } else if(val == 19){
        return "TUZOBUS";
    } else if(val == 20){
        return "BUSSI";
    } else if(val == 22){
        return "ESASA";
    } else if(val == 26){
        return "CORET";
    } else if(val == 35){
        return "AMTM";
    } else if(val == 37){
        return "AULSA";
    } else if(val == 39){
        return "COTXS";
    } else if(val == 41){
        return "CODIV";
    } else if(val == 44){
        return "IXTAP";
    } else if(val == 45){
        return "MTY";
    } else if(val == 46){
        return "SITRA";
    } else{
        return "";
    }
}
//inicio de Desincorporacion
function NuevaDesincorporacion(){
    app.views.main.router.back('/formDesin1/', {force: true, ignoreCache: true, reload: true});
}
function regresarDesincorporacion(){
    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
}
function GuardaDesincorporacion(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var id_cedula = localStorage.getItem("IdCedula");
        var UsuarioDes = localStorage.getItem("Usuario");
        var HoraDes = $("#hora_des").val();        
        var UnidadDesinID = $("#UnidadDesinID").val()
        var UnidadDesin = $("#unidad_des").val();
        var Itinerario = $("#itinerario").val();
        var OperadorDes = $("#operador_des").val();
        var id_operador_des = $("#id_operador_des").val();
        var Falla = $("#falla").val();
        var DetalleFalla = $("#detalle_falla").val();
        var SentidoDes = $("#sentido").val();
        var KmDes = $("#km_unidad").val();
        var FolioDes = $("#folio_inicial").val();
        var UbicacionDes = $("#ubicacion").val();
        if($("#check_jornada").prop("checked") == true){
            var jornadas = 1;
        } else {
            var jornadas = 0;
        }
        if($("#check_apoyo").prop("checked") == true){
            var apoyo = 1;
        } else {
            var apoyo = 0;
        }
        var estatus_servidor = 0;
        var id_servidor = 0;
        var fecha = getDateWhitZeros();
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer guardar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                databaseHandler.db.transaction(
                    function (tx) {
                      tx.executeSql(//
                        "insert into desincorporacionesD(id_cedula, apoyo, jornadas, HoraDes, UnidadDesinID, UnidadDesin, Itinerario, Falla, DetalleFalla, SentidoDes, UbicacionDes, OperadorDes, id_operador_des, KmDes, FolioDes, UsuarioDes,estatus_servidor, id_servidor, HoraDesR) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [id_cedula, apoyo, jornadas, HoraDes, UnidadDesinID, UnidadDesin, Itinerario, Falla, DetalleFalla, SentidoDes, UbicacionDes, OperadorDes, id_operador_des, KmDes, FolioDes, UsuarioDes, estatus_servidor, id_servidor, fecha],
                        function (tx, results) {
                            swal("","Guardado correctamente","success");
                            setTimeout(function () {
                                swal.close();
                                app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                            }, 1500);  
                        },
                        function (tx, error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                      );
                    },
                    function (error) {console.error("Error al consultar bandeja de salida: " + error.message);},
                    function (error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                );           
            }
        });
    }else{
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }
}
function check_jornada(val){
    if(val){
        if(val == 1){
            if($("#check_jornada").prop("checked") == true){
                var campos;
                campos = document.querySelectorAll('#datos_form .opta');
                [].slice.call(campos).forEach(function(campo) {
                    $("#"+$(campo).attr("id")).removeClass("obligatorio");
                    $("#"+$(campo).attr("id")).val("");
                    $("#"+$(campo).attr("id")).prop("readonly", true);
                });
                $("#sentido_inc").prop("disabled", true);
                $("#sentido_inc").css("background-color", "#f5f5f5", "!important");
                $("#incumplimiento").addClass("obligatorio");
                $("#incumplimiento").prop("readonly", false);
                $("#km_perdidos").addClass("obligatorio");
                $("#km_perdidos").prop("readonly", false);
            } else {
                var campos;
                campos = document.querySelectorAll('#datos_form .opta');
                [].slice.call(campos).forEach(function(campo) {
                    $("#"+$(campo).attr("id")).addClass("obligatorio");
                    $("#"+$(campo).attr("id")).val("");
                    $("#"+$(campo).attr("id")).prop("readonly", false);
                });
                $("#sentido_inc").css("background-color", "#ffffff", "!important");
                $("#sentido_inc").prop("disabled", false);
            }
        }
    } else {
        if($("#check_jornada").prop("checked") == true){
            $("#unidad_des").removeClass("obligatorio");
            $("#operador_des").removeClass("obligatorio");
            $("#km_unidad").removeClass("obligatorio");
            $("#hora_des").removeClass("obligatorio");
            $("#hora_des").val("00:00");
            // $("#hora_des").prop("readonly", true);
        } else {
            $("#unidad_des").addClass("obligatorio");
            $("#unidad_des").val("");
            $("#unidad_des").prop("readonly", false);
            $("#operador_des").addClass("obligatorio");
            $("#operador_des").val("");
            $("#operador_des").prop("readonly", false);
            $("#km_unidad").addClass("obligatorio");
            $("#km_unidad").val("");
            $("#km_unidad").prop("readonly", false);
            $("#hora_des").addClass("obligatorio");
            $("#hora_des").val("");
            $("#hora_des").prop("readonly", false);
        }
    }
}
function check_apoyo(){
    // if($("#check_jornada").prop("checked") == true){
    //     swal("","No se puede marcar la opción de apoyo cuando la jornada es no incorporada.","warning");
    //     $("#check_apoyo").prop("checked",false);
    // }
}
function get_datos_completos(form){
    var campos;
    var trae_los_campos_sin_llennar='';
    campos = document.querySelectorAll('#'+form+' .obligatorio');
    var valido = true;

    [].slice.call(campos).forEach(function(campo) {
        if($(campo).get(0).tagName == 'SELECT'){
            if (campo.value.trim() == 0 || campo.value.trim() == '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", "+$(campo).attr("name");
            }
        }else if($(campo).get(0).tagName == 'TEXTAREA'){
            if (campo.value.trim() === '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", "+$(campo).attr("name");
            }
        }else{
            if (campo.value.trim() === '') {
                valido = false;
                trae_los_campos_sin_llennar = trae_los_campos_sin_llennar + ", "+$(campo).attr("name");
            }
        }
    });

    if (valido) {
        return {
            valido: valido,
            reponse: 1
        };
    } else {
        const str = trae_los_campos_sin_llennar;
        const quita_coma = str.slice(1)
        return {
            valido: valido,
            response: quita_coma
        };
    }
}
function iniciarDesincorporaciones(){
    // var hoy = getDateWhitZeros();
    // hoy = hoy.split(" ");
    var hoy = $("#demo-calendar-modal").val()
    if(!hoy){
        swal("", "Debes seleccionar un día", "warning")
        return false
    }

    var id_cliente = localStorage.getItem("empresa");

    if(id_cliente == 1){
        var nombre_cliente = "ACHSA";
    } else if(id_cliente == 2){
        var nombre_cliente = "ATROL";
    } else if(id_cliente == 3){
        var nombre_cliente = "CCA";
    } else if(id_cliente == 4){
        var nombre_cliente = "CISA";
    } else if(id_cliente == 5){
        var nombre_cliente = "COAVE";
    } else if(id_cliente == 6){
        var nombre_cliente = "COPE";
    } else if(id_cliente == 7){
        var nombre_cliente = "CORENSA";
    } else if(id_cliente == 8){
        var nombre_cliente = "COREV";
    } else if(id_cliente == 9){
        var nombre_cliente = "COTAN";
    } else if(id_cliente == 10){
        var nombre_cliente = "COTOBUSA";
    } else if(id_cliente == 11){
        var nombre_cliente = "MIHSA";
    } else if(id_cliente == 12){
        var nombre_cliente = "RECSA";
    } else if(id_cliente == 13){
        var nombre_cliente = "SIMES";
    } else if(id_cliente == 14){
        var nombre_cliente = "SKYBUS";
    } else if(id_cliente == 15){
        var nombre_cliente = "STMP";
    } else if(id_cliente == 16){
        var nombre_cliente = "TCGSA";
    } else if(id_cliente == 17){
        var nombre_cliente = "TREPSA";
    } else if(id_cliente == 18){
        var nombre_cliente = "VYCSA";
    } else if(id_cliente == 19){
        var nombre_cliente = "TUZOBUS";
    } else if(id_cliente == 20){
        var nombre_cliente = "BUSSI";
    } else if(id_cliente == 22){
        var nombre_cliente = "ESASA";
    } else if(id_cliente == 26){
        var nombre_cliente = "CORET";
    } else if(id_cliente == 35){
        var nombre_cliente = "AMTM";
    } else if(id_cliente == 37){
        var nombre_cliente = "AULSA";
    } else if(id_cliente == 39){
        var nombre_cliente = "COTXS";
    } else if(id_cliente == 41){
        var nombre_cliente = "CODIV";
    } else if(id_cliente == 44){
        var nombre_cliente = "IXTAP";
    } else if(id_cliente == 45){
        var nombre_cliente = "MTY";
    } else if(id_cliente == 46){
        var nombre_cliente = "SITRA";
    } else{
        var nombre_cliente = "N/A";
    }

    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "Select id_cedula from desincorporaciones where DATE(fechaApertura) = ? AND empresa = ?",
            [hoy, nombre_cliente],
            function (tx, results) {
                var length = results.rows.length;
                if(length == 0){
                    swal({
                        title: "Aviso",
                        text: "¿Estas seguro de querer iniciar un nuevo Reporte?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            var id_usuario = localStorage.getItem("Usuario");
                            var nombre_usuario = localStorage.getItem("nombre");
                            var Usuario = localStorage.getItem("Usuario");
                            var fecha_llegada = getDateWhitZeros();
                            var fechaApertura = hoy
                            var estatus = 0;
                            var geolocation = '';
                
                            var tipo_cedula = 'Desincorporaciones';
                            productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,fechaApertura,estatus,tipo_cedula);
                
                            databaseHandler.db.transaction(
                                function (tx) {
                                  tx.executeSql(
                                    "Select MAX(id_cedula) as Id from cedulas_general",
                                    [],
                                    function (tx, results) {
                                        var item = results.rows.item(0);
                                        localStorage.setItem("IdCedula", item.Id);
                                        var id_cedula = item.Id;
                                        var estatusd = "Abierto";
                                        productHandler.addDesincorHeader(id_cedula,nombre_cliente,fecha_llegada,estatusd,Usuario, 0, 0, fechaApertura, 'MOBILE', null);
                                        app.views.main.router.navigate({ name: 'yallegue_desin'});         
                                    },
                                    function (tx, error) {}
                                  );
                                },
                                function (error) {},
                                function () {}
                            );
                        }
                    });
                } else {
                    swal("","Actualmente ya existe un registro este día. Puedes acceder a el en la sección de bandeja de salida","warning");
                }
            },
            function (tx, error) {}
          );
        },
        function (error) {},
        function () {}
    );
}
function RevisaHeaders(){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Header_'+empresa;

    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");

    var encontro = false;
    var id = '';
    var folio = '';
    var fecha = '';
    var estatus = '';
    var usuarioApertura = '';
    var usuarioCierre = '';
    var empresa = '';
    var FechaApertura = '';
    var OrigenApertura = '';
    var OrigenCierre = '';

    app.request.get(cordova.file.dataDirectory + "jsons_desin/"+NomJson+".json", function (data) {
        if(data){
            var content2 = JSON.parse(data);
            if (content2 == null){}else{
                for(var x = 0; x < content2.length; x++) {
                    // if(content2[x].Fecha2 == hoy[0]){
                        encontro = true;
                        id = content2[x].ID;
                        empresa = content2[x].Empresa;
                        folio = content2[x].Folio;
                        fecha = content2[x].Fecha;
                        estatus = content2[x].Estatus;
                        usuarioApertura = content2[x].UsuarioApertura;
                        usuarioCierre = content2[x].UsuarioCierre;
                        FechaApertura = content2[x].FechaApertura;
                        OrigenApertura = content2[x].OrigenApertura;
                        OrigenCierre = content2[x].OrigenCierre;
                        FechaApertura ? null : FechaApertura = content2[x].Fecha2
                        GuardaHeaderDesktop(id, empresa, folio, fecha, estatus, usuarioApertura, usuarioCierre, FechaApertura, OrigenApertura, OrigenCierre);
                    // }
                }
            }
        }
    });
}

function GuardaHeaderDesktop(id, empresa, folio, fecha, estatus, usuarioApertura, usuarioCierre, FechaApertura, OrigenApertura, OrigenCierre){
    // console.log(id, empresa, folio, fecha, estatus, usuarioApertura, usuarioCierre, FechaApertura, OrigenApertura, OrigenCierre)
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM desincorporaciones WHERE id_servidor = ? ",
                [id],
                function(tx5, results){
                    var length = results.rows.length;
                    if(length == 0){
                        var id_usuario = localStorage.getItem("Usuario");
                        var nombre_usuario = localStorage.getItem("nombre");
                        var id_cliente = localStorage.getItem("empresa");
                        var estatus = 0;
                        var geolocation = '';
                        var tipo_cedula = 'Desincorporaciones';
                        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha,geolocation,id_cliente,empresa,FechaApertura,estatus,tipo_cedula);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    var item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    var id_cedula = item.Id;
                                    if(usuarioCierre){
                                        var estatusd = "Concluido";
                                        productHandler.addDesincorHeader2(id_cedula,empresa,fecha,estatusd,usuarioApertura, 4, id, usuarioCierre, OrigenApertura, OrigenCierre);
                                        PintaCedulas(0, "Desincorporaciones");
                                    } else {
                                        var estatusd = "Abierto";
                                        productHandler.addDesincorHeader(id_cedula,empresa,fecha,estatusd,usuarioApertura, 2, id, fecha, OrigenApertura, OrigenCierre);
                                        PintaCedulas(0, "Desincorporaciones");
                                    }
                                    InsertaDetails(id_cedula, id);
                                },
                                function (tx, error) {}
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else {
                        var item2 = results.rows.item(0);
                        var id_cedula = item2.id_cedula;
                        if(usuarioCierre){
                            var estatusd = "Cerrado";
                            var estatusn = 4;
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                    "UPDATE desincorporaciones SET userApertura = ?, userCierre = ?,estatus = ?, estatus_servidor = ?, fecha2 = ? WHERE id_cedula = ?",
                                    [usuarioApertura, usuarioCierre, estatusd ,estatusn, fecha, id_cedula],
                                    function (tx, results) {
                                        PintaCedulas(0, "Desincorporaciones");
                                        InsertaDetails(id_cedula, item2.id_servidor);
                                        databaseHandler.db.transaction(
                                            function(tx){
                                                tx.executeSql("UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                                    [fecha,3,id_cedula],
                                                    function(tx, results){
                                                    },
                                                    function(tx, error){
                                                        swal("Error al guardar",error.message,"error");
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        } else {
                            var estatusd = "Abierto";
                            var estatus = 2;
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                    "UPDATE desincorporaciones SET userApertura = ?, userCierre = ?,estatus = ?, estatus_servidor = ?, fecha2 = ? WHERE id_cedula = ?",
                                    [usuarioApertura, usuarioCierre, estatusd ,estatusn, fecha, id_cedula],
                                    function (tx, results) {
                                        PintaCedulas(0, "Desincorporaciones");
                                        InsertaDetails(id_cedula, item2.id_servidor);
                                    },
                                    function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
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

function PintaCedulas(estatus, tipo){
    if(tipo == "Desincorporaciones"){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                    [estatus, tipo],
                    function(tx5, results){
                        var length = results.rows.length;
                        var html = '';
                        for(var i = 0; i< length; i++){
                            var item2 = results.rows.item(i);
                            var fechas = item2.horario_programado
                            var html = html + `<li id='conc${item2.id_cedula}'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> ${item2.nombre_cliente + "| "+fechas}</div> </div><div class='item-after'><a href='#' onclick='continuarCed(${item2.id_cedula},3);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;</div></div></div></li>`;
                        }
                        $("#pendientes").html(html);
                    },
                    function(tx5, error){
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );  
            },
          function(error){},
          function(){}
        );
    } else if(tipo == "Recaudo"){
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT * FROM cedulas_general WHERE estatus = ? AND tipo_cedula = ?",
                    [estatus, tipo],
                    function(tx5, results){
                        var length = results.rows.length;
                        var html = '';
                        for(var i = 0; i< length; i++){
                            var item2 = results.rows.item(i);
                            var fechas = item2.fecha_entrada.split(" ");
                            var html = html + "<li id='conc"+item2.id_cedula+"'><div class='item-content'><div class='item-media'><i class='icon'><img src='img/circuloNaranja.png' width='20px' height='20px' /></i></div><div class='item-inner'><div class='item-title'> <div> "+item2.nombre_cliente + "| "+fechas[0]+ "</div> <div style='color: #afafaf;font-size: 12px;margin-left: 10px;margin-top: 8px;font-weight: bold;'>Recaudo</div> </div><div class='item-after'><a href='#' onclick='continuarCed(`" + item2.id_cedula + "`,4);' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:#00A7B5'>play_circle_outline</i></a>&nbsp;&nbsp;&nbsp;<a href='#' onclick='EliminarReg(" + item2.id_cedula+ ",`" + item2.tipo_cedula + "`)' style='border: none; outline:none;'><i class='material-icons md-light' style='font-size:35px;color:red'>delete_forever</i></a></div></div></div></li>";
                        }
                        $("#pendientes").html(html);
                    },
                    function(tx5, error){
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );  
            },
          function(error){console.error("Error al consultar bandeja de salida: " + error.message);},
          function(error){console.error("Error al consultar bandeja de salida: " + error.message);}
        );
    }
}
function InsertaDetails(id_cedula, id_servidor){
    // console.log(id_cedula, id_servidor)
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Details_'+empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_desin/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                if(id_servidor == content2[x].IDCabecero){
                    productHandler.addDetailsDes(content2[x].ID, content2[x].IDCabecero, content2[x].Apoyo, content2[x].JornadasNoIncorporadas, content2[x].HoraD, content2[x].HoraI, content2[x].UnidadDID, content2[x].UnidadD, content2[x].UnidadIID, content2[x].UnidadI, content2[x].Itinerario, content2[x].Motivo, content2[x].Falla, content2[x].SentidoD, content2[x].SentidoI, content2[x].UbicacionD, content2[x].Incumplimiento, content2[x].OperadorD, content2[x].OperadorI, content2[x].KmD, content2[x].KmI, content2[x].KmPerdidos, content2[x].FolioD, content2[x].FolioI, content2[x].UsuarioI, content2[x].UsuarioD, content2[x].HoraCapturaD, content2[x].HoraCapturaI, content2[x].Origen, content2[x].UbicacionI, content2[x].JornadaSinIncorporacion, x, content2.length, id_cedula)
                }
            }
        }
    });
    var NomJson2 = 'DetailsApoyos_'+empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_desin/"+NomJson2+".json", function (data) {
        var content3 = JSON.parse(data);
        if (content3 == null){}else{
            for(var x = 0; x < content3.length; x++) {
                if(id_servidor == content3[x].IDCabecero){
                    productHandler.addDetailsApoyo(content3[x].ID, content3[x].IDCabecero, content3[x].Apoyo,content3[x].TipoUnidad, content3[x].Hora, content3[x].UnidadID,content3[x].Unidad,content3[x].Ubicacion,content3[x].Itinerario,content3[x].TramoDeApoyo,content3[x].Sentido,content3[x].kilometrajeUnidad,content3[x].kilometrajeApoyo,content3[x].Operador,content3[x].Usuario,content3[x].HoraCaptura,content3[x].Origen, x, content3.length, id_cedula)
                }
            }
        }
    });
}
function GuardaIncorporacion(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var UnidadIncID = $("#UnidadIncID").val();
        var HoraInc = $("#hora_inc").val();
        var UnidadInc = $("#unidad_inc").val();
        var OperadorInc = $("#operador_inc").val();
        var UbicacionInc = $("#ubicacion_inc").val();
        var SentidoInc = $("#sentido_inc").val();
        var Inclumplimiento = $("#incumplimiento").val();
        var KmPerdidos = $("#km_perdidos").val();
        var KmInc = $("#km_inc").val();
        var FolioInc = $("#folio_final").val();
        var fecha = getDateWhitZeros();
        var id_operador_inc = $("#id_operador_inc").val();
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer guardar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                if($("#check_jornada").prop("checked") == true){
                    var jornadaSIncorporacion = 1;
                } else {
                    var jornadaSIncorporacion = 0;
                }
                var id_cedula = localStorage.getItem("IdCedula");
                var id_desD = localStorage.getItem("detalle_incorpora");
                var Usuarioinc = localStorage.getItem("Usuario");     
                databaseHandler.db.transaction(
                    function (tx) {
                    tx.executeSql(
                        "Select estatus_servidor from desincorporacionesD where id_cedula = ? AND id_desD = ?",
                        [id_cedula, id_desD],
                        function (tx, results) {
                            var item = results.rows.item(0);
                            if (item.estatus_servidor == 0){
                                var new_estatus = 1;
                            } else if (item.estatus_servidor == 2){
                                var new_estatus = 3;
                            }
                            databaseHandler.db.transaction(
                                function (tx) {
                                  tx.executeSql(
                                    "UPDATE desincorporacionesD SET HoraInc = ?, UnidadIncID = ?, UnidadInc = ?, SentidoInc = ?, UbicacionInc = ?, Inclumplimiento = ?, OperadorInc = ?, KmInc = ?, FolioInc = ?, Usuarioinc = ?, KmPerdidos = ?, HoraIncR = ?, estatus_servidor = ?, id_operador_inc = ?, jornadaSIncorporacion = ? WHERE id_cedula = ? AND id_desD = ?",
                                    [HoraInc, UnidadIncID, UnidadInc, SentidoInc, UbicacionInc, Inclumplimiento, OperadorInc, KmInc, FolioInc, Usuarioinc, KmPerdidos, fecha, new_estatus,id_operador_inc, jornadaSIncorporacion, id_cedula, id_desD],
                                    function (tx, results) {
                                        swal("","Guardado correctamente","success");
                                        setTimeout(function () {
                                            swal.close();
                                            app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                                        }, 1500);  
                                    },
                                    function (tx, error) {}
                                  );
                                },
                                function (error) {},
                                function () {}
                            );
                        },
                        function (tx, error) {}
                    );
                    },
                    function (error) {},
                    function () {}
                );
            }
        });
    }else{
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }   
}
function IncorporarUnidad(val){
    localStorage.setItem("detalle_incorpora",val);
    app.views.main.router.back('/formDesin2/', {force: true, ignoreCache: true, reload: true});
}
function VerDetalleDesinc(val){
    localStorage.setItem("detalle_incorpora",val);
    app.views.main.router.back('/formDesin3/', {force: true, ignoreCache: true, reload: true});
}
function RefreshDataSustitucion(){
    var onestep = localStorage.getItem("one_step");
    localStorage.setItem("tap_refresh", 1);
    if(!onestep){
        localStorage.setItem("one_step", 1);
        swal("Actualizando...!", "...", "success");
        EnvioDatosTrafico();

        setTimeout(function(){
            localStorage.removeItem("one_step");
        },3000)
    }
}
function CerrarReporte(){
    // var MyDate = new Date();
    // var time1 = ('0' + MyDate.getHours()).slice(-2)+":"+('0' + MyDate.getMinutes()).slice(-2)+":"+('0' + MyDate.getSeconds()).slice(-2);

    // const date1 = new Date('2023-01-01 ' + time1);
    // const date2 = new Date('2023-01-01 23:00');
    // const date3 = new Date('2023-01-01 03:00');

    // if (date1.getTime() < date2.getTime() && date1.getTime() > date3.getTime()) {
    //     swal("", "Este botón solo estará activo después de las 23 horas", "warning");
    //     return false;
    // } 

    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT id_cedula FROM desincorporacionesD WHERE id_cedula = ? AND jornadaSIncorporacion IS NULL",
                [id_cedula],
                function(tx5, results){
                    var length = results.rows.length;
                    if(length == 0){} else {
                        swal("", "Aún tienes jornadas que no se han incorporado, debes cerrarlas para poder finalizar el reporte.", "warning");
                        return false;
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
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer cerrar el reporte?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_cedula = localStorage.getItem("IdCedula");
            var usuarioCierre = localStorage.getItem("Usuario");
            var fecha_salida = getDateWhitZeros();
            var estatus = 1;
            var cierre = "CERRADO";
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("UPDATE desincorporaciones SET fecha2  = ?, userCierre = ?, Estatus = ?, estatus_servidor = ?, OrigenCierre = ? WHERE id_cedula = ?",
                        [fecha_salida, usuarioCierre, cierre,3, 'MOBILE', id_cedula],
                        function(tx, results){
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
function CambiaBolita(id, estatus){
    if(estatus == 2){
        $("#bol_"+id).css("color", "#F39C12");
    } else  if(estatus == 4){
        $("#bol_"+id).css("color", "#2ECC71");
    }
}
function CambiaBolita2(id, estatus){
    if(estatus == 1){
        $("#bolac_"+id).css("color", "#F39C12");
    } else  if(estatus == 4){
        $("#bolac_"+id).css("color", "#2ECC71");
    }
}
function edit_folio(id, folio){
    localStorage.setItem("Folio", folio);
    localStorage.setItem("id_detalle_folio", id);
    if(folio == 1){
        app.views.main.router.back('/formDesin4/', {force: true, ignoreCache: true, reload: true});
    } else if(folio == 2){
        app.views.main.router.back('/formDesin4/', {force: true, ignoreCache: true, reload: true});
    } 
}
function ActualizaFolio(){
    var id_desD = $("#id_des").val();
    var folio = localStorage.getItem("Folio");
    var id_cedula = localStorage.getItem("IdCedula");
    
    var Inclumplimiento = $("#incumplimiento").val();
    var Folios = $("#folio_inicial").val();
    var km_perdidos = $("#km_perdidos").val();

    var estatus_s = $("#estatus_servidor").val();
    if (estatus_s == 4){
        var estatus_servidor = 3;
    } else {
        estatus_servidor = estatus_s;
    }
    
    if (folio == 1){
        var sql = "UPDATE desincorporacionesD SET FolioDes = ?, Inclumplimiento = ?, KmPerdidos = ?, estatus_servidor = ? WHERE id_cedula = ? AND id_desD = ?";
    } else if (folio == 2){
        var sql = "UPDATE desincorporacionesD SET FolioInc = ?, Inclumplimiento = ?, KmPerdidos = ?, estatus_servidor = ? WHERE id_cedula = ? AND id_desD = ?";
    }

    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            sql,
            [Folios,Inclumplimiento, km_perdidos, estatus_servidor ,id_cedula, id_desD],
            function (tx, results) {
                swal("","Guardado correctamente","success");
                setTimeout(function () {
                    swal.close();
                    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                }, 1500);       
            },
            function (tx, error) {}
          );
        },
        function (error) {},
        function () {}
    );
}
function check_hour(val){
    var horades = $("#hora_des").val();
    if (horades <= val) {}else{
        swal("","La hora no puede ser menor a la hora de desincorporación.","warning");
        $("#hora_inc").val("");
    } 
}
function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function numberWithZeros(num) {
    if(num.split(".").length == 1){
        return num+".00";
    } else {
        return num;
    }
}

function NuevoApoyo(){
    app.views.main.router.back('/formDesin5/', {force: true, ignoreCache: true, reload: true});
}

function GuardarTRFApoyos(){
    var values = get_datos_completos('datos_form');
    var quita_coma = values.response;
    var valido = values.valido;
    if (valido) {
        var id_cedula = localStorage.getItem("IdCedula");
        var Usuario = localStorage.getItem("Usuario");
        var id_operador = $("#id_operador").val();
        var Hora = $("#Hora").val();
        var Itinerario = $("#Itinerario").val();
        var Unidad = $("#Unidad").val();
        var kilometrajeUnidad = $("#kilometrajeUnidad").val();
        var Operador = $("#Operador").val();
        var Ubicacion = $("#Ubicacion").val();
        var Sentido = $("#Sentido").val();
        var TramoDeApoyo = $("#TramoDeApoyo").val();
        var kilometrajeApoyo = $("#kilometrajeApoyo").val();
        var UnidadID = $("#UnidadID").val();
        if($("#TipoUnidad").prop("checked") == true){
            var TipoUnidad = 1;
        } else {
            var TipoUnidad = 0;
        }
        if($("#Apoyo").prop("checked") == true){
            var Apoyo = 1;
        } else {
            var Apoyo = 0;
        }

        var estatus_servidor = 0;
        var id_servidor = 0;
        var HoraCaptura = getDateWhitZeros();

        if(Apoyo == 0 && TipoUnidad == 0){
            swal("","Debes marcar una opción del tipo de apoyo.","warning");
            return false;
        }

        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer guardar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                if($("#id_apoyo").val()){
                    var id_apoyo = $("#id_apoyo").val();
                    if($("#estatus_servs").val() == 0){
                        estatus_servidor = 0;
                    } else if($("#estatus_servs").val() == 2){
                        estatus_servidor = 1;
                    } else if($("#estatus_servs").val() == 4){
                        estatus_servidor = 1;
                    }
                    databaseHandler.db.transaction(
                        function (tx) {
                          tx.executeSql(
                            "UPDATE TRFapoyo SET TramoDeApoyo = ?, kilometrajeApoyo = ?, estatus_servidor = ? WHERE id_apoyo = ?",
                            [TramoDeApoyo, kilometrajeApoyo, estatus_servidor, id_apoyo],
                            function (tx, results) {
                                swal("","Guardado correctamente","success");
                                setTimeout(function () {
                                    swal.close();
                                    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                                }, 1500);  
                            },
                            function (tx, error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                          );
                        },
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);},
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                    );
                } else {
                    databaseHandler.db.transaction(
                        function (tx) {
                          tx.executeSql(
                            "insert into TRFapoyo (id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo],
                            function (tx, results) {
                                swal("","Guardado correctamente","success");
                                setTimeout(function () {
                                    swal.close();
                                    app.views.main.router.back('/yallegue_desin/', {force: true, ignoreCache: true, reload: true});
                                }, 1500);  
                            },
                            function (tx, error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                          );
                        },
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);},
                        function (error) {console.error("Error al consultar bandeja de salida: " + error.message);}
                    );  
                }         
            }
            // TRFapoyo(id_cedula, Apoyo, TipoUnidad, Hora, UnidadID, Unidad, Itinerario, Sentido, Ubicacion, Operador, id_operador, kilometrajeUnidad, Usuario, estatus_servidor, id_servidor, HoraCaptura, TramoDeApoyo, kilometrajeApoyo);
        });
    }else{
        swal("","Debes llenar estos campos para poder guardar: "+quita_coma,"warning");
        return false;
    }   
}

function edit_apoyo(val, estatus){
    localStorage.setItem("id_detalle_folio", val);
    localStorage.setItem("estatus_servs", estatus);
    app.views.main.router.back('/formDesin5/', {force: true, ignoreCache: true, reload: true});
}
function sincronizaDatos(){
    var EmpresaID = localStorage.getItem("empresa");
    // var urlBase2 = "http://192.168.100.4/Desarrollo/CISAApp";
    var urlBase2 = "http://mantto.ci-sa.com.mx/www.CISAAPP.com";
    var url = urlBase2 + "/Exec/datos_desin.php?empresa="+EmpresaID;
    var url2 = urlBase2 + "/Exec/datos_desin_H.php?empresa="+EmpresaID;

    fetch(url)
        .then((response) => {
    });

    fetch(url2)
        .then((response) => {
    });
    // console.log("Sincroniza datos")
}
function CheckApoyoTipo(val){
    if(val == 0){
        var valCheck = document.getElementById("TipoUnidad").checked;
        if(valCheck == true){
            document.getElementById("Apoyo").checked = false;
        }
    }else {
        var valCheck = document.getElementById("Apoyo").checked;
        if(valCheck ==true){
            document.getElementById("TipoUnidad").checked = false;
        }
    }
}
function getIDEmpresa(val){
    if(val == "ACHSA"){
        return 1;
    } else if(val == "ATROL"){
        return 2;
    } else if(val == "CCA"){
        return 3;
    } else if(val == "CISA"){
        return 4;
    } else if(val == "COAVE"){
        return 5;
    } else if(val == "COPE"){
        return 6;
    } else if(val == "CORENSA"){
        return 7;
    } else if(val == "COREV"){
        return 8;
    } else if(val == "COTAN"){
        return 9;
    } else if(val == "COTOBUSA"){
        return 10;
    } else if(val == "MIHSA"){
        return 11;
    } else if(val == "RECSA"){
        return 12;
    } else if(val == "SIMES"){
        return 13;
    } else if(val == "SKYBUS"){
        return 14;
    } else if(val == "STMP"){
        return 15;
    } else if(val == "TCGSA"){
        return 16;
    } else if(val == "TREPSA"){
        return 17;
    } else if(val == "VYCSA"){
        return 18;
    } else if(val == "TUZOBUS"){
        return 19;
    } else if(val == "BUSSI"){
        return 20;
    } else if(val == "ESASA"){
        return 22;
    } else if(val == "CORET"){
        return 26;
    } else if(val == "AMTM"){
        return 35;
    } else if(val == "AULSA"){
        return 37;
    } else if(val == "COTXS"){
        return 39;
    } else if(val == "REFORMA"){
        return 40;
    } else if(val == "CODIV"){
        return 41;
    } else if(val == "IXTAP"){
        return 44;
    } else if(val == "MTY"){
        return 45;
    } else if(val == "SITRA"){
        return 46;
    } else if(val == "logo1"){
        return 0;
    }
}

function validaMenor500(ID, value){
    if(value <= 500){ } else {
        $("#"+ID).val('0')
        swal("", "Los Kilometros perdidos no pueden ser mayor a 500", "warning")
    }
}

// fin desincorporaciones
//Inicio Recaudo
function iniciarRecaudo(){
    var id_usuario = localStorage.getItem("Usuario");
    var nombre_usuario = localStorage.getItem("nombre");
    var fecha_llegada =  getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = "Recaudo";
    var estatus = 0;
    var geolocation = '';
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = 'Recaudo';
    productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
            "Select MAX(id_cedula) as Id from cedulas_general",
            [],
            function (tx, results) {
                var item = results.rows.item(0);
                localStorage.setItem("IdCedula", item.Id);
                var id_cedula = item.Id;
                productHandler.addDatosGenerales_Recaudo(id_cedula, fecha_llegada, id_usuario, id_cliente);
                app.views.main.router.navigate({ name: 'yallegueRecaudo'});
            },
            function (tx, error) {
                console.log("Error al guardar cedula: " + error.message);
            }
            );
        },
        function (error) {},
        function () {}
    );
}
function recaudarUnidad(){
    if($("#id_unidad").val()){
        var id_cedula = localStorage.getItem("IdCedula");
        var eco = $("#autocomplete-dropdown-ajax").val();
        var fecha = getDateWhitZeros();
        var id_unidad = $("#id_unidad").val();
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                "Select id_cedula from detalle_recaudo Where id_cedula = ? AND eco = ?",
                [id_cedula, eco],
                function (tx, results) {
                    var item = results.rows.item(0);
                    if(item.id_cedula){
                        swal({
                            title: "Aviso",
                            text: "Esta unidad ya se encuentra en este recaudo. ¿Quieres hacer otro recaudo de la unidad?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((RESP) => {
                            if (RESP == true) {
                                productHandler.addDetalle_Recaudo(id_cedula, id_unidad, eco, fecha, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                        "Select MAX(id_detalle) as Id from detalle_recaudo Where id_cedula = ?",
                                        [id_cedula],
                                        function (tx, results) {
                                            var item = results.rows.item(0);
                                            localStorage.setItem("IdDetalle", item.Id);
                                            app.views.main.router.back('/formRecaudo1/', {force: true, ignoreCache: true, reload: true});
                                        },
                                        function (tx, error) {
                                            console.log("Error al guardar cedula: 1" + error.message);
                                        }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            }
                        });
                    }
                },
                function (tx, error) {console.log("Error al guardar cedula: 2" + error.message);}
                );
            },
            function (error) {
                productHandler.addDetalle_Recaudo(id_cedula, id_unidad, eco, fecha, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                        "Select MAX(id_detalle) as Id from detalle_recaudo Where id_cedula = ?",
                        [id_cedula],
                        function (tx, results) {
                            var item = results.rows.item(0);
                            localStorage.setItem("IdDetalle", item.Id);
                            app.views.main.router.back('/formRecaudo1/', {force: true, ignoreCache: true, reload: true});
                        },
                        function (tx, error) {
                            console.log("Error al guardar cedula: 1" + error.message);
                        }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            },
            function (error) {console.log("Error al guardar cedula: 4" + error.message);}
        );
    }else {
        swal("","No haz seleccionado una unidad","warning");
    }
}
function FinalizarRecaudo(){
    if($("#recaudo_momento").val()){
        swal({
            title: "Aviso",
            text: "¿Estas seguro de querer finalizar el recaudo?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((RESP) => {
            if (RESP == true) {
                var bolsa1 = $("#fin_recaudo").data("bolsa1"); //cuantas bolsa de $1
                var bolsa2 = $("#fin_recaudo").data("bolsa2"); //cuantas bolsa de $2
                var bolsa5 = $("#fin_recaudo").data("bolsa5"); //cuantas bolsa de $5
                var bolsa10 = $("#fin_recaudo").data("bolsa10"); //cuantas bolsa de $10
                var bolsa50c = $("#fin_recaudo").data("bolsa50c"); //cuantas bolsa de $50c
                var bolsas_totales = $("#fin_recaudo").data("bolsas_totales"); //cuantas bolsas totales
                
                var monto1 = $("#fin_recaudo").data("monto1"); //suma sin cacharpa
                var total_unidades = $("#fin_recaudo").data("total_unidades");//
                var unidades_recaudads = $("#fin_recaudo").data("unidades_recaudads"); //

                var pico1 = $("#fin_recaudo").data("pico1");  //pico de monedas de $1
                var pico2 = $("#fin_recaudo").data("pico2");  //pico de monedas de $2
                var pico5 = $("#fin_recaudo").data("pico5");  //pico de monedas de $5
                var pico10 = $("#fin_recaudo").data("pico10");  //pico de monedas de $10
                var pico50c = $("#fin_recaudo").data("pico50c");  //pico de monedas de $50c

                var promedio = $("#fin_recaudo").data("promedio"); //promedio de recaudo
                var recaudo_sin_billetes = $("#fin_recaudo").data("recaudo_sin_billetes"); //total sin billetes
                var recaudo_total = $("#fin_recaudo").data("recaudo_total"); // recaudo total + total cacharpa si hay
                var total_billetes = $("#fin_recaudo").data("total_billetes"); //suma de los billetes

                var id_cedula = localStorage.getItem("IdCedula");

                databaseHandler.db.transaction(
                    function(tx){
                        tx.executeSql("UPDATE datos_generales_recaudo SET bolsa1 = ?, bolsa2 = ?, bolsa5 = ?, bolsa10 = ?, bolsa50c = ?, bolsas_totales = ?, monto1 = ?, total_unidades = ?, unidades_recaudads = ?, pico1 = ?, pico2 = ?, pico5 = ?, pico10 = ?, pico50c = ?, promedio = ?, recaudo_sin_billetes = ?, recaudo_total = ?, total_billetes = ? WHERE id_cedula = ?",
                            [bolsa1,bolsa2,bolsa5,bolsa10,bolsa50c,bolsas_totales,monto1,total_unidades,unidades_recaudads,pico1,pico2,pico5,pico10,pico50c,promedio,recaudo_sin_billetes,recaudo_total,total_billetes,id_cedula],
                            function(tx, results){
                                app.views.main.router.back('/formRecaudo2/', {force: true, ignoreCache: true, reload: true});
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
        });
    } else {
        swal("", "Aún no haz recaudado para poder finalizar", "warning");
    }
}
function editarUnidadRecaudo(id){
    localStorage.setItem("IdDetalle", id);
    app.views.main.router.back('/formRecaudo1/', {force: true, ignoreCache: true, reload: true});
}

function editarMonedaRecaudo(id_detalle, monedabd){
    modalCantidad(monedabd)
}
function modalCantidad(val){
    var ruta = '';
    var clase= '';
    var texto = '';
    var valor = 0;
    if(val == 0){
        ruta = 'img/currency/50c.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = .5;
    } else if(val == 1){
        ruta = 'img/currency/1.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 1;
    } else if(val == 2){
        ruta = 'img/currency/2.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 2;
    } else if(val == 5){
        ruta = 'img/currency/5.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 5;
    } else if(val == 10){
        ruta = 'img/currency/10.png';
        clase = 'moneda_mx';
        texto = 'monedas';
        valor = 10;
    } else if(val == 20){
        ruta = 'img/currency/20.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 20;
    } else if(val == 50){
        ruta = 'img/currency/50.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 50;
    } else if(val == 100){
        ruta = 'img/currency/100.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 100;
    } else if(val == 200){
        ruta = 'img/currency/200.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 200;
    } else if(val == 500){
        ruta = 'img/currency/500.png';
        clase = 'billete_mx';
        texto = 'billetes';
        valor = 500;
    } 
    var popEvidencia = app.popup.create({
        content: `
        <div class="sheet-modal my-sheet" id="sheet-modal" name="sheet" style="height: 90%;">
        <div class="toolbar">
            <div class="toolbar-inner">
                <div class="left"></div>
                <div class="right"><a class="link" id="close_sheet" href="#">Cerrar</a></div>
            </div>
        </div>
        <div class="sheet-modal-inner" style="overflow-y: scroll;">
            <div class="block">
                <div class="FWM-photo-container">
                    <a>
                        <img src="`+ruta+`" alt="" class="`+clase+`">
                    </a>
                </div>

                <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                    <span class="span FWM-span-form" style="color: #005D99;">Ingresa la cantidad de pzas.</span>
                    <input type="text" class="FWM-input" id="recuento" readonly>
                    <input type="hidden" id="valor" value="`+valor+`">
                    <input type="hidden" id="importe2">
                    <span class="span FWM-span-form" style="color: #FF0037;" id="importe">0 `+texto+` es = $0.00</span>
                    
                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(1)">1</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(2)">2</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(3)">3</button>
                        </div>
                    </div>

                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(4)">4</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(5)">5</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(6)">6</button>
                        </div>
                    </div>

                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(7)">7</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(8)">8</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(9)">9</button>
                        </div>
                    </div>

                    <div style="display: flex;justify-content: space-around;">
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora('borra')"><i class="material-icons md-light" style="color: #FF0037;vertical-align: middle;font-size: 30px;">backspace</i></button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora" onclick="calculadora(0)">0</button>
                        </div>
                        <div>
                            <button class="col button button-large button-fill btn-calculadora"  onclick="calculadora('termina')"><i class="material-icons md-light" style="color: #2ECC71;vertical-align: middle;font-size: 30px;">check_circle</i></button>
                        </div>
                    </div>

                    <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                        <div class="row align-items-stretch" style="text-align: center;">
                            <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                <span class="resize-handler"></span>
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
                                }
                            });
                        }
                    });
                },
            }
    });
   
    popEvidencia.open();
}
function finRecaudoUnidad(){
    if($("#id_unidad").val()){
        var eco = $("#autocomplete-dropdown-ajax").val();
        var id_detalle = localStorage.getItem("IdDetalle");
        var id_cedula = localStorage.getItem("IdCedula");
        var id_unidad = $("#id_unidad").val();
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("SELECT id_cedula FROM detalle_recaudo WHERE id_cedula = ? AND eco = ? ",
                    [id_cedula, eco],
                    function(tx5, results){
                        var length = results.rows.length;
                        if(length > 0){
                            swal({
                                title: "Aviso",
                                text: "Ya existe una unidad recaudada con este eco, ¿Deseas aún así hacer el cambio?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack){
                                    databaseHandler.db.transaction(
                                        function(tx){
                                            tx.executeSql("UPDATE detalle_recaudo SET eco = ?, id_unidad = ? WHERE id_cedula = ? AND id_detalle = ?",
                                                [eco,id_unidad,id_cedula,id_detalle],
                                                function(tx, results){
                                                    swal("","Unidad actualizada correctamente", "success");
                                                    app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});                
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
                            });
                        } else {
                            databaseHandler.db.transaction(
                                function(tx){
                                    tx.executeSql("UPDATE detalle_recaudo SET eco = ?, id_unidad = ? WHERE id_cedula = ? AND id_detalle = ?",
                                        [eco,id_unidad,id_cedula,id_detalle],
                                        function(tx, results){
                                            swal("","Unidad actualizada correctamente", "success");
                                            app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});                
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
                    },
                    function(tx5, error){
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );  
            },
        function(error){},
        function(){}
        );

        
    } else {
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    }
}

function regresaRecaudo(val){
    if(val == 1){
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    } else if(val == 2){
        app.views.main.router.back('/yallegueRecaudo/', {force: true, ignoreCache: true, reload: true});
    }
}

function calculadora(valor){
    var cuenta = $("#recuento").val();
    if(valor == 'borra'){
        cuenta = cuenta.substring(0, cuenta.length - 1);
    } else if(valor == 'termina'){
        if($("#recuento").val()){
            guardarMoneda($("#recuento").val(),$("#importe2").val(),$("#valor").val());
        }else{
            swal({
                title: "Aún no haz ingresado la cantidad de piezas",
                text: 'Si quieres reiniciar la cantidad en 0 da en "ok" de lo contrario en "cancelar"',
                icon: "warning",
                buttons: true,
                dangerMode: false,
            }).then((willGoBack) => {
                if (willGoBack){
                    guardarMoneda(0,0,$("#valor").val());
                }
            });
        }
    } else if(valor == 0){
        if ($("#recuento").val()){
            cuenta = cuenta + valor; 
        }
    } else {
        cuenta = cuenta + valor; 
    }
    $("#recuento").val(cuenta);
    var moneda = parseFloat($("#valor").val());
    var importe = parseFloat(cuenta)* moneda;
    if(!isNaN(importe)){
        if($("#valor").val() == '0.5' || $("#valor").val() == '1' || $("#valor").val() == '2' || $("#valor").val() == '5' || $("#valor").val() == '10'){
            $("#importe").html(numberWithCommas(cuenta) +" monedas es = $"+numberWithCommas(importe));
            $("#importe2").val(importe);
        } else if($("#valor").val() == '20' || $("#valor").val() == '50' || $("#valor").val() == '100' || $("#valor").val() == '200' || $("#valor").val() == '500'){
            $("#importe").html(numberWithCommas(cuenta) +" billetes es = $"+numberWithCommas(importe));
            $("#importe2").val(importe);
        }
    }else{
        if($("#valor").val() == '.5' || $("#valor").val() == '1' || $("#valor").val() == '2' || $("#valor").val() == '5' || $("#valor").val() == '10'){
            $("#importe").html(0 +" monedas es = $0.00");
            $("#importe2").val(0);
        } else if($("#valor").val() == '20' || $("#valor").val() == '50' || $("#valor").val() == '100' || $("#valor").val() == '200' || $("#valor").val() == '500'){
            $("#importe").html(0 +" billetes es = $0.00");
            $("#importe2").val(0);
        }
    }
}

function guardarMoneda(piezas, importe, moneda){
    var id_detalle = localStorage.getItem("IdDetalle");
    var id_cedula = localStorage.getItem("IdCedula");
    if(moneda == "0.5"){
        var modedabd  = 'Moneda50c';
        var importebd = 'importe50c';
        var newMoneda = 1;
    }else{
        var modedabd = 'Moneda'+moneda;
        var importebd = 'importe'+moneda;
        if(moneda == 1){
            var newMoneda = 2;
        } else if(moneda == 2){
            var newMoneda = 5;
        } else if(moneda == 5){
            var newMoneda = 10;
        } else if(moneda == 10){
            var newMoneda = 20;
        } else if(moneda == 20){
            var newMoneda = 50;
        } else if(moneda == 50){
            var newMoneda = 100;
        } else if(moneda == 100){
            var newMoneda = 200;
        } else if(moneda == 200){
            var newMoneda = 500;
        } else {
            var newMoneda = '';
        }
    }

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE detalle_recaudo SET "+modedabd+" = ?, "+importebd+" = ? WHERE id_cedula = ? AND id_detalle = ?",
                [piezas,importe,id_cedula,id_detalle],
                function(tx, results){
                    app.sheet.close('#sheet-modal');
                    // swal("","Guardado correctamente.","success");
                    setTimeout(function() {
                        // swal.close();
                        // if(newMoneda){
                             modalCantidad(newMoneda);
                        // }
                    }, 400)
                    $("#tb_recaudo").empty();
                    databaseHandler.db.transaction(
                        function(tx5){
                            tx5.executeSql("SELECT * FROM detalle_recaudo WHERE id_detalle = ? AND id_cedula = ?",
                                [id_detalle, id_cedula],
                                function(tx5, results){
                                    var length = results.rows.length;
                                    if(length == 0){
                                        $("#message-nr").css("display", "block");
                                    }else{
                                        $("#message-nr").css("display", "none");
                                        for(var i = 0; i< length; i++){
                                            var item2 = results.rows.item(i);
                                            $("#tb_recaudo").append("<tr><td>$0.5</td><td>"+item2.Moneda50c+"</td><td>$"+numberWithCommas(item2.importe50c)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",0);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$1</td><td>"+item2.Moneda1+"</td><td>$"+numberWithCommas(item2.importe1)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",1);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$2</td><td>"+item2.Moneda2+"</td><td>$"+numberWithCommas(item2.importe2)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",2);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$5</td><td>"+item2.Moneda5+"</td><td>$"+numberWithCommas(item2.importe5)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",5);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$10</td><td>"+item2.Moneda10+"</td><td>$"+numberWithCommas(item2.importe10)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",10);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$20</td><td>"+item2.Moneda20+"</td><td>$"+numberWithCommas(item2.importe20)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",20);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$50</td><td>"+item2.Moneda50+"</td><td>$"+numberWithCommas(item2.importe50)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",50);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$100</td><td>"+item2.Moneda100+"</td><td>$"+numberWithCommas(item2.importe100)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",100);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$200</td><td>"+item2.Moneda200+"</td><td>$"+numberWithCommas(item2.importe200)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",200);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");
                                            $("#tb_recaudo").append("<tr><td>$500</td><td>"+item2.Moneda500+"</td><td>$"+numberWithCommas(item2.importe500)+"</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo("+ item2.id_detalle +",500);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>");

                                            var piezastotales = parseInt(item2.Moneda50c)+parseInt(item2.Moneda1)+parseInt(item2.Moneda2)+parseInt(item2.Moneda5)+parseInt(item2.Moneda10)+parseInt(item2.Moneda20)+parseInt(item2.Moneda50)+parseInt(item2.Moneda100)+parseInt(item2.Moneda200)+parseInt(item2.Moneda500);
                                            var importetotal = parseFloat(item2.importe50c)+parseFloat(item2.importe1)+parseFloat(item2.importe2)+parseFloat(item2.importe5)+parseFloat(item2.importe10)+parseFloat(item2.importe20)+parseFloat(item2.importe50)+parseFloat(item2.importe100)+parseFloat(item2.importe200)+parseFloat(item2.importe500);
                                            $(".title").html("Recaudo | "+item2.eco+" - $"+numberWithCommas(importetotal));
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("UPDATE detalle_recaudo SET piezas_totales = ?, importe_total = ? WHERE id_cedula = ? AND id_detalle = ?",
                                                        [piezastotales,importetotal,id_cedula,id_detalle],
                                                        function(tx, results){
                                                            $("#tb_recaudo").append("<tr style='text-align: center;background-color: #005D99;color: white;''><td>Totales</td><td>"+numberWithCommas(piezastotales)+"</td><td>$"+numberWithCommas(importetotal)+"</td><td>&nbsp;</td></tr>");
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
                                },
                                function(tx5, error){
                                    console.error("Error al consultar bandeja de salida: " + error.message);
                                }
                            );  
                        },
                    function(error){},
                    function(){}
                    );
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
function validarRadio(id){
    var ids = id.split("-");
    var apartado = ids[1];
    var check = ids[2];
    var valCheck = document.getElementById(ids[0]+"-"+ids[1]+"-"+ids[2]).checked;
    if(check.includes('1')){
        if(valCheck ==true){
            var otherCheck = ids[0] + "-"+ids[1]+"-2";
            document.getElementById(otherCheck).checked = false;
            $("#div_"+apartado).css("display","block");
            if(apartado == 'monto'){
                $("#div_folio2").css("display","flex");
            }
        }
    }else{
        if(valCheck ==true){
            var otherCheck = ids[0] + "-"+ids[1]+"-1";
            document.getElementById(otherCheck).checked = false;
            $("#div_"+apartado).css("display","none");
            if(apartado == 'monto'){
                $("#div_cacharpa").css("display","none");
                $("#div_folio2").css("display","none");
            }
        }
    }
}
function CalculaBolsa(bolsa){
    var bolsaCacharpa10 = $("#bolsaCacharpa10").val();
    var bolsaCacharpa20 = $("#bolsaCacharpa20").val();
    var bolsaCacharpa50 = $("#bolsaCacharpa50").val();

    var monto10c = parseInt(bolsaCacharpa10*500)
    var monto20c = parseInt(bolsaCacharpa20*500)
    var monto50c = parseInt(bolsaCacharpa50*1000)

    var cuenta = monto10c + monto20c + monto50c;

    $("#Acumulado1").val(cuenta);
    $("#Acumulado1_text").html(`Acumulado: $${numberWithCommas(cuenta.toFixed(2))}`);

    if(bolsa == 50){
        $("#max_bolsa50c").val(parseInt($("#bolsas_50co").val())+parseInt($("#bolsaCacharpa50").val()));
    }
}
function ingresarBolsasMonto(){
    if(parseInt($("#monto").val()) > parseInt($("#recaudo_sin_billetes").val())){
        swal("","El monto no puede ser mayor a lo recaudado.","warning");
        $("#monto").val("");
        $("#Acumulado3_text").text("Monto: $0.00");
        $("#div_cacharpa").css("display", "none");
    } else{
        $("#div_cacharpa").css("display", "block");
    }
}
function CalculaBolsa2(bolsa){
    $("#monto").prop("disabled", true);
    $("#monto").css("background-color", "#F4F4F4");
    var bolsas50c = $("#step_moneda0").val();
    var bolsas1 = $("#step_moneda1").val();
    var bolsas2 = $("#step_moneda2").val();
    var bolsas5 = $("#step_moneda5").val();
    var bolsas10 = $("#step_moneda10").val();

    var monto0 = parseInt(bolsas50c*1000);
    var monto1 = parseInt(bolsas1*2000);
    var monto2 = parseInt(bolsas2*4000);
    var monto5 = parseInt(bolsas5*6000);
    var monto10 = parseInt(bolsas10*5000);

    var Acumulado2 = monto0+monto1+monto2+monto5+monto10;
    
    if(Acumulado2 > $("#monto").val()){
        swal("","Agregando esta bolsa el monto acumulado sería mayor.","warning");
        if(bolsa == 0){
            var stepper = app.stepper.get('#steper0');
            stepper.decrement();
        } else if(bolsa == 1){
            $("#step_moneda1").val($("#step_moneda1").val()-1);
            var stepper = app.stepper.get('#steper1');
            stepper.decrement();
        } else if(bolsa == 2){
            $("#step_moneda2").val($("#step_moneda2").val()-1);
            var stepper = app.stepper.get('#steper2');
            stepper.decrement();
        } else if(bolsa == 5){
            $("#step_moneda5").val($("#step_moneda5").val()-1);
            var stepper = app.stepper.get('#steper5');
            stepper.decrement();
        } else if(bolsa == 10){
            $("#step_moneda10").val($("#step_moneda10").val()-1);
            var stepper = app.stepper.get('#steper10');
            stepper.decrement();
        }
        return false;
    }
    if(bolsa == 0){
        var stepper = app.stepper.get('#steper0');
        if(parseInt($("#step_moneda0").val()) > parseInt($("#max_bolsa50c").val())){
            swal("","No tienes bolsas suficientes de esta denominación, para continar la acción intenta con otra bolsa","warning");
            stepper.decrement();
            return false;
        }
    } else if(bolsa == 1 || bolsa == 2 || bolsa == 5 || bolsa == 10){
        var stepper = app.stepper.get('#steper'+bolsa);
        if(parseInt($("#step_moneda"+bolsa).val()) > parseInt($("#max_bolsa"+bolsa).val())){
            swal("","No tienes bolsas suficientes de esta denominación, para continar la acción intenta con otra bolsa","warning");
            stepper.decrement();
            return false;
        }
    }
    $("#Acumulado2_text").html(`Acumulado: $${numberWithCommas(Acumulado2.toFixed(2))}`);
    $("#Acumulado2").val(Acumulado2);
}
function finRecaudo(){
    var id_cedula = localStorage.getItem("IdCedula");
    if($("#radio-bolsas-2").prop("checked")){
        var opc_cacharpa = '0';
        var bolsaCacharpa10 = 0  //cuantas bolsas se van a mandar de $10C
        var bolsaCacharpa20 = 0  //cuantas bolsas se van a mandar de $20C
        var bolsaCacharpa50 = 0  //cuantas bolsas se van a mandar de $50C
        var total_cacharpa = 0 //suma de cacharpa monto adicional
    }else{
        var opc_cacharpa = '1';
        var bolsaCacharpa10 = $("#bolsaCacharpa10").val();
        var bolsaCacharpa20 = $("#bolsaCacharpa20").val();
        var bolsaCacharpa50 = $("#bolsaCacharpa50").val();

        var total_cacharpa = parseInt(bolsaCacharpa10)+parseInt(bolsaCacharpa20)+parseInt(bolsaCacharpa50)
    }

    if(!$("#folio").val()){
        swal("","Favor de indicar el folio de traslado.","warning");
        return false;
    }else{
        var folio = $("#folio").val();
    }

    if($("#radio-monto-2").prop("checked")){
        var opc_adicional = '0';
        var monto_adicional = 0;
        var bolsaAdd50c = 0;
        var bolsaAdd1 = 0;
        var bolsaAdd2 = 0;
        var bolsaAdd5 = 0;
        var bolsaAdd10 = 0;
        var folio2 = "";
    }else{
        var opc_adicional = '1';
        if($("#monto").val() == $("#Acumulado2").val()){
            if(!$("#folio2").val()){
                swal("","Favor de indicar el folio 2 de traslado.","warning");
                return false;
            }else{
                var folio2 = $("#folio2").val();        
            }
        }else{
            swal("","El monto adicional y el acumulado no coinciden.","warning");
            return false;
        }
        var monto_adicional = $("#monto").val();
        var bolsaAdd50c = $("#step_moneda0").val();
        var bolsaAdd1 = $("#step_moneda1").val();
        var bolsaAdd2 = $("#step_moneda2").val();
        var bolsaAdd5 = $("#step_moneda5").val();
        var bolsaAdd10 = $("#step_moneda10").val();
    }

    var plomo = $("#CountPlomos").val();
    for(var i = 1; i<= plomo; i++){
        if(i == 1){
            if(!$("#plomo").val()){
                swal("","Favor de indicar el plomo 1.","warning");
                return false;
            }
        } else {
            if(!$("#plomo"+i).val()){
                swal("","Favor de indicar el plomo "+i+".","warning");
                return false;
            }
        }
    }

    if($("#total_billetes").val() == 0){}else{
        if(!$("#plomo").val()){
            swal("","Debes indicar al menos un plomo.","warning");
            return false;
        }
    }

    var plomo1 = $("#plomo").val();
    var plomo2 = $("#plomo2").val();
    var plomo3 = $("#plomo3").val();
    var plomo4 = $("#plomo4").val();
    var plomo5 = $("#plomo5").val();

    if(!$("#obs_recaudo").val()){
        var observaciones = "Sin comentarios";
    }else {
        var observaciones = $("#obs_recaudo").val();
    }
    var importe_cacharpa = $("#Acumulado1").val();

    var recaudo_sin_billetes = $("#recaudo_sin_billetes").val();
    var monto1 = parseInt(recaudo_sin_billetes)+parseInt(importe_cacharpa);

    var peso_cacharpa = $("#peso_cacharpa").val();

    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("UPDATE datos_generales_recaudo SET opc_cacharpa = ?, monto1 = ?, bolsaCacharpa10 = ?, bolsaCacharpa20 = ?, bolsaCacharpa50 = ?, total_cacharpa = ?, opc_adicional = ?, monto_adicional = ?, bolsaAdd50c = ?, bolsaAdd1 = ?, bolsaAdd2 = ?, bolsaAdd5 = ?, bolsaAdd10 = ?, folio2 = ?, folio = ?, plomo = ?, plomo2 = ?, plomo3 = ?, plomo4 = ?, plomo5 = ?, observaciones = ?, importe_cacharpa = ?, peso_cacharpa = ? WHERE id_cedula = ?",
                [opc_cacharpa, monto1, bolsaCacharpa10, bolsaCacharpa20, bolsaCacharpa50, total_cacharpa, opc_adicional, monto_adicional, bolsaAdd50c, bolsaAdd1, bolsaAdd2, bolsaAdd5, bolsaAdd10, folio2, folio, plomo1,plomo2, plomo3, plomo4, plomo5, observaciones, importe_cacharpa, peso_cacharpa, id_cedula],
                function(tx, results){
                    swal("","Guardado correctamente.","success");
                    EnviarRecaudo();
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
function EnviarRecaudo(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar el Recaudo del día?",
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
function showPlomos(){
    var plomo = $("#CountPlomos").val();
    for(var i = 1; i<= plomo; i++){
        $("#div_plomo"+i).css("display", "flex");
    }

    for(var i = 5; i > plomo; i--){
        $("#div_plomo"+i).css("display", "none");
    }
}
function ver_preliminar(id){
    localStorage.setItem("IdCedula", id);
    app.views.main.router.back('/formRecaudo3/', {force: true, ignoreCache: true, reload: true});
}
function preingresoRecaudo(){
    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");
    var id_empresa = localStorage.getItem("empresa");
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "Select id_cedula from datos_generales_recaudo where DATE(fecha) = ? AND id_empresa = ?",
            [hoy[0], id_empresa],
            function (tx, results) {
                var length = results.rows.length;
                if(length == 0){
                    swal({
                        title: "Aviso",
                        text: "¿Estas seguro de querer empezar un nuevo registro para recaudar?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            iniciarRecaudo();
                        }
                    });
                } else {
                    swal({
                        title: "Aviso",
                        text: "¿Ya se ha realizado un recaudo con la fecha de hoy, deseas generar un recaudo nuevo?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((RESP) => {
                        if (RESP == true) {
                            iniciarRecaudo();
                        }
                    });
                }
            },
            function (tx, error) {}
          );
        },
        function (error) {},
        function () {}
    );
}
function actualiza_fecha(){
    if($("#fecha").val()){
        var fecha_s = $("#fecha").val().split("-");
        var fecha = $("#fecha").val()+" "+$("#hora").val();
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function(tx5){
                tx5.executeSql("UPDATE datos_generales_recaudo SET fecha = ? WHERE id_cedula = ?",
                    [fecha, id_cedula],
                    function(tx5, results){
                        swal("", "Fecha actualizada.","success");
                        var MyDateString = fecha_s[2]+"-"+fecha_s[1]+"-"+fecha_s[0];
                        $(".title").html("Recaudo | "+MyDateString);
                        databaseHandler.db.transaction(
                            function(tx5){
                                tx5.executeSql("UPDATE cedulas_general SET fecha_entrada = ? WHERE id_cedula = ?",
                                    [fecha, id_cedula],
                                    function(tx5, results){},
                                    function(tx5, error){}
                                );  
                            },
                            function(error){},
                            function(){}
                        );
                    },
                    function(tx5, error){
                        console.error("Error update: " + error.message);
                    }
                );  
            },
            function(error){},
            function(){}
        );
    } else {
        swal("", "Debes elegir una fecha válida", "warning");
    }
}

function RevisaHeaders_recaudo(){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Recaudo_'+empresa;

    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");

    var encontro = false;
    var empresa = '';

    app.request.get(cordova.file.dataDirectory + "jsons_recaudo/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                guardaHeaderRecaudo(content2[x].fecha,content2[x].id_cedula,content2[x].id_dato, content2[x].id_usuario, content2[x].id_empresa, content2[x].observaciones, content2[x].folio, content2[x].folio2, content2[x].recaudo_total, content2[x].recaudo_sin_billetes, content2[x].total_billetes, content2[x].total_cacharpa, content2[x].bolsas_totales, content2[x].plomo, content2[x].monto1, content2[x].total_unidades, content2[x].unidades_recaudads, content2[x].promedio, content2[x].bolsa50c, content2[x].bolsa1, content2[x].bolsa2, content2[x].bolsa5, content2[x].bolsa10, content2[x].pico50c, content2[x].pico1, content2[x].pico2, content2[x].pico5, content2[x].pico10, content2[x].opc_cacharpa, content2[x].opc_adicional, content2[x].bolsaCacharpa10, content2[x].bolsaCacharpa20, content2[x].bolsaCacharpa50, content2[x].monto_adicional, content2[x].bolsaAdd50c, content2[x].bolsaAdd1, content2[x].bolsaAdd2, content2[x].bolsaAdd5, content2[x].bolsaAdd10, content2[x].importe_cacharpa, content2[x].estatus, content2[x].origen, content2[x].plomo2, content2[x].plomo3, content2[x].plomo4, content2[x].plomo5, content2[x].peso_cacharpa);
            }
        }
    });
}

function guardaHeaderRecaudo(fecha,id,id_dato,id_usuario,id_empresa,observaciones,folio,folio2,recaudo_total,recaudo_sin_billetes,total_billetes,total_cacharpa,bolsas_totales,plomo,monto1,total_unidades,unidades_recaudads,promedio,bolsa50c,bolsa1,bolsa2,bolsa5,bolsa10,pico50c,pico1,pico2,pico5,pico10,opc_cacharpa,opc_adicional,bolsaCacharpa10,bolsaCacharpa20,bolsaCacharpa50,monto_adicional,bolsaAdd50c,bolsaAdd1,bolsaAdd2,bolsaAdd5,bolsaAdd10,importe_cacharpa,estatus,origen,plomo2, plomo3, plomo4, plomo5, peso_cacharpa){
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM datos_generales_recaudo WHERE fecha = ? ",
                [fecha],
                function(tx5, results){
                    var length = results.rows.length;
                    if(length == 0){
                        var nombre_usuario = localStorage.getItem("nombre");
                        var id_cliente = localStorage.getItem("empresa");
                        var empresa = NombreEmpresa(id_cliente);
                        var estatus = 0;
                        var geolocation = '';
                        var tipo_cedula = 'Recaudo';
                        productHandler.addCedulayb(id_usuario,nombre_usuario,fecha,geolocation,id_cliente,empresa,fecha,estatus,tipo_cedula);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    var item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    var id_cedula = item.Id;
                                    productHandler.addDesincorHeaderRecaudo(id_cedula, empresa, fecha, id_usuario, id_empresa, observaciones, folio, folio2, recaudo_total, recaudo_sin_billetes, total_billetes, total_cacharpa, bolsas_totales, plomo, monto1, total_unidades, unidades_recaudads, promedio, bolsa50c, bolsa1, bolsa2, bolsa5, bolsa10, pico50c, pico1, pico2, pico5, pico10, opc_cacharpa, opc_adicional, bolsaCacharpa10, bolsaCacharpa20, bolsaCacharpa50, monto_adicional, bolsaAdd50c, bolsaAdd1, bolsaAdd2, bolsaAdd5, bolsaAdd10, importe_cacharpa, plomo2, plomo3, plomo4, plomo5, peso_cacharpa, estatus, origen, id);
                                    PintaCedulas(0, "Recaudo");
                                    InsertaDetailsRecaudo(id_cedula, id);
                                },
                                function (tx, error) {}
                                );
                            },
                            function (error) {},
                            function () {}
                        );
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
function InsertaDetailsRecaudo(id_cedula, id_servidor){
    var empresa = localStorage.getItem("empresa");
    var NomJson = 'Recaudo_desc_'+empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_recaudo/"+NomJson+".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null){}else{
            for(var x = 0; x < content2.length; x++) {
                if(id_servidor == content2[x].id_cedula){
                    productHandler.addDetailsDesRecaudo(content2[x].id_detalle, id_cedula, content2[x].eco, content2[x].Moneda50c, content2[x].Moneda1, content2[x].Moneda2, content2[x].Moneda5, content2[x].Moneda10, content2[x].Moneda20, content2[x].Moneda50, content2[x].Moneda100, content2[x].Moneda200, content2[x].Moneda500, content2[x].importe50c, content2[x].importe1, content2[x].importe2, content2[x].importe5, content2[x].importe10, content2[x].importe20, content2[x].importe50, content2[x].importe100, content2[x].importe200, content2[x].importe500, content2[x].piezas_totales, content2[x].importe_total, content2[x].id_unidad);
                }
            }
        }
    });
}
//Fin Recaudo
//Inicio Diesel
function preingresoDiesel(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer empezar un nuevo registro para Cargas de Diesel?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            iniciarCargasDiesel();
        }
    });
}

function iniciarCargasDiesel(){
    var id_usuario = localStorage.getItem("Usuario");
    var nombre_usuario = localStorage.getItem("nombre");
    var fecha_llegada =  getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = NombreEmpresa(localStorage.getItem("empresa"));
    var estatus = 0;
    var geolocation = '';
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = 'Diesel';
    var origen = 'Mobile';
    productHandler.addCedulayb(id_usuario,nombre_usuario,fecha_llegada,geolocation,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula);
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
            "Select MAX(id_cedula) as Id from cedulas_general",
            [],
            function (tx, results) {
                var item = results.rows.item(0);
                localStorage.setItem("IdCedula", item.Id);
                var id_cedula = item.Id;
                productHandler.addDatosGenerales_Diesel(id_cedula, fecha_llegada, id_usuario, id_cliente, estatus, origen, nombre_usuario);
                app.views.main.router.navigate({ name: 'yallegueDiesel'});
            },
            function (tx, error) {
                console.log("Error al guardar cedula: " + error.message);
            }
            );
        },
        function (error) {},
        function () {}
    );
}

function llamarUnidadDiesel(){
    var id_unidad = $("#btn_llamarUnidad").data('id_unidad');
    var eco = $("#btn_llamarUnidad").data('Unidad');
    var VIN = $("#btn_llamarUnidad").data('VIN');
    var buscador = $("#btn_llamarUnidad").data('buscador');
    if(id_unidad){
        app.sheet.open('#sheet-modal');
        $("#id_unidad").val("");
        $("#eco").val("");
        $("#bomba_c").val("0");
        $("#almacen").val("Diesel");
        $("#id_operador").val("");
        $("#operador2").val("");
        $("#operador").val("");
        $("#jornada").val("");
        $("#vueltas").val("");
        $("#odometro").val("");
        $("#h_inicio").val("");
        $("#h_fin").val("");
        $("#carga").val("");
        
        var tiempoactual = getDateWhitZeros().split(" ");
        var horasSplit = tiempoactual[1].split(":");
        var fecha = tiempoactual[0].split("-");
        var hours = add_minutes(new Date(fecha[0],fecha[1],fecha[2], horasSplit[0],horasSplit[1],horasSplit[2]), 1).getHours();
        var minutes = add_minutes(new Date(fecha[0],fecha[1],fecha[2], horasSplit[0],horasSplit[1],horasSplit[2]), 1).getMinutes();
        var seconds = add_minutes(new Date(fecha[0],fecha[1],fecha[2], horasSplit[0],horasSplit[1],horasSplit[2]), 1).getSeconds();
        var houtransform = ('0'+hours).slice(-2)+":"+('0'+minutes).slice(-2)+":"+('0'+seconds).slice(-2);

        $("#id_unidad").val(id_unidad);
        $("#eco").val(eco);
        $("#title_unidad").html(`Unidad: ${buscador}`);
        $("#h_inicio").val(tiempoactual[1]);
        $("#h_fin").val(houtransform);
        $("#VIN").val(VIN);
        $('#close_sheet').click(function () {
            if($('#pasa').val()!=0){
                app.sheet.close('#sheet-modal');
            }else{
                swal({
                    title: "Aviso",
                    text: "Aún no haz guardado información, ¿Estas seguro que deseas regresar?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                }).then((willGoBack) => {
                    if (willGoBack){
                        app.sheet.close('#sheet-modal');
                    }
                });
            }
        });
    } else {
        swal("", "Debes seleccionar primero una unidad para poder continuar", "warning");
    }
}

function agregaCarga(){
    if($("#carga").val() && $("#odometro").val()){
        var id_cedula = localStorage.getItem("IdCedula");
        var carga_total = Number($("#carga").val()).toFixed(2);
        var odometro = Number($("#odometro").val()).toFixed(2);
        var fecha_carga = getDateWhitZeros();
        var no_bomba = $("#bomba_c").val();
        var tipo_carga = $("#tipo_carga").val();
        var almacen = $("#almacen").val();
        var operador = $("#operador").val();
        var id_operador = $("#id_operador").val();
        var jornada = $("#jornada").val();
        var vueltas = $("#vueltas").val();
        var h_inicio = $("#h_inicio").val();
        var h_fin = $("#h_fin").val();
        var operador2 = $("#operador2").val();
        var VIN = $("#VIN").val();
        var id_unidad = $("#id_unidad").val();
        var eco = $("#eco").val();
        var eco2 = $("#title_unidad").text()
        eco2 = eco2.replace("Unidad: ", '')

        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "insert into detalle_diesel (id_cedula, id_unidad, eco, carga_total, odometro, fecha_carga, no_bomba, almacen, operador, id_operador, jornada, vueltas, h_inicio, h_fin, tipo_carga, operador2, VIN, eco2) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [id_cedula, id_unidad, eco, carga_total, odometro, fecha_carga, no_bomba, almacen, operador, id_operador, jornada, vueltas, h_inicio, h_fin, tipo_carga, operador2, VIN, eco2],
                function (tx, results) {
                    swal("","Guardado correctamente","success");
                    $("#row_totales").remove();
                    databaseHandler.db.transaction(
                        function(tx5){
                            tx5.executeSql("SELECT * FROM detalle_diesel WHERE id_cedula = ? ORDER BY id_detalle DESC LIMIT 1",
                                [id_cedula],
                                function(tx5, results){
                                    var item2 = results.rows.item(0);
                                    $("#message-nr").css("display", "none");
                                    var no_bomba = '';
                                    item2.no_bomba ? no_bomba = item2.no_bomba: no_bomba = 0;
                                    $("#tb_diesel").append(`<tr><td>${item2.eco2}</td><td>${numberWithCommas(item2.carga_total)}</td><td>${numberWithCommas(item2.odometro)}</td><td>${no_bomba}</td><td>${item2.tipo_carga}</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${item2.id_detalle}','${item2.id_unidad}','${item2.eco}','${item2.carga_total}','${item2.odometro}','${item2.no_bomba}','${item2.almacen}','${item2.h_fin}','${item2.h_inicio}','${item2.jornada}','${item2.operador}','${item2.id_operador}','${item2.vueltas}','${item2.tipo_carga}','${item2.operador2}','${item2.VIN}','2','${item2.eco2}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></tr>`);
                                    databaseHandler.db.transaction(
                                        function(tx5){
                                            tx5.executeSql("SELECT SUM(carga_total) as carga_totales, COUNT(id_cedula) as cuentas FROM detalle_diesel WHERE id_cedula = ?",
                                                [id_cedula],
                                                function(tx5, results){
                                                    var item3 = results.rows.item(0);
                                                    $("#total_litros").html(`${numberWithCommas(Number(item3.carga_totales).toFixed(2))}`);
                                                    $("#unidades_cargadas").html(`${item3.cuentas}`);
                                                    $("#tb_diesel").append(`<tr id="row_totales" style="text-align: center;background-color: #005D99;color: white;font-weight: bold;"><th>Totales</th><th>${numberWithCommas(Number(item3.carga_totales).toFixed(2))}</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>`);
                                                    $("#autocomplete").val("");
                                                    $("#btn_llamarUnidad").removeData()
                                                    app.sheet.close('#sheet-modal');
                                                },
                                                function(tx5, error){
                                                    console.error("Error: " + error.message);
                                                }
                                            );  
                                        },
                                        function(error){console.error("Error: " + error.message);},
                                        function(error){console.error("Error: " + error.message);}
                                    );
                                },
                                function(tx5, error){
                                    console.error("Error: " + error.message);
                                }
                            );  
                        },
                        function(error){console.error("Error: " + error.message);},
                        function(error){console.error("Error: " + error.message);}
                    );
                },
                function (tx, error) {console.error("Error: " + error.message);}
              );
            },
            function (error) {console.error("Error: " + error.message);},
            function (error) {console.error("Error: " + error.message);}
        );
    } else {
        swal("", "Debes llenar los campos de litros cargados y el odometro para poder guardar", "warning")
    }
}

function editarCargaDiesel(id_detalle,id_unidad,eco,carga_total,odometro,no_bomba,almacen,h_fin,h_inicio,jornada,operador,id_operador,vueltas,tipo_carga,operador2,VIN,type,eco2){
    if(type){
        app.sheet.open('#sheet-modal-u');
        $("#h_inicio_u").val(h_inicio);
        $("#h_fin_u").val(h_fin);
        $("#id_unidad_u").val(id_unidad);
        $("#id_detalle_u").val(id_detalle);
        $("#title_unidad_u").html(`Unidad: ${eco2}`);
        $("#carga_u").val(carga_total);
        $("#odometro_u").val(odometro);
        $("#bomba_u").val(no_bomba);
        $("#almacen_u").val(almacen);
        $("#jornada_u").val(jornada);
        $("#operador_u").val(operador);
        $("#id_operador_u").val(id_operador);
        $("#vueltas_u").val(vueltas);
        $("#tipo_carga_u").val(tipo_carga);
        $("#operador2_u").val(operador2);
        $("#eco").val(eco);
        $("#unidad_u").val(eco);
        $("#carga_back").val(carga_total);
        $("#VIN_u").val(VIN);

        $('#close_sheet_u').click(function () {
            if($('#pasa_u').val()!=0){
                app.sheet.close('#sheet-modal-u');
            }else{
                swal({
                    title: "Aviso",
                    text: "Aún no haz actualizado información, ¿Estas seguro que deseas regresar?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                }).then((willGoBack) => {
                    if (willGoBack){
                        app.sheet.close('#sheet-modal-u');
                    }
                });
            }
        });
    } else {
        $("#h_inicio_u").val(h_inicio);
        $("#h_fin_u").val(h_fin);
        $("#id_unidad_u").val(id_unidad);
        $("#id_detalle_u").val(id_detalle);
        $("#title_unidad_u").html(`Unidad: ${eco}`);
        $("#carga_u").val(carga_total);
        $("#odometro_u").val(odometro);
        $("#bomba_u").val(no_bomba);
        $("#almacen_u").val(almacen);
        $("#jornada_u").val(jornada);
        $("#operador_u").val(operador);
        $("#id_operador_u").val(id_operador);
        $("#vueltas_u").val(vueltas);
        $("#tipo_carga_u").val(tipo_carga);
        $("#operador2_u").val(operador2);
        $("#eco").val(eco);
        $("#unidad_u").val(eco);
        $("#VIN_u").val(VIN);

        $('#close_sheet_u').click(function () {
            if($('#pasa_u').val()!=0){
                app.sheet.close('#sheet-modal-u');
            }else{
                swal({
                    title: "Aviso",
                    text: "Aún no haz actualizado información, ¿Estas seguro que deseas regresar?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                }).then((willGoBack) => {
                    if (willGoBack){
                        app.sheet.close('#sheet-modal-u');
                    }
                });
            }
        });
    }
}

function actualizaCargaDiesel(){
    if($("#id_unidad_u").val()){
        var id_cedula = localStorage.getItem("IdCedula");
        var h_inicio = $("#h_inicio_u").val();
        var h_fin = $("#h_fin_u").val();
        var id_carga = $("#id_detalle_u").val();
        var carga = Number($("#carga_u").val()).toFixed(2);
        var odometro = Number($("#odometro_u").val()).toFixed(2);
        var bomba = $("#bomba_u").val();
        var almacen = $("#almacen_u").val();
        var jornada = $("#jornada_u").val();
        var operador = $("#operador_u").val();
        var id_operador = $("#id_operador_u").val();
        var vueltas = $("#vueltas_u").val();
        var tipo_carga = $("#tipo_carga_u").val();
        var operador2 = $("#operador2_u").val();
        var id_unidad =$("#id_unidad_u").val();
        var eco =$("#unidad_u").val();
        var VIN = $("#VIN_u").val();
        var eco2 = $("#title_unidad_u").text()
        eco2 = eco2.replace("Unidad: ", '')
    
        databaseHandler.db.transaction(
            function (tx) {
              tx.executeSql(
                "Update detalle_diesel SET carga_total = ?, odometro = ?, no_bomba = ?, h_inicio = ?, h_fin = ?, almacen = ?, jornada = ?, operador = ?, id_operador = ?, vueltas = ?, tipo_carga = ?, operador2 = ?, id_unidad = ?, eco = ?, VIN = ?, eco2 = ? WHERE id_cedula = ? AND id_detalle = ?",
                [carga, odometro, bomba, h_inicio, h_fin, almacen, jornada, operador, id_operador, vueltas, tipo_carga, operador2, id_unidad, eco, VIN, eco2, id_cedula, id_carga],
                function (tx, results) {
                    $("#tb_diesel").html(``);
                    swal("","Actualizado correctamente","success");
                    databaseHandler.db.transaction(
                        function(tx5){
                            tx5.executeSql("SELECT * FROM detalle_diesel WHERE id_cedula = ?",
                                [id_cedula],
                                function(tx5, results){
                                    var length = results.rows.length;
                                    if(length == 0){
                                        $("#message-nr").css("display", "block");
                                        $("#total_litros").html(`${numberWithCommas(0)}`);
                                    }else{
                                        $("#message-nr").css("display", "none");
                                        for(var i = 0; i< length; i++){
                                            var item2 = results.rows.item(i);
                                            var no_bomba = '';
                                            item2.no_bomba ? no_bomba = item2.no_bomba: no_bomba = 0;
                                            $("#tb_diesel").append(`<tr><td>${item2.eco2}</td><td>${numberWithCommas(item2.carga_total)}</td><td>${numberWithCommas(item2.odometro)}</td><td>${no_bomba}</td><td>${item2.tipo_carga}</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${item2.id_detalle}','${item2.id_unidad}','${item2.eco}','${item2.carga_total}','${item2.odometro}','${item2.no_bomba}','${item2.almacen}','${item2.h_fin}','${item2.h_inicio}','${item2.jornada}','${item2.operador}','${item2.id_operador}','${item2.vueltas}','${item2.tipo_carga}','${item2.operador2}','${item2.VIN}','2','${item2.eco2}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></tr>`);
                                        }
                                        databaseHandler.db.transaction(
                                            function(tx5){
                                                tx5.executeSql("SELECT SUM(carga_total) as carga_totales, COUNT(id_cedula) as cuentas FROM detalle_diesel WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function(tx5, results){
                                                        var item3 = results.rows.item(0);
                                                        $("#total_litros").html(`${numberWithCommas(Number(item3.carga_totales).toFixed(2))}`);
                                                        $("#unidades_cargadas").html(`${item3.cuentas}`);
                                                        $("#tb_diesel").append(`<tr id="row_totales" style="text-align: center;background-color: #005D99;color: white;font-weight: bold;"><th>Totales</th><th>${numberWithCommas(Number(item3.carga_totales).toFixed(2))}</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>`);
                                                        $("#autocomplete").val("");
                                                        app.preloader.hide();
                                                        app.sheet.close('#sheet-modal-u');
                                                    },
                                                    function(tx5, error){
                                                        console.error("Error: " + error.message);
                                                    }
                                                );  
                                            },
                                            function(error){console.error("Error: " + error.message);},
                                            function(error){console.error("Error: " + error.message);}
                                        );
                                    }
                                },
                                function(tx5, error){
                                    console.error("Error: " + error.message);
                                }
                            );  
                        },
                        function(error){console.error("Error: " + error.message);},
                        function(error){console.error("Error: " + error.message);}
                    );
                },
                function (tx, error) {console.error("Error: " + error.message);}
              );
            },
            function (error) {console.error("Error: " + error.message);},
            function (error) {console.error("Error: " + error.message);}
        );
    } else {
        swal("", "La unidad no puede estar vacía", "warning");
    }
}

function FinalizarCargaDiesel(){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar la carga de Diesel?",
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
                            databaseHandler.db.transaction(
                                function(tx5){
                                    tx5.executeSql("SELECT SUM(carga_total) as carga_totales, COUNT(id_cedula) as cuentas FROM detalle_diesel WHERE id_cedula = ?",
                                        [id_cedula],
                                        function(tx5, results){
                                            var item3 = results.rows.item(0);
                                            var fecha_fin = getDateWhitZeros();
                                            var promedio = Number(item3.carga_totales/item3.cuentas).toFixed(2);
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("UPDATE datos_generales_diesel  SET carga_total  = ?,total_unidades = ?,unidades_cargadas = ?,promedio = ?, fecha_fin = ? WHERE id_cedula = ?",
                                                        [Number(item3.carga_totales).toFixed(2), item3.cuentas, item3.cuentas, promedio, fecha_fin,id_cedula],
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
                                        },
                                        function(tx5, error){
                                            console.error("Error: " + error.message);
                                        }
                                    );  
                                },
                                function(error){console.error("Error: " + error.message);},
                                function(error){console.error("Error: " + error.message);}
                            );  
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

function check_hours_menores(hora1, hora2){
    var horas1 = $("#"+hora1).val();
    var horas2 = $("#"+hora2).val();
    if (horas2 > horas1) {}else{
        swal("","La hora fin no puede ser menor a la hora de inicio de carga.","warning");
        $("#"+hora2).val("");
    } 
}

//Consultas para lista
function cargarDiesel(){
    app.dialog.progress('Trabajando..','red');
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var tipo = localStorage.getItem("Modulos");
    var url = localStorage.getItem("url");
    var Usuario = localStorage.getItem("Usuario");
    localStorage.getItem("TipoAcceso") == 'admin' ?  Usuario = null : null;
    if (localStorage.getItem("TipoAcceso") == 'admin'){
        app.request.get(url+'/historial.php', { IdUsuario: IdU, tipo:tipo, empresa:id_empresa, Usuario:Usuario}, function (data) {
            var content = JSON.parse(data);
            if(content == 0){
                $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                app.dialog.close()
            }else{
                if(data == 'null'){
                    $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close()
                } else {
                    if(content.length > 0){
                        var html = '';
                        var ids = new Array();
                        for(var e=0; e < content.length; e++){
                            var fecha = content[e].FechaCaptura.split(' ');
                            var id_interno = content[e].id_interno;
                            var id_intelesis = content[e].id_intelesis;
                            var estatusIntelisis = content[e].estatusIntelisis;
                            var procesado = false;
                            content[e].procesado == 2 || content[e].procesado == 3 ? procesado = true : procesado = false;
    
                            id_interno ?  ids[e] = id_interno : null ;
    
                            if(estatusIntelisis == 2){
                                if (ids.length > 0){
                                    if(ids.filter(x => x === id_interno).length > 1){ } else {
                                        id_interno 
                                        ? procesado
                                        ? id_intelesis 
                                        ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                    }
                                } else {
                                    id_interno 
                                        ? procesado
                                        ? id_intelesis 
                                        ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                }
                            } else {
                                if (ids.length > 0){
                                    if(ids.filter(x => x === id_interno).length > 1){ } else {
                                        id_interno 
                                        ? procesado
                                        ? id_intelesis 
                                        ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                    }
                                } else {
                                    id_interno 
                                    ? procesado
                                    ? id_intelesis 
                                    ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` 
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` 
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                }
                            }
                            
                        }
                        $("#cedul").html(html);
                        app.dialog.close()
                    } else {
                        app.dialog.close()
                        $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                    }
                }
            }
        },function (xhr) {
            app.dialog.close()
            $('.preloader').remove();
            $("#content-page").css('display','none');
            $("#nointernet-page").css('display','block');
        });
    } else {
        app.request.get(url+'/historial.php', { IdUsuario: IdU, tipo:tipo, empresa:id_empresa, Usuario:Usuario}, function (data) {
            var content = JSON.parse(data);
            if(content == 0){
                $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                app.dialog.close()
            }else{
                if(data == 'null'){
                    $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close()
                } else {
                    if(content.length > 0){
                        var html = '';
                        var ids = new Array();
                        for(var e=0; e < content.length; e++){
                            var fecha = content[e].FechaCaptura.split(' ');
                            var id_interno = content[e].id_interno;
                            var id_intelesis = content[e].id_intelesis;
                            var estatusIntelisis = content[e].estatusIntelisis;
                            var procesado = false;
                            content[e].procesado == 2 || content[e].procesado == 3 ? procesado = true : procesado = false;
    
                            id_interno ?  ids[e] = id_interno : null ;

                            if (ids.length > 0){
                                if(ids.filter(x => x === id_interno).length > 1){ } else {
                                    id_interno 
                                    ? procesado
                                    ? id_intelesis 
                                    ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                }
                            } else {
                                id_interno 
                                    ? procesado
                                    ? id_intelesis 
                                    ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                            }
                        }
                        $("#cedul").html(html);
                        app.dialog.close()
                    } else {
                        app.dialog.close()
                        $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                    }
                }
            }
        },function (xhr) {
            app.dialog.close()
            $('.preloader').remove();
            $("#content-page").css('display','none');
            $("#nointernet-page").css('display','block');
        });
    }
}

function recarga_Diesel(mes_pdfs,year_pdfs){
    app.dialog.progress('Trabajando..','red');
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var tipo = localStorage.getItem("Modulos");
    var url = localStorage.getItem("url");
    var Usuario = localStorage.getItem("Usuario");
    localStorage.getItem("TipoAcceso") == 'admin' ?  Usuario = null : null;
    if (localStorage.getItem("TipoAcceso") == 'admin'){
        app.request.get(url+'/historial.php', { IdUsuario: IdU, tipo:tipo, empresa:id_empresa, mes_pdfs : mes_pdfs, year_pdfs: year_pdfs, Usuario:Usuario}, function (data) {
            var content = JSON.parse(data);
            if(content == 0){
                $("#cedul").html(`<tr><td colspan = "5"><span>No hay datos para mostrar</span></td></tr>`);
                app.dialog.close()
            }else{
                if(data == 'null'){
                    $("#cedul").html(`<tr><td colspan = "5"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close()
                } else {
                    if(content.length > 0){
                        var html = '';
                        var ids = new Array();
                        for(var e=0; e < content.length; e++){
                            var fecha = content[e].FechaCaptura.split(' ');
                            var id_interno = content[e].id_interno;
                            var id_intelesis = content[e].id_intelesis;
                            var estatusIntelisis = content[e].estatusIntelisis;
                            var procesado = false;
                            content[e].procesado == 2 || content[e].procesado == 3 ? procesado = true : procesado = false;
    
                            id_interno ?  ids[e] = id_interno : null ;
    
                            if(estatusIntelisis == 2){
                                if (ids.length > 0){
                                    if(ids.filter(x => x === id_interno).length > 1){ } else {
                                        id_interno 
                                        ? procesado
                                        ? id_intelesis 
                                        ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                    }
                                } else {
                                    id_interno 
                                        ? procesado
                                        ? id_intelesis 
                                        ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                }
                            } else {
                                if (ids.length > 0){
                                    if(ids.filter(x => x === id_interno).length > 1){ } else {
                                        id_interno 
                                        ? procesado
                                        ? id_intelesis 
                                        ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                        : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                    }
                                } else {
                                    id_interno 
                                    ? procesado
                                    ? id_intelesis 
                                    ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` 
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` 
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                }
                            }
                        }
                        $("#cedul").html(html);
                        app.dialog.close()
                    } else {
                        $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                        app.dialog.close()
                    }
                }
            }
        },function (xhr) {
            app.dialog.close()
            $('.preloader').remove();
            $("#content-page").css('display','none');
            $("#nointernet-page").css('display','block');
        });
    } else {
        app.request.get(url+'/historial.php', { IdUsuario: IdU, tipo:tipo, empresa:id_empresa, mes_pdfs : mes_pdfs, year_pdfs: year_pdfs, Usuario:Usuario }, function (data) {
            var content = JSON.parse(data);
            if(content == 0){
                $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                app.dialog.close()
            }else{
                if(data == 'null'){
                    $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close()
                } else {
                    if(content.length > 0){
                        var html = '';
                        var ids = new Array();
                        for(var e=0; e < content.length; e++){
                            var fecha = content[e].FechaCaptura.split(' ');
                            var id_interno = content[e].id_interno;
                            var id_intelesis = content[e].id_intelesis;
                            var estatusIntelisis = content[e].estatusIntelisis;
                            var procesado = false;
                            content[e].procesado == 2 || content[e].procesado == 3 ? procesado = true : procesado = false;
    
                            id_interno ?  ids[e] = id_interno : null ;
                            
                            if (ids.length > 0){
                                if(ids.filter(x => x === id_interno).length > 1){ } else {
                                    id_interno 
                                    ? procesado
                                    ? id_intelesis 
                                    ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                                }
                            } else {
                                id_interno 
                                    ? procesado
                                    ? id_intelesis 
                                    ? html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`
                                    : html = html + `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>` ;
                            }
                        }
                        $("#cedul").html(html);
                        app.dialog.close()
                    } else {
                        app.dialog.close()
                        $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                    }
                }
            }
        },function (xhr) {
            app.dialog.close()
            $('.preloader').remove();
            $("#content-page").css('display','none');
            $("#nointernet-page").css('display','block');
        });
    }
}

function corresponderRegistrosDiesel(IdCte, IdCedula, FechaCaptura){
    $(".td_input").css("display", "table-cell")
    $(".div_button_diesel").css("display", "block")
    $(".radio_diesel").prop("checked", false)
    $("#diesel_IdCte").val(IdCte)
    $("#diesel_IdCedula").val(IdCedula)
    $("#diesel_FechaCaptura").val(FechaCaptura)
}

function viewDetailDiesel(IdCte,IdCedula,id_intelesis,type){

    // nube verde ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" 
    // nube naranja ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" 
    // send amarillo ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" 
    // add rojo ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" 

    if(type == 3){
        var ID_consulta = IdCte;
    } else {
        var ID_consulta = id_intelesis;
    }
    var typeConsulta = type;
    localStorage.setItem("ID_consulta", ID_consulta);
    localStorage.setItem("typeConsulta", typeConsulta);
    localStorage.setItem("IdCte", IdCte);
    app.views.main.router.back('/formDiesel2/', {force: true, ignoreCache: true, reload: true});
}

function viewDetailDiesel2(IdCte,IdCedula,id_intelesis,type){
    if(type == 3){
        var ID_consulta = IdCte;
        var typeConsulta = type;
        localStorage.setItem("ID_consulta", ID_consulta);
        localStorage.setItem("typeConsulta", typeConsulta);
        localStorage.setItem("IdCte", IdCte);
        app.views.main.router.back('/formDiesel3/', {force: true, ignoreCache: true, reload: true});
    } else {
        var ID_consulta = id_intelesis;
        var typeConsulta = type;
        localStorage.setItem("ID_consulta", ID_consulta);
        localStorage.setItem("typeConsulta", typeConsulta);
        localStorage.setItem("IdCte", IdCte);

        var datos = new Array();
        datos[0] = {'ID_interno' : ID_consulta};

        var url = localStorage.getItem("url");
        $.ajax({
            type: "POST",
            async : true,
            url: url+"/processDiesel.php?proceso=5&subProcess=1",
            dataType: 'html',
            data: {'datos': JSON.stringify(datos)},
            success: function(respuesta){
                if(respuesta){
                    var respu1 = respuesta.split("._.");
                    var dat1 = respu1[0];
                    var dat2 = respu1[1];
                    if(dat1 == "CEDULA"){
                        if(dat2 > 0){
                            if (dat2 == 2) { // the mov in intelisis is concluido
                                app.views.main.router.back('/formDiesel3/', {force: true, ignoreCache: true, reload: true});
                            } else { // the mov in intelisis not is concluido
                                if (localStorage.getItem("TipoAcceso") == 'admin'){
                                    app.views.main.router.back('/formDiesel2/', {force: true, ignoreCache: true, reload: true});
                                } else {
                                    app.views.main.router.back('/formDiesel3/', {force: true, ignoreCache: true, reload: true});
                                }
                            }
                        } else {
                            AlmacenarError(respuesta);
                        }
                    } else {
                        AlmacenarError(respuesta);
                    }
                }
            },
            error: function(){
                console.log("Error en la comunicacion con el servidor");
                swal("Error de comunicación a Internet","","error")
                $(".icons_diesel").css("pointer-events", "all")
            }
        });
        
    }
}

function actualizaCargaDiesel2(){
    if($("#id_unidad_u").val()){
        var id_cedula = $("#id_detalle_u").val();
        var h_inicio = $("#h_inicio_u").val();
        var h_fin = $("#h_fin_u").val();
        var id_carga = $("#id_detalle_u").val();
        var carga = Number($("#carga_u").val()).toFixed(2);
        var odometro = Number($("#odometro_u").val()).toFixed(2);
        var bomba = $("#bomba_u").val();
        var almacen = $("#almacen_u").val();
        var jornada = $("#jornada_u").val();
        var operador = $("#operador_u").val();
        var id_operador = $("#id_operador_u").val();
        var vueltas = $("#vueltas_u").val();
        var tipo_carga = $("#tipo_carga_u").val();
        var operador2 = $("#operador2_u").val();
        var carga_back = Number($("#carga_back").val());
        var id_unidad = $("#id_unidad_u").val();
        var eco = $("#unidad_u").val();
        var VIN = $("#VIN_u").val();

        var eco2 = $("#title_unidad_u").text()
        eco2 = eco2.replace("Unidad: ", '')
    
        var url = localStorage.getItem("url");
        var datos = new Array();
    
        var Evento = "UPDATE"
        var Fecha = getDateWhitZeros().replace(" ", "T");
        var ID_Usuario = localStorage.getItem("Usuario");
        var Nombre_Usuario = localStorage.getItem("nombre");
        var Origen = 'Mobile' 
        var Version_App = localStorage.getItem("version");
        var id_empresa = localStorage.getItem("empresa");
    
        datos[0] = { 'id_cedula': id_cedula, 'h_inicio': h_inicio, 'h_fin': h_fin, 'id_carga': id_carga, 'carga': carga, 'odometro': odometro, 'bomba': bomba, 'almacen': almacen, 'jornada': jornada, 'operador': operador, 'id_operador': id_operador, 'vueltas': vueltas, 'tipo_carga': tipo_carga, 'operador2': operador2, 'ID_interno' : id_carga, 'Evento' : Evento, 'Fecha' : Fecha, 'ID_Usuario' : ID_Usuario, 'Nombre_Usuario' : Nombre_Usuario, 'Origen' : Origen, 'Version_App' : Version_App, 'ID_cabeceros' : id_carga, 'id_empresa' : id_empresa, 'id_unidad':id_unidad, 'eco' : eco, 'eco2' : eco2, 'VIN':VIN};
    
        $.ajax({
            type: "POST",
            async : true,
            url: url+"/processDiesel.php?proceso=2",
            dataType: 'html',
            data: {'datos': JSON.stringify(datos)},
            success: function(respuesta){
                if(respuesta){
                    var respu1 = respuesta.split("._.");
                    var dat1 = respu1[0];
                    var dat2 = respu1[1];
                    if(dat1 == "CEDULA"){
                        if(dat2 > 0){
                            app.sheet.close('#sheet-modal-u');
                            swal("Actualizado","","success");
                            $("#trdiesel_"+id_carga).html(`<td>${eco2}</td><td>${numberWithCommas(carga)}</td><td>${numberWithCommas(odometro)}</td><td>${bomba}</td><td>${tipo_carga}</td><td> 
                            <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${id_carga}','${id_unidad}','${eco}','${carga}','${odometro}','${bomba}','${almacen}','${h_fin}','${h_inicio}','${jornada}','${operador}','${id_operador}','${vueltas}','${tipo_carga}','${operador2}','${VIN}','3','${eco2}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button>
                            <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="borrarCargaDiesel('${id_carga}','${id_unidad}','${eco}','${carga}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>delete_forever</i></button>
                            </td>`);
                            var carga_total_diesel = Number($("#carga_total_diesel").val());
                            carga_total_diesel ? null : carga_total_diesel = 0;
                            carga_total_diesel = Number(carga_total_diesel - carga_back);
                            carga_total_diesel = Number(carga_total_diesel + Number(carga));
                            $("#carga_total_diesel").val(carga_total_diesel);
                            $("#text_carga_Diesel").html(numberWithCommas(carga_total_diesel))
                        }
                    }
                }
            },
            error: function(){
                console.log("Error en la comunicacion con el servidor");
            }
        });
    } else {
        swal("", "La unidad no puede estar vacía", "warning");
    }
}

function reprocesarIntelisis1(IdCte, IdCedula, id_intelesis, estatus_intelesis){
    //Procesa con id de intelesis 
    //console.log('Reprocesa1', IdCte, IdCedula, id_intelesis);
    $(".icons_diesel").css("pointer-events", "none");
    swal("Procesando....","","success");
    var ID_interno = id_intelesis;
    var Evento = "Reproceso intelesis con ID de intelesis"
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = 'Mobile' 
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCedula;
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {'ID_interno' : ID_interno, 'Evento' : Evento, 'Fecha' : Fecha, 'ID_Usuario' : ID_Usuario, 'Nombre_Usuario' : Nombre_Usuario, 'Origen' : Origen, 'Version_App' : Version_App, 'ID_cabeceros' : ID_cabeceros, 'id_empresa' : id_empresa, 'estatus_intelesis': estatus_intelesis};

    // console.log(datos);
    $.ajax({
        type: "POST",
        async : true,
        url: url+"/processDiesel.php?proceso=5&subProcess=1",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta){
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if(dat1 == "CEDULA"){
                    if(dat2 > 0){
                        if(dat2 == 2){
                            swal("Este registro ya no se puede reprocesar","","warning");
                            $(".icons_diesel").css("pointer-events", "all")
                            var mes_pdfs = $(".mes_pdfs").val();
                            var year_pdfs = $("#year").val();
                            recarga_Diesel(mes_pdfs,year_pdfs);
                        } else  if(dat2 == 4){
                            swal("Este registro ya no se puede reprocesar","","warning");
                            $(".icons_diesel").css("pointer-events", "all")
                            var mes_pdfs = $(".mes_pdfs").val();
                            var year_pdfs = $("#year").val();
                            recarga_Diesel(mes_pdfs,year_pdfs);
                        } else {
                            swal("Trabajando en el reproceso...","","warning");
                            $.ajax({
                                type: "POST",
                                async : true,
                                url: url+"/processDiesel.php?proceso=5&subProcess=2&estatusIntel="+dat2,
                                dataType: 'html',
                                data: {'datos': JSON.stringify(datos)},
                                success: function(respuesta){
                                    if(respuesta){
                                        var respu1 = respuesta.split("._.");
                                        var dat1 = respu1[0];
                                        var dat2 = respu1[1];
                                        if(dat1 == "CEDULA"){
                                            if(dat2 > 0){
                                                swal("Completado","","success");
                                                $(".icons_diesel").css("pointer-events", "all")
                                                var mes_pdfs = $(".mes_pdfs").val();
                                                var year_pdfs = $("#year").val();
                                                recarga_Diesel(mes_pdfs,year_pdfs);
                                            } else {
                                                AlmacenarError(respuesta);
                                            }
                                        } else {
                                            AlmacenarError(respuesta);
                                        }
                                    }
                                },
                                error: function(){
                                    console.log("Error en la comunicacion con el servidor");
                                    swal("Error de comunicación a Internet","","error")
                                    $(".icons_diesel").css("pointer-events", "all")
                                }
                            });
                        }
                        //swal("Aún existe el registro en Intelisis","","warning");
                    } else if (dat2 == 0){
                        // AlmacenarError(respuesta);
                        swal("Algo salió mal intenta más tarde.","","warning");
                        $(".icons_diesel").css("pointer-events", "all")
                    }
                } else {
                    AlmacenarError(respuesta);
                    swal("Algo salió mal intenta más tarde.","","warning");
                    $(".icons_diesel").css("pointer-events", "all")
                }
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
        }
    });
}

function reprocesarIntelisis2(IdCte, IdCedula, id_intelesis, estatus_intelesis  ){
    //Procesa cuando no se competo la carga
    //console.log('Reprocesa2', IdCte, IdCedula, id_intelesis);
    $(".icons_diesel").css("pointer-events", "none");
    swal("Procesando....","","success");
    var ID_interno = id_intelesis; // id interno en 305
    var Evento = "Reproceso Intelesis incompleto"
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = 'Mobile' 
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCte; // ID autoincrementable 305
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {'ID_interno' : ID_interno, 'Evento' : Evento, 'Fecha' : Fecha, 'ID_Usuario' : ID_Usuario, 'Nombre_Usuario' : Nombre_Usuario, 'Origen' : Origen, 'Version_App' : Version_App, 'ID_cabeceros' : ID_cabeceros, 'id_empresa' : id_empresa, 'estatus_intelesis': estatus_intelesis };

    console.log(datos);
    $.ajax({
        type: "POST",
        async : true,
        url: url+"/processDiesel.php?proceso=4",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta){
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if(dat1 == "CEDULA"){
                    if(dat2 > 0){
                        swal("Completado","","success");
                        $(".icons_diesel").css("pointer-events", "all")
                        var mes_pdfs = $(".mes_pdfs").val();
                        var year_pdfs = $("#year").val();
                        recarga_Diesel(mes_pdfs,year_pdfs);
                    } else {
                        AlmacenarError(respuesta);
                    }
                } else {
                    AlmacenarError(respuesta);
                }
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
            swal("Error de comunicación a Internet","","error")
            $(".icons_diesel").css("pointer-events", "all")
        }
    });
}

function procesarIntelesis(IdCte, IdCedula, id_interno, estatus_intelesis){
    //console.log('Procesa', IdCte, IdCedula, nid_interno);
    $(".icons_diesel").css("pointer-events", "none");
    swal("Procesando....","","");
    var ID_interno = id_interno;
    var Evento = "Procesa a Intelisis";
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = 'Mobile' 
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCte;
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {'ID_interno' : ID_interno, 'Evento' : Evento, 'Fecha' : Fecha, 'ID_Usuario' : ID_Usuario, 'Nombre_Usuario' : Nombre_Usuario, 'Origen' : Origen, 'Version_App' : Version_App, 'ID_cabeceros' : ID_cabeceros, 'id_empresa' : id_empresa, 'estatus_intelesis': estatus_intelesis };

    // console.log(datos);
    $.ajax({
        type: "POST",
        async : true,
        url: url+"/processDiesel.php?proceso=3",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta){
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if(dat1 == "CEDULA"){
                    if(dat2 > 0){
                        swal("Completado","","success");
                        $(".icons_diesel").css("pointer-events", "all")
                        var mes_pdfs = $(".mes_pdfs").val();
                        var year_pdfs = $("#year").val();
                        recarga_Diesel(mes_pdfs,year_pdfs);
                    } else {
                        AlmacenarError(respuesta);
                    }
                } else {
                    AlmacenarError(respuesta);
                }
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
            swal("Error de comunicación a Internet","","error")
            $(".icons_diesel").css("pointer-events", "all")
        }
    });
}

function regresaDiesel(){
    app.views.main.router.back('/formDiesel1/', {force: true, ignoreCache: true, reload: true});
}

function guardarUnion(){
    var campos;
    campos = document.querySelectorAll('.radio_diesel');
    var valido = false;
    var ids = '';

    [].slice.call(campos).forEach(function(campo) {
        if(campo.checked == true) {
            valido = true;
            ids += ","+campo.id.replace("radioDiesel_", "");
        }
    });
    const quita_coma = ids.slice(1)
    
    if(valido){
        // console.log(quita_coma);
        $(".td_input").css("display", "none")
        $(".div_button_diesel").css("display", "none")
        $(".radio_diesel").prop("checked", false)
        enviaUnion($("#diesel_IdCte").val(), $("#diesel_IdCedula").val(), $("#diesel_FechaCaptura").val(), quita_coma);
    } else {
        swal("", "Debes seleccionar al menos una opción", "warning");
    }
}

function enviaUnion(IdCte, IdCedula, FechaCaptura, ids){
    swal("Uniendo....","","");
    $(".icons_diesel").css("pointer-events", "none");
    var ID_interno = IdCte;
    var Evento = "Unión de cargas"
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = 'Mobile' 
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCte;
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {'ID_interno' : ID_interno, ids:ids, 'Evento' : Evento, 'Fecha' : Fecha, 'ID_Usuario' : ID_Usuario, 'Nombre_Usuario' : Nombre_Usuario, 'Origen' : Origen, 'Version_App' : Version_App, 'ID_cabeceros' : ID_cabeceros, 'id_empresa' : id_empresa };

    $.ajax({
        type: "POST",
        async : true,
        url: url+"/processDiesel.php?proceso=1",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta){
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if(dat1 == "CEDULA"){
                    if(dat2 > 0){
                        swal("Unión completa","","success")
                        $(".icons_diesel").css("pointer-events", "all")

                        var mes_pdfs = $(".mes_pdfs").val();
                        var year_pdfs = $("#year").val();
                        recarga_Diesel(mes_pdfs,year_pdfs);
                    } else {
                        AlmacenarError(respuesta);
                    }
                } else {
                    AlmacenarError(respuesta);
                }
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
            swal("Error de comunicación a Internet","","error")
            $(".icons_diesel").css("pointer-events", "all")
        }
    });
}

// funcion para sumar 1 minute
var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}

function agregaCarga2(){
    if($("#carga").val() && $("#odometro").val()){
        var id_cedula = localStorage.getItem("IdCte"); // ID_cabecero
        var carga_total = Number($("#carga").val()).toFixed(2); // carga_total
        var odometro = Number($("#odometro").val()).toFixed(2); // odometro
        var fecha_carga = getDateWhitZeros().replace(" ", "T"); // fecha_carga
        var no_bomba = $("#bomba_c").val(); // no_bomba
        var tipo_carga = $("#tipo_carga").val(); // tipo_carga
        var almacen = $("#almacen").val(); // almacen
        var operador = $("#operador").val(); // operador
        var id_operador = $("#id_operador").val(); // id_operador
        var jornada = $("#jornada").val(); // jornada
        var vueltas = $("#vueltas").val(); // vueltas
        var h_inicio = $("#h_inicio").val(); // h_inicio
        var h_fin = $("#h_fin").val(); // h_fin
        var operador2 = $("#operador2").val(); // operador2
        var VIN = $("#VIN").val(); // VIN
        var id_unidad = $("#id_unidad").val(); // id_unidad
        var eco = $("#eco").val(); // eco
        var eco2 = $("#title_unidad").text()
        eco2 = eco2.replace("Unidad: ", '')
        var procesado = 0;
        var id_interno = localStorage.getItem("ID_consulta");

        var url = localStorage.getItem("url");
        var datos = new Array();
    
        var Evento = "INSERT"
        var Fecha = getDateWhitZeros().replace(" ", "T");
        var ID_Usuario = localStorage.getItem("Usuario");
        var Nombre_Usuario = localStorage.getItem("nombre");
        var Origen = 'Mobile' 
        var Version_App = localStorage.getItem("version");
        var id_empresa = localStorage.getItem("empresa");
        var typeConsulta = localStorage.getItem("typeConsulta");
    
        datos[0] = { 'id_cedula' :id_cedula, 'typeConsulta':typeConsulta, 'carga_total' :carga_total, 'odometro' :odometro, 'fecha_carga' :fecha_carga, 'no_bomba' :no_bomba, 'tipo_carga' :tipo_carga, 'almacen' :almacen, 'operador' :operador, 'id_operador' :id_operador, 'jornada' :jornada, 'vueltas' :vueltas, 'h_inicio' :h_inicio, 'h_fin' :h_fin, 'operador2' :operador2, 'VIN' :VIN, 'id_unidad' :id_unidad, 'eco' :eco, 'eco2' :eco2, 'procesado' :procesado, 'ID_interno' :id_interno, 'Evento' :Evento, 'Fecha' :Fecha, 'ID_Usuario' :ID_Usuario, 'Nombre_Usuario' :Nombre_Usuario, 'Origen' :Origen, 'Version_App' :Version_App, 'id_empresa' :id_empresa, 'ID_cabeceros': id_cedula};
    
        $.ajax({
            type: "POST",
            async : true,
            url: url+"/processDiesel.php?proceso=7",
            dataType: 'html',
            data: {'datos': JSON.stringify(datos)},
            success: function(respuesta){
                if(respuesta){
                    var respu1 = respuesta.split("._.");
                    var dat1 = respu1[0];
                    var dat2 = respu1[1];
                    if(dat1 == "CEDULA"){
                        if(dat2 > 0){
                            $("#autocomplete").val("");
                            $("#btn_llamarUnidad").removeData()
                            app.sheet.close('#sheet-modal');
                            swal("Agregado","","success");
                            $("#disesl_detalle").append(`<tr id="trdiesel_${dat2}"><td>${eco2}</td><td>${numberWithCommas(carga_total)}</td><td>${numberWithCommas(odometro)}</td><td>${no_bomba}</td><td>${tipo_carga}</td><td> 
                                <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${dat2}','${id_unidad}','${eco}','${carga_total}','${odometro}','${no_bomba}','${almacen}','${h_fin}','${h_inicio}','${jornada}','${operador}','${id_operador}','${vueltas}','${tipo_carga}','${operador2}','${VIN}','3','${eco2}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button>
                                <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="borrarCargaDiesel('${dat2}','${id_unidad}','${eco}','${carga_total}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>delete_forever</i></button>
                            </td></tr>`);
                            var carga_total_diesel = Number($("#carga_total_diesel").val());
                            carga_total_diesel ? null : carga_total_diesel = 0;
                            carga_total_diesel = Number(carga_total_diesel + Number(carga_total));
                            $("#carga_total_diesel").val(carga_total_diesel);
                            $("#text_carga_Diesel").html(numberWithCommas(carga_total_diesel))
                            
                            let text_unidades_cargadas = Number($("#text_unidades_cargadas").text());
                            text_unidades_cargadas++
                            $("#text_unidades_cargadas").html(text_unidades_cargadas)
                        }
                    }
                }
            },
            error: function(){
                console.log("Error en la comunicacion con el servidor");
            }
        });
    } else {
        swal("", "Debes llenar los campos de litros cargados y el odometro para poder guardar", "warning")
    }
}
function borrarCargaDiesel(id, id_unidad, eco, carga){
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer eliminar este registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            console.log(id);
            var Evento = "DELETE"
            var Fecha = getDateWhitZeros().replace(" ", "T");
            var ID_Usuario = localStorage.getItem("Usuario");
            var Nombre_Usuario = localStorage.getItem("nombre");
            var Origen = 'Mobile' 
            var Version_App = localStorage.getItem("version");
            var id_empresa = localStorage.getItem("empresa");
            var typeConsulta = localStorage.getItem("typeConsulta");
            var ID_consulta = localStorage.getItem("ID_consulta");
            
            var url = localStorage.getItem("url");
            var datos = new Array();

            datos[0] = { 'id_cedula' :id, 'typeConsulta':typeConsulta, 'ID_interno' :ID_consulta, 'Evento' :Evento, 'Fecha' :Fecha, 'ID_Usuario' :ID_Usuario, 'Nombre_Usuario' :Nombre_Usuario, 'Origen' :Origen, 'Version_App' :Version_App, 'id_empresa' :id_empresa, 'ID_cabeceros': id};
        
            console.log(datos);

            $.ajax({
                type: "POST",
                async : true,
                url: url+"/processDiesel.php?proceso=8",
                dataType: 'html',
                data: {'datos': JSON.stringify(datos)},
                success: function(respuesta){
                    if(respuesta){
                        var respu1 = respuesta.split("._.");
                        var dat1 = respu1[0];
                        var dat2 = respu1[1];
                        if(dat1 == "CEDULA"){
                            if(dat2 > 0){
                                swal("Eliminado correctamente","","success");
                                $("#trdiesel_"+id).remove();
                                var carga_total_diesel = Number($("#carga_total_diesel").val());
                                carga_total_diesel ? null : carga_total_diesel = 0;
                                carga_total_diesel = Number(carga_total_diesel - Number(carga));
                                $("#carga_total_diesel").val(carga_total_diesel);
                                $("#text_carga_Diesel").html(numberWithCommas(carga_total_diesel))

                                let text_unidades_cargadas = Number($("#text_unidades_cargadas").text());
                                text_unidades_cargadas = text_unidades_cargadas-1
                                $("#text_unidades_cargadas").html(text_unidades_cargadas)
                            }
                        }
                    }
                },
                error: function(){
                    console.log("Error en la comunicacion con el servidor");
                }
            });
        }
    });
}
//Fin Diesel