function AlmacenarError(respuesta) {
    $(".send-ced").css("pointer-events", "all");

    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    var versionapp = localStorage.getItem("version");
    datos[0] = {
        id_usario: id_usuario,
        id_empresa: id_empresa,
        respuesta: respuesta,
        versionapp: versionapp,
    };
    $.ajax({
        type: "POST",
        async: true,
        url: url + "/guardarErrorRespuesta.php",
        dataType: "html",
        data: { datos: JSON.stringify(datos) },
        success: function (respuesta) {
            if (respuesta == 1) {
                //swal("","No se pudo completar el registro","warning");
            }
        },
        error: function () {
            console.log("Error en la comunicacion con el servidor");
        },
    });
}
function llevarTodo(id_cedula, tipo_cedula) {
    $(".send-ced").css("pointer-events", "none");
    console.log(id_cedula, tipo_cedula);
    //Aqio va el ajax (tipo de cedula,id_usuario y id_empresa)
    var datos = new Array();
    var id_usuario = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    var versionapp = localStorage.getItem("version");
    datos[0] = {
        id_usuario: id_usuario,
        id_empresa: id_empresa,
        tipo_cedula: tipo_cedula,
        versionapp: versionapp,
    };
    // $.ajax({
    //     type: "POST",
    //     async : true,
    //     url: url+"/guardarEnvioCedula.php",
    //     dataType: 'html',
    //     data: {'datos': JSON.stringify(datos)},
    //     success: function(respuesta){
    //     },
    //     error: function(){
    //         console.log("Error en la comunicacion con el servidor");
    //     }
    // });
    swal("Enviando", "....", "success");
    var empresa = localStorage.getItem("nombre_empresa");
    var datosCedulaGeneral = new Array();
    var checklist = new Array();
    var datos_generales_checklist = new Array();

    var fecha = new Date();
    var fecha_envio =
        fecha.getFullYear() +
        "-" +
        (fecha.getMonth() + 1) +
        "-" +
        fecha.getDate() +
        " " +
        fecha.getHours() +
        ":" +
        fecha.getMinutes() +
        ":" +
        fecha.getSeconds();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "SELECT * FROM cedulas_general WHERE id_cedula = ?",
                [id_cedula],
                function (tx, results) {
                    var length = results.rows.length;
                    for (var i = 0; i < length; i++) {
                        var item = results.rows.item(i);
                        tipo = item.tipo_cedula;
                        //datosCedulaGeneral[i] = {'Valor':i,'id_cedula':item.id_cedula,'tipo_cedula':item.tipo_cedula,'id_usuario':item.id_usuario,'nombre_usuario':item.nombre_usuario,'fecha_entrada':item.fecha_entrada,'geolocalizacion_entrada': item.geolocalizacion_entrada,'id_cliente': item.id_cliente,'nombre_cliente': item.nombre_cliente,'horario_programado': item.horario_programado,'calificacion': item.calificacion,'fecha_salida':item.fecha_salida,'geolocalizacion_salida':item.geolocalizacion_salida,'nombre_evalua':item.nombre_evalua,'comentario_cliente':item.comentario_cliente,'fecha_envio':fecha_envio};
                        datosCedulaGeneral[i] = {
                            Valor: i,
                            id_cedula: item.id_cedula,
                            tipo_cedula: item.tipo_cedula,
                            id_usuario: item.id_usuario,
                            nombre_usuario: item.nombre_usuario,
                            fecha_entrada: item.fecha_entrada,
                            geolocalizacion_entrada: item.geolocalizacion_entrada,
                            id_cliente: item.id_cliente,
                            nombre_cliente: item.nombre_cliente,
                            horario_programado: item.horario_programado,
                            calificacion: 0,
                            fecha_salida: item.fecha_salida,
                            geolocalizacion_salida: item.geolocalizacion_salida,
                            nombre_evalua: item.nombre_evalua,
                            comentario_cliente: item.comentario_cliente,
                            fecha_envio: fecha_envio,
                        };
                    }
                    if (tipo == "checklist") {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM checklist WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            checklist[i] = {
                                                Valor: i,
                                                id_pregunta: item1.id_pregunta,
                                                revision: item1.revision,
                                                nombre_fase: item1.nombre_fase,
                                                int_ext: item1.int_ext,
                                                id_fase: item1.id_fase,
                                                obligatorio: item1.obligatorio,
                                                no_pregunta: item1.no_pregunta,
                                                respuesta: item1.respuesta,
                                                modelo: item1.modelo,
                                                comentarios: item1.comentarios,
                                                multiple: item1.multiple,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM datos_generales_checklist WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            datos_generales_checklist[i] = {
                                                                Valor: i,
                                                                Unidad: item2.Unidad,
                                                                Chasis: item2.Chasis,
                                                                Familia: item2.Familia,
                                                                marca: item2.marca,
                                                                Empresa: item2.Empresa,
                                                                FK_id_unidad: item2.FK_id_unidad,
                                                                id_unidad_vs: item2.id_unidad_vs,
                                                                FK_id_empresa: item2.FK_id_empresa,
                                                                id_modelo_check: item2.id_modelo_check,
                                                                comentarios_generales: item2.comentarios_generales,
                                                                fecha_revision: item2.fecha_revision,
                                                            };
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/guardarRevImgCheklist.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                checklist: JSON.stringify(checklist),
                                                                datos_generales_checklist: JSON.stringify(datos_generales_checklist),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                    validaEmpresasGPO();
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "Limpieza") {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM checklist_revlimp WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            checklist[i] = {
                                                Valor: i,
                                                id_pregunta: item1.id_pregunta,
                                                revision: item1.revision,
                                                nombre_fase: item1.nombre_fase,
                                                int_ext: item1.int_ext,
                                                id_fase: item1.id_fase,
                                                obligatorio: item1.obligatorio,
                                                no_pregunta: item1.no_pregunta,
                                                respuesta: item1.respuesta,
                                                modelo: item1.modelo,
                                                comentarios: item1.comentarios,
                                                multiple: item1.multiple,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM datos_generales_revlimp WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            datos_generales_checklist[i] = {
                                                                Valor: i,
                                                                Unidad: item2.Unidad,
                                                                Chasis: item2.Chasis,
                                                                Familia: item2.Familia,
                                                                marca: item2.marca,
                                                                Empresa: item2.Empresa,
                                                                FK_id_unidad: item2.FK_id_unidad,
                                                                id_unidad_vs: item2.id_unidad_vs,
                                                                FK_id_empresa: item2.FK_id_empresa,
                                                                id_modelo_check: item2.id_modelo_check,
                                                                comentarios_generales: item2.comentarios_generales,
                                                                fecha_revision: item2.fecha_revision,
                                                            };
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/guardarRevLimpCheklist.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                checklist: JSON.stringify(checklist),
                                                                datos_generales_checklist: JSON.stringify(datos_generales_checklist),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                    validaEmpresasGPO();
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "Desincorporaciones") {
                        var desincorporaciones = new Array();
                        var desincorporacionesD = new Array();
                        var Apoyos = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM desincorporaciones WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            var horas = item1.fecha.replace(" ", "T");
                                            var horas2 = item1.fecha2.replace(" ", "T");
                                            if (item1.estatus == "Abierto") {
                                                var estatusHeader = "Pendiente";
                                            } else {
                                                var estatusHeader = item1.estatus;
                                            }
                                            desincorporaciones[i] = {
                                                Valor: i,
                                                Empresa: item1.empresa,
                                                estatus_servidor: item1.estatus_servidor,
                                                Fecha: horas,
                                                Estatus: estatusHeader,
                                                UsuarioApertura: item1.userApertura,
                                                UsuarioCierre: item1.userCierre,
                                                id_servidor: item1.id_servidor,
                                                fecha2: horas2,
                                                id_empresa: id_empresa,
                                                OrigenApertura: item1.OrigenApertura,
                                                OrigenCierre: item1.OrigenCierre,
                                                fechaApertura: item1.fechaApertura,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM desincorporacionesD WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            if (item2.HoraDesR) {
                                                                var horas = item2.HoraDesR.replace(" ", "T");
                                                            } else {
                                                                var horas = "";
                                                            }

                                                            if (item2.HoraIncR) {
                                                                var horas2 = item2.HoraIncR.replace(" ", "T");
                                                            } else {
                                                                var horas2 = "";
                                                            }
                                                            desincorporacionesD[i] = {
                                                                Valor: i,
                                                                id_servidor: item1.id_servidor,
                                                                Apoyo: item2.apoyo,
                                                                JornadasNoIncorporadas: item2.jornadas,
                                                                HoraD: item2.HoraDes,
                                                                HoraI: item2.HoraInc,
                                                                UnidadDID: item2.UnidadDesinID,
                                                                UnidadD: item2.UnidadDesin,
                                                                UnidadIID: item2.UnidadIncID,
                                                                UnidadI: item2.UnidadInc,
                                                                Itinerario: item2.Itinerario,
                                                                Motivo: item2.Falla,
                                                                Falla: item2.DetalleFalla,
                                                                SentidoD: item2.SentidoDes,
                                                                SentidoI: item2.SentidoInc,
                                                                UbicacionD: item2.UbicacionDes,
                                                                UbicacionI: item2.UbicacionInc,
                                                                Incumplimiento: item2.Inclumplimiento,
                                                                OperadorD: item2.id_operador_des,
                                                                OperadorI: item2.id_operador_inc,
                                                                KmD: item2.KmDes,
                                                                KmI: item2.KmInc,
                                                                FolioD: item2.FolioDes,
                                                                FolioI: item2.FolioInc,
                                                                UsuarioI: item2.Usuarioinc,
                                                                UsuarioD: item2.UsuarioDes,
                                                                KmPerdidos: item2.KmPerdidos,
                                                                estatus_servidor: item2.estatus_servidor,
                                                                HoraCapturaI: horas2,
                                                                HoraCapturaD: horas,
                                                                id_servidord: item2.id_servidor,
                                                                jornadaSIncorporacion: item2.jornadaSIncorporacion,
                                                            };
                                                        }
                                                        databaseHandler.db.transaction(
                                                            function (tx) {
                                                                tx.executeSql(
                                                                    "SELECT * FROM TRFapoyo WHERE id_cedula = ?",
                                                                    [id_cedula],
                                                                    function (tx, results) {
                                                                        var length = results.rows.length;
                                                                        for (var i = 0; i < length; i++) {
                                                                            var item3 = results.rows.item(i);

                                                                            if (item3.HoraCaptura) {
                                                                                var horasca = item3.HoraCaptura.replace(" ", "T");
                                                                            } else {
                                                                                var horasca = "";
                                                                            }

                                                                            Apoyos[i] = {
                                                                                Valor: i,
                                                                                id_servidor: item1.id_servidor,
                                                                                id_servidord: item3.id_servidor,
                                                                                Apoyo: item3.Apoyo,
                                                                                Hora: item3.Hora,
                                                                                HoraCaptura: horasca,
                                                                                Itinerario: item3.Itinerario,
                                                                                Operador: item3.Operador,
                                                                                Sentido: item3.Sentido,
                                                                                TipoUnidad: item3.TipoUnidad,
                                                                                TramoDeApoyo: item3.TramoDeApoyo,
                                                                                Ubicacion: item3.Ubicacion,
                                                                                Unidad: item3.Unidad,
                                                                                UnidadID: item3.UnidadID,
                                                                                Usuario: item3.Usuario,
                                                                                estatus_servidor: item3.estatus_servidor,
                                                                                id_operador: item3.id_operador,
                                                                                kilometrajeApoyo: item3.kilometrajeApoyo,
                                                                                kilometrajeUnidad: item3.kilometrajeUnidad,
                                                                            };
                                                                        }
                                                                        $.ajax({
                                                                            type: "POST",
                                                                            async: true,
                                                                            url: url + "/guardarTraficoFinal.php",
                                                                            dataType: "html",
                                                                            data: {
                                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                                desincorporaciones: JSON.stringify(desincorporaciones),
                                                                                desincorporacionesD: JSON.stringify(desincorporacionesD),
                                                                                apoyos: JSON.stringify(Apoyos),
                                                                            },
                                                                            success: function (respuesta) {
                                                                                var respu1 = respuesta.split("._.");
                                                                                var dat1 = respu1[0];
                                                                                var dat2 = respu1[1];
                                                                                if (dat1 == "CEDULA") {
                                                                                    if (dat2 > 0) {
                                                                                        databaseHandler.db.transaction(function (tx5) {
                                                                                            tx5.executeSql(
                                                                                                "UPDATE desincorporacionesD SET estatus_servidor = 4 WHERE id_cedula = ?",
                                                                                                [id_cedula],
                                                                                                function (tx5, results) {
                                                                                                    databaseHandler.db.transaction(function (tx6) {
                                                                                                        tx6.executeSql(
                                                                                                            "UPDATE desincorporaciones SET estatus_servidor = 4 WHERE id_cedula = ?",
                                                                                                            [id_cedula],
                                                                                                            function (tx6, results) {
                                                                                                                databaseHandler.db.transaction(
                                                                                                                    function (tx6) {
                                                                                                                        tx6.executeSql(
                                                                                                                            "UPDATE TRFapoyo SET estatus_servidor = 4 WHERE id_cedula = ?",
                                                                                                                            [id_cedula],
                                                                                                                            function (tx6, results) {
                                                                                                                                databaseHandler.db.transaction(
                                                                                                                                    function (tx7) {
                                                                                                                                        tx7.executeSql(
                                                                                                                                            "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                                                                            [
                                                                                                                                                id_cedula,
                                                                                                                                            ],
                                                                                                                                            function (
                                                                                                                                                tx7,
                                                                                                                                                results
                                                                                                                                            ) {
                                                                                                                                                $(
                                                                                                                                                    ".send-ced"
                                                                                                                                                ).css(
                                                                                                                                                    "pointer-events",
                                                                                                                                                    "all"
                                                                                                                                                );
                                                                                                                                                localStorage.setItem(
                                                                                                                                                    "sendFlag",
                                                                                                                                                    0
                                                                                                                                                );
                                                                                                                                                $(
                                                                                                                                                    "#li-" +
                                                                                                                                                        item.id_cedula
                                                                                                                                                ).remove();
                                                                                                                                                sincronizaDatos();
                                                                                                                                                swal(
                                                                                                                                                    "Enviado!",
                                                                                                                                                    "",
                                                                                                                                                    "success"
                                                                                                                                                );
                                                                                                                                                validaEmpresasGPO();
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
                                                                                                    });
                                                                                                }
                                                                                            );
                                                                                        });
                                                                                    }
                                                                                } else {
                                                                                    AlmacenarError(respuesta);
                                                                                }
                                                                            },
                                                                            error: function () {
                                                                                console.log("Error en la comunicacion");
                                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                                $(".send-ced").css("pointer-events", "all");
                                                                            },
                                                                        });
                                                                    },
                                                                    function (tx, error) {
                                                                        console.log("Error al consultar: " + error.message);
                                                                    }
                                                                );
                                                            },
                                                            function (error) {},
                                                            function () {}
                                                        );
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function (error) {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "Recaudo") {
                        var detalle_recaudo = new Array();
                        var datos_generales_recaudo = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM datos_generales_recaudo WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            datos_generales_recaudo[i] = {
                                                Valor: i,
                                                fecha: item1.fecha,
                                                id_usuario: item1.id_usuario,
                                                id_empresa: item1.id_empresa,
                                                observaciones: item1.observaciones,
                                                folio: item1.folio,
                                                folio2: item1.folio2,
                                                recaudo_total: item1.recaudo_total,
                                                recaudo_sin_billetes: item1.recaudo_sin_billetes,
                                                total_billetes: item1.total_billetes,
                                                total_cacharpa: item1.total_cacharpa,
                                                bolsas_totales: item1.bolsas_totales,
                                                plomo: item1.plomo,
                                                monto1: item1.monto1,
                                                total_unidades: item1.total_unidades,
                                                unidades_recaudads: item1.unidades_recaudads,
                                                promedio: item1.promedio,
                                                bolsa50c: item1.bolsa50c,
                                                bolsa1: item1.bolsa1,
                                                bolsa2: item1.bolsa2,
                                                bolsa5: item1.bolsa5,
                                                bolsa10: item1.bolsa10,
                                                pico50c: item1.pico50c,
                                                pico1: item1.pico1,
                                                pico2: item1.pico2,
                                                pico5: item1.pico5,
                                                pico10: item1.pico10,
                                                opc_cacharpa: item1.opc_cacharpa,
                                                opc_adicional: item1.opc_adicional,
                                                bolsaCacharpa10: item1.bolsaCacharpa10,
                                                bolsaCacharpa20: item1.bolsaCacharpa20,
                                                bolsaCacharpa50: item1.bolsaCacharpa50,
                                                monto_adicional: item1.monto_adicional,
                                                bolsaAdd50c: item1.bolsaAdd50c,
                                                bolsaAdd1: item1.bolsaAdd1,
                                                bolsaAdd2: item1.bolsaAdd2,
                                                bolsaAdd5: item1.bolsaAdd5,
                                                bolsaAdd10: item1.bolsaAdd10,
                                                importe_cacharpa: item1.importe_cacharpa,
                                                plomo2: item1.plomo2,
                                                plomo3: item1.plomo3,
                                                plomo4: item1.plomo4,
                                                plomo5: item1.plomo5,
                                                peso_cacharpa: item1.peso_cacharpa,
                                                id_servidor: item1.id_servidor,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM detalle_recaudo WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            var fecha = item1.fecha.replace(" ", "T");
                                                            detalle_recaudo[i] = {
                                                                Valor: i,
                                                                id_unidad: item2.id_unidad,
                                                                Moneda1: item2.Moneda1,
                                                                Moneda2: item2.Moneda2,
                                                                Moneda5: item2.Moneda5,
                                                                Moneda10: item2.Moneda10,
                                                                Moneda20: item2.Moneda20,
                                                                Moneda50: item2.Moneda50,
                                                                Moneda50c: item2.Moneda50c,
                                                                Moneda100: item2.Moneda100,
                                                                Moneda200: item2.Moneda200,
                                                                Moneda500: item2.Moneda500,
                                                                eco: item2.eco,
                                                                id_cedula: item2.id_cedula,
                                                                id_detalle: item2.id_detalle,
                                                                importe1: item2.importe1,
                                                                importe2: item2.importe2,
                                                                importe5: item2.importe5,
                                                                importe10: item2.importe10,
                                                                importe20: item2.importe20,
                                                                importe50: item2.importe50,
                                                                importe50c: item2.importe50c,
                                                                importe100: item2.importe100,
                                                                importe200: item2.importe200,
                                                                importe500: item2.importe500,
                                                                importe_total: item2.importe_total,
                                                                piezas_totales: item2.piezas_totales,
                                                                fecha: fecha,
                                                                id_servidor: item2.id_servidor,
                                                            };
                                                        }
                                                        console.log(datos_generales_recaudo);
                                                        console.log(detalle_recaudo);
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/guardarRecaudo.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                datos_generales_recaudo: JSON.stringify(datos_generales_recaudo),
                                                                detalle_recaudo: JSON.stringify(detalle_recaudo),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                    validaEmpresasGPO();
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar sanitizacion: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar sanitizacion: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "Diesel") {
                        var detalle_diesel = new Array();
                        var datos_generales_diesel = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM datos_generales_diesel WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            let fecha_corta = item1.fecha.split(" ");
                                            let fecha = item1.fecha.replace(" ", "T");
                                            let fecha_fin = item1.fecha_fin.replace(" ", "T");
                                            let fecha_envio = getDateWhitZeros();
                                            let fechaReal = "";
                                            if (item1.fechaReal) {
                                                fechaReal = item1.fechaReal.replace(" ", "T");
                                            } else {
                                                fechaReal = item1.fecha.replace(" ", "T");
                                            }

                                            fecha_envio = fecha_envio.replace(" ", "T");
                                            datos_generales_diesel[i] = {
                                                Valor: i,
                                                fecha: fecha,
                                                fecha_corta: fecha_corta[0],
                                                id_usuario: item1.id_usuario,
                                                nombre_usuario: item1.nombre_usuario,
                                                id_empresa: item1.id_empresa,
                                                carga_total: item1.carga_total,
                                                total_unidades: item1.total_unidades,
                                                unidades_cargadas: item1.unidades_cargadas,
                                                promedio: item1.promedio,
                                                origen: item1.origen,
                                                fechaReal: fechaReal,
                                                fecha_fin: fecha_fin,
                                                nombre_empresa: NombreEmpresa(item1.id_empresa),
                                                fecha_envio: fecha_envio,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM detalle_diesel WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            let fecha_carga = item2.fecha_carga.replace(" ", "T");
                                                            detalle_diesel[i] = {
                                                                Valor: i,
                                                                id_unidad: item2.id_unidad,
                                                                eco: item2.eco,
                                                                eco2: item2.eco2,
                                                                carga_total: item2.carga_total,
                                                                odometro: item2.odometro,
                                                                fecha_carga: fecha_carga,
                                                                no_bomba: item2.no_bomba,
                                                                almacen: item2.almacen,
                                                                id_operador: item2.id_operador,
                                                                operador: item2.operador,
                                                                jornada: item2.jornada,
                                                                vueltas: item2.vueltas,
                                                                h_inicio: item2.h_inicio,
                                                                h_fin: item2.h_fin,
                                                                tipo_carga: item2.tipo_carga,
                                                                operador2: item2.operador2,
                                                                VIN: item2.VIN,
                                                            };
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            async: true,
                                                            url: url + "/guardarDiesel.php",
                                                            dataType: "html",
                                                            data: {
                                                                datosCedulaGeneral: JSON.stringify(datosCedulaGeneral),
                                                                detalle_diesel: JSON.stringify(detalle_diesel),
                                                                datos_generales_diesel: JSON.stringify(datos_generales_diesel),
                                                            },
                                                            success: function (respuesta) {
                                                                var respu1 = respuesta.split("._.");
                                                                var dat1 = respu1[0];
                                                                var dat2 = respu1[1];
                                                                if (dat1 == "CEDULA") {
                                                                    if (dat2 > 0) {
                                                                        databaseHandler.db.transaction(function (tx7) {
                                                                            tx7.executeSql(
                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                [id_cedula],
                                                                                function (tx7, results) {
                                                                                    $(".send-ced").css("pointer-events", "all");
                                                                                    localStorage.setItem("sendFlag", 0);
                                                                                    $("#li-" + item.id_cedula).remove();
                                                                                    swal("Enviado!", "", "success");
                                                                                    validaEmpresasGPO();
                                                                                }
                                                                            );
                                                                        });
                                                                    }
                                                                } else {
                                                                    AlmacenarError(respuesta);
                                                                }
                                                            },
                                                            error: function () {
                                                                console.log("Error en la comunicacion");
                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                $(".send-ced").css("pointer-events", "all");
                                                            },
                                                        });
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else if (tipo == "InsFlota") {
                        var checklistFlota = new Array();
                        var datosGeneralesFlota = new Array();
                        var Evidencias = new Array();
                        var Milimetrajes = new Array();
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM checklistFlota WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        for (var i = 0; i < length; i++) {
                                            var item1 = results.rows.item(i);
                                            checklistFlota[i] = {
                                                Valor: i,
                                                id_pregunta: item1.id_pregunta,
                                                revision: item1.revision,
                                                nombre_fase: item1.nombre_fase,
                                                int_ext: item1.int_ext,
                                                id_fase: item1.id_fase,
                                                obligatorio: item1.obligatorio,
                                                no_pregunta: item1.no_pregunta,
                                                respuesta: item1.respuesta,
                                                modelo: item1.modelo,
                                                comentarios: item1.comentarios,
                                                multiple: item1.multiple,
                                                ponderacion: item1.ponderacion,
                                            };
                                        }
                                        databaseHandler.db.transaction(
                                            function (tx) {
                                                tx.executeSql(
                                                    "SELECT * FROM datosGeneralesFlota WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx, results) {
                                                        var length = results.rows.length;
                                                        let fechaInicio = String(item.fecha_entrada).replace(" ", "T");
                                                        let fechaFin = String(item.fecha_salida).replace(" ", "T");
                                                        let fechaEnvio = String(getDateWhitZeros()).replace(" ", "T");
                                                        for (var i = 0; i < length; i++) {
                                                            var item2 = results.rows.item(i);
                                                            datosGeneralesFlota[i] = {
                                                                Valor: i,
                                                                Unidad: item2.Unidad,
                                                                Chasis: item2.Chasis,
                                                                Familia: item2.Familia,
                                                                marca: item2.marca,
                                                                Empresa: item2.Empresa,
                                                                FK_id_unidad: item2.FK_id_unidad,
                                                                id_unidad_vs: item2.id_unidad_vs,
                                                                FK_id_empresa: item2.FK_id_empresa,
                                                                id_modelo_check: item2.id_modelo_check,
                                                                comentarios_generales: item2.comentarios_generales,
                                                                fecha_revision: item2.fecha_revision,
                                                                flagInspeccion: item2.flagInspeccion,
                                                                fechaInicio: fechaInicio,
                                                                fechaFin: fechaFin,
                                                                fechaEnvio: fechaEnvio,
                                                                usuario: item.id_usuario,
                                                                nameUsuario: item.nombre_usuario,
                                                            };
                                                        }
                                                        databaseHandler.db.transaction(
                                                            function (tx) {
                                                                tx.executeSql(
                                                                    "SELECT * FROM Evidencias WHERE id_cedula = ?",
                                                                    [id_cedula],
                                                                    function (tx, results) {
                                                                        var length = results.rows.length;
                                                                        for (var i = 0; i < length; i++) {
                                                                            var item3 = results.rows.item(i);
                                                                            Evidencias[i] = {
                                                                                Valor: i,
                                                                                FKHeader: item3.FKHeader,
                                                                                evidencia: item3.evidencia,
                                                                                fecha: String(item3.fecha).replace(" ", "T"),
                                                                                flagPregunta: item3.flagPregunta,
                                                                                proceso: item3.proceso,
                                                                            };
                                                                        }
                                                                        databaseHandler.db.transaction(
                                                                            function (tx) {
                                                                                tx.executeSql(
                                                                                    "SELECT * FROM Milimetrajes WHERE id_cedula = ?",
                                                                                    [id_cedula],
                                                                                    function (tx, results) {
                                                                                        var length = results.rows.length;
                                                                                        for (var i = 0; i < length; i++) {
                                                                                            var item4 = results.rows.item(i);
                                                                                            Milimetrajes[i] = {
                                                                                                Valor: i,
                                                                                                posicion: item4.posicion,
                                                                                                valor: item4.valor,
                                                                                                valorPresion: item4.valorPresion,
                                                                                                fechaPresion: String(item4.fechaPresion).replace(
                                                                                                    " ",
                                                                                                    "T"
                                                                                                ),
                                                                                                fecha: String(item4.fecha).replace(" ", "T"),
                                                                                            };
                                                                                        }
                                                                                        // console.table(datosCedulaGeneral);
                                                                                        // console.table(checklistFlota);
                                                                                        // console.table(datosGeneralesFlota);
                                                                                        // console.table(Evidencias);
                                                                                        // console.table(Milimetrajes);
                                                                                        $.ajax({
                                                                                            type: "POST",
                                                                                            async: true,
                                                                                            url: url + "/InsFlota/guardarInspeccionFlota.php",
                                                                                            dataType: "html",
                                                                                            data: {
                                                                                                datosCedulaGeneral:
                                                                                                    JSON.stringify(datosCedulaGeneral),
                                                                                                checklistFlota: JSON.stringify(checklistFlota),
                                                                                                datosGeneralesFlota:
                                                                                                    JSON.stringify(datosGeneralesFlota),
                                                                                                Evidencias: JSON.stringify(Evidencias),
                                                                                                Milimetrajes: JSON.stringify(Milimetrajes),
                                                                                            },
                                                                                            success: function (respuesta) {
                                                                                                var respu1 = respuesta.split("._.");
                                                                                                var dat1 = respu1[0];
                                                                                                var dat2 = respu1[1];
                                                                                                if (dat1 == "CEDULA") {
                                                                                                    if (dat2 > 0) {
                                                                                                        databaseHandler.db.transaction(function (
                                                                                                            tx7
                                                                                                        ) {
                                                                                                            tx7.executeSql(
                                                                                                                "UPDATE cedulas_general SET estatus = 3 WHERE id_cedula = ?",
                                                                                                                [id_cedula],
                                                                                                                function (tx7, results) {
                                                                                                                    $(".send-ced").css(
                                                                                                                        "pointer-events",
                                                                                                                        "all"
                                                                                                                    );
                                                                                                                    localStorage.setItem(
                                                                                                                        "sendFlag",
                                                                                                                        0
                                                                                                                    );
                                                                                                                    $(
                                                                                                                        "#li-" + item.id_cedula
                                                                                                                    ).remove();
                                                                                                                    swal("Enviado!", "", "success");
                                                                                                                    validaEmpresasGPO();
                                                                                                                }
                                                                                                            );
                                                                                                        });
                                                                                                    }
                                                                                                } else {
                                                                                                    AlmacenarError(respuesta);
                                                                                                }
                                                                                            },
                                                                                            error: function () {
                                                                                                console.log("Error en la comunicacion");
                                                                                                swal("Fallo el envío, por conexión!", "", "error");
                                                                                                $(".send-ced").css("pointer-events", "all");
                                                                                            },
                                                                                        });
                                                                                    },
                                                                                    function (tx, error) {
                                                                                        console.log("Error al consultar: " + error.message);
                                                                                    }
                                                                                );
                                                                            },
                                                                            function (error) {},
                                                                            function () {}
                                                                        );
                                                                    },
                                                                    function (tx, error) {
                                                                        console.log("Error al consultar: " + error.message);
                                                                    }
                                                                );
                                                            },
                                                            function (error) {},
                                                            function () {}
                                                        );
                                                    },
                                                    function (tx, error) {
                                                        console.log("Error al consultar: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {},
                                            function () {}
                                        );
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                },
                function (tx, error) {
                    console.log("Error al consultar datos generales: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function EliminarRegistrosAntiguos() {
    var fecha = new Date();
    var fecha_ingreso = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    fecha_eliminar = editar_fecha(fecha_ingreso, "-11", "d", "-");
    //console.log(fecha_eliminar);
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT * FROM cedulas_general WHERE fecha_entrada > ? AND (estatus = 1 OR estatus = 2)",
                [fecha_eliminar],
                function (tx5, results) {
                    var length = results.rows.length;
                    for (var i = 0; i < length; i++) {
                        var item2 = results.rows.item(i);
                        var id_eliminar = item2.IdCedula;
                        databaseHandler.db.transaction(
                            function (tx4) {
                                tx4.executeSql(
                                    "DELETE FROM cedulas_general WHERE id_cedula = ?",
                                    [id_eliminar],
                                    function (tx4, results) {},
                                    function (tx4, error) {
                                        console.error("Error al eliminar cedula_general: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    }
                },
                function (tx5, error) {
                    console.log("Error al depurar registros: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function EliminarReg(id_cedula, tipo_cedula) {
    swal({
        title: "Aviso",
        text: "Estas apunto de eliminar todos los datos de este registro, ¿Estas seguro continuar con la acción?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willGoBack) => {
        if (willGoBack) {
            var empresa = localStorage.getItem("nombre_empresa");
            // console.log(empresa,id_cedula,tipo_cedula);
            databaseHandler.db.transaction(
                function (tx) {
                    tx.executeSql(
                        "DELETE FROM cedulas_general WHERE id_cedula = ?",
                        [id_cedula],
                        function (tx, results) {},
                        function (tx, error) {}
                    );
                },
                function (error) {},
                function () {}
            );
            if (tipo_cedula == "checklist") {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM checklist WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM datos_generales_checklist WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                $("#conc" + id_cedula).remove();
                                                swal("", "Eliminado correctamente", "success");
                                            },
                                            function (tx, error) {
                                                // swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            },
                            function (tx, error) {
                                console.log("Error al eliminar" + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "Limpieza") {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM checklist WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM datos_generales_checklist WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                $("#conc" + id_cedula).remove();
                                                swal("", "Eliminado correctamente", "success");
                                            },
                                            function (tx, error) {
                                                // swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            },
                            function (tx, error) {
                                console.log("Error al eliminar" + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "Recaudo") {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM datos_generales_recaudo WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM detalle_recaudo WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                $("#conc" + id_cedula).remove();
                                                swal("", "Eliminado correctamente", "success");
                                            },
                                            function (tx, error) {
                                                // swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            },
                            function (tx, error) {
                                console.log("Error al eliminar" + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            } else if (tipo_cedula == "Diesel") {
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "DELETE FROM datos_generales_diesel WHERE id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "DELETE FROM detalle_diesel WHERE id_cedula = ?",
                                            [id_cedula],
                                            function (tx, results) {
                                                $("#conc" + id_cedula).remove();
                                                swal("", "Eliminado correctamente", "success");
                                            },
                                            function (tx, error) {
                                                // swal("Error al eliminar",error.message,"error");
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            },
                            function (tx, error) {
                                console.log("Error al eliminar" + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            }
        }
    });
}

function EnvioDatosTrafico() {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "SELECT * FROM desincorporaciones WHERE id_cedula = ? AND estatus_servidor = 0 OR estatus_servidor = 1 OR estatus_servidor = 3",
                [id_cedula],
                function (tx, results) {
                    var length = results.rows.length;
                    if (length == 0) {
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "SELECT * FROM desincorporacionesD WHERE id_cedula = ? AND estatus_servidor = 0 OR estatus_servidor = 1 OR estatus_servidor = 3",
                                    [id_cedula],
                                    function (tx, results) {
                                        var length = results.rows.length;
                                        if (length == 0) {
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT * FROM TRFapoyo WHERE id_cedula = ? AND estatus_servidor = 0 OR estatus_servidor = 1 OR estatus_servidor = 3",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var length = results.rows.length;
                                                            if (length == 0) {
                                                                if (localStorage.getItem("tap_refresh")) {
                                                                    setTimeout(function () {
                                                                        try {
                                                                            swal.close();
                                                                            localStorage.removeItem("tap_refresh");
                                                                        } catch (e) {}
                                                                    }, 1500);
                                                                }
                                                            } else {
                                                                var item5 = results.rows.item(0);
                                                                databaseHandler.db.transaction(
                                                                    function (tx) {
                                                                        tx.executeSql(
                                                                            "SELECT id_servidor FROM desincorporaciones WHERE id_cedula = ?",
                                                                            [id_cedula],
                                                                            function (tx, results) {
                                                                                var item6 = results.rows.item(0);
                                                                                localStorage.setItem("sendFlag", 1);
                                                                                llevarDatosTrafico(item5.id_apoyo, 3, item6.id_servidor);
                                                                            },
                                                                            function (tx, error) {
                                                                                console.log("Error al consultar: " + error.message);
                                                                            }
                                                                        );
                                                                    },
                                                                    function (error) {},
                                                                    function () {}
                                                                );
                                                            }
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        } else {
                                            var item3 = results.rows.item(0);
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "SELECT id_servidor FROM desincorporaciones WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx, results) {
                                                            var item4 = results.rows.item(0);
                                                            localStorage.setItem("sendFlag", 1);
                                                            llevarDatosTrafico(item3.id_desD, 2, item4.id_servidor);
                                                        },
                                                        function (tx, error) {
                                                            console.log("Error al consultar: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        }
                                    },
                                    function (tx, error) {
                                        console.log("Error al consultar: " + error.message);
                                    }
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    } else {
                        localStorage.setItem("sendFlag", 1);
                        var item2 = results.rows.item(0);
                        llevarDatosTrafico(item2.id_cedula, 1, 0);
                    }
                },
                function (tx, error) {
                    console.log("Error al consultar: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}

function llevarDatosTrafico(id_cedula, tipo, id_servidor) {
    // console.log("llevar datos trafico", id_cedula, tipo, id_servidor);
    var desincorporaciones = new Array();
    var desincorporacionesd = new Array();
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");
    if (tipo == 1) {
        // HEADER
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM desincorporaciones WHERE id_cedula = ?",
                    [id_cedula],
                    function (tx, results) {
                        var item2 = results.rows.item(0);
                        var horas = item2.fecha.replace(" ", "T");
                        if (item2.estatus == "Abierto") {
                            var estatusHeader = "Pendiente";
                        } else {
                            var estatusHeader = item2.estatus;
                        }
                        desincorporaciones[0] = {
                            Empresa: item2.empresa,
                            Fecha: horas,
                            Estatus: estatusHeader,
                            UsuarioApertura: item2.userApertura,
                            UsuarioCierre: item2.userCierre,
                            id_servidor: item2.id_servidor,
                            fecha2: item2.fecha2,
                            id_empresa: id_empresa,
                            OrigenApertura: item2.OrigenApertura,
                            OrigenCierre: item2.OrigenCierre,
                            fechaApertura: item2.fechaApertura,
                        };
                        var estatus = item2.estatus_servidor;
                        var urlphp = url + "/guardarTrafico.php?tipo=" + estatus;
                        $.ajax({
                            type: "POST",
                            async: true,
                            url: urlphp,
                            dataType: "html",
                            data: {
                                desincorporaciones: JSON.stringify(desincorporaciones),
                            },
                            success: function (respuesta) {
                                var respu1 = respuesta.split("._.");
                                var dat1 = respu1[0];
                                var dat2 = respu1[1];
                                if (dat1 == "CEDULA") {
                                    if (dat2 > 0) {
                                        if (estatus == 0) {
                                            // Sin Enviar Y estado abierto en base
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE desincorporaciones SET id_servidor = ?, estatus_servidor = ? WHERE id_cedula = ?",
                                                    [dat2, 2, id_cedula], //enviado el estado abierto
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                    }
                                                );
                                            });
                                        } else if (estatus == 1) {
                                            // Sin enviar , estado en => Cerrado y Abierto
                                            var cerrado = "Cerrado";
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE desincorporaciones SET id_servidor = ?, estatus_servidor = ?, estatus = ?  WHERE id_cedula = ?",
                                                    [dat2, 4, cerrado, id_cedula], // En servidor estado abierto y cerrado
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        $("#li-" + item.id_cedula).remove();
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        } else if (estatus == 3) {
                                            // Estado Abierto enviado, guardado en base el cierre
                                            var cerrado = "Cerrado";
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE desincorporaciones SET estatus_servidor = ?, estatus = ? WHERE id_cedula = ?",
                                                    [4, cerrado, id_cedula], // En servidor estado abierto y cerrado
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        $("#li-" + item.id_cedula).remove();
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        }
                                    }
                                } else {
                                    AlmacenarError(respuesta);
                                }
                            },
                            error: function () {
                                console.log("Error en la comunicacion");
                                swal("Fallo el envío, por conexión!", "", "error");
                                $(".send-ced").css("pointer-events", "all");
                            },
                        });
                    },
                    function (tx, error) {
                        console.log("Error al consultar: " + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    } else if (tipo == 2) {
        // DETAIL
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM desincorporacionesD WHERE id_desD = ?",
                    [id_cedula],
                    function (tx, results) {
                        var item2 = results.rows.item(0);
                        if (item2.HoraDesR) {
                            var horas = item2.HoraDesR.replace(" ", "T");
                        } else {
                            var horas = "";
                        }

                        if (item2.HoraIncR) {
                            var horas2 = item2.HoraIncR.replace(" ", "T");
                        } else {
                            var horas2 = "";
                        }

                        desincorporacionesd[0] = {
                            id_servidor: id_servidor,
                            Apoyo: item2.apoyo,
                            JornadasNoIncorporadas: item2.jornadas,
                            HoraD: item2.HoraDes,
                            HoraI: item2.HoraInc,
                            UnidadDID: item2.UnidadDesinID,
                            UnidadD: item2.UnidadDesin,
                            UnidadIID: item2.UnidadIncID,
                            UnidadI: item2.UnidadInc,
                            Itinerario: item2.Itinerario,
                            Motivo: item2.Falla,
                            Falla: item2.DetalleFalla,
                            SentidoD: item2.SentidoDes,
                            SentidoI: item2.SentidoInc,
                            UbicacionD: item2.UbicacionDes,
                            UbicacionI: item2.UbicacionInc,
                            Incumplimiento: item2.Inclumplimiento,
                            OperadorD: item2.id_operador_des,
                            OperadorI: item2.id_operador_inc,
                            KmD: item2.KmDes,
                            KmI: item2.KmInc,
                            FolioD: item2.FolioDes,
                            FolioI: item2.FolioInc,
                            UsuarioI: item2.Usuarioinc,
                            UsuarioD: item2.UsuarioDes,
                            KmPerdidos: item2.KmPerdidos,
                            estatus_servidor: item2.estatus_servidor,
                            HoraCapturaI: horas2,
                            HoraCapturaD: horas,
                            id_servidord: item2.id_servidor,
                            jornadaSIncorporacion: item2.jornadaSIncorporacion,
                        };
                        var estatus = item2.estatus_servidor;
                        var urlphp = url + "/guardarTrafico_d.php?tipo=" + estatus;
                        // console.log(desincorporacionesd);
                        $.ajax({
                            type: "POST",
                            async: true,
                            url: urlphp,
                            dataType: "html",
                            data: {
                                desincorporacionesd: JSON.stringify(desincorporacionesd),
                            },
                            success: function (respuesta) {
                                var respu1 = respuesta.split("._.");
                                var dat1 = respu1[0];
                                var dat2 = respu1[1];
                                if (dat1 == "CEDULA") {
                                    if (dat2 > 0) {
                                        if (estatus == 0) {
                                            // Sin Enviar Y estado abierto en base
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE desincorporacionesD SET id_servidor = ?, estatus_servidor = ? WHERE id_desD = ?",
                                                    [dat2, 2, id_cedula], //enviado el estado abierto
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        CambiaBolita(id_cedula, 2);
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        } else if (estatus == 1) {
                                            // Sin enviar , estado en => Cerrado y Abierto
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE desincorporacionesD SET id_servidor = ?, estatus_servidor = ? WHERE id_desD = ?",
                                                    [dat2, 4, id_cedula], // En servidor estado abierto y cerrado
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        CambiaBolita(id_cedula, 4);
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        } else if (estatus == 3) {
                                            // Estado Abierto enviado, guardado en base el cierre
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE desincorporacionesD SET estatus_servidor = ? WHERE id_desD = ?",
                                                    [4, id_cedula], // En servidor estado abierto y cerrado
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        CambiaBolita(id_cedula, 4);
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        }
                                    }
                                } else {
                                    AlmacenarError(respuesta);
                                }
                            },
                            error: function () {
                                console.log("Error en la comunicacion");
                                swal("Fallo el envío, por conexión!", "", "error");
                                $(".send-ced").css("pointer-events", "all");
                            },
                        });
                    },
                    function (tx, error) {
                        console.log("Error al consultar: " + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    } else if (tipo == 3) {
        // TRF Apoyos
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM TRFapoyo WHERE id_apoyo = ?",
                    [id_cedula],
                    function (tx, results) {
                        var item2 = results.rows.item(0);
                        //console.log(item2);
                        if (item2.HoraCaptura) {
                            var horas = item2.HoraCaptura.replace(" ", "T");
                        } else {
                            var horas = "";
                        }

                        desincorporacionesd[0] = {
                            id_servidor: id_servidor,
                            id_servidor2: item2.id_servidor,
                            Apoyo: item2.Apoyo,
                            Hora: item2.Hora,
                            HoraCaptura: horas,
                            Itinerario: item2.Itinerario,
                            Operador: item2.Operador,
                            Sentido: item2.Sentido,
                            TipoUnidad: item2.TipoUnidad,
                            TramoDeApoyo: item2.TramoDeApoyo,
                            Ubicacion: item2.Ubicacion,
                            Unidad: item2.Unidad,
                            UnidadID: item2.UnidadID,
                            Usuario: item2.Usuario,
                            estatus_servidor: item2.estatus_servidor,
                            id_operador: item2.id_operador,
                            kilometrajeApoyo: item2.kilometrajeApoyo,
                            kilometrajeUnidad: item2.kilometrajeUnidad,
                        };

                        var estatus = item2.estatus_servidor;
                        var urlphp = url + "/guardarTraficoApoyo.php?tipo=" + estatus;
                        $.ajax({
                            type: "POST",
                            async: true,
                            url: urlphp,
                            dataType: "html",
                            data: {
                                desincorporacionesd: JSON.stringify(desincorporacionesd),
                            },
                            success: function (respuesta) {
                                var respu1 = respuesta.split("._.");
                                var dat1 = respu1[0];
                                var dat2 = respu1[1];
                                if (dat1 == "CEDULA") {
                                    if (dat2 > 0) {
                                        if (estatus == 0) {
                                            // Sin Enviar Y estado abierto en base
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE TRFapoyo SET id_servidor = ?, estatus_servidor = ? WHERE id_apoyo = ?",
                                                    [dat2, 4, id_cedula], //enviado el estado abierto
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        CambiaBolita2(id_cedula, 4);
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        } else if (estatus == 1) {
                                            // Sin enviar , estado en => Cerrado y Abierto
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE TRFapoyo SET estatus_servidor = ? WHERE id_apoyo = ?",
                                                    [4, id_cedula], // En servidor estado abierto y cerrado
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        CambiaBolita2(id_cedula, 4);
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        } else if (estatus == 3) {
                                            // Estado Abierto enviado, guardado en base el cierre
                                            databaseHandler.db.transaction(function (tx7) {
                                                tx7.executeSql(
                                                    "UPDATE TRFapoyo SET estatus_servidor = ? WHERE id_apoyo = ?",
                                                    [4, id_cedula], // En servidor estado abierto y cerrado
                                                    function (tx7, results) {
                                                        sincronizaDatos();
                                                        $(".send-ced").css("pointer-events", "all");
                                                        localStorage.setItem("sendFlag", 0);
                                                        CambiaBolita2(id_cedula, 4);
                                                        swal("Enviado!", "", "success");
                                                        validaEmpresasGPO();
                                                    }
                                                );
                                            });
                                        }
                                    }
                                } else {
                                    AlmacenarError(respuesta);
                                }
                            },
                            error: function () {
                                console.log("Error en la comunicacion");
                                swal("Fallo el envío, por conexión!", "", "error");
                                $(".send-ced").css("pointer-events", "all");
                            },
                        });
                    },
                    function (tx, error) {
                        console.log("Error al consultar: " + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    }
}
