function AlmacenarError(respuesta){
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    datos[0] = {'id_usario':id_usuario,'id_empresa':id_empresa,'respuesta':respuesta};
    $.ajax({
        type: "POST",
        async : true,
        url: url+"/guardarErrorRespuesta.php",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta == 1){
                //swal("","No se pudo completar el registro","warning");
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
        }
    });
}
function llevarTodo(id_cedula,tipo_cedula){
    console.log(id_cedula, tipo_cedula)
    //Aqio va el ajax (tipo de cedula,id_usuario y id_empresa)
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    var versionapp = localStorage.getItem("version");
    datos[0] = {'id_usuario':id_usuario,'id_empresa':id_empresa,'tipo_cedula':tipo_cedula,'versionapp':versionapp};
    $.ajax({
        type: "POST",
        async : true,
        url: url+"/guardarEnvioCedula.php",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
        }
    });
    swal("Enviando", "....", "success");
    var empresa = localStorage.getItem("nombre_empresa");
    var datosCedulaGeneral = new Array();
    var checklist = new Array();
    var datos_generales_checklist = new Array();

    var fecha = new Date();
    var fecha_envio = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("SELECT * FROM cedulas_general WHERE id_cedula = ?",
                [id_cedula],
                function(tx, results){
                    var length = results.rows.length;
                    for(var i = 0; i< length; i++){
                        var item = results.rows.item(i);
                        tipo = item.tipo_cedula;
                        //datosCedulaGeneral[i] = {'Valor':i,'id_cedula':item.id_cedula,'tipo_cedula':item.tipo_cedula,'id_usuario':item.id_usuario,'nombre_usuario':item.nombre_usuario,'fecha_entrada':item.fecha_entrada,'geolocalizacion_entrada': item.geolocalizacion_entrada,'id_cliente': item.id_cliente,'nombre_cliente': item.nombre_cliente,'horario_programado': item.horario_programado,'calificacion': item.calificacion,'fecha_salida':item.fecha_salida,'geolocalizacion_salida':item.geolocalizacion_salida,'nombre_evalua':item.nombre_evalua,'comentario_cliente':item.comentario_cliente,'fecha_envio':fecha_envio};
                        datosCedulaGeneral[i] = {'Valor':i,'id_cedula':item.id_cedula,'tipo_cedula':item.tipo_cedula,'id_usuario':item.id_usuario,'nombre_usuario':item.nombre_usuario,'fecha_entrada':item.fecha_entrada,'geolocalizacion_entrada': item.geolocalizacion_entrada,'id_cliente': item.id_cliente,'nombre_cliente': item.nombre_cliente,'horario_programado': item.horario_programado,'calificacion': 0,'fecha_salida':item.fecha_salida,'geolocalizacion_salida':item.geolocalizacion_salida,'nombre_evalua':item.nombre_evalua,'comentario_cliente':item.comentario_cliente,'fecha_envio':fecha_envio};
                    }
                    if(tipo == "checklist"){
                        databaseHandler.db.transaction(
                            function(tx){
                                tx.executeSql("SELECT * FROM checklist WHERE id_cedula = ?",
                                    [id_cedula],
                                    function(tx, results){
                                        var length = results.rows.length;
                                        for(var i = 0; i< length; i++){
                                            var item1 = results.rows.item(i);
                                            checklist[i] = {'Valor':i,'id_pregunta':item1.id_pregunta, 'revision':item1.revision, 'nombre_fase':item1.nombre_fase, 'int_ext':item1.int_ext, 'id_fase':item1.id_fase, 'obligatorio':item1.obligatorio, 'no_pregunta':item1.no_pregunta, 'respuesta':item1.respuesta, 'modelo':item1.modelo, 'comentarios':item1.comentarios, 'multiple':item1.multiple};
                                        }
                                        databaseHandler.db.transaction(
                                            function(tx){
                                                tx.executeSql("SELECT * FROM datos_generales_checklist WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function(tx, results){
                                                        var length = results.rows.length;
                                                        for(var i = 0; i< length; i++){
                                                            var item2 = results.rows.item(i);
                                                            datos_generales_checklist[i] = {'Valor':i, 'Unidad':item2.Unidad, 'Chasis':item2.Chasis, 'Familia':item2.Familia, 'marca':item2.marca, 'Empresa':item2.Empresa, 'FK_id_unidad':item2.FK_id_unidad, 'id_unidad_vs':item2.id_unidad_vs, 'FK_id_empresa':item2.FK_id_empresa, 'id_modelo_check':item2.id_modelo_check, 'comentarios_generales':item2.comentarios_generales, 'fecha_revision':item2.fecha_revision};
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async : true,
                                                            url: url+"/guardarRevImgCheklist.php",
                                                            dataType: 'html',
                                                            data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                            'checklist': JSON.stringify(checklist),
                                                            'datos_generales_checklist': JSON.stringify(datos_generales_checklist)},
                                                            success: function(respuesta){
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if(dat1 == "CEDULA"){
                                                                    if(dat2 > 0){
                                                                        databaseHandler.db.transaction(
                                                                            function(tx7){
                                                                                tx7.executeSql(
                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                    [id_cedula],
                                                                                    function(tx7, results){
                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                        $("#li-"+item.id_cedula).remove();
                                                                                        swal("Enviado!", "", "success");
                                                                                    }
                                                                                );
                                                                            }
                                                                        );
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function(){
                                                                console.log("Error en la comunicacion");
                                                            }
                                                        });
                                                    },
                                                    function(tx, error){
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    } else if(tipo == "Limpieza"){
                        databaseHandler.db.transaction(
                            function(tx){
                                tx.executeSql("SELECT * FROM checklist_revlimp WHERE id_cedula = ?",
                                    [id_cedula],
                                    function(tx, results){
                                        var length = results.rows.length;
                                        for(var i = 0; i< length; i++){
                                            var item1 = results.rows.item(i);
                                            checklist[i] = {'Valor':i,'id_pregunta':item1.id_pregunta, 'revision':item1.revision, 'nombre_fase':item1.nombre_fase, 'int_ext':item1.int_ext, 'id_fase':item1.id_fase, 'obligatorio':item1.obligatorio, 'no_pregunta':item1.no_pregunta, 'respuesta':item1.respuesta, 'modelo':item1.modelo, 'comentarios':item1.comentarios, 'multiple':item1.multiple};
                                        }
                                        databaseHandler.db.transaction(
                                            function(tx){
                                                tx.executeSql("SELECT * FROM datos_generales_revlimp WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function(tx, results){
                                                        var length = results.rows.length;
                                                        for(var i = 0; i< length; i++){
                                                            var item2 = results.rows.item(i);
                                                            datos_generales_checklist[i] = {'Valor':i, 'Unidad':item2.Unidad, 'Chasis':item2.Chasis, 'Familia':item2.Familia, 'marca':item2.marca, 'Empresa':item2.Empresa, 'FK_id_unidad':item2.FK_id_unidad, 'id_unidad_vs':item2.id_unidad_vs, 'FK_id_empresa':item2.FK_id_empresa, 'id_modelo_check':item2.id_modelo_check, 'comentarios_generales':item2.comentarios_generales, 'fecha_revision':item2.fecha_revision};
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async : true,
                                                            url: url+"/guardarRevLimpCheklist.php",
                                                            dataType: 'html',
                                                            data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                            'checklist': JSON.stringify(checklist),
                                                            'datos_generales_checklist': JSON.stringify(datos_generales_checklist)},
                                                            success: function(respuesta){
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if(dat1 == "CEDULA"){
                                                                    if(dat2 > 0){
                                                                        databaseHandler.db.transaction(
                                                                            function(tx7){
                                                                                tx7.executeSql(
                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                    [id_cedula],
                                                                                    function(tx7, results){
                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                        $("#li-"+item.id_cedula).remove();
                                                                                        swal("Enviado!", "", "success");
                                                                                    }
                                                                                );
                                                                            }
                                                                        );
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function(){
                                                                console.log("Error en la comunicacion");
                                                            }
                                                        });
                                                    },
                                                    function(tx, error){
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    } else if (tipo == 'Desincorporaciones'){
                        var desincorporaciones = new Array();
                        var desincorporacionesD = new Array();
                        var Apoyos = new Array();
                        databaseHandler.db.transaction(
                            function(tx){
                                tx.executeSql("SELECT * FROM desincorporaciones WHERE id_cedula = ?",
                                    [id_cedula],
                                    function(tx, results){
                                        var length = results.rows.length;
                                        for(var i = 0; i< length; i++){
                                            var item1 = results.rows.item(i);
                                            var horas = item1.fecha.replace(" ", "T");
                                            var horas2 = item1.fecha2.replace(" ", "T");
                                            if(item1.estatus == 'Abierto'){
                                                var estatusHeader = 'Pendiente';
                                            } else {
                                                var estatusHeader = item1.estatus;
                                            }
                                            desincorporaciones[i] = {'Valor':i, 'Empresa':item1.empresa,'estatus_servidor':item1.estatus_servidor, 'Fecha':horas, 'Estatus':estatusHeader, 'UsuarioApertura':item1.userApertura, 'UsuarioCierre':item1.userCierre, 'id_servidor': item1.id_servidor, 'fecha2': horas2, 'id_empresa': id_empresa};
                                        }
                                        databaseHandler.db.transaction(
                                            function(tx){
                                                tx.executeSql("SELECT * FROM desincorporacionesD WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function(tx, results){
                                                        var length = results.rows.length;
                                                        for(var i = 0; i< length; i++){
                                                            var item2 = results.rows.item(i);
                                                            if(item2.HoraDesR){
                                                                var horas = item2.HoraDesR.replace(" ", "T");
                                                            } else {
                                                                var horas = "";
                                                            }
                                                            
                                                            if(item2.HoraIncR){
                                                                var horas2 = item2.HoraIncR.replace(" ", "T");
                                                            } else {
                                                                var horas2 = "";
                                                            }
                                                            desincorporacionesD[i] = {'Valor':i, 'id_servidor':item1.id_servidor,'Apoyo': item2.apoyo, 'JornadasNoIncorporadas': item2.jornadas, 'HoraD': item2.HoraDes, 'HoraI': item2.HoraInc, 'UnidadDID': item2.UnidadDesinID, 'UnidadD': item2.UnidadDesin, 'UnidadIID': item2.UnidadIncID, 'UnidadI': item2.UnidadInc, 'Itinerario': item2.Itinerario, 'Motivo': item2.Falla, 'Falla': item2.DetalleFalla, 'SentidoD': item2.SentidoDes, 'SentidoI': item2.SentidoInc, 'UbicacionD': item2.UbicacionDes, 'UbicacionI': item2.UbicacionInc, 'Incumplimiento': item2.Inclumplimiento, 'OperadorD': item2.id_operador_des, 'OperadorI': item2.id_operador_inc, 'KmD': item2.KmDes, 'KmI': item2.KmInc, 'FolioD': item2.FolioDes, 'FolioI': item2.FolioInc, 'UsuarioI': item2.Usuarioinc, 'UsuarioD': item2.UsuarioDes, 'KmPerdidos': item2.KmPerdidos, 'estatus_servidor': item2.estatus_servidor, 'HoraCapturaI': horas2, 'HoraCapturaD': horas, 'id_servidord': item2.id_servidor, 'jornadaSIncorporacion': item2.jornadaSIncorporacion};
                                                        }
                                                        databaseHandler.db.transaction(
                                                            function(tx){
                                                                tx.executeSql("SELECT * FROM TRFapoyo WHERE id_cedula = ?",
                                                                    [id_cedula],
                                                                    function(tx, results){
                                                                        var length = results.rows.length;
                                                                        for(var i = 0; i< length; i++){
                                                                            var item3 = results.rows.item(i);
                                                                            
                                                                            if(item3.HoraCaptura){
                                                                                var horasca = item3.HoraCaptura.replace(" ", "T");
                                                                            } else {
                                                                                var horasca = "";
                                                                            }

                                                                            Apoyos[i] = {'Valor':i, 'id_servidor':item1.id_servidor, 'id_servidord':item3.id_servidor, 'Apoyo': item3.Apoyo, 'Hora': item3.Hora, 'HoraCaptura': horasca, 'Itinerario': item3.Itinerario, 'Operador': item3.Operador, 'Sentido': item3.Sentido, 'TipoUnidad': item3.TipoUnidad, 'TramoDeApoyo': item3.TramoDeApoyo, 'Ubicacion': item3.Ubicacion, 'Unidad': item3.Unidad, 'UnidadID': item3.UnidadID, 'Usuario': item3.Usuario, 'estatus_servidor': item3.estatus_servidor, 'id_operador': item3.id_operador, 'kilometrajeApoyo': item3.kilometrajeApoyo, 'kilometrajeUnidad': item3.kilometrajeUnidad};
                                                                        }
                                                                        $.ajax({
                                                                            type: "POST",
                                                                            async : true,
                                                                            url: url+"/guardarTraficoFinal.php",
                                                                            dataType: 'html',
                                                                            data: {'datosCedulaGeneral': JSON.stringify(datosCedulaGeneral),
                                                                            'desincorporaciones': JSON.stringify(desincorporaciones),
                                                                            'desincorporacionesD': JSON.stringify(desincorporacionesD),
                                                                            'apoyos': JSON.stringify(Apoyos)},
                                                                            success: function(respuesta){
                                                                                var respu1 = respuesta.split("._.");
                                                                                var dat1 = respu1[0];
                                                                                var dat2 = respu1[1];
                                                                                if(dat1 == "CEDULA"){
                                                                                    if(dat2 > 0){
                                                                                        databaseHandler.db.transaction(
                                                                                            function(tx5){
                                                                                                tx5.executeSql(
                                                                                                    "UPDATE desincorporacionesD SET estatus_servidor = 4 WHERE id_cedula = ?",
                                                                                                    [id_cedula],
                                                                                                    function(tx5, results){
                                                                                                        databaseHandler.db.transaction(
                                                                                                            function(tx6){
                                                                                                                tx6.executeSql(
                                                                                                                    "UPDATE desincorporaciones SET estatus_servidor = 4 WHERE id_cedula = ?",
                                                                                                                    [id_cedula],
                                                                                                                    function(tx6, results){
                                                                                                                        databaseHandler.db.transaction(
                                                                                                                            function(tx6){
                                                                                                                                tx6.executeSql(
                                                                                                                                    "UPDATE TRFapoyo SET estatus_servidor = 4 WHERE id_cedula = ?",
                                                                                                                                    [id_cedula],
                                                                                                                                    function(tx6, results){
                                                                                                                                        databaseHandler.db.transaction(
                                                                                                                                            function(tx7){
                                                                                                                                                tx7.executeSql(
                                                                                                                                                    "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                                                                                    [id_cedula],
                                                                                                                                                    function(tx7, results){
                                                                                                                                                        localStorage.setItem("sendFlag", 0);
                                                                                                                                                        $("#li-"+item.id_cedula).remove();
                                                                                                                                                        sincronizaDatos();
                                                                                                                                                        swal("Enviado!", "", "success");
                                                                                                                                                    }
                                                                                                                                                );
                                                                                                                                            }
                                                                                                                                        );
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            }
                                                                                                                        );
                                                                                                                    }
                                                                                                                );
                                                                                                            }
                                                                                                        );
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                } else {
                                                                                    AlmacenarError(respuesta);
                                                                                }
                                                                            },
                                                                            error: function(){
                                                                                console.log("Error en la comunicacion");
                                                                            }
                                                                        });
                                                                        
                                                                    },
                                                                    function(tx, error){
                                                                        console.log("Error al consultar: " + error.message);
                                                                    }
                                                                );
                                                            },
                                                            function(error){},
                                                            function(){}
                                                        );

                                                    },
                                                    function(tx, error){
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(error){}
                                        );
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    }
                },
                function(tx, error){
                    console.log("Error al consultar datos generales: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}
function EliminarRegistrosAntiguos(){
    var fecha = new Date();
    var fecha_ingreso = fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate();
    fecha_eliminar = editar_fecha(fecha_ingreso, "-11", "d","-");
    //console.log(fecha_eliminar);
    databaseHandler.db.transaction(
        function(tx5){
            tx5.executeSql("SELECT * FROM cedulas_general WHERE fecha_entrada > ? AND (estatus = 1 OR estatus = 2)",
                [fecha_eliminar],
                function(tx5, results){
                    var length = results.rows.length;
                    for(var i = 0; i< length; i++){
                        var item2 = results.rows.item(i);
                        var id_eliminar = item2.IdCedula;
                        databaseHandler.db.transaction(
                            function(tx4){
                                tx4.executeSql("DELETE FROM cedulas_general WHERE id_cedula = ?",
                                    [id_eliminar],
                                    function(tx4, results){
                                    },
                                    function(tx4, error){
                                        console.error("Error al eliminar cedula_general: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    }
                },
                function(tx5, error){
                    console.log("Error al depurar registros: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}
function EliminarReg(id_cedula,tipo_cedula){
    swal({
        title: "Aviso",
        text: "Estas apunto de eliminar todos los datos de este registro, ??Estas seguro continuar con la acci??n?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willGoBack) => {
        if (willGoBack){
            var empresa = localStorage.getItem("nombre_empresa");               
            // console.log(empresa,id_cedula,tipo_cedula);
            databaseHandler.db.transaction(
                function(tx){
                    tx.executeSql("DELETE FROM cedulas_general WHERE id_cedula = ?",
                        [id_cedula],
                        function(tx, results){},
                        function(tx, error){}
                    );
                },function(error){},function(){}
            );
            if(tipo_cedula == "checklist"){
                databaseHandler.db.transaction(
                    function(tx){
                        tx.executeSql("DELETE FROM checklist WHERE id_cedula = ?",
                            [id_cedula],
                            function(tx, results){
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("DELETE FROM datos_generales_checklist WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                $("#conc" + id_cedula).remove();
                                                swal("","Eliminado correctamente","success");
                                            },
                                            function(tx, error){
                                                swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },function(error){},function(){}
                                );
                            },
                            function(tx, error){console.log("Error al eliminar" +error.message);}
                        );
                    },function(error){},function(){}
                );
            }else if(tipo_cedula == "Limpieza"){
                databaseHandler.db.transaction(
                    function(tx){
                        tx.executeSql("DELETE FROM checklist WHERE id_cedula = ?",
                            [id_cedula],
                            function(tx, results){
                                databaseHandler.db.transaction(
                                    function(tx){
                                        tx.executeSql("DELETE FROM datos_generales_checklist WHERE id_cedula = ?",
                                            [id_cedula],
                                            function(tx, results){
                                                $("#conc" + id_cedula).remove();
                                                swal("","Eliminado correctamente","success");
                                            },
                                            function(tx, error){
                                                swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },function(error){},function(){}
                                );
                            },
                            function(tx, error){console.log("Error al eliminar" +error.message);}
                        );
                    },function(error){},function(){}
                );
            }
        } 
    });
}

function EnvioDatosTrafico(){
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function(tx){
            tx.executeSql("SELECT * FROM desincorporaciones WHERE id_cedula = ? AND estatus_servidor = 0 OR estatus_servidor = 1 OR estatus_servidor = 3",
                [id_cedula],
                function(tx, results){
                    var length = results.rows.length;
                    if (length == 0){
                        databaseHandler.db.transaction(
                            function(tx){
                                tx.executeSql("SELECT * FROM desincorporacionesD WHERE id_cedula = ? AND estatus_servidor = 0 OR estatus_servidor = 1 OR estatus_servidor = 3",
                                    [id_cedula],
                                    function(tx, results){
                                        var length = results.rows.length;
                                        if (length == 0){
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("SELECT * FROM TRFapoyo WHERE id_cedula = ? AND estatus_servidor = 0 OR estatus_servidor = 1 OR estatus_servidor = 3",
                                                        [id_cedula],
                                                        function(tx, results){
                                                            var length = results.rows.length;
                                                            if(length == 0){
                                                                if(localStorage.getItem("tap_refresh")){
                                                                    setTimeout(function () {
                                                                        try {
                                                                            swal.close();
                                                                            localStorage.removeItem("tap_refresh")
                                                                        } catch (e) {
                                                                        }
                                                                    }, 1500);
                                                                }
                                                            } else {
                                                                var item5 = results.rows.item(0);
                                                                databaseHandler.db.transaction(
                                                                    function(tx){
                                                                        tx.executeSql("SELECT id_servidor FROM desincorporaciones WHERE id_cedula = ?",
                                                                            [id_cedula],
                                                                            function(tx, results){
                                                                                var item6 = results.rows.item(0);
                                                                                localStorage.setItem("sendFlag", 1);
                                                                                llevarDatosTrafico(item5.id_apoyo,3 , item6.id_servidor);
                                                                            },
                                                                            function(tx, error){ console.log("Error al consultar: " + error.message); }
                                                                        );
                                                                    },
                                                                    function(error){},
                                                                    function(){}
                                                                );
                                                            }
                                                        },
                                                        function(tx, error){ console.log("Error al consultar: " + error.message); }
                                                    );
                                                },
                                                function(error){},
                                                function(){}
                                            );
                                        } else {
                                            var item3 = results.rows.item(0);
                                            databaseHandler.db.transaction(
                                                function(tx){
                                                    tx.executeSql("SELECT id_servidor FROM desincorporaciones WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function(tx, results){
                                                            var item4 = results.rows.item(0);
                                                            localStorage.setItem("sendFlag", 1);
                                                            llevarDatosTrafico(item3.id_desD,2, item4.id_servidor);
                                                        },
                                                        function(tx, error){ console.log("Error al consultar: " + error.message); }
                                                    );
                                                },
                                                function(error){},
                                                function(){}
                                            );
                                        }
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    } else {
                        localStorage.setItem("sendFlag", 1);
                        var item2 = results.rows.item(0);
                        llevarDatosTrafico(item2.id_cedula,1,0);
                    }
                },
                function(tx, error){
                    console.log("Error al consultar: " + error.message);
                }
            );
        },
        function(error){},
        function(){}
    );
}

function llevarDatosTrafico(id_cedula,tipo,id_servidor){
    // console.log("llevar datos trafico", id_cedula, tipo, id_servidor);
    var desincorporaciones = new Array();
    var desincorporacionesd = new Array();
    var id_empresa =  localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    if(tipo == 1){ // HEADER
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("SELECT * FROM desincorporaciones WHERE id_cedula = ?",
                    [id_cedula],
                    function(tx, results){                        
                        var item2 = results.rows.item(0);
                        var horas = item2.fecha.replace(" ", "T");
                        if(item2.estatus == 'Abierto'){
                            var estatusHeader = 'Pendiente';
                        } else {
                            var estatusHeader = item2.estatus;
                        }
                        desincorporaciones[0] = {'Empresa':item2.empresa, 'Fecha':horas, 'Estatus':estatusHeader, 'UsuarioApertura':item2.userApertura, 'UsuarioCierre':item2.userCierre, 'id_servidor': item2.id_servidor, 'fecha2': item2.fecha2, 'id_empresa': id_empresa};
                        var estatus = item2.estatus_servidor;
                        var urlphp = url+"/guardarTrafico.php?tipo="+estatus;
                        $.ajax({
                            type: "POST",
                            async : true,
                            url: urlphp,
                            dataType: 'html',
                            data: {'desincorporaciones': JSON.stringify(desincorporaciones)},
                            success: function(respuesta){
                                var respu1 = respuesta.split("._.");
                                var dat1 = respu1[0];
                                var dat2 = respu1[1];
                                if(dat1 == "CEDULA"){
                                    if(dat2 > 0){
                                       if(estatus == 0){ // Sin Enviar Y estado abierto en base
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE desincorporaciones SET id_servidor = ?, estatus_servidor = ? WHERE id_cedula = ?",
                                                        [dat2, 2, id_cedula], //enviado el estado abierto
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                        }
                                                    );
                                                }
                                            );
                                       } else if(estatus == 1){ // Sin enviar , estado en => Cerrado y Abierto
                                            var cerrado = 'Cerrado';
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE desincorporaciones SET id_servidor = ?, estatus_servidor = ?, estatus = ?  WHERE id_cedula = ?",
                                                        [dat2, 4, cerrado, id_cedula], // En servidor estado abierto y cerrado
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            $("#li-"+item.id_cedula).remove();
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                        } else if(estatus == 3){ // Estado Abierto enviado, guardado en base el cierre
                                            var cerrado = 'Cerrado';
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE desincorporaciones SET estatus_servidor = ?, estatus = ? WHERE id_cedula = ?",
                                                        [4, cerrado, id_cedula], // En servidor estado abierto y cerrado
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            $("#li-"+item.id_cedula).remove();
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                       }
                                    }
                                } else {
                                    AlmacenarError(respuesta);
                                }
                            },
                            error: function(){
                                console.log("Error en la comunicacion");
                            }
                        });
                    },
                    function(tx, error){
                        console.log("Error al consultar: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    } else if(tipo == 2){ // DETAIL
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("SELECT * FROM desincorporacionesD WHERE id_desD = ?",
                    [id_cedula],
                    function(tx, results){     
                        var item2 = results.rows.item(0);
                        if(item2.HoraDesR){
                            var horas = item2.HoraDesR.replace(" ", "T");
                        } else {
                            var horas = "";
                        }
                        
                        if(item2.HoraIncR){
                            var horas2 = item2.HoraIncR.replace(" ", "T");
                        } else {
                            var horas2 = "";
                        }
                        
                        desincorporacionesd[0] = {'id_servidor':id_servidor,'Apoyo': item2.apoyo, 'JornadasNoIncorporadas': item2.jornadas, 'HoraD': item2.HoraDes, 'HoraI': item2.HoraInc, 'UnidadDID': item2.UnidadDesinID, 'UnidadD': item2.UnidadDesin, 'UnidadIID': item2.UnidadIncID, 'UnidadI': item2.UnidadInc, 'Itinerario': item2.Itinerario, 'Motivo': item2.Falla, 'Falla': item2.DetalleFalla, 'SentidoD': item2.SentidoDes, 'SentidoI': item2.SentidoInc, 'UbicacionD': item2.UbicacionDes, 'UbicacionI': item2.UbicacionInc, 'Incumplimiento': item2.Inclumplimiento, 'OperadorD': item2.id_operador_des, 'OperadorI': item2.id_operador_inc, 'KmD': item2.KmDes, 'KmI': item2.KmInc, 'FolioD': item2.FolioDes, 'FolioI': item2.FolioInc, 'UsuarioI': item2.Usuarioinc, 'UsuarioD': item2.UsuarioDes, 'KmPerdidos': item2.KmPerdidos, 'estatus_servidor': item2.estatus_servidor, 'HoraCapturaI': horas2, 'HoraCapturaD': horas, 'id_servidord': item2.id_servidor, 'jornadaSIncorporacion': item2.jornadaSIncorporacion};
                        var estatus = item2.estatus_servidor;
                        var urlphp = url+"/guardarTrafico_d.php?tipo="+estatus;
                        // console.log(desincorporacionesd);
                        $.ajax({
                            type: "POST",
                            async : true,
                            url: urlphp,
                            dataType: 'html',
                            data: {'desincorporacionesd': JSON.stringify(desincorporacionesd)},
                            success: function(respuesta){
                                var respu1 = respuesta.split("._.");
                                var dat1 = respu1[0];
                                var dat2 = respu1[1];
                                if(dat1 == "CEDULA"){
                                    if(dat2 > 0){
                                       if(estatus == 0){ // Sin Enviar Y estado abierto en base
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE desincorporacionesD SET id_servidor = ?, estatus_servidor = ? WHERE id_desD = ?",
                                                        [dat2, 2, id_cedula], //enviado el estado abierto
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            CambiaBolita(id_cedula,2);
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                       } else if(estatus == 1){ // Sin enviar , estado en => Cerrado y Abierto
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE desincorporacionesD SET id_servidor = ?, estatus_servidor = ? WHERE id_desD = ?",
                                                        [dat2, 4, id_cedula], // En servidor estado abierto y cerrado
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            CambiaBolita(id_cedula,4);
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                        } else if(estatus == 3){ // Estado Abierto enviado, guardado en base el cierre
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE desincorporacionesD SET estatus_servidor = ? WHERE id_desD = ?",
                                                        [4, id_cedula], // En servidor estado abierto y cerrado
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            CambiaBolita(id_cedula,4);
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                       }
                                    }
                                } else {
                                    AlmacenarError(respuesta);
                                }
                            },
                            error: function(){
                                console.log("Error en la comunicacion");
                            }
                        });
                    },
                    function(tx, error){
                        console.log("Error al consultar: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    } else if(tipo == 3){ // TRF Apoyos
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql("SELECT * FROM TRFapoyo WHERE id_apoyo = ?",
                    [id_cedula],
                    function(tx, results){     
                        var item2 = results.rows.item(0);
                        //console.log(item2);
                        if(item2.HoraCaptura){
                            var horas = item2.HoraCaptura.replace(" ", "T");
                        } else {
                            var horas = "";
                        }
                        
                        desincorporacionesd[0] = {'id_servidor':id_servidor, 'id_servidor2':item2.id_servidor, 'Apoyo': item2.Apoyo, 'Hora': item2.Hora, 'HoraCaptura': horas, 'Itinerario': item2.Itinerario, 'Operador': item2.Operador, 'Sentido': item2.Sentido, 'TipoUnidad': item2.TipoUnidad, 'TramoDeApoyo': item2.TramoDeApoyo, 'Ubicacion': item2.Ubicacion, 'Unidad': item2.Unidad, 'UnidadID': item2.UnidadID, 'Usuario': item2.Usuario, 'estatus_servidor': item2.estatus_servidor, 'id_operador': item2.id_operador, 'kilometrajeApoyo': item2.kilometrajeApoyo, 'kilometrajeUnidad': item2.kilometrajeUnidad};
                        
                        var estatus = item2.estatus_servidor;
                        var urlphp = url+"/guardarTraficoApoyo.php?tipo="+estatus;
                        $.ajax({
                            type: "POST",
                            async : true,
                            url: urlphp,
                            dataType: 'html',
                            data: {'desincorporacionesd': JSON.stringify(desincorporacionesd)},
                            success: function(respuesta){
                                var respu1 = respuesta.split("._.");
                                var dat1 = respu1[0];
                                var dat2 = respu1[1];
                                if(dat1 == "CEDULA"){
                                    if(dat2 > 0){
                                       if(estatus == 0){ // Sin Enviar Y estado abierto en base
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE TRFapoyo SET id_servidor = ?, estatus_servidor = ? WHERE id_apoyo = ?",
                                                        [dat2, 4, id_cedula], //enviado el estado abierto
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            CambiaBolita2(id_cedula,4);
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                       } else if(estatus == 1){ // Sin enviar , estado en => Cerrado y Abierto
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE TRFapoyo SET estatus_servidor = ? WHERE id_apoyo = ?",
                                                        [4, id_cedula], // En servidor estado abierto y cerrado
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            CambiaBolita2(id_cedula,4);
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                        } else if(estatus == 3){ // Estado Abierto enviado, guardado en base el cierre
                                            databaseHandler.db.transaction(
                                                function(tx7){
                                                    tx7.executeSql(
                                                        "UPDATE TRFapoyo SET estatus_servidor = ? WHERE id_apoyo = ?",
                                                        [4, id_cedula], // En servidor estado abierto y cerrado
                                                        function(tx7, results){
                                                            sincronizaDatos();
                                                            localStorage.setItem("sendFlag", 0);
                                                            CambiaBolita2(id_cedula,4);
                                                            swal("Enviado!", "", "success");
                                                        }
                                                    );
                                                }
                                            );
                                       }
                                    }
                                } else {
                                    AlmacenarError(respuesta);
                                }
                            },
                            error: function(){
                                console.log("Error en la comunicacion");
                            }
                        });
                    },
                    function(tx, error){
                        console.log("Error al consultar: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    }
}