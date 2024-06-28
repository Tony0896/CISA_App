//Inicio Recaudo
function iniciarRecaudo() {
    var id_usuario = localStorage.getItem("Usuario");
    var nombre_usuario = localStorage.getItem("nombre");
    var fecha_llegada = getDateWhitZeros();
    var horario_programado = fecha_llegada;
    var nombre_cliente = "Recaudo";
    var estatus = 0;
    var geolocation = "";
    var id_cliente = localStorage.getItem("empresa");
    var tipo_cedula = "Recaudo";
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
                    productHandler.addDatosGenerales_Recaudo(id_cedula, fecha_llegada, id_usuario, id_cliente);
                    app.views.main.router.navigate({ name: "yallegueRecaudo" });
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
function recaudarUnidad() {
    if ($("#id_unidad").val()) {
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
                        if (item.id_cedula) {
                            swal({
                                title: "Aviso",
                                text: "Esta unidad ya se encuentra en este recaudo. ¿Quieres hacer otro recaudo de la unidad?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            }).then((RESP) => {
                                if (RESP == true) {
                                    productHandler.addDetalle_Recaudo(
                                        id_cedula,
                                        id_unidad,
                                        eco,
                                        fecha,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0
                                    );
                                    databaseHandler.db.transaction(
                                        function (tx) {
                                            tx.executeSql(
                                                "Select MAX(id_detalle) as Id from detalle_recaudo Where id_cedula = ?",
                                                [id_cedula],
                                                function (tx, results) {
                                                    var item = results.rows.item(0);
                                                    localStorage.setItem("IdDetalle", item.Id);
                                                    app.views.main.router.back("/formRecaudo1/", {
                                                        force: true,
                                                        ignoreCache: true,
                                                        reload: true,
                                                    });
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
                    function (tx, error) {
                        console.log("Error al guardar cedula: 2" + error.message);
                    }
                );
            },
            function (error) {
                productHandler.addDetalle_Recaudo(
                    id_cedula,
                    id_unidad,
                    eco,
                    fecha,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                );
                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "Select MAX(id_detalle) as Id from detalle_recaudo Where id_cedula = ?",
                            [id_cedula],
                            function (tx, results) {
                                var item = results.rows.item(0);
                                localStorage.setItem("IdDetalle", item.Id);
                                app.views.main.router.back("/formRecaudo1/", {
                                    force: true,
                                    ignoreCache: true,
                                    reload: true,
                                });
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
            function (error) {
                console.log("Error al guardar cedula: 4" + error.message);
            }
        );
    } else {
        swal("", "No haz seleccionado una unidad", "warning");
    }
}
function FinalizarRecaudo() {
    if ($("#recaudo_momento").val()) {
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
                var total_unidades = $("#fin_recaudo").data("total_unidades"); //
                var unidades_recaudads = $("#fin_recaudo").data("unidades_recaudads"); //

                var pico1 = $("#fin_recaudo").data("pico1"); //pico de monedas de $1
                var pico2 = $("#fin_recaudo").data("pico2"); //pico de monedas de $2
                var pico5 = $("#fin_recaudo").data("pico5"); //pico de monedas de $5
                var pico10 = $("#fin_recaudo").data("pico10"); //pico de monedas de $10
                var pico50c = $("#fin_recaudo").data("pico50c"); //pico de monedas de $50c

                var promedio = $("#fin_recaudo").data("promedio"); //promedio de recaudo
                var recaudo_sin_billetes = $("#fin_recaudo").data("recaudo_sin_billetes"); //total sin billetes
                var recaudo_total = $("#fin_recaudo").data("recaudo_total"); // recaudo total + total cacharpa si hay
                var total_billetes = $("#fin_recaudo").data("total_billetes"); //suma de los billetes

                var id_cedula = localStorage.getItem("IdCedula");

                databaseHandler.db.transaction(
                    function (tx) {
                        tx.executeSql(
                            "UPDATE datos_generales_recaudo SET bolsa1 = ?, bolsa2 = ?, bolsa5 = ?, bolsa10 = ?, bolsa50c = ?, bolsas_totales = ?, monto1 = ?, total_unidades = ?, unidades_recaudads = ?, pico1 = ?, pico2 = ?, pico5 = ?, pico10 = ?, pico50c = ?, promedio = ?, recaudo_sin_billetes = ?, recaudo_total = ?, total_billetes = ? WHERE id_cedula = ?",
                            [
                                bolsa1,
                                bolsa2,
                                bolsa5,
                                bolsa10,
                                bolsa50c,
                                bolsas_totales,
                                monto1,
                                total_unidades,
                                unidades_recaudads,
                                pico1,
                                pico2,
                                pico5,
                                pico10,
                                pico50c,
                                promedio,
                                recaudo_sin_billetes,
                                recaudo_total,
                                total_billetes,
                                id_cedula,
                            ],
                            function (tx, results) {
                                app.views.main.router.back("/formRecaudo2/", {
                                    force: true,
                                    ignoreCache: true,
                                    reload: true,
                                });
                            },
                            function (tx, error) {
                                console.error("Error al guardar cierre: " + error.message);
                            }
                        );
                    },
                    function (error) {},
                    function () {}
                );
            }
        });
    } else {
        swal("", "Aún no haz recaudado para poder finalizar", "warning");
    }
}
function editarUnidadRecaudo(id) {
    localStorage.setItem("IdDetalle", id);
    app.views.main.router.back("/formRecaudo1/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}

function editarMonedaRecaudo(id_detalle, monedabd) {
    modalCantidad(monedabd);
}
function modalCantidad(val) {
    var ruta = "";
    var clase = "";
    var texto = "";
    var valor = 0;
    if (val == 0) {
        ruta = "img/currency/50c.png";
        clase = "moneda_mx";
        texto = "monedas";
        valor = 0.5;
    } else if (val == 1) {
        ruta = "img/currency/1.png";
        clase = "moneda_mx";
        texto = "monedas";
        valor = 1;
    } else if (val == 2) {
        ruta = "img/currency/2.png";
        clase = "moneda_mx";
        texto = "monedas";
        valor = 2;
    } else if (val == 5) {
        ruta = "img/currency/5.png";
        clase = "moneda_mx";
        texto = "monedas";
        valor = 5;
    } else if (val == 10) {
        ruta = "img/currency/10.png";
        clase = "moneda_mx";
        texto = "monedas";
        valor = 10;
    } else if (val == 20) {
        ruta = "img/currency/20.png";
        clase = "billete_mx";
        texto = "billetes";
        valor = 20;
    } else if (val == 50) {
        ruta = "img/currency/50.png";
        clase = "billete_mx";
        texto = "billetes";
        valor = 50;
    } else if (val == 100) {
        ruta = "img/currency/100.png";
        clase = "billete_mx";
        texto = "billetes";
        valor = 100;
    } else if (val == 200) {
        ruta = "img/currency/200.png";
        clase = "billete_mx";
        texto = "billetes";
        valor = 200;
    } else if (val == 500) {
        ruta = "img/currency/500.png";
        clase = "billete_mx";
        texto = "billetes";
        valor = 500;
    }
    var popEvidencia = app.popup.create({
        content:
            `
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
                        <img src="` +
            ruta +
            `" alt="" class="` +
            clase +
            `">
                    </a>
                </div>

                <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;"> 
                    <span class="span FWM-span-form" style="color: #005D99;">Ingresa la cantidad de pzas.</span>
                    <input type="text" class="FWM-input" id="recuento" readonly>
                    <input type="hidden" id="valor" value="` +
            valor +
            `">
                    <input type="hidden" id="importe2">
                    <span class="span FWM-span-form" style="color: #FF0037;" id="importe">0 ` +
            texto +
            ` es = $0.00</span>
                    
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
        swipeToClose: false,
        closeByOutsideClick: false,
        closeByBackdropClick: false,
        closeOnEscape: false,
        on: {
            open: function (popup) {
                $("#close_sheet").click(function () {
                    if ($("#pasa").val() != 0) {
                        app.sheet.close("#sheet-modal");
                    } else {
                        swal({
                            title: "Aviso",
                            text: "Aún no seleccionas o guardas una opción, ¿Estas seguro que deseas regresar?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: false,
                        }).then((willGoBack) => {
                            if (willGoBack) {
                                var otherCheck = "radio" + id + "-2";
                                document.getElementById(otherCheck).checked = false;
                                var Check = "radio" + id + "-1";
                                document.getElementById(Check).checked = true;
                                var labels1 = Check.replace("radio", "label");
                                var labels2 = otherCheck.replace("radio", "label");
                                $("#" + labels1).addClass("checked");
                                $("#" + labels2).removeClass("checked");
                                actualizacheck(Check);
                                app.sheet.close("#sheet-modal");
                            }
                        });
                    }
                });
            },
        },
    });

    popEvidencia.open();
}
function finRecaudoUnidad() {
    if ($("#id_unidad").val()) {
        var eco = $("#autocomplete-dropdown-ajax").val();
        var id_detalle = localStorage.getItem("IdDetalle");
        var id_cedula = localStorage.getItem("IdCedula");
        var id_unidad = $("#id_unidad").val();
        databaseHandler.db.transaction(
            function (tx5) {
                tx5.executeSql(
                    "SELECT id_cedula FROM detalle_recaudo WHERE id_cedula = ? AND eco = ? ",
                    [id_cedula, eco],
                    function (tx5, results) {
                        var length = results.rows.length;
                        if (length > 0) {
                            swal({
                                title: "Aviso",
                                text: "Ya existe una unidad recaudada con este eco, ¿Deseas aún así hacer el cambio?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack) {
                                    databaseHandler.db.transaction(
                                        function (tx) {
                                            tx.executeSql(
                                                "UPDATE detalle_recaudo SET eco = ?, id_unidad = ? WHERE id_cedula = ? AND id_detalle = ?",
                                                [eco, id_unidad, id_cedula, id_detalle],
                                                function (tx, results) {
                                                    swal("", "Unidad actualizada correctamente", "success");
                                                    app.views.main.router.back("/yallegueRecaudo/", {
                                                        force: true,
                                                        ignoreCache: true,
                                                        reload: true,
                                                    });
                                                },
                                                function (tx, error) {
                                                    console.error("Error al guardar cierre: " + error.message);
                                                }
                                            );
                                        },
                                        function (error) {},
                                        function () {}
                                    );
                                }
                            });
                        } else {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE detalle_recaudo SET eco = ?, id_unidad = ? WHERE id_cedula = ? AND id_detalle = ?",
                                        [eco, id_unidad, id_cedula, id_detalle],
                                        function (tx, results) {
                                            swal("", "Unidad actualizada correctamente", "success");
                                            app.views.main.router.back("/yallegueRecaudo/", {
                                                force: true,
                                                ignoreCache: true,
                                                reload: true,
                                            });
                                        },
                                        function (tx, error) {
                                            console.error("Error al guardar cierre: " + error.message);
                                        }
                                    );
                                },
                                function (error) {},
                                function () {}
                            );
                        }
                    },
                    function (tx5, error) {
                        console.error("Error al consultar bandeja de salida: " + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    } else {
        app.views.main.router.back("/yallegueRecaudo/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    }
}

function regresaRecaudo(val) {
    if (val == 1) {
        app.views.main.router.back("/yallegueRecaudo/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else if (val == 2) {
        app.views.main.router.back("/yallegueRecaudo/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    }
}

function calculadora(valor) {
    var cuenta = $("#recuento").val();
    if (valor == "borra") {
        cuenta = cuenta.substring(0, cuenta.length - 1);
    } else if (valor == "termina") {
        if ($("#recuento").val()) {
            guardarMoneda($("#recuento").val(), $("#importe2").val(), $("#valor").val());
        } else {
            swal({
                title: "Aún no haz ingresado la cantidad de piezas",
                text: 'Si quieres reiniciar la cantidad en 0 da en "ok" de lo contrario en "cancelar"',
                icon: "warning",
                buttons: true,
                dangerMode: false,
            }).then((willGoBack) => {
                if (willGoBack) {
                    guardarMoneda(0, 0, $("#valor").val());
                }
            });
        }
    } else if (valor == 0) {
        if ($("#recuento").val()) {
            cuenta = cuenta + valor;
        }
    } else {
        cuenta = cuenta + valor;
    }
    $("#recuento").val(cuenta);
    var moneda = parseFloat($("#valor").val());
    var importe = parseFloat(cuenta) * moneda;
    if (!isNaN(importe)) {
        if (
            $("#valor").val() == "0.5" ||
            $("#valor").val() == "1" ||
            $("#valor").val() == "2" ||
            $("#valor").val() == "5" ||
            $("#valor").val() == "10"
        ) {
            $("#importe").html(numberWithCommas(cuenta) + " monedas es = $" + numberWithCommas(importe));
            $("#importe2").val(importe);
        } else if (
            $("#valor").val() == "20" ||
            $("#valor").val() == "50" ||
            $("#valor").val() == "100" ||
            $("#valor").val() == "200" ||
            $("#valor").val() == "500"
        ) {
            $("#importe").html(numberWithCommas(cuenta) + " billetes es = $" + numberWithCommas(importe));
            $("#importe2").val(importe);
        }
    } else {
        if (
            $("#valor").val() == ".5" ||
            $("#valor").val() == "1" ||
            $("#valor").val() == "2" ||
            $("#valor").val() == "5" ||
            $("#valor").val() == "10"
        ) {
            $("#importe").html(0 + " monedas es = $0.00");
            $("#importe2").val(0);
        } else if (
            $("#valor").val() == "20" ||
            $("#valor").val() == "50" ||
            $("#valor").val() == "100" ||
            $("#valor").val() == "200" ||
            $("#valor").val() == "500"
        ) {
            $("#importe").html(0 + " billetes es = $0.00");
            $("#importe2").val(0);
        }
    }
}

function guardarMoneda(piezas, importe, moneda) {
    var id_detalle = localStorage.getItem("IdDetalle");
    var id_cedula = localStorage.getItem("IdCedula");
    if (moneda == "0.5") {
        var modedabd = "Moneda50c";
        var importebd = "importe50c";
        var newMoneda = 1;
    } else {
        var modedabd = "Moneda" + moneda;
        var importebd = "importe" + moneda;
        if (moneda == 1) {
            var newMoneda = 2;
        } else if (moneda == 2) {
            var newMoneda = 5;
        } else if (moneda == 5) {
            var newMoneda = 10;
        } else if (moneda == 10) {
            var newMoneda = 20;
        } else if (moneda == 20) {
            var newMoneda = 50;
        } else if (moneda == 50) {
            var newMoneda = 100;
        } else if (moneda == 100) {
            var newMoneda = 200;
        } else if (moneda == 200) {
            var newMoneda = 500;
        } else {
            var newMoneda = "";
        }
    }

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE detalle_recaudo SET " + modedabd + " = ?, " + importebd + " = ? WHERE id_cedula = ? AND id_detalle = ?",
                [piezas, importe, id_cedula, id_detalle],
                function (tx, results) {
                    app.sheet.close("#sheet-modal");
                    // swal("","Guardado correctamente.","success");
                    setTimeout(function () {
                        // swal.close();
                        // if(newMoneda){
                        modalCantidad(newMoneda);
                        // }
                    }, 400);
                    $("#tb_recaudo").empty();
                    databaseHandler.db.transaction(
                        function (tx5) {
                            tx5.executeSql(
                                "SELECT * FROM detalle_recaudo WHERE id_detalle = ? AND id_cedula = ?",
                                [id_detalle, id_cedula],
                                function (tx5, results) {
                                    var length = results.rows.length;
                                    if (length == 0) {
                                        $("#message-nr").css("display", "block");
                                    } else {
                                        $("#message-nr").css("display", "none");
                                        for (var i = 0; i < length; i++) {
                                            var item2 = results.rows.item(i);
                                            $("#tb_recaudo").append(
                                                "<tr><td>$0.5</td><td>" +
                                                    item2.Moneda50c +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe50c) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",0);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$1</td><td>" +
                                                    item2.Moneda1 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe1) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",1);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$2</td><td>" +
                                                    item2.Moneda2 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe2) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",2);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$5</td><td>" +
                                                    item2.Moneda5 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe5) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",5);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$10</td><td>" +
                                                    item2.Moneda10 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe10) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",10);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$20</td><td>" +
                                                    item2.Moneda20 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe20) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",20);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$50</td><td>" +
                                                    item2.Moneda50 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe50) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",50);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$100</td><td>" +
                                                    item2.Moneda100 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe100) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",100);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$200</td><td>" +
                                                    item2.Moneda200 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe200) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",200);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );
                                            $("#tb_recaudo").append(
                                                "<tr><td>$500</td><td>" +
                                                    item2.Moneda500 +
                                                    "</td><td>$" +
                                                    numberWithCommas(item2.importe500) +
                                                    "</td><td><button class='col button button-small button-round button-outline edit-btn' style='height: 100%;border-color: #FF0037;' onclick='editarMonedaRecaudo(" +
                                                    item2.id_detalle +
                                                    ",500);'><i class='material-icons md-light' style='color: #FF0037;vertical-align: middle;font-size: 23px;'>edit</i></button></td></td></tr>"
                                            );

                                            var piezastotales =
                                                parseInt(item2.Moneda50c) +
                                                parseInt(item2.Moneda1) +
                                                parseInt(item2.Moneda2) +
                                                parseInt(item2.Moneda5) +
                                                parseInt(item2.Moneda10) +
                                                parseInt(item2.Moneda20) +
                                                parseInt(item2.Moneda50) +
                                                parseInt(item2.Moneda100) +
                                                parseInt(item2.Moneda200) +
                                                parseInt(item2.Moneda500);
                                            var importetotal =
                                                parseFloat(item2.importe50c) +
                                                parseFloat(item2.importe1) +
                                                parseFloat(item2.importe2) +
                                                parseFloat(item2.importe5) +
                                                parseFloat(item2.importe10) +
                                                parseFloat(item2.importe20) +
                                                parseFloat(item2.importe50) +
                                                parseFloat(item2.importe100) +
                                                parseFloat(item2.importe200) +
                                                parseFloat(item2.importe500);
                                            $(".title").html("Recaudo | " + item2.eco + " - $" + numberWithCommas(importetotal));
                                            databaseHandler.db.transaction(
                                                function (tx) {
                                                    tx.executeSql(
                                                        "UPDATE detalle_recaudo SET piezas_totales = ?, importe_total = ? WHERE id_cedula = ? AND id_detalle = ?",
                                                        [piezastotales, importetotal, id_cedula, id_detalle],
                                                        function (tx, results) {
                                                            $("#tb_recaudo").append(
                                                                "<tr style='text-align: center;background-color: #005D99;color: white;''><td>Totales</td><td>" +
                                                                    numberWithCommas(piezastotales) +
                                                                    "</td><td>$" +
                                                                    numberWithCommas(importetotal) +
                                                                    "</td><td>&nbsp;</td></tr>"
                                                            );
                                                        },
                                                        function (tx, error) {
                                                            console.error("Error al guardar cierre: " + error.message);
                                                        }
                                                    );
                                                },
                                                function (error) {},
                                                function () {}
                                            );
                                        }
                                    }
                                },
                                function (tx5, error) {
                                    console.error("Error al consultar bandeja de salida: " + error.message);
                                }
                            );
                        },
                        function (error) {},
                        function () {}
                    );
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function validarRadio(id) {
    var ids = id.split("-");
    var apartado = ids[1];
    var check = ids[2];
    var valCheck = document.getElementById(ids[0] + "-" + ids[1] + "-" + ids[2]).checked;
    if (check.includes("1")) {
        if (valCheck == true) {
            var otherCheck = ids[0] + "-" + ids[1] + "-2";
            document.getElementById(otherCheck).checked = false;
            $("#div_" + apartado).css("display", "block");
            if (apartado == "monto") {
                $("#div_folio2").css("display", "flex");
            }
        }
    } else {
        if (valCheck == true) {
            var otherCheck = ids[0] + "-" + ids[1] + "-1";
            document.getElementById(otherCheck).checked = false;
            $("#div_" + apartado).css("display", "none");
            if (apartado == "monto") {
                $("#div_cacharpa").css("display", "none");
                $("#div_folio2").css("display", "none");
            }
        }
    }
}
function CalculaBolsa(bolsa) {
    var bolsaCacharpa10 = $("#bolsaCacharpa10").val();
    var bolsaCacharpa20 = $("#bolsaCacharpa20").val();
    var bolsaCacharpa50 = $("#bolsaCacharpa50").val();

    var monto10c = parseInt(bolsaCacharpa10 * 500);
    var monto20c = parseInt(bolsaCacharpa20 * 500);
    var monto50c = parseInt(bolsaCacharpa50 * 1000);

    var cuenta = monto10c + monto20c + monto50c;

    $("#Acumulado1").val(cuenta);
    $("#Acumulado1_text").html(`Acumulado: $${numberWithCommas(cuenta.toFixed(2))}`);

    if (bolsa == 50) {
        $("#max_bolsa50c").val(parseInt($("#bolsas_50co").val()) + parseInt($("#bolsaCacharpa50").val()));
    }
}
function ingresarBolsasMonto() {
    if (parseInt($("#monto").val()) > parseInt($("#recaudo_sin_billetes").val())) {
        swal("", "El monto no puede ser mayor a lo recaudado.", "warning");
        $("#monto").val("");
        $("#Acumulado3_text").text("Monto: $0.00");
        $("#div_cacharpa").css("display", "none");
    } else {
        $("#div_cacharpa").css("display", "block");
    }
}
function CalculaBolsa2(bolsa) {
    $("#monto").prop("disabled", true);
    $("#monto").css("background-color", "#F4F4F4");
    var bolsas50c = $("#step_moneda0").val();
    var bolsas1 = $("#step_moneda1").val();
    var bolsas2 = $("#step_moneda2").val();
    var bolsas5 = $("#step_moneda5").val();
    var bolsas10 = $("#step_moneda10").val();

    var monto0 = parseInt(bolsas50c * 1000);
    var monto1 = parseInt(bolsas1 * 2000);
    var monto2 = parseInt(bolsas2 * 4000);
    var monto5 = parseInt(bolsas5 * 6000);
    var monto10 = parseInt(bolsas10 * 5000);

    var Acumulado2 = monto0 + monto1 + monto2 + monto5 + monto10;

    if (Acumulado2 > $("#monto").val()) {
        swal("", "Agregando esta bolsa el monto acumulado sería mayor.", "warning");
        if (bolsa == 0) {
            var stepper = app.stepper.get("#steper0");
            stepper.decrement();
        } else if (bolsa == 1) {
            $("#step_moneda1").val($("#step_moneda1").val() - 1);
            var stepper = app.stepper.get("#steper1");
            stepper.decrement();
        } else if (bolsa == 2) {
            $("#step_moneda2").val($("#step_moneda2").val() - 1);
            var stepper = app.stepper.get("#steper2");
            stepper.decrement();
        } else if (bolsa == 5) {
            $("#step_moneda5").val($("#step_moneda5").val() - 1);
            var stepper = app.stepper.get("#steper5");
            stepper.decrement();
        } else if (bolsa == 10) {
            $("#step_moneda10").val($("#step_moneda10").val() - 1);
            var stepper = app.stepper.get("#steper10");
            stepper.decrement();
        }
        return false;
    }
    if (bolsa == 0) {
        var stepper = app.stepper.get("#steper0");
        if (parseInt($("#step_moneda0").val()) > parseInt($("#max_bolsa50c").val())) {
            swal("", "No tienes bolsas suficientes de esta denominación, para continar la acción intenta con otra bolsa", "warning");
            stepper.decrement();
            return false;
        }
    } else if (bolsa == 1 || bolsa == 2 || bolsa == 5 || bolsa == 10) {
        var stepper = app.stepper.get("#steper" + bolsa);
        if (parseInt($("#step_moneda" + bolsa).val()) > parseInt($("#max_bolsa" + bolsa).val())) {
            swal("", "No tienes bolsas suficientes de esta denominación, para continar la acción intenta con otra bolsa", "warning");
            stepper.decrement();
            return false;
        }
    }
    $("#Acumulado2_text").html(`Acumulado: $${numberWithCommas(Acumulado2.toFixed(2))}`);
    $("#Acumulado2").val(Acumulado2);
}
function finRecaudo() {
    var id_cedula = localStorage.getItem("IdCedula");
    if ($("#radio-bolsas-2").prop("checked")) {
        var opc_cacharpa = "0";
        var bolsaCacharpa10 = 0; //cuantas bolsas se van a mandar de $10C
        var bolsaCacharpa20 = 0; //cuantas bolsas se van a mandar de $20C
        var bolsaCacharpa50 = 0; //cuantas bolsas se van a mandar de $50C
        var total_cacharpa = 0; //suma de cacharpa monto adicional
    } else {
        var opc_cacharpa = "1";
        var bolsaCacharpa10 = $("#bolsaCacharpa10").val();
        var bolsaCacharpa20 = $("#bolsaCacharpa20").val();
        var bolsaCacharpa50 = $("#bolsaCacharpa50").val();

        var total_cacharpa = parseInt(bolsaCacharpa10) + parseInt(bolsaCacharpa20) + parseInt(bolsaCacharpa50);
    }

    if (!$("#folio").val()) {
        swal("", "Favor de indicar el folio de traslado.", "warning");
        return false;
    } else {
        var folio = $("#folio").val();
    }

    if ($("#radio-monto-2").prop("checked")) {
        var opc_adicional = "0";
        var monto_adicional = 0;
        var bolsaAdd50c = 0;
        var bolsaAdd1 = 0;
        var bolsaAdd2 = 0;
        var bolsaAdd5 = 0;
        var bolsaAdd10 = 0;
        var folio2 = "";
    } else {
        var opc_adicional = "1";
        if ($("#monto").val() == $("#Acumulado2").val()) {
            if (!$("#folio2").val()) {
                swal("", "Favor de indicar el folio 2 de traslado.", "warning");
                return false;
            } else {
                var folio2 = $("#folio2").val();
            }
        } else {
            swal("", "El monto adicional y el acumulado no coinciden.", "warning");
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
    for (var i = 1; i <= plomo; i++) {
        if (i == 1) {
            if (!$("#plomo").val()) {
                swal("", "Favor de indicar el plomo 1.", "warning");
                return false;
            }
        } else {
            if (!$("#plomo" + i).val()) {
                swal("", "Favor de indicar el plomo " + i + ".", "warning");
                return false;
            }
        }
    }

    if ($("#total_billetes").val() == 0) {
    } else {
        if (!$("#plomo").val()) {
            swal("", "Debes indicar al menos un plomo.", "warning");
            return false;
        }
    }

    var plomo1 = $("#plomo").val();
    var plomo2 = $("#plomo2").val();
    var plomo3 = $("#plomo3").val();
    var plomo4 = $("#plomo4").val();
    var plomo5 = $("#plomo5").val();

    if (!$("#obs_recaudo").val()) {
        var observaciones = "Sin comentarios";
    } else {
        var observaciones = $("#obs_recaudo").val();
    }
    var importe_cacharpa = $("#Acumulado1").val();

    var recaudo_sin_billetes = $("#recaudo_sin_billetes").val();
    var monto1 = parseInt(recaudo_sin_billetes) + parseInt(importe_cacharpa);

    var peso_cacharpa = $("#peso_cacharpa").val();

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE datos_generales_recaudo SET opc_cacharpa = ?, monto1 = ?, bolsaCacharpa10 = ?, bolsaCacharpa20 = ?, bolsaCacharpa50 = ?, total_cacharpa = ?, opc_adicional = ?, monto_adicional = ?, bolsaAdd50c = ?, bolsaAdd1 = ?, bolsaAdd2 = ?, bolsaAdd5 = ?, bolsaAdd10 = ?, folio2 = ?, folio = ?, plomo = ?, plomo2 = ?, plomo3 = ?, plomo4 = ?, plomo5 = ?, observaciones = ?, importe_cacharpa = ?, peso_cacharpa = ? WHERE id_cedula = ?",
                [
                    opc_cacharpa,
                    monto1,
                    bolsaCacharpa10,
                    bolsaCacharpa20,
                    bolsaCacharpa50,
                    total_cacharpa,
                    opc_adicional,
                    monto_adicional,
                    bolsaAdd50c,
                    bolsaAdd1,
                    bolsaAdd2,
                    bolsaAdd5,
                    bolsaAdd10,
                    folio2,
                    folio,
                    plomo1,
                    plomo2,
                    plomo3,
                    plomo4,
                    plomo5,
                    observaciones,
                    importe_cacharpa,
                    peso_cacharpa,
                    id_cedula,
                ],
                function (tx, results) {
                    swal("", "Guardado correctamente.", "success");
                    EnviarRecaudo();
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function EnviarRecaudo() {
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
        }
    });
}
function showPlomos() {
    var plomo = $("#CountPlomos").val();
    for (var i = 1; i <= plomo; i++) {
        $("#div_plomo" + i).css("display", "flex");
    }

    for (var i = 5; i > plomo; i--) {
        $("#div_plomo" + i).css("display", "none");
    }
}
function ver_preliminar(id) {
    localStorage.setItem("IdCedula", id);
    app.views.main.router.back("/formRecaudo3/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}
function preingresoRecaudo() {
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
                    if (length == 0) {
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
function actualiza_fecha() {
    if ($("#fecha").val()) {
        var fecha_s = $("#fecha").val().split("-");
        var fecha = $("#fecha").val() + " " + $("#hora").val();
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx5) {
                tx5.executeSql(
                    "UPDATE datos_generales_recaudo SET fecha = ? WHERE id_cedula = ?",
                    [fecha, id_cedula],
                    function (tx5, results) {
                        swal("", "Fecha actualizada.", "success");
                        var MyDateString = fecha_s[2] + "-" + fecha_s[1] + "-" + fecha_s[0];
                        $(".title").html("Recaudo | " + MyDateString);
                        databaseHandler.db.transaction(
                            function (tx5) {
                                tx5.executeSql(
                                    "UPDATE cedulas_general SET fecha_entrada = ? WHERE id_cedula = ?",
                                    [fecha, id_cedula],
                                    function (tx5, results) {},
                                    function (tx5, error) {}
                                );
                            },
                            function (error) {},
                            function () {}
                        );
                    },
                    function (tx5, error) {
                        console.error("Error update: " + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    } else {
        swal("", "Debes elegir una fecha válida", "warning");
    }
}

function RevisaHeaders_recaudo() {
    var empresa = localStorage.getItem("empresa");
    var NomJson = "Recaudo_" + empresa;

    var hoy = getDateWhitZeros();
    hoy = hoy.split(" ");

    var encontro = false;
    var empresa = "";

    app.request.get(cordova.file.dataDirectory + "jsons_recaudo/" + NomJson + ".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null) {
        } else {
            for (var x = 0; x < content2.length; x++) {
                guardaHeaderRecaudo(
                    content2[x].fecha,
                    content2[x].id_cedula,
                    content2[x].id_dato,
                    content2[x].id_usuario,
                    content2[x].id_empresa,
                    content2[x].observaciones,
                    content2[x].folio,
                    content2[x].folio2,
                    content2[x].recaudo_total,
                    content2[x].recaudo_sin_billetes,
                    content2[x].total_billetes,
                    content2[x].total_cacharpa,
                    content2[x].bolsas_totales,
                    content2[x].plomo,
                    content2[x].monto1,
                    content2[x].total_unidades,
                    content2[x].unidades_recaudads,
                    content2[x].promedio,
                    content2[x].bolsa50c,
                    content2[x].bolsa1,
                    content2[x].bolsa2,
                    content2[x].bolsa5,
                    content2[x].bolsa10,
                    content2[x].pico50c,
                    content2[x].pico1,
                    content2[x].pico2,
                    content2[x].pico5,
                    content2[x].pico10,
                    content2[x].opc_cacharpa,
                    content2[x].opc_adicional,
                    content2[x].bolsaCacharpa10,
                    content2[x].bolsaCacharpa20,
                    content2[x].bolsaCacharpa50,
                    content2[x].monto_adicional,
                    content2[x].bolsaAdd50c,
                    content2[x].bolsaAdd1,
                    content2[x].bolsaAdd2,
                    content2[x].bolsaAdd5,
                    content2[x].bolsaAdd10,
                    content2[x].importe_cacharpa,
                    content2[x].estatus,
                    content2[x].origen,
                    content2[x].plomo2,
                    content2[x].plomo3,
                    content2[x].plomo4,
                    content2[x].plomo5,
                    content2[x].peso_cacharpa
                );
            }
        }
    });
}

function guardaHeaderRecaudo(
    fecha,
    id,
    id_dato,
    id_usuario,
    id_empresa,
    observaciones,
    folio,
    folio2,
    recaudo_total,
    recaudo_sin_billetes,
    total_billetes,
    total_cacharpa,
    bolsas_totales,
    plomo,
    monto1,
    total_unidades,
    unidades_recaudads,
    promedio,
    bolsa50c,
    bolsa1,
    bolsa2,
    bolsa5,
    bolsa10,
    pico50c,
    pico1,
    pico2,
    pico5,
    pico10,
    opc_cacharpa,
    opc_adicional,
    bolsaCacharpa10,
    bolsaCacharpa20,
    bolsaCacharpa50,
    monto_adicional,
    bolsaAdd50c,
    bolsaAdd1,
    bolsaAdd2,
    bolsaAdd5,
    bolsaAdd10,
    importe_cacharpa,
    estatus,
    origen,
    plomo2,
    plomo3,
    plomo4,
    plomo5,
    peso_cacharpa
) {
    databaseHandler.db.transaction(
        function (tx5) {
            tx5.executeSql(
                "SELECT * FROM datos_generales_recaudo WHERE fecha = ? ",
                [fecha],
                function (tx5, results) {
                    var length = results.rows.length;
                    if (length == 0) {
                        var nombre_usuario = localStorage.getItem("nombre");
                        var id_cliente = localStorage.getItem("empresa");
                        var empresa = NombreEmpresa(id_cliente);
                        var estatus = 0;
                        var geolocation = "";
                        var tipo_cedula = "Recaudo";
                        productHandler.addCedulayb(id_usuario, nombre_usuario, fecha, geolocation, id_cliente, empresa, fecha, estatus, tipo_cedula);
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "Select MAX(id_cedula) as Id from cedulas_general",
                                    [],
                                    function (tx, results) {
                                        var item = results.rows.item(0);
                                        localStorage.setItem("IdCedula", item.Id);
                                        var id_cedula = item.Id;
                                        productHandler.addDesincorHeaderRecaudo(
                                            id_cedula,
                                            empresa,
                                            fecha,
                                            id_usuario,
                                            id_empresa,
                                            observaciones,
                                            folio,
                                            folio2,
                                            recaudo_total,
                                            recaudo_sin_billetes,
                                            total_billetes,
                                            total_cacharpa,
                                            bolsas_totales,
                                            plomo,
                                            monto1,
                                            total_unidades,
                                            unidades_recaudads,
                                            promedio,
                                            bolsa50c,
                                            bolsa1,
                                            bolsa2,
                                            bolsa5,
                                            bolsa10,
                                            pico50c,
                                            pico1,
                                            pico2,
                                            pico5,
                                            pico10,
                                            opc_cacharpa,
                                            opc_adicional,
                                            bolsaCacharpa10,
                                            bolsaCacharpa20,
                                            bolsaCacharpa50,
                                            monto_adicional,
                                            bolsaAdd50c,
                                            bolsaAdd1,
                                            bolsaAdd2,
                                            bolsaAdd5,
                                            bolsaAdd10,
                                            importe_cacharpa,
                                            plomo2,
                                            plomo3,
                                            plomo4,
                                            plomo5,
                                            peso_cacharpa,
                                            estatus,
                                            origen,
                                            id
                                        );
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
                function (tx5, error) {
                    console.error("Error al consultar bandeja de salida: " + error.message);
                }
            );
        },
        function (error) {},
        function () {}
    );
}
function InsertaDetailsRecaudo(id_cedula, id_servidor) {
    var empresa = localStorage.getItem("empresa");
    var NomJson = "Recaudo_desc_" + empresa;
    app.request.get(cordova.file.dataDirectory + "jsons_recaudo/" + NomJson + ".json", function (data) {
        var content2 = JSON.parse(data);
        if (content2 == null) {
        } else {
            for (var x = 0; x < content2.length; x++) {
                if (id_servidor == content2[x].id_cedula) {
                    productHandler.addDetailsDesRecaudo(
                        content2[x].id_detalle,
                        id_cedula,
                        content2[x].eco,
                        content2[x].Moneda50c,
                        content2[x].Moneda1,
                        content2[x].Moneda2,
                        content2[x].Moneda5,
                        content2[x].Moneda10,
                        content2[x].Moneda20,
                        content2[x].Moneda50,
                        content2[x].Moneda100,
                        content2[x].Moneda200,
                        content2[x].Moneda500,
                        content2[x].importe50c,
                        content2[x].importe1,
                        content2[x].importe2,
                        content2[x].importe5,
                        content2[x].importe10,
                        content2[x].importe20,
                        content2[x].importe50,
                        content2[x].importe100,
                        content2[x].importe200,
                        content2[x].importe500,
                        content2[x].piezas_totales,
                        content2[x].importe_total,
                        content2[x].id_unidad
                    );
                }
            }
        }
    });
}
//Fin Recaudo
