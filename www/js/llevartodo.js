function AlmacenarError(respuesta){
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    datos[0] = {'id_usario':id_usuario,'id_empresa':id_empresa,'respuesta':respuesta};
    $.ajax({
        type: "POST",
        async : true,
        url: "http://189.254.4.243/CISAApp/Archivos/App/guardarErrorRespuesta.php",
        dataType: 'html',
        data: {'datos': JSON.stringify(datos)},
        success: function(respuesta){
            if(respuesta == 1){
                swal("","No se pudo completar el registro","warning");
            }
        },
        error: function(){
            console.log("Error en la comunicacion con el servidor");
        }
    });
}
function llevarTodo(id_cedula,tipo_cedula){
    //Aqio va el ajax (tipo de cedula,id_usuario y id_empresa)
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var versionapp = '1.1.8';
    datos[0] = {'id_usuario':id_usuario,'id_empresa':id_empresa,'tipo_cedula':tipo_cedula,'versionapp':versionapp};
    $.ajax({
        type: "POST",
        async : true,
        url: "http://189.254.4.243/CISAApp/Archivos/App/guardarEnvioCedula.php",
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
                                                            url: "http://189.254.4.243/CISAApp/Archivos/App/guardarRevImgCheklist.php",
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
                                                        console.log("Error al consultar sanitizacion: " + error.message);
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar sanitizacion: " + error.message);
                                    }
                                );
                            },
                            function(error){},
                            function(){}
                        );
                    }else if(tipo == "Limpieza"){
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
                                                            url: "http://189.254.4.243/CISAApp/Archivos/App/guardarRevLimpCheklist.php",
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
                                                        console.log("Error al consultar sanitizacion: " + error.message);
                                                    }
                                                );
                                            },
                                            function(error){},
                                            function(){}
                                        );
                                    },
                                    function(tx, error){
                                        console.log("Error al consultar sanitizacion: " + error.message);
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
    console.log(fecha_eliminar);
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
        text: "Estas apunto de eliminar todos los datos de este registro, ¿Estas seguro continuar con la acción?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willGoBack) => {
        if (willGoBack){
            var empresa = localStorage.getItem("nombre_empresa");               
            console.log(empresa,id_cedula,tipo_cedula);
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