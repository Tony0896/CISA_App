//Inicio Diesel
function preingresoDiesel() {
    let hoy = $("#demo-calendar-modal1").val();
    if (!hoy) {
        swal("", "Debes seleccionar un día", "warning");
        return false;
    }

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

function iniciarCargasDiesel() {
    let hoy = $("#demo-calendar-modal1").val();

    var id_usuario = localStorage.getItem("Usuario");
    var nombre_usuario = localStorage.getItem("nombre");
    var fecha_llegada = hoy + " 00:00:00";
    var fechaReal = getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = NombreEmpresa(localStorage.getItem("empresa"));
    var estatus = 0;
    var geolocation = "";
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = "Diesel";
    var origen = "Mobile";
    productHandler.addCedulayb(
        id_usuario,
        nombre_usuario,
        fecha_llegada,
        geolocation,
        id_cliente,
        nombre_cliente,
        horario_programado,
        estatus,
        tipo_cedula
    );
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "Select MAX(id_cedula) as Id from cedulas_general",
                [],
                function (tx, results) {
                    var item = results.rows.item(0);
                    localStorage.setItem("IdCedula", item.Id);
                    var id_cedula = item.Id;
                    productHandler.addDatosGenerales_Diesel(
                        id_cedula,
                        fecha_llegada,
                        id_usuario,
                        id_cliente,
                        estatus,
                        origen,
                        nombre_usuario,
                        fechaReal
                    );
                    app.views.main.router.navigate({ name: "yallegueDiesel" });
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

function llamarUnidadDiesel() {
    var id_unidad = $("#btn_llamarUnidad").data("id_unidad");
    var eco = $("#btn_llamarUnidad").data("Unidad");
    var VIN = $("#btn_llamarUnidad").data("VIN");
    var buscador = $("#btn_llamarUnidad").data("buscador");
    if (id_unidad) {
        app.sheet.open("#sheet-modal");
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
        var hours = add_minutes(new Date(fecha[0], fecha[1], fecha[2], horasSplit[0], horasSplit[1], horasSplit[2]), 1).getHours();
        var minutes = add_minutes(new Date(fecha[0], fecha[1], fecha[2], horasSplit[0], horasSplit[1], horasSplit[2]), 1).getMinutes();
        var seconds = add_minutes(new Date(fecha[0], fecha[1], fecha[2], horasSplit[0], horasSplit[1], horasSplit[2]), 1).getSeconds();
        var houtransform = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

        $("#id_unidad").val(id_unidad);
        $("#eco").val(eco);
        $("#title_unidad").html(`Unidad: ${buscador}`);
        $("#h_inicio").val(tiempoactual[1]);
        $("#h_fin").val(houtransform);
        $("#VIN").val(VIN);
        $("#close_sheet").click(function () {
            if ($("#pasa").val() != 0) {
                app.sheet.close("#sheet-modal");
            } else {
                swal({
                    title: "Aviso",
                    text: "Aún no haz guardado información, ¿Estas seguro que deseas regresar?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                }).then((willGoBack) => {
                    if (willGoBack) {
                        app.sheet.close("#sheet-modal");
                    }
                });
            }
        });
    } else {
        swal("", "Debes seleccionar primero una unidad para poder continuar", "warning");
    }
}

function agregaCarga() {
    if ($("#carga").val() && $("#odometro").val()) {
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
        var eco2 = $("#title_unidad").text();
        eco2 = eco2.replace("Unidad: ", "");

        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into detalle_diesel (id_cedula, id_unidad, eco, carga_total, odometro, fecha_carga, no_bomba, almacen, operador, id_operador, jornada, vueltas, h_inicio, h_fin, tipo_carga, operador2, VIN, eco2) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        id_unidad,
                        eco,
                        carga_total,
                        odometro,
                        fecha_carga,
                        no_bomba,
                        almacen,
                        operador,
                        id_operador,
                        jornada,
                        vueltas,
                        h_inicio,
                        h_fin,
                        tipo_carga,
                        operador2,
                        VIN,
                        eco2,
                    ],
                    function (tx, results) {
                        swal("", "Guardado correctamente", "success");
                        $("#row_totales").remove();
                        databaseHandler.db.transaction(
                            function (tx5) {
                                tx5.executeSql(
                                    "SELECT * FROM detalle_diesel WHERE id_cedula = ? ORDER BY id_detalle DESC LIMIT 1",
                                    [id_cedula],
                                    function (tx5, results) {
                                        var item2 = results.rows.item(0);
                                        $("#message-nr").css("display", "none");
                                        var no_bomba = "";
                                        item2.no_bomba ? (no_bomba = item2.no_bomba) : (no_bomba = 0);
                                        $("#tb_diesel").append(
                                            `<tr><td>${item2.eco2}</td><td>${numberWithCommas(item2.carga_total)}</td><td>${numberWithCommas(
                                                item2.odometro
                                            )}</td><td>${no_bomba}</td><td>${
                                                item2.tipo_carga
                                            }</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${
                                                item2.id_detalle
                                            }','${item2.id_unidad}','${item2.eco}','${item2.carga_total}','${item2.odometro}','${item2.no_bomba}','${
                                                item2.almacen
                                            }','${item2.h_fin}','${item2.h_inicio}','${item2.jornada}','${item2.operador}','${item2.id_operador}','${
                                                item2.vueltas
                                            }','${item2.tipo_carga}','${item2.operador2}','${item2.VIN}','2','${
                                                item2.eco2
                                            }');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></tr>`
                                        );
                                        databaseHandler.db.transaction(
                                            function (tx5) {
                                                tx5.executeSql(
                                                    "SELECT SUM(carga_total) as carga_totales, COUNT(id_cedula) as cuentas FROM detalle_diesel WHERE id_cedula = ?",
                                                    [id_cedula],
                                                    function (tx5, results) {
                                                        var item3 = results.rows.item(0);
                                                        $("#total_litros").html(`${numberWithCommas(Number(item3.carga_totales).toFixed(2))}`);
                                                        $("#unidades_cargadas").html(`${item3.cuentas}`);
                                                        $("#tb_diesel").append(
                                                            `<tr id="row_totales" style="text-align: center;background-color: #005D99;color: white;font-weight: bold;"><th>Totales</th><th>${numberWithCommas(
                                                                Number(item3.carga_totales).toFixed(2)
                                                            )}</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>`
                                                        );
                                                        $("#autocomplete").val("");
                                                        $("#btn_llamarUnidad").removeData();
                                                        app.sheet.close("#sheet-modal");
                                                    },
                                                    function (tx5, error) {
                                                        console.error("Error: " + error.message);
                                                    }
                                                );
                                            },
                                            function (error) {
                                                console.error("Error: " + error.message);
                                            },
                                            function (error) {
                                                console.error("Error: " + error.message);
                                            }
                                        );
                                    },
                                    function (tx5, error) {
                                        console.error("Error: " + error.message);
                                    }
                                );
                            },
                            function (error) {
                                console.error("Error: " + error.message);
                            },
                            function (error) {
                                console.error("Error: " + error.message);
                            }
                        );
                    },
                    function (tx, error) {
                        console.error("Error: " + error.message);
                    }
                );
            },
            function (error) {
                console.error("Error: " + error.message);
            },
            function (error) {
                console.error("Error: " + error.message);
            }
        );
    } else {
        swal("", "Debes llenar los campos de litros cargados y el odometro para poder guardar", "warning");
    }
}

function editarCargaDiesel(
    id_detalle,
    id_unidad,
    eco,
    carga_total,
    odometro,
    no_bomba,
    almacen,
    h_fin,
    h_inicio,
    jornada,
    operador,
    id_operador,
    vueltas,
    tipo_carga,
    operador2,
    VIN,
    type,
    eco2
) {
    if (type) {
        app.sheet.open("#sheet-modal-u");
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

        $("#close_sheet_u").click(function () {
            if ($("#pasa_u").val() != 0) {
                app.sheet.close("#sheet-modal-u");
            } else {
                swal({
                    title: "Aviso",
                    text: "Aún no haz actualizado información, ¿Estas seguro que deseas regresar?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                }).then((willGoBack) => {
                    if (willGoBack) {
                        app.sheet.close("#sheet-modal-u");
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

        $("#close_sheet_u").click(function () {
            if ($("#pasa_u").val() != 0) {
                app.sheet.close("#sheet-modal-u");
            } else {
                swal({
                    title: "Aviso",
                    text: "Aún no haz actualizado información, ¿Estas seguro que deseas regresar?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: false,
                }).then((willGoBack) => {
                    if (willGoBack) {
                        app.sheet.close("#sheet-modal-u");
                    }
                });
            }
        });
    }
}

function actualizaCargaDiesel() {
    if ($("#id_unidad_u").val()) {
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
        var id_unidad = $("#id_unidad_u").val();
        var eco = $("#unidad_u").val();
        var VIN = $("#VIN_u").val();
        var eco2 = $("#title_unidad_u").text();
        eco2 = eco2.replace("Unidad: ", "");

        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "Update detalle_diesel SET carga_total = ?, odometro = ?, no_bomba = ?, h_inicio = ?, h_fin = ?, almacen = ?, jornada = ?, operador = ?, id_operador = ?, vueltas = ?, tipo_carga = ?, operador2 = ?, id_unidad = ?, eco = ?, VIN = ?, eco2 = ? WHERE id_cedula = ? AND id_detalle = ?",
                    [
                        carga,
                        odometro,
                        bomba,
                        h_inicio,
                        h_fin,
                        almacen,
                        jornada,
                        operador,
                        id_operador,
                        vueltas,
                        tipo_carga,
                        operador2,
                        id_unidad,
                        eco,
                        VIN,
                        eco2,
                        id_cedula,
                        id_carga,
                    ],
                    function (tx, results) {
                        $("#tb_diesel").html(``);
                        swal("", "Actualizado correctamente", "success");
                        databaseHandler.db.transaction(
                            function (tx5) {
                                tx5.executeSql(
                                    "SELECT * FROM detalle_diesel WHERE id_cedula = ?",
                                    [id_cedula],
                                    function (tx5, results) {
                                        var length = results.rows.length;
                                        if (length == 0) {
                                            $("#message-nr").css("display", "block");
                                            $("#total_litros").html(`${numberWithCommas(0)}`);
                                        } else {
                                            $("#message-nr").css("display", "none");
                                            for (var i = 0; i < length; i++) {
                                                var item2 = results.rows.item(i);
                                                var no_bomba = "";
                                                item2.no_bomba ? (no_bomba = item2.no_bomba) : (no_bomba = 0);
                                                $("#tb_diesel").append(
                                                    `<tr><td>${item2.eco2}</td><td>${numberWithCommas(item2.carga_total)}</td><td>${numberWithCommas(
                                                        item2.odometro
                                                    )}</td><td>${no_bomba}</td><td>${
                                                        item2.tipo_carga
                                                    }</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${
                                                        item2.id_detalle
                                                    }','${item2.id_unidad}','${item2.eco}','${item2.carga_total}','${item2.odometro}','${
                                                        item2.no_bomba
                                                    }','${item2.almacen}','${item2.h_fin}','${item2.h_inicio}','${item2.jornada}','${
                                                        item2.operador
                                                    }','${item2.id_operador}','${item2.vueltas}','${item2.tipo_carga}','${item2.operador2}','${
                                                        item2.VIN
                                                    }','2','${
                                                        item2.eco2
                                                    }');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></tr>`
                                                );
                                            }
                                            databaseHandler.db.transaction(
                                                function (tx5) {
                                                    tx5.executeSql(
                                                        "SELECT SUM(carga_total) as carga_totales, COUNT(id_cedula) as cuentas FROM detalle_diesel WHERE id_cedula = ?",
                                                        [id_cedula],
                                                        function (tx5, results) {
                                                            var item3 = results.rows.item(0);
                                                            $("#total_litros").html(`${numberWithCommas(Number(item3.carga_totales).toFixed(2))}`);
                                                            $("#unidades_cargadas").html(`${item3.cuentas}`);
                                                            $("#tb_diesel").append(
                                                                `<tr id="row_totales" style="text-align: center;background-color: #005D99;color: white;font-weight: bold;"><th>Totales</th><th>${numberWithCommas(
                                                                    Number(item3.carga_totales).toFixed(2)
                                                                )}</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>`
                                                            );
                                                            $("#autocomplete").val("");
                                                            app.preloader.hide();
                                                            app.sheet.close("#sheet-modal-u");
                                                        },
                                                        function (tx5, error) {
                                                            console.error("Error: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {
                                                    console.error("Error: " + error.message);
                                                },
                                                function (error) {
                                                    console.error("Error: " + error.message);
                                                }
                                            );
                                        }
                                    },
                                    function (tx5, error) {
                                        console.error("Error: " + error.message);
                                    }
                                );
                            },
                            function (error) {
                                console.error("Error: " + error.message);
                            },
                            function (error) {
                                console.error("Error: " + error.message);
                            }
                        );
                    },
                    function (tx, error) {
                        console.error("Error: " + error.message);
                    }
                );
            },
            function (error) {
                console.error("Error: " + error.message);
            },
            function (error) {
                console.error("Error: " + error.message);
            }
        );
    } else {
        swal("", "La unidad no puede estar vacía", "warning");
    }
}

function FinalizarCargaDiesel() {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT COUNT(id_cedula) as cuenta FROM detalle_diesel WHERE id_cedula = ?",
                [id_cedula],
                function (tx5, results) {
                    var item = results.rows.item(0);
                    if (item.cuenta > 0) {
                        swal({
                            title: "Aviso",
                            text: "¿Estas seguro de querer finalizar la carga de Diesel?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((RESP) => {
                            if (RESP == true) {
                                var fecha = new Date();
                                var fecha_salida =
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
                                var estatus = 1;
                                databaseHandler.db.transaction(
                                    function (tx) {
                                        tx.executeSql(
                                            "UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                                            [fecha_salida, estatus, id_cedula],
                                            function (tx, results) {
                                                databaseHandler.db.transaction(
                                                    function (tx5) {
                                                        tx5.executeSql(
                                                            "SELECT SUM(carga_total) as carga_totales, COUNT(id_cedula) as cuentas FROM detalle_diesel WHERE id_cedula = ?",
                                                            [id_cedula],
                                                            function (tx5, results) {
                                                                var item3 = results.rows.item(0);
                                                                var fecha_fin = getDateWhitZeros();
                                                                var promedio = Number(item3.carga_totales / item3.cuentas).toFixed(2);
                                                                databaseHandler.db.transaction(
                                                                    function (tx) {
                                                                        tx.executeSql(
                                                                            "UPDATE datos_generales_diesel  SET carga_total  = ?,total_unidades = ?,unidades_cargadas = ?,promedio = ?, fecha_fin = ? WHERE id_cedula = ?",
                                                                            [
                                                                                Number(item3.carga_totales).toFixed(2),
                                                                                item3.cuentas,
                                                                                item3.cuentas,
                                                                                promedio,
                                                                                fecha_fin,
                                                                                id_cedula,
                                                                            ],
                                                                            function (tx, results) {
                                                                                window.location.href = "./menu.html";
                                                                            },
                                                                            function (tx, error) {
                                                                                swal("Error al guardar", error.message, "error");
                                                                            }
                                                                        );
                                                                    },
                                                                    function (error) {},
                                                                    function () {}
                                                                );
                                                            },
                                                            function (tx5, error) {
                                                                console.error("Error: " + error.message);
                                                            }
                                                        );
                                                    },
                                                    function (error) {
                                                        console.error("Error: " + error.message);
                                                    },
                                                    function (error) {
                                                        console.error("Error: " + error.message);
                                                    }
                                                );
                                            },
                                            function (tx, error) {
                                                swal("Error al guardar", error.message, "error");
                                            }
                                        );
                                    },
                                    function (error) {},
                                    function () {}
                                );
                            }
                        });
                    } else {
                        swal("", "No tienes aún unidades registradas.", "warning");
                    }
                },
                function (tx5, error) {
                    console.error("Error: " + error.message);
                }
            );
        },
        function (error) {
            console.error("Error: " + error.message);
        },
        function (error) {
            console.error("Error: " + error.message);
        }
    );
}

function check_hours_menores(hora1, hora2) {
    var horas1 = $("#" + hora1).val();
    var horas2 = $("#" + hora2).val();
    if (horas2 > horas1) {
    } else {
        swal("", "La hora fin no puede ser menor a la hora de inicio de carga.", "warning");
        $("#" + hora2).val("");
    }
}

//Consultas para lista
function cargarDiesel() {
    app.dialog.progress("Trabajando..", "red");
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var tipo = localStorage.getItem("Modulos");
    var url = localStorage.getItem("url");
    var Usuario = localStorage.getItem("Usuario");
    localStorage.getItem("TipoAcceso") == "admin" ? (Usuario = null) : null;
    if (localStorage.getItem("TipoAcceso") == "admin") {
        app.request.get(
            url + "/historial.php",
            {
                IdUsuario: IdU,
                tipo: tipo,
                empresa: id_empresa,
                Usuario: Usuario,
            },
            function (data) {
                var content = JSON.parse(data);
                if (content == 0) {
                    $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close();
                } else {
                    if (data == "null") {
                        $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                        app.dialog.close();
                    } else {
                        if (content.length > 0) {
                            var html = "";
                            var ids = new Array();
                            for (var e = 0; e < content.length; e++) {
                                var fecha = content[e].FechaCaptura.split(" ");
                                var id_interno = content[e].id_interno;
                                var id_intelesis = content[e].id_intelesis;
                                var estatusIntelisis = content[e].estatusIntelisis;
                                var procesado = false;
                                content[e].procesado == 2 || content[e].procesado == 3 ? (procesado = true) : (procesado = false);

                                id_interno ? (ids[e] = id_interno) : null;

                                if (estatusIntelisis == 2) {
                                    if (ids.length > 0) {
                                        if (ids.filter((x) => x === id_interno).length > 1) {
                                        } else {
                                            id_interno
                                                ? procesado
                                                    ? id_intelesis
                                                        ? (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                        : (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                        }
                                    } else {
                                        id_interno
                                            ? procesado
                                                ? id_intelesis
                                                    ? (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                    }
                                } else {
                                    if (ids.length > 0) {
                                        if (ids.filter((x) => x === id_interno).length > 1) {
                                        } else {
                                            id_interno
                                                ? procesado
                                                    ? id_intelesis
                                                        ? (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                        : (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                        }
                                    } else {
                                        id_interno
                                            ? procesado
                                                ? id_intelesis
                                                    ? (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                    }
                                }
                            }
                            $("#cedul").html(html);
                            app.dialog.close();
                        } else {
                            app.dialog.close();
                            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                        }
                    }
                }
            },
            function (xhr) {
                app.dialog.close();
                $(".preloader").remove();
                $("#content-page").css("display", "none");
                $("#nointernet-page").css("display", "block");
            }
        );
    } else {
        app.request.get(
            url + "/historial.php",
            {
                IdUsuario: IdU,
                tipo: tipo,
                empresa: id_empresa,
                Usuario: Usuario,
            },
            function (data) {
                var content = JSON.parse(data);
                if (content == 0) {
                    $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close();
                } else {
                    if (data == "null") {
                        $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                        app.dialog.close();
                    } else {
                        if (content.length > 0) {
                            var html = "";
                            var ids = new Array();
                            for (var e = 0; e < content.length; e++) {
                                var fecha = content[e].FechaCaptura.split(" ");
                                var id_interno = content[e].id_interno;
                                var id_intelesis = content[e].id_intelesis;
                                var estatusIntelisis = content[e].estatusIntelisis;
                                var procesado = false;
                                content[e].procesado == 2 || content[e].procesado == 3 ? (procesado = true) : (procesado = false);

                                id_interno ? (ids[e] = id_interno) : null;

                                if (ids.length > 0) {
                                    if (ids.filter((x) => x === id_interno).length > 1) {
                                    } else {
                                        id_interno
                                            ? procesado
                                                ? id_intelesis
                                                    ? (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                    }
                                } else {
                                    id_interno
                                        ? procesado
                                            ? id_intelesis
                                                ? (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                        : (html =
                                              html +
                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                }
                            }
                            $("#cedul").html(html);
                            app.dialog.close();
                        } else {
                            app.dialog.close();
                            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                        }
                    }
                }
            },
            function (xhr) {
                app.dialog.close();
                $(".preloader").remove();
                $("#content-page").css("display", "none");
                $("#nointernet-page").css("display", "block");
            }
        );
    }
}

function recarga_Diesel(mes_pdfs, year_pdfs) {
    app.dialog.progress("Trabajando..", "red");
    var IdU = localStorage.getItem("Usuario");
    var id_empresa = localStorage.getItem("empresa");
    var tipo = localStorage.getItem("Modulos");
    var url = localStorage.getItem("url");
    var Usuario = localStorage.getItem("Usuario");
    localStorage.getItem("TipoAcceso") == "admin" ? (Usuario = null) : null;
    if (localStorage.getItem("TipoAcceso") == "admin") {
        app.request.get(
            url + "/historial.php",
            {
                IdUsuario: IdU,
                tipo: tipo,
                empresa: id_empresa,
                mes_pdfs: mes_pdfs,
                year_pdfs: year_pdfs,
                Usuario: Usuario,
            },
            function (data) {
                var content = JSON.parse(data);
                if (content == 0) {
                    $("#cedul").html(`<tr><td colspan = "5"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close();
                } else {
                    if (data == "null") {
                        $("#cedul").html(`<tr><td colspan = "5"><span>No hay datos para mostrar</span></td></tr>`);
                        app.dialog.close();
                    } else {
                        if (content.length > 0) {
                            var html = "";
                            var ids = new Array();
                            for (var e = 0; e < content.length; e++) {
                                var fecha = content[e].FechaCaptura.split(" ");
                                var id_interno = content[e].id_interno;
                                var id_intelesis = content[e].id_intelesis;
                                var estatusIntelisis = content[e].estatusIntelisis;
                                var procesado = false;
                                content[e].procesado == 2 || content[e].procesado == 3 ? (procesado = true) : (procesado = false);

                                id_interno ? (ids[e] = id_interno) : null;

                                if (estatusIntelisis == 2) {
                                    if (ids.length > 0) {
                                        if (ids.filter((x) => x === id_interno).length > 1) {
                                        } else {
                                            id_interno
                                                ? procesado
                                                    ? id_intelesis
                                                        ? (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                        : (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                        }
                                    } else {
                                        id_interno
                                            ? procesado
                                                ? id_intelesis
                                                    ? (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                    }
                                } else {
                                    if (ids.length > 0) {
                                        if (ids.filter((x) => x === id_interno).length > 1) {
                                        } else {
                                            id_interno
                                                ? procesado
                                                    ? id_intelesis
                                                        ? (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].id_interno}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                        : (html =
                                                              html +
                                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                        }
                                    } else {
                                        id_interno
                                            ? procesado
                                                ? id_intelesis
                                                    ? (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis1('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #2ECC71;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="reprocesarIntelisis2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #E67E22;'><i class="material-icons md-light" style="font-size: 40px;">backup</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="procesarIntelesis('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #F1C40F;'><i class="material-icons md-light" style="font-size: 40px;">tap_and_play</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="corresponderRegistrosDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}','${content[e].estatusIntelisis}')" style='border: none; outline:none;color: #FF0037'><i class="material-icons md-light" style="font-size: 40px;">library_add</i></a> <a href='#' class="icons_diesel" onclick="viewDetailDiesel('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                    }
                                }
                            }
                            $("#cedul").html(html);
                            app.dialog.close();
                        } else {
                            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                            app.dialog.close();
                        }
                    }
                }
            },
            function (xhr) {
                app.dialog.close();
                $(".preloader").remove();
                $("#content-page").css("display", "none");
                $("#nointernet-page").css("display", "block");
            }
        );
    } else {
        app.request.get(
            url + "/historial.php",
            {
                IdUsuario: IdU,
                tipo: tipo,
                empresa: id_empresa,
                mes_pdfs: mes_pdfs,
                year_pdfs: year_pdfs,
                Usuario: Usuario,
            },
            function (data) {
                var content = JSON.parse(data);
                if (content == 0) {
                    $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                    app.dialog.close();
                } else {
                    if (data == "null") {
                        $("#cedul").html(`<tr><td colspan = "6"><span>No hay datos para mostrar</span></td></tr>`);
                        app.dialog.close();
                    } else {
                        if (content.length > 0) {
                            var html = "";
                            var ids = new Array();
                            for (var e = 0; e < content.length; e++) {
                                var fecha = content[e].FechaCaptura.split(" ");
                                var id_interno = content[e].id_interno;
                                var id_intelesis = content[e].id_intelesis;
                                var estatusIntelisis = content[e].estatusIntelisis;
                                var procesado = false;
                                content[e].procesado == 2 || content[e].procesado == 3 ? (procesado = true) : (procesado = false);

                                id_interno ? (ids[e] = id_interno) : null;

                                if (ids.length > 0) {
                                    if (ids.filter((x) => x === id_interno).length > 1) {
                                    } else {
                                        id_interno
                                            ? procesado
                                                ? id_intelesis
                                                    ? (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                    : (html =
                                                          html +
                                                          `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                    }
                                } else {
                                    id_interno
                                        ? procesado
                                            ? id_intelesis
                                                ? (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                                : (html =
                                                      html +
                                                      `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                            : (html =
                                                  html +
                                                  `<tr id="trc_${content[e].IdCte}"> <td class="td_input">&nbsp;</td> <td><span> ${content[e].id_interno} </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`)
                                        : (html =
                                              html +
                                              `<tr id="trc_${content[e].IdCte}"> <td class="td_input"><input type="checkbox" id="radioDiesel_${content[e].IdCte}" class="radio_diesel"></td> <td><span> N/A </span></td> <td><span>${content[e].Cliente}</span></td> <td><span>${fecha[0]}</span></td> <td><span>${content[e].nombre_usuario}</span></td> <td style="white-space: nowrap;"> <span> <a href='#' class="icons_diesel" onclick="viewDetailDiesel2('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)" style='border: none; outline:none;color: #005D99;margin-left: 30px;'><i class="material-icons md-light" style="font-size: 40px;">description</i></a> </span> </td> </tr>`);
                                }
                            }
                            $("#cedul").html(html);
                            app.dialog.close();
                        } else {
                            app.dialog.close();
                            $("#cedul").html(`<tr><td colspan = "3"><span>No hay datos para mostrar</span></td></tr>`);
                        }
                    }
                }
            },
            function (xhr) {
                app.dialog.close();
                $(".preloader").remove();
                $("#content-page").css("display", "none");
                $("#nointernet-page").css("display", "block");
            }
        );
    }
}

function corresponderRegistrosDiesel(IdCte, IdCedula, FechaCaptura) {
    $(".td_input").css("display", "table-cell");
    $(".div_button_diesel").css("display", "block");
    $(".radio_diesel").prop("checked", false);
    $("#diesel_IdCte").val(IdCte);
    $("#diesel_IdCedula").val(IdCedula);
    $("#diesel_FechaCaptura").val(FechaCaptura);
}

function viewDetailDiesel(IdCte, IdCedula, id_intelesis, type) {
    // nube verde ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_intelesis}',1)"
    // nube naranja ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)"
    // send amarillo ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].id_interno}',2)"
    // add rojo ('${content[e].IdCte}','${content[e].IdCedula}','${content[e].FechaCaptura}',3)"

    if (type == 3) {
        var ID_consulta = IdCte;
    } else {
        var ID_consulta = id_intelesis;
    }
    var typeConsulta = type;
    localStorage.setItem("ID_consulta", ID_consulta);
    localStorage.setItem("typeConsulta", typeConsulta);
    localStorage.setItem("IdCte", IdCte);
    app.views.main.router.back("/formDiesel2/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}

function viewDetailDiesel2(IdCte, IdCedula, id_intelesis, type) {
    if (type == 3) {
        var ID_consulta = IdCte;
        var typeConsulta = type;
        localStorage.setItem("ID_consulta", ID_consulta);
        localStorage.setItem("typeConsulta", typeConsulta);
        localStorage.setItem("IdCte", IdCte);
        app.views.main.router.back("/formDiesel3/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else {
        var ID_consulta = id_intelesis;
        var typeConsulta = type;
        localStorage.setItem("ID_consulta", ID_consulta);
        localStorage.setItem("typeConsulta", typeConsulta);
        localStorage.setItem("IdCte", IdCte);

        var datos = new Array();
        datos[0] = { ID_interno: ID_consulta };

        var url = localStorage.getItem("url");
        $.ajax({
            type: "POST",
            async: true,
            url: url + "/processDiesel.php?proceso=5&subProcess=1",
            dataType: "html",
            data: { datos: JSON.stringify(datos) },
            success: function (respuesta) {
                if (respuesta) {
                    var respu1 = respuesta.split("._.");
                    var dat1 = respu1[0];
                    var dat2 = respu1[1];
                    if (dat1 == "CEDULA") {
                        if (dat2 > 0) {
                            if (dat2 == 2) {
                                // the mov in intelisis is concluido
                                app.views.main.router.back("/formDiesel3/", {
                                    force: true,
                                    ignoreCache: true,
                                    reload: true,
                                });
                            } else {
                                // the mov in intelisis not is concluido
                                if (localStorage.getItem("TipoAcceso") == "admin") {
                                    app.views.main.router.back("/formDiesel2/", {
                                        force: true,
                                        ignoreCache: true,
                                        reload: true,
                                    });
                                } else {
                                    app.views.main.router.back("/formDiesel3/", {
                                        force: true,
                                        ignoreCache: true,
                                        reload: true,
                                    });
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
            error: function () {
                console.log("Error en la comunicacion con el servidor");
                swal("Error de comunicación a Internet", "", "error");
                $(".icons_diesel").css("pointer-events", "all");
            },
        });
    }
}

function actualizaCargaDiesel2() {
    if ($("#id_unidad_u").val()) {
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

        var eco2 = $("#title_unidad_u").text();
        eco2 = eco2.replace("Unidad: ", "");

        var url = localStorage.getItem("url");
        var datos = new Array();

        var Evento = "UPDATE";
        var Fecha = getDateWhitZeros().replace(" ", "T");
        var ID_Usuario = localStorage.getItem("Usuario");
        var Nombre_Usuario = localStorage.getItem("nombre");
        var Origen = "Mobile";
        var Version_App = localStorage.getItem("version");
        var id_empresa = localStorage.getItem("empresa");

        datos[0] = {
            id_cedula: id_cedula,
            h_inicio: h_inicio,
            h_fin: h_fin,
            id_carga: id_carga,
            carga: carga,
            odometro: odometro,
            bomba: bomba,
            almacen: almacen,
            jornada: jornada,
            operador: operador,
            id_operador: id_operador,
            vueltas: vueltas,
            tipo_carga: tipo_carga,
            operador2: operador2,
            ID_interno: id_carga,
            Evento: Evento,
            Fecha: Fecha,
            ID_Usuario: ID_Usuario,
            Nombre_Usuario: Nombre_Usuario,
            Origen: Origen,
            Version_App: Version_App,
            ID_cabeceros: id_carga,
            id_empresa: id_empresa,
            id_unidad: id_unidad,
            eco: eco,
            eco2: eco2,
            VIN: VIN,
        };

        $.ajax({
            type: "POST",
            async: true,
            url: url + "/processDiesel.php?proceso=2",
            dataType: "html",
            data: { datos: JSON.stringify(datos) },
            success: function (respuesta) {
                if (respuesta) {
                    var respu1 = respuesta.split("._.");
                    var dat1 = respu1[0];
                    var dat2 = respu1[1];
                    if (dat1 == "CEDULA") {
                        if (dat2 > 0) {
                            app.sheet.close("#sheet-modal-u");
                            swal("Actualizado", "", "success");
                            $("#trdiesel_" + id_carga).html(`<td>${eco2}</td><td>${numberWithCommas(carga)}</td><td>${numberWithCommas(
                                odometro
                            )}</td><td>${bomba}</td><td>${tipo_carga}</td><td> 
                            <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${id_carga}','${id_unidad}','${eco}','${carga}','${odometro}','${bomba}','${almacen}','${h_fin}','${h_inicio}','${jornada}','${operador}','${id_operador}','${vueltas}','${tipo_carga}','${operador2}','${VIN}','3','${eco2}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button>
                            <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="borrarCargaDiesel('${id_carga}','${id_unidad}','${eco}','${carga}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>delete_forever</i></button>
                            </td>`);
                            var carga_total_diesel = Number($("#carga_total_diesel").val());
                            carga_total_diesel ? null : (carga_total_diesel = 0);
                            carga_total_diesel = Number(carga_total_diesel - carga_back);
                            carga_total_diesel = Number(carga_total_diesel + Number(carga));
                            $("#carga_total_diesel").val(carga_total_diesel);
                            $("#text_carga_Diesel").html(numberWithCommas(carga_total_diesel));
                        }
                    }
                }
            },
            error: function () {
                console.log("Error en la comunicacion con el servidor");
            },
        });
    } else {
        swal("", "La unidad no puede estar vacía", "warning");
    }
}

function reprocesarIntelisis1(IdCte, IdCedula, id_intelesis, estatus_intelesis) {
    //Procesa con id de intelesis
    //console.log('Reprocesa1', IdCte, IdCedula, id_intelesis);
    $(".icons_diesel").css("pointer-events", "none");
    swal("Procesando....", "", "success");
    var ID_interno = id_intelesis;
    var Evento = "Reproceso intelesis con ID de intelesis";
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = "Mobile";
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCedula;
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {
        ID_interno: ID_interno,
        Evento: Evento,
        Fecha: Fecha,
        ID_Usuario: ID_Usuario,
        Nombre_Usuario: Nombre_Usuario,
        Origen: Origen,
        Version_App: Version_App,
        ID_cabeceros: ID_cabeceros,
        id_empresa: id_empresa,
        estatus_intelesis: estatus_intelesis,
    };

    // console.log(datos);
    $.ajax({
        type: "POST",
        async: true,
        url: url + "/processDiesel.php?proceso=5&subProcess=1",
        dataType: "html",
        data: { datos: JSON.stringify(datos) },
        success: function (respuesta) {
            if (respuesta) {
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if (dat1 == "CEDULA") {
                    if (dat2 > 0) {
                        if (dat2 == 2) {
                            swal("Este registro ya no se puede reprocesar", "", "warning");
                            $(".icons_diesel").css("pointer-events", "all");
                            var mes_pdfs = $(".mes_pdfs").val();
                            var year_pdfs = $("#year").val();
                            recarga_Diesel(mes_pdfs, year_pdfs);
                        } else if (dat2 == 4) {
                            swal("Este registro ya no se puede reprocesar", "", "warning");
                            $(".icons_diesel").css("pointer-events", "all");
                            var mes_pdfs = $(".mes_pdfs").val();
                            var year_pdfs = $("#year").val();
                            recarga_Diesel(mes_pdfs, year_pdfs);
                        } else {
                            swal("Trabajando en el reproceso...", "", "warning");
                            $.ajax({
                                type: "POST",
                                async: true,
                                url: url + "/processDiesel.php?proceso=5&subProcess=2&estatusIntel=" + dat2,
                                dataType: "html",
                                data: { datos: JSON.stringify(datos) },
                                success: function (respuesta) {
                                    if (respuesta) {
                                        var respu1 = respuesta.split("._.");
                                        var dat1 = respu1[0];
                                        var dat2 = respu1[1];
                                        if (dat1 == "CEDULA") {
                                            if (dat2 > 0) {
                                                swal("Completado", "", "success");
                                                $(".icons_diesel").css("pointer-events", "all");
                                                var mes_pdfs = $(".mes_pdfs").val();
                                                var year_pdfs = $("#year").val();
                                                recarga_Diesel(mes_pdfs, year_pdfs);
                                            } else {
                                                AlmacenarError(respuesta);
                                            }
                                        } else {
                                            AlmacenarError(respuesta);
                                        }
                                    }
                                },
                                error: function () {
                                    console.log("Error en la comunicacion con el servidor");
                                    swal("Error de comunicación a Internet", "", "error");
                                    $(".icons_diesel").css("pointer-events", "all");
                                },
                            });
                        }
                        //swal("Aún existe el registro en Intelisis","","warning");
                    } else if (dat2 == 0) {
                        // AlmacenarError(respuesta);
                        swal("Algo salió mal intenta más tarde.", "", "warning");
                        $(".icons_diesel").css("pointer-events", "all");
                    }
                } else {
                    AlmacenarError(respuesta);
                    swal("Algo salió mal intenta más tarde.", "", "warning");
                    $(".icons_diesel").css("pointer-events", "all");
                }
            }
        },
        error: function () {
            console.log("Error en la comunicacion con el servidor");
        },
    });
}

function reprocesarIntelisis2(IdCte, IdCedula, id_intelesis, estatus_intelesis) {
    //Procesa cuando no se competo la carga
    //console.log('Reprocesa2', IdCte, IdCedula, id_intelesis);
    $(".icons_diesel").css("pointer-events", "none");
    swal("Procesando....", "", "success");
    var ID_interno = id_intelesis; // id interno en 305
    var Evento = "Reproceso Intelesis incompleto";
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = "Mobile";
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCte; // ID autoincrementable 305
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {
        ID_interno: ID_interno,
        Evento: Evento,
        Fecha: Fecha,
        ID_Usuario: ID_Usuario,
        Nombre_Usuario: Nombre_Usuario,
        Origen: Origen,
        Version_App: Version_App,
        ID_cabeceros: ID_cabeceros,
        id_empresa: id_empresa,
        estatus_intelesis: estatus_intelesis,
    };

    console.log(datos);
    $.ajax({
        type: "POST",
        async: true,
        url: url + "/processDiesel.php?proceso=4",
        dataType: "html",
        data: { datos: JSON.stringify(datos) },
        success: function (respuesta) {
            if (respuesta) {
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if (dat1 == "CEDULA") {
                    if (dat2 > 0) {
                        swal("Completado", "", "success");
                        $(".icons_diesel").css("pointer-events", "all");
                        var mes_pdfs = $(".mes_pdfs").val();
                        var year_pdfs = $("#year").val();
                        recarga_Diesel(mes_pdfs, year_pdfs);
                    } else {
                        AlmacenarError(respuesta);
                    }
                } else {
                    AlmacenarError(respuesta);
                }
            }
        },
        error: function () {
            console.log("Error en la comunicacion con el servidor");
            swal("Error de comunicación a Internet", "", "error");
            $(".icons_diesel").css("pointer-events", "all");
        },
    });
}

function procesarIntelesis(IdCte, IdCedula, id_interno, estatus_intelesis) {
    //console.log('Procesa', IdCte, IdCedula, nid_interno);
    $(".icons_diesel").css("pointer-events", "none");
    swal("Procesando....", "", "");
    var ID_interno = id_interno;
    var Evento = "Procesa a Intelisis";
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = "Mobile";
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCte;
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {
        ID_interno: ID_interno,
        Evento: Evento,
        Fecha: Fecha,
        ID_Usuario: ID_Usuario,
        Nombre_Usuario: Nombre_Usuario,
        Origen: Origen,
        Version_App: Version_App,
        ID_cabeceros: ID_cabeceros,
        id_empresa: id_empresa,
        estatus_intelesis: estatus_intelesis,
    };

    // console.log(datos);
    $.ajax({
        type: "POST",
        async: true,
        url: url + "/processDiesel.php?proceso=3",
        dataType: "html",
        data: { datos: JSON.stringify(datos) },
        success: function (respuesta) {
            if (respuesta) {
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if (dat1 == "CEDULA") {
                    if (dat2 > 0) {
                        swal("Completado", "", "success");
                        $(".icons_diesel").css("pointer-events", "all");
                        var mes_pdfs = $(".mes_pdfs").val();
                        var year_pdfs = $("#year").val();
                        recarga_Diesel(mes_pdfs, year_pdfs);
                    } else {
                        AlmacenarError(respuesta);
                    }
                } else {
                    AlmacenarError(respuesta);
                }
            }
        },
        error: function () {
            console.log("Error en la comunicacion con el servidor");
            swal("Error de comunicación a Internet", "", "error");
            $(".icons_diesel").css("pointer-events", "all");
        },
    });
}

function regresaDiesel() {
    app.views.main.router.back("/formDiesel1/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}

function guardarUnion() {
    var campos;
    campos = document.querySelectorAll(".radio_diesel");
    var valido = false;
    var ids = "";

    [].slice.call(campos).forEach(function (campo) {
        if (campo.checked == true) {
            valido = true;
            ids += "," + campo.id.replace("radioDiesel_", "");
        }
    });
    const quita_coma = ids.slice(1);

    if (valido) {
        // console.log(quita_coma);
        $(".td_input").css("display", "none");
        $(".div_button_diesel").css("display", "none");
        $(".radio_diesel").prop("checked", false);
        enviaUnion($("#diesel_IdCte").val(), $("#diesel_IdCedula").val(), $("#diesel_FechaCaptura").val(), quita_coma);
    } else {
        swal("", "Debes seleccionar al menos una opción", "warning");
    }
}

function enviaUnion(IdCte, IdCedula, FechaCaptura, ids) {
    swal("Uniendo....", "", "");
    $(".icons_diesel").css("pointer-events", "none");
    var ID_interno = IdCte;
    var Evento = "Unión de cargas";
    var Fecha = getDateWhitZeros().replace(" ", "T");
    var ID_Usuario = localStorage.getItem("Usuario");
    var Nombre_Usuario = localStorage.getItem("nombre");
    var Origen = "Mobile";
    var Version_App = localStorage.getItem("version");
    var ID_cabeceros = IdCte;
    var id_empresa = localStorage.getItem("empresa");
    var url = localStorage.getItem("url");

    var datos = new Array();
    datos[0] = {
        ID_interno: ID_interno,
        ids: ids,
        Evento: Evento,
        Fecha: Fecha,
        ID_Usuario: ID_Usuario,
        Nombre_Usuario: Nombre_Usuario,
        Origen: Origen,
        Version_App: Version_App,
        ID_cabeceros: ID_cabeceros,
        id_empresa: id_empresa,
    };

    $.ajax({
        type: "POST",
        async: true,
        url: url + "/processDiesel.php?proceso=1",
        dataType: "html",
        data: { datos: JSON.stringify(datos) },
        success: function (respuesta) {
            if (respuesta) {
                var respu1 = respuesta.split("._.");
                var dat1 = respu1[0];
                var dat2 = respu1[1];
                if (dat1 == "CEDULA") {
                    if (dat2 > 0) {
                        swal("Unión completa", "", "success");
                        $(".icons_diesel").css("pointer-events", "all");

                        var mes_pdfs = $(".mes_pdfs").val();
                        var year_pdfs = $("#year").val();
                        recarga_Diesel(mes_pdfs, year_pdfs);
                    } else {
                        AlmacenarError(respuesta);
                    }
                } else {
                    AlmacenarError(respuesta);
                }
            }
        },
        error: function () {
            console.log("Error en la comunicacion con el servidor");
            swal("Error de comunicación a Internet", "", "error");
            $(".icons_diesel").css("pointer-events", "all");
        },
    });
}

// funcion para sumar 1 minute
var add_minutes = function (dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
};

function agregaCarga2() {
    if ($("#carga").val() && $("#odometro").val()) {
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
        var eco2 = $("#title_unidad").text();
        eco2 = eco2.replace("Unidad: ", "");
        var procesado = 0;
        var id_interno = localStorage.getItem("ID_consulta");

        var url = localStorage.getItem("url");
        var datos = new Array();

        var Evento = "INSERT";
        var Fecha = getDateWhitZeros().replace(" ", "T");
        var ID_Usuario = localStorage.getItem("Usuario");
        var Nombre_Usuario = localStorage.getItem("nombre");
        var Origen = "Mobile";
        var Version_App = localStorage.getItem("version");
        var id_empresa = localStorage.getItem("empresa");
        var typeConsulta = localStorage.getItem("typeConsulta");

        datos[0] = {
            id_cedula: id_cedula,
            typeConsulta: typeConsulta,
            carga_total: carga_total,
            odometro: odometro,
            fecha_carga: fecha_carga,
            no_bomba: no_bomba,
            tipo_carga: tipo_carga,
            almacen: almacen,
            operador: operador,
            id_operador: id_operador,
            jornada: jornada,
            vueltas: vueltas,
            h_inicio: h_inicio,
            h_fin: h_fin,
            operador2: operador2,
            VIN: VIN,
            id_unidad: id_unidad,
            eco: eco,
            eco2: eco2,
            procesado: procesado,
            ID_interno: id_interno,
            Evento: Evento,
            Fecha: Fecha,
            ID_Usuario: ID_Usuario,
            Nombre_Usuario: Nombre_Usuario,
            Origen: Origen,
            Version_App: Version_App,
            id_empresa: id_empresa,
            ID_cabeceros: id_cedula,
        };

        $.ajax({
            type: "POST",
            async: true,
            url: url + "/processDiesel.php?proceso=7",
            dataType: "html",
            data: { datos: JSON.stringify(datos) },
            success: function (respuesta) {
                if (respuesta) {
                    var respu1 = respuesta.split("._.");
                    var dat1 = respu1[0];
                    var dat2 = respu1[1];
                    if (dat1 == "CEDULA") {
                        if (dat2 > 0) {
                            $("#autocomplete").val("");
                            $("#btn_llamarUnidad").removeData();
                            app.sheet.close("#sheet-modal");
                            swal("Agregado", "", "success");
                            $("#disesl_detalle").append(`<tr id="trdiesel_${dat2}"><td>${eco2}</td><td>${numberWithCommas(
                                carga_total
                            )}</td><td>${numberWithCommas(odometro)}</td><td>${no_bomba}</td><td>${tipo_carga}</td><td> 
                                <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="editarCargaDiesel('${dat2}','${id_unidad}','${eco}','${carga_total}','${odometro}','${no_bomba}','${almacen}','${h_fin}','${h_inicio}','${jornada}','${operador}','${id_operador}','${vueltas}','${tipo_carga}','${operador2}','${VIN}','3','${eco2}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button>
                                <button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick="borrarCargaDiesel('${dat2}','${id_unidad}','${eco}','${carga_total}');"><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>delete_forever</i></button>
                            </td></tr>`);
                            var carga_total_diesel = Number($("#carga_total_diesel").val());
                            carga_total_diesel ? null : (carga_total_diesel = 0);
                            carga_total_diesel = Number(carga_total_diesel + Number(carga_total));
                            carga_total_diesel = Number(carga_total_diesel).toFixed(2);
                            $("#carga_total_diesel").val(carga_total_diesel);
                            $("#text_carga_Diesel").html(numberWithCommas(carga_total_diesel));

                            let text_unidades_cargadas = Number($("#text_unidades_cargadas").text());
                            text_unidades_cargadas++;
                            $("#text_unidades_cargadas").html(text_unidades_cargadas);
                        }
                    }
                }
            },
            error: function () {
                console.log("Error en la comunicacion con el servidor");
            },
        });
    } else {
        swal("", "Debes llenar los campos de litros cargados y el odometro para poder guardar", "warning");
    }
}
function borrarCargaDiesel(id, id_unidad, eco, carga) {
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer eliminar este registro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            console.log(id);
            var Evento = "DELETE";
            var Fecha = getDateWhitZeros().replace(" ", "T");
            var ID_Usuario = localStorage.getItem("Usuario");
            var Nombre_Usuario = localStorage.getItem("nombre");
            var Origen = "Mobile";
            var Version_App = localStorage.getItem("version");
            var id_empresa = localStorage.getItem("empresa");
            var typeConsulta = localStorage.getItem("typeConsulta");
            var ID_consulta = localStorage.getItem("ID_consulta");

            var url = localStorage.getItem("url");
            var datos = new Array();

            datos[0] = {
                id_cedula: id,
                typeConsulta: typeConsulta,
                ID_interno: ID_consulta,
                Evento: Evento,
                Fecha: Fecha,
                ID_Usuario: ID_Usuario,
                Nombre_Usuario: Nombre_Usuario,
                Origen: Origen,
                Version_App: Version_App,
                id_empresa: id_empresa,
                ID_cabeceros: id,
            };

            console.log(datos);

            $.ajax({
                type: "POST",
                async: true,
                url: url + "/processDiesel.php?proceso=8",
                dataType: "html",
                data: { datos: JSON.stringify(datos) },
                success: function (respuesta) {
                    if (respuesta) {
                        var respu1 = respuesta.split("._.");
                        var dat1 = respu1[0];
                        var dat2 = respu1[1];
                        if (dat1 == "CEDULA") {
                            if (dat2 > 0) {
                                swal("Eliminado correctamente", "", "success");
                                $("#trdiesel_" + id).remove();
                                var carga_total_diesel = Number($("#carga_total_diesel").val());
                                carga_total_diesel ? null : (carga_total_diesel = 0);
                                carga_total_diesel = Number(carga_total_diesel - Number(carga));
                                $("#carga_total_diesel").val(carga_total_diesel);
                                $("#text_carga_Diesel").html(numberWithCommas(carga_total_diesel));

                                let text_unidades_cargadas = Number($("#text_unidades_cargadas").text());
                                text_unidades_cargadas = text_unidades_cargadas - 1;
                                $("#text_unidades_cargadas").html(text_unidades_cargadas);
                            }
                        }
                    }
                },
                error: function () {
                    console.log("Error en la comunicacion con el servidor");
                },
            });
        }
    });
}
function prepreingresoDiesel() {
    $("#demo-calendar-modal1").trigger("click");
}
//Fin Diesel
