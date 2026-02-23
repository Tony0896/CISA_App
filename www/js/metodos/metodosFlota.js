function IniciaCheckListFlota() {
    let sePuede = "";
    let flag = 1;

    if ($("#autocomplete-dropdown-ajax").val()) {
        if ($("#radioY-2").prop("checked") == true) {
            sePuede = false;
            flag = 0;
        } else if ($("#radioY-1").prop("checked") == true) {
            sePuede = true;
            flag = 1;
        } else {
            swal("", "Debes indicar si la unidad se puede inspeccionar.", "warning");
            return false;
        }

        if (sePuede) {
            swal({
                title: "Aviso",
                text: "¿Deseas continuar con el llenado de la información?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((RESP) => {
                if (RESP == true) {
                    let Unidad = $("#autocomplete-dropdown-ajax").val();
                    let Chasis = $("#Chasis").val();
                    let Familia = $("#Familia").val();
                    let marca = $("#marca").val();
                    let Empresa = $("#Empresa").val();
                    let FK_id_unidad = $("#FK_unidad").val();
                    let id_unidad_vs = $("#id_unidad").val();
                    let FK_id_empresa = $("#FK_unidad_danos_empresa").val();
                    let id_modelo_check = $("#modelo_check").val();
                    let fecha_revision = $("#fecha_revision").val();
                    let VIN = $("#VIN").val();
                    let ultimoMantenimiento = $("#FechaConclusionOT").val();
                    let tipoMannto = $("#TipoMantenimiento").val();
                    let medidor = $("#Medidor").val();
                    let intervalo = $("#Intervalo").val();
                    let id_usuario = localStorage.getItem("Usuario");
                    let nombre_usuario = localStorage.getItem("nombre");
                    let fecha_llegada = getDateWhitZeros();
                    let horario_programado = fecha_llegada;
                    let nombre_cliente = Unidad;
                    let estatus = 0;
                    let geolocation = 1;
                    let id_cliente = localStorage.getItem("empresa");
                    let tipo_cedula = localStorage.getItem("Modulos");
                    productHandler.addCedulayb(
                        id_usuario,
                        nombre_usuario,
                        fecha_llegada,
                        geolocation,
                        id_cliente,
                        nombre_cliente,
                        horario_programado,
                        estatus,
                        tipo_cedula,
                    );
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    //app.dialog.progress('Generando CheckList','red');
                                    let progress = 0;
                                    let dialog = app.dialog.progress("Generando CheckList", progress, "red");
                                    let empresa = localStorage.getItem("empresa");
                                    let item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    let id_cedula = item.Id;
                                    productHandler.addDatosGeneralesFlota(
                                        id_cedula,
                                        Unidad,
                                        Chasis,
                                        Familia,
                                        marca,
                                        Empresa,
                                        FK_id_unidad,
                                        id_unidad_vs,
                                        FK_id_empresa,
                                        id_modelo_check,
                                        fecha_revision,
                                        flag,
                                        VIN,
                                        ultimoMantenimiento,
                                        tipoMannto,
                                        medidor,
                                        intervalo,
                                    );
                                    let NomJson = "datos_check_desc" + empresa;
                                    app.request({
                                        url: cordova.file.dataDirectory + "jsons_InsFlota/" + NomJson + ".json",
                                        method: "GET",
                                        dataType: "json",
                                        success: function (data) {
                                            let aux = 0;
                                            let aux2 = 0;
                                            for (let j = 0; j < data.length; j++) {
                                                if (data[j].modelos == id_modelo_check) {
                                                    aux++;
                                                }
                                            }
                                            if (aux == 0) {
                                                app.dialog.close();
                                                swal("", "Algo salió mal.", "warning");
                                            } else {
                                                dialog.setText("1 de " + aux);
                                                for (let j = 0; j < data.length; j++) {
                                                    if (data[j].modelos == id_modelo_check) {
                                                        aux2++;
                                                        productHandler.insertPreguntasFlota(
                                                            id_cedula,
                                                            data[j].id_pregunta,
                                                            data[j].revision,
                                                            data[j].nombre_fase,
                                                            data[j].fase,
                                                            data[j].obligatorio,
                                                            data[j].no_pregunta,
                                                            1,
                                                            data[j].modelos,
                                                            aux,
                                                            aux2,
                                                            data[j].multiple,
                                                            data[j].criterio,
                                                            data[j].ponderacion,
                                                        );
                                                    }
                                                }
                                            }
                                        },
                                    });
                                },
                                function (tx, error) {
                                    console.log("Error al guardar cedula: " + error.message);
                                },
                            );
                        },
                        function (error) {},
                        function () {},
                    );
                }
            });
        } else {
            swal({
                title: "Aviso",
                text: 'Haz marcado la opción de "Unidad no se puede inspeccionar", ¿Deseas continuar?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((RESP) => {
                if (RESP == true) {
                    let Unidad = $("#autocomplete-dropdown-ajax").val();
                    let Chasis = $("#Chasis").val();
                    let Familia = $("#Familia").val();
                    let marca = $("#marca").val();
                    let Empresa = $("#Empresa").val();
                    let FK_id_unidad = $("#FK_unidad").val();
                    let id_unidad_vs = $("#id_unidad").val();
                    let FK_id_empresa = $("#FK_unidad_danos_empresa").val();
                    let id_modelo_check = $("#modelo_check").val();
                    let fecha_revision = $("#fecha_revision").val();
                    let id_usuario = localStorage.getItem("Usuario");
                    let nombre_usuario = localStorage.getItem("nombre");
                    let fecha_llegada = getDateWhitZeros();
                    let horario_programado = fecha_llegada;
                    let nombre_cliente = Unidad;
                    let estatus = 0;
                    let geolocation = 0;
                    let id_cliente = localStorage.getItem("empresa");
                    let tipo_cedula = localStorage.getItem("Modulos");
                    productHandler.addCedulayb(
                        id_usuario,
                        nombre_usuario,
                        fecha_llegada,
                        geolocation,
                        id_cliente,
                        nombre_cliente,
                        horario_programado,
                        estatus,
                        tipo_cedula,
                    );
                    databaseHandler.db.transaction(
                        function (tx) {
                            tx.executeSql(
                                "Select MAX(id_cedula) as Id from cedulas_general",
                                [],
                                function (tx, results) {
                                    let item = results.rows.item(0);
                                    localStorage.setItem("IdCedula", item.Id);
                                    let id_cedula = item.Id;
                                    productHandler.addDatosGeneralesFlota(
                                        id_cedula,
                                        Unidad,
                                        Chasis,
                                        Familia,
                                        marca,
                                        Empresa,
                                        FK_id_unidad,
                                        id_unidad_vs,
                                        FK_id_empresa,
                                        id_modelo_check,
                                        fecha_revision,
                                        flag,
                                    );
                                },
                                function (tx, error) {
                                    console.log("Error al guardar cedula: " + error.message);
                                },
                            );
                        },
                        function (error) {},
                        function () {},
                    );
                }
            });
        }
    } else {
        swal("", "Selecciona una unidad para poder continuar.", "warning");
    }
}

function moveChecklistFlota(fase) {
    localStorage.setItem("fase", fase);
    let page = localStorage.getItem("page");
    if (page == 1) {
        app.views.main.router.back("/formFlota2/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else if (page == 2) {
        app.views.main.router.back("/formFlota1/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    }
}

function IrMilimetrajes() {
    app.views.main.router.back("/formFlota5/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}

function showCriterios(criterio) {
    app.dialog.alert(criterio, "Información");
}

function validaRadioFlota(id, numero) {
    if (numero == 1) {
        let labels = id.replace("radio", "label");
        let ids = id.split("-");
        $(".radios-" + ids[1]).removeClass("checked");
        $(".inRadios-" + ids[1]).prop("checked", false);
        $("#" + id).prop("checked", true);
        $("#" + labels).addClass("checked");

        if (ids[2] == 2) {
            seleccionaDaniosFlota(ids[1]);
        } else {
            actualizaRespuestasFlota(id, 1);
        }
    }
}

function actualizaRespuestasFlota(id, paso) {
    let id_cedula = localStorage.getItem("IdCedula");
    let ids = id.split("-");
    let id_pregunta = ids[1];
    let respuesta = ids[2];
    let comentarios = "";

    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE checklistFlota SET respuesta = ?, comentarios = ?, comentarios2 = ? WHERE id_cedula = ? AND id_pregunta = ?",
                [respuesta, comentarios, comentarios, id_cedula, id_pregunta],
                function (tx, results) {
                    if (respuesta == 1 || respuesta == 3) {
                        $("#span-" + id_pregunta).html("");
                        databaseHandler.db.transaction(
                            function (tx) {
                                tx.executeSql(
                                    "DELETE FROM Evidencias WHERE id_cedula = ? AND flagPregunta = ?",
                                    [id_cedula, id_pregunta],
                                    function (tx, results) {},
                                    function (tx, error) {
                                        console.error("Error al guardar cierre: " + error.message);
                                    },
                                );
                            },
                            function (error) {},
                            function () {},
                        );
                    }
                },
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                },
            );
        },
        function (error) {},
        function () {},
    );
}

function seleccionaDaniosFlota(id) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(function (tx5) {
        tx5.executeSql("SELECT * FROM checklistFlota WHERE id_pregunta = ? AND id_cedula = ?", [id, id_cedula], function (tx5, results) {
            var item2 = results.rows.item(0);
            if (item2.multiple == 1) {
                var text = item2.revision;
                let result = text.includes("(");
                if (result) {
                    var resultados = text.split("(");
                    var titulo_modal = resultados[0].trim();
                    var divididos = resultados[1].split(",");
                    var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                    var quitapar = "";
                    for (i = 0; i < divididos.length; i++) {
                        quitapar = divididos[i].replace("(", "");
                        quitapar = quitapar.replace(")", "");
                        quitapar = capitalizarPrimeraLetra(quitapar);
                        opciones = opciones + `<option value=` + quitapar.trim() + `>` + quitapar.trim() + `</option>`;
                    }
                    opciones = opciones + "</select>";
                    CreaModalOptionFlota(id, opciones, 1, titulo_modal);
                } else {
                    var titulo_modal = "";
                    var divididos = text.split(",");
                    var opciones = '<select class="FWM-input" id="opts_modal" multiple>';
                    var quitapar = "";
                    for (i = 0; i < divididos.length; i++) {
                        quitapar = divididos[i].replace("(", "");
                        quitapar = quitapar.replace(")", "");
                        quitapar = capitalizarPrimeraLetra(quitapar);
                        opciones = opciones + `<option value=` + quitapar.trim() + `>` + quitapar.trim() + `</option>`;
                    }
                    opciones = opciones + "</select>";
                    var titulo_modal = "";
                    CreaModalOptionFlota(id, opciones, 2, titulo_modal);
                }
            } else {
                var opciones = false;
                var titulo_modal = "";
                CreaModalOptionFlota(id, opciones, 3, titulo_modal);
            }
        });
    });
}

function CreaModalOptionFlota(id, opciones, mul, titulo_modal) {
    if (mul == 3) {
        var display = "none"; //div_opt
        var display1 = "none"; //titulo_modal
    } else if (mul == 2) {
        var display = "block"; //div_opt
        var display1 = "none"; //titulo_modal
    } else if (mul == 1) {
        var display = "block"; //div_opt
        var display1 = "block"; //titulo_modal
    }

    var NomDescCli = "danios";
    var html = "";

    app.request.get(cordova.file.dataDirectory + "jsons_InsFlota/" + NomDescCli + ".json", function (data) {
        var content2 = JSON.parse(data);
        for (var x = 0; x < content2.length; x++) {
            html += `<label class="label_modal">
                    <input class="cbox_modal obligatorio" type="checkbox" id="cbox${content2[x].id_danio}" value="${content2[x].tipo_danio}">${content2[x].tipo_danio}
                </label><br>`;
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
                    <span id="titulo_modal" style="display:${display1};color: #FF0037;" class="span FWM-span-form">${titulo_modal}</span>
                    <div id="div_opt" style="display:${display}; padding-top: 10px;margin-bottom: 20px;">
                    ${opciones}
                    </div>
                    <span class="span FWM-span-form">Daños:</span>
                    <div class="list FWM-fixing-form" id="div_cboxs" style="margin-top: 25px;max-height: 350px;overflow-y: scroll;padding-top: 20px;border: 1px solid #b1b1b1 !important;border-radius: 10px;padding-left: 20px;margin-left: 15px;margin-right: 15px;width: 92%;"> 
                        <input type="hidden" id="inputEvidencia" value='${id}'>
                        <input type="hidden" id="pasa" value="0">
                            ${html}
                    </div>

                    <span class="span FWM-span-form">Observaciones adicionales:</span>
                        <textarea class="FWM-input" style="font-family: 'ITC Avant Garde Gothic',sans-serif;width: 100%;margin-bottom: 30px;padding-top: 10px;" 
                            id="comentarios_generales" cols="30" rows="10" onchange="setComentariosFlota(this.value, ${id})">
                        </textarea>

                        <div id="evidencias_div" style="padding-left: 10px;padding-right: 10px;display: none;">
                        <div class="FWM-photo-container">
                            <div class="border-capture" style="text-align: center" >
                                <img class="FWM-photo" src="" id="photoIcon" width="45px"/>
                            </div>
                            <img class="FWM-photo-hide" id="smallImage" src="" />
                            <input type="hidden" id="imagenC" name="imagenC" />
                        </div>
                    </div>

                    <div class="row" style=" text-align: center; margin: 65px 10px 65px 10px; justify-content: space-around;" id="div_botones_camara">
                        <div style="min-width: 50px; border-style: none">
                            <span class="resize-handler"></span>
                            <a
                                href="#"
                                onclick="ValidarCapturePhotoInsflota2()"
                                style=" background-color: #fff; border: 3px solid #005d99; color: #005d99;" class="boton-equipo">
                                Agregar Evidencia
                                <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color: #005d99;">
                                    photo_camera
                                </i>
                            </a>
                        </div>
                    </div>

                    <div class="block grid-resizable-demo" style="margin-bottom: 70px;">
                        <div class="row align-items-stretch" style="text-align: center;">
                            <div class="col-100 medium-50" style="min-width: 50px; border-style: none;">
                                <span class="resize-handler"></span>
                                <a href="#" onclick="agregaComentariosFlota('${id}','${mul}');" style="background-color: #FF0037;" class="boton-equipo">Guardar</a>
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
                        let campos;
                        let comentarios = "";
                        let valido = false;

                        campos = document.querySelectorAll("#div_cboxs .obligatorio");

                        [].slice.call(campos).forEach(function (campo) {
                            if (campo.checked == true) {
                                valido = true;
                                comentarios = comentarios + ", " + campo.value;
                            }
                        });

                        if (valido) {
                            swal({
                                title: "Aviso",
                                text: "¿Estas seguro que deseas regresar?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack) {
                                    let otherCheck = "radio-" + id + "-2";
                                    document.getElementById(otherCheck).checked = false;
                                    let Check = "radio-" + id + "-3";
                                    document.getElementById(Check).checked = false;
                                    let Checks = "radio-" + id + "-1";
                                    document.getElementById(Checks).checked = true;
                                    let labels0 = Checks.replace("radio", "label");
                                    let labels1 = Check.replace("radio", "label");
                                    let labels2 = otherCheck.replace("radio", "label");

                                    $("#" + labels0).addClass("checked");
                                    $("#" + labels1).removeClass("checked");
                                    $("#" + labels2).removeClass("checked");
                                    validaRadioFlota(Checks, 1);
                                    app.sheet.close("#sheet-modal");
                                } else {
                                }
                            });
                        } else {
                            swal({
                                title: "Aviso",
                                text: "¿Estas seguro que deseas regresar?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: false,
                            }).then((willGoBack) => {
                                if (willGoBack) {
                                    let otherCheck = "radio-" + id + "-2";
                                    document.getElementById(otherCheck).checked = false;
                                    let Check = "radio-" + id + "-3";
                                    document.getElementById(Check).checked = false;
                                    let Checks = "radio-" + id + "-1";
                                    document.getElementById(Checks).checked = true;
                                    let labels0 = Checks.replace("radio", "label");
                                    let labels1 = Check.replace("radio", "label");
                                    let labels2 = otherCheck.replace("radio", "label");

                                    $("#" + labels0).addClass("checked");
                                    $("#" + labels1).removeClass("checked");
                                    $("#" + labels2).removeClass("checked");
                                    validaRadioFlota(Checks, 1);
                                    app.sheet.close("#sheet-modal");
                                } else {
                                }
                            });
                        }
                    });

                    let id_pregunta = id;

                    databaseHandler.db.transaction(
                        function (tx1) {
                            tx1.executeSql(
                                "Select * from Evidencias where id_cedula= ? AND FKHeader = ? AND flagPregunta = ? ORDER BY id_evidencia",
                                [localStorage.getItem("IdCedula"), localStorage.getItem("IdHeader"), id_pregunta],
                                function (tx, results) {
                                    var length = results.rows.length;
                                    if (length == 0) {
                                    } else {
                                        let item = results.rows.item(0);
                                        let imageData = item.evidencia;
                                        $("#imagenC").val(imageData);
                                        let smallImage = document.getElementById("smallImage");
                                        smallImage.style.display = "flex";
                                        smallImage.src = imageData;
                                        $("#evidencias_div").css("display", "block");
                                        $("#div_botones_camara").html(`<div style="min-width: 50px; border-style: none;">
                                                <a href="#" onclick="capturePhotoModal()" style="background-color: #005D99;" class="boton-equipo">Volver a tomar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;">photo_camera</i></a>
                                            </div>`);
                                    }
                                },
                            );
                        },
                        function (error) {},
                        function () {},
                    );

                    databaseHandler.db.transaction(
                        function (tx1) {
                            tx1.executeSql(
                                "Select * from checklistFlota where id_cedula= ? AND id_pregunta = ?",
                                [localStorage.getItem("IdCedula"), id_pregunta],
                                function (tx, results) {
                                    var length = results.rows.length;
                                    if (length == 0) {
                                    } else {
                                        let item = results.rows.item(0);
                                        let comentarios = String(item.comentarios).split(",");
                                        comentarios.forEach((comentario) => {
                                            let campos;
                                            let cbox = comentario.trim();

                                            campos = document.querySelectorAll("#div_cboxs .obligatorio");

                                            [].slice.call(campos).forEach((campo) => {
                                                if (campo.value == cbox) {
                                                    campo.checked = true;
                                                }
                                            });
                                        });
                                        $("#comentarios_generales").val(item.comentarios2);
                                    }
                                },
                            );
                        },
                        function (error) {},
                        function () {},
                    );
                },
            },
        });

        popEvidencia.open();
    });
}

function agregaComentariosFlota(id_pregunta, mul) {
    if (mul == 1 || mul == 2) {
        let seleccionados = $("#opts_modal").val();
        if (seleccionados.length == 0) {
            swal("", "Selecciona al menos una opción del desplegable.", "warning");
            return false;
        } else {
            var opts = "";
            $("#opts_modal option").each(function () {
                if (this.selected) {
                    opts = opts + ", " + capitalizarPrimeraLetra($(this).text());
                }
            });
            opts = opts.slice(1);
            opts = opts + ":";
        }
    } else {
        var opts = "";
    }
    var campos;
    var comentarios = "";

    campos = document.querySelectorAll("#div_cboxs .obligatorio");
    var valido = false;

    [].slice.call(campos).forEach(function (campo) {
        if (campo.checked == true) {
            valido = true;
            comentarios = comentarios + ", " + campo.value;
        }
    });

    if (valido) {
        var str = comentarios;
        var name = str.slice(1);
        name = opts + "" + name;
        name = name.trim();
        name = capitalizarPrimeraLetra(name);
        var id_cedula = localStorage.getItem("IdCedula");
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "UPDATE checklistFlota SET comentarios = ?, respuesta = ? WHERE id_cedula = ? AND id_pregunta = ?",
                    [name, 2, id_cedula, id_pregunta],
                    function (tx, results) {
                        let comentarios2 = $("#comentarios_generales").val();
                        comentarios2 && (name += ", " + comentarios2);
                        $("#span-" + id_pregunta).html(name);
                        app.sheet.close("#sheet-modal");
                        if ($("#imagenC").val()) {
                            let foto = $("#imagenC").val();
                            databaseHandler.db.transaction(
                                function (tx1) {
                                    tx1.executeSql(
                                        "Select * from Evidencias where id_cedula= ? AND FKHeader = ? AND flagPregunta = ? ORDER BY id_evidencia",
                                        [id_cedula, localStorage.getItem("IdHeader"), id_pregunta],
                                        function (tx, results) {
                                            var length = results.rows.length;
                                            if (length == 0) {
                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "INSERT INTO Evidencias(id_cedula,FKHeader,evidencia,fecha,proceso,flagPregunta) VALUES (?,?,?,?,?,?)",
                                                            [id_cedula, localStorage.getItem("IdHeader"), foto, getDateWhitZeros(), 0, id_pregunta],
                                                            function (tx, results) {},
                                                            function (tx, error) {},
                                                        );
                                                    },
                                                    function (error) {
                                                        console.log(error);
                                                    },
                                                    function (e) {
                                                        console.log(e);
                                                    },
                                                );
                                            } else {
                                                databaseHandler.db.transaction(
                                                    function (tx) {
                                                        tx.executeSql(
                                                            "UPDATE Evidencias SET evidencia = ?, fecha = ? WHERE id_cedula = ?, flagPregunta = ?",
                                                            [foto, getDateWhitZeros(), id_cedula, id_pregunta],
                                                            function (tx, results) {},
                                                            function (tx, error) {},
                                                        );
                                                    },
                                                    function (error) {},
                                                    function () {},
                                                );
                                            }
                                        },
                                    );
                                },
                                function (error) {},
                                function () {},
                            );
                        }
                        swal("", "Guardado correctamente", "success");
                    },
                    function (tx, error) {
                        console.error("Error al guardar cierre: " + error.message);
                    },
                );
            },
            function (error) {},
            function () {},
        );
    } else {
        swal("", "Selecciona almenos un daño para poder guardar", "warning");
    }
}

function GuardarPhoto() {
    var id_cedula = localStorage.getItem("IdCedula");
    var foto = $("#imagenC").val();
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "INSERT INTO Evidencias(id_cedula,FKHeader,evidencia,fecha,proceso,flagPregunta) VALUES (?,?,?,?,?,?)",
                [id_cedula, localStorage.getItem("IdHeader"), foto, getDateWhitZeros(), 1, 0],
                function (tx, results) {
                    databaseHandler.db.transaction(
                        function (tx1) {
                            tx1.executeSql(
                                "Select * from Evidencias where id_cedula= ? AND FKHeader = ? ORDER BY id_evidencia DESC LIMIT 1",
                                [id_cedula, localStorage.getItem("IdHeader")],
                                function (tx, results) {
                                    var item = results.rows.item(0);
                                    $("#evidencias_div").css("display", "none");
                                    $("#div_botones_camara").html(`<div style="min-width: 50px; border-style: none; margin: auto;">
                                        <span class="resize-handler"></span>
                                        <a href="#" onclick="ValidarCapturePhotoInsflota()" style="background-color: #fff;border: 3px solid #005D99;color:#005D99" class="boton-equipo">
                                            Agregar Evidencia <i class="icon material-icons md-only" style="display: inline-block;margin-left: 12px;color:#005D99">photo_camera</i>
                                        </a>
                                    </div>`);
                                    $("#imagenC").val("");
                                    swal("", "Foto guardada correctamente", "success");
                                    $("#facturas").append(
                                        "<tr id='fila" +
                                            item.id_evidencia +
                                            "'><td style='text-align: center;'><img src='" +
                                            item.evidencia +
                                            "' width='60px' style='margin-top: 4px;'/></td><td style='text-align: center;'><a href='#' onclick='eliminarFilaFoto(" +
                                            item.id_evidencia +
                                            ",1);' style='border: none; outline:none;'><i class='icon material-icons md-only' style='display: inline-block;margin-left: 12px;color:#FF0037;font-size: 40px;'>delete_forever</i></a></td></tr>",
                                    );
                                    $(".message-nr").css("display", "none");
                                },
                            );
                        },
                        function (error) {},
                        function () {},
                    );
                },
                function (tx, error) {},
            );
        },
        function (error) {},
        function () {},
    );
}

function continuarCedIns(id_cedula, IdHeader) {
    localStorage.setItem("IdCedula", id_cedula);
    localStorage.setItem("IdHeader", IdHeader);
    if (IdHeader == 0) {
        app.views.main.router.back("/formFlota4/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    } else {
        app.views.main.router.back("/formFlota1/", {
            force: true,
            ignoreCache: true,
            reload: true,
        });
    }
}

function eliminarFilaFoto(index, val) {
    if (val) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "DELETE FROM Evidencias WHERE id_evidencia = ?",
                    [index],
                    function (tx, results) {
                        swal("", "El registro se elimino satisfactoriamente", "success");
                        $("#fila" + index).remove();
                    },
                    function (tx, error) {
                        swal("Error al eliminar registro", error.message, "error");
                    },
                );
            },
            function (error) {},
            function () {},
        );
    }
}

function EnviarCheckListFlota() {
    swal({
        title: "Aviso",
        text: "¿Estas seguro de querer finalizar la inspección?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((RESP) => {
        if (RESP == true) {
            var id_cedula = localStorage.getItem("IdCedula");
            var fecha_salida = getDateWhitZeros();
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
                        },
                    );
                },
                function (error) {},
                function () {},
            );
        }
    });
}

function setComentariosFlota(value, id_pregunta) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE checklistFlota SET comentarios2 = ? WHERE id_cedula = ? AND id_pregunta = ?",
                [value, id_cedula, id_pregunta],
                function (tx, results) {},
                function (tx, error) {
                    console.error("Error al guardar cierre: " + error.message);
                },
            );
        },
        function (error) {},
        function () {},
    );
}

function capturePhotoModal() {
    var camera = localStorage.getItem("camera");
    if (camera == 0) {
        var camera = app.popup.create({
            content: `
                <div class="popup" id="camera" style="display: block;width: 100%;height: 100%;margin-top: 0px;margin-left: 0px;top: 0;left: 0;">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">
                        <div>
                            <div class="left-action">
                                <div class="cancel popup-close" id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                                <div class="cancel " id="cancelPicure" onClick="onCancelPicture()"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            </div>
                            <div class="camera">
                                <div class="take" id="take" onclick="onTake()">
                                    <div class="bubble-take"></div>
                                </div>
                                <div class="select" id="select" style="display: none;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                            </div>
                            <div class="right-action">
                                <div class="switch" id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg"></div>
                            </div>
                        </div>
                        
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()"><img id="flash" src="img/flash_off.svg" width="30px" style="display:none;"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        
                        <input type="hidden" id="deviceOrientation" name="deviceOrientation"/>
                    </div>
                    <fwm></fwm>
                    </div>
                </div>
                `,
            on: {
                open: function (popup) {
                    var permissions = cordova.plugins.permissions;
                    permissions.checkPermission(permissions.CAMERA, function (status) {
                        if (status.hasPermission) {
                            cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                            function empresaCargada() {
                                cameraStart(onPhotoDataSuccess);
                            }
                            function cargarEmpresa(url, callback) {
                                var pie = document.getElementsByTagName("fwm")[0];
                                var script = document.createElement("script");
                                script.type = "text/javascript";
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        } else {
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close(".popup");
                                swal("Se Requiere los permisos", "Para poder tomar las evidencias fotograficas necesitamos el permiso.", "warning");
                            }
                            function success(status) {
                                if (!status.hasPermission) {
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada() {
                                        cameraStart(onPhotoDataSuccess);
                                    }
                                    function cargarEmpresa(url, callback) {
                                        var pie = document.getElementsByTagName("fwm")[0];
                                        var script = document.createElement("script");
                                        script.type = "text/javascript";
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
            },
        });
        camera.open();
    } else {
        navigator.camera.getPicture(onPhotoDataSuccessModal, onFail, {
            quality: 100,
            destinationType: destinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            correctOrientation: true,
        });
    }
}

function ValidarCapturePhotoInsflota() {
    databaseHandler.db.transaction(
        function (tx1) {
            tx1.executeSql(
                "Select COUNT(id_cedula) as cuenta from Evidencias where id_cedula= ? AND FKHeader = ? AND proceso = 1",
                [localStorage.getItem("IdCedula"), 1],
                function (tx, results) {
                    var item = results.rows.item(0);
                    if (item.cuenta <= 2) {
                        capturePhoto();
                    } else {
                        swal("", "Solo puedes agregar máx. 3 fotos", "warning");
                    }
                },
            );
        },
        function (error) {
            console.log("error =>", error);
        },
        function (e) {
            console.log("error e =>", e);
        },
    );
}

function ValidarCapturePhotoInsflota2() {
    capturePhotoModalFlota();
}

function TerminarInsFlota() {
    app.views.main.router.back("/formFlota3/", {
        force: true,
        ignoreCache: true,
        reload: true,
    });
}

function guardaComentarios_generales_Flota(val) {
    var id_cedula = localStorage.getItem("IdCedula");
    databaseHandler.db.transaction(
        function (tx) {
            tx.executeSql(
                "UPDATE datosGeneralesFlota SET comentarios_generales = ? WHERE id_cedula = ?",
                [val, id_cedula],
                function (tx, results) {
                    swal("", "Observaciones guardadas correctamente", "success");
                },
                function (tx, error) {
                    console.error("Error al guardar: " + error.message);
                },
            );
        },
        function (error) {},
        function () {},
    );
}

function cambioMili(ids, values) {
    let value = Number(values);
    if (value >= 0 && value < 26) {
        let id_cedula = localStorage.getItem("IdCedula");
        let id = ids.replace("mili_", "");
        let fecha = getDateWhitZeros();
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "UPDATE Milimetrajes SET valor = ?, fecha = ? WHERE id_mili = ? AND id_cedula = ?",
                    [value, fecha, id, id_cedula],
                    function (tx, results) {},
                    function (tx, error) {
                        console.error("Error al guardar: " + error.message);
                    },
                );
            },
            function (error) {},
            function () {},
        );
    } else {
        $("#" + ids).val("0");
        swal("", "Debes indicar un número válido, y que este sea menor a 26", "warning");
    }
}

function cambioPresion(ids, values) {
    let value = Number(values);
    if (value >= 0 && value < 130) {
        let id_cedula = localStorage.getItem("IdCedula");
        let id = ids.replace("psi_", "");
        let fecha = getDateWhitZeros();
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "UPDATE Milimetrajes SET valorPresion = ?, fechaPresion = ? WHERE id_mili = ? AND id_cedula = ?",
                    [value, fecha, id, id_cedula],
                    function (tx, results) {},
                    function (tx, error) {
                        console.error("Error al guardar: " + error.message);
                    },
                );
            },
            function (error) {},
            function () {},
        );
    } else {
        $("#" + ids).val("0");
        swal("", "Debes indicar un número válido, y que este sea menor a 130", "warning");
    }
}

function capturePhotoModalFlota() {
    var camera = localStorage.getItem("camera");
    if (camera == 0) {
        var camera = app.popup.create({
            content: `
                <div class="popup" id="camera" style="display: block;width: 100%;height: 100%;margin-top: 0px;margin-left: 0px;top: 0;left: 0; z-index: 12501;">
                    <div class="app">
                    <div id="deviceready camera-Field-frame">
                        <div class="top"></div>
                        <canvas id="camera-frame" style="display: none;"></canvas>
                        <video id="camera-view" autoplay playsinline class="raster" style="display: none;"></video>
                        <img src="" id="phototaked">

                        <div style="position: relative; display: flex; flex-direction: row; justify-content: space-around;margin-top: 80vh;">
                            <div>
                                <div id="cancelCamera" onClick="onCancelCamera()"><img class="image-cancel" src="img/cerrar_camera.svg" style="margin-left: 0;"></div>
                                <div id="cancelPicure" onClick="onCancelPicture()" style="display:none;background-color: #c2c2c242;width: 58px;height: 58px;border-radius: 100%;"><img class="image-cancel" src="img/cerrar_camera.svg"></div>
                            </div>
                            <div>
                                <div class="take" id="take" onclick="onTake()" style="right: auto;">
                                    <div class="bubble-take"></div>
                                </div>
                            </div>
                            <div>
                                <div id="switch" onClick="onSwitch()"><img class="image-switch" src="img/flip.svg" style="margin-left: 0;"></div>
                                <div id="select" style="display: none;border-radius: 100%;background-color: #c2c2c242;width: 58px !important;height: 58px !important;" onClick="onDone()"><img id="img-select" src="img/validar_camera.svg"></div>
                            </div>
                        </div>
                        
                        <div class="actions">
                            <div class="action torch" id="torch" onClick="onTorch()" style="display:none;"><img id="flash" src="img/flash_off.svg" width="30px"></div>
                            <div class="action rotate-right" id="rotateRight" onClick="onRotateRight()" style="display:none"><img id="flash" src="img/rotate-right.svg" width="30px"></div>
                            <div class="action rotate-left" id="rotateLeft" onClick="onRotateLeft()" style="display:none"><img id="flash" src="img/rotate-left.svg" width="30px"></div>
                        </div>
                        
                        <input type="hidden" id="deviceOrientation" name="deviceOrientation"/>
                    </div>
                    <fwm></fwm>
                    </div>
                </div>
                `,
            on: {
                open: function (popup) {
                    var permissions = cordova.plugins.permissions;
                    permissions.checkPermission(permissions.CAMERA, function (status) {
                        if (status.hasPermission) {
                            cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                            function empresaCargada() {
                                cameraStart(onPhotoDataSuccessModal);
                            }
                            function cargarEmpresa(url, callback) {
                                var pie = document.getElementsByTagName("fwm")[0];
                                var script = document.createElement("script");
                                script.type = "text/javascript";
                                script.src = url;
                                script.id = "cameraSource";
                                script.onload = callback;
                                pie.appendChild(script);
                            }
                        } else {
                            permissions.requestPermission(permissions.CAMERA, success, error);
                            function error() {
                                app.sheet.close(".popup");
                                swal("Se Requiere los permisos", "Para poder tomar las evidencias fotograficas necesitamos el permiso.", "warning");
                            }
                            function success(status) {
                                if (!status.hasPermission) {
                                    error();
                                } else {
                                    cargarEmpresa(`./js/camera-field.js`, empresaCargada);
                                    function empresaCargada() {
                                        cameraStart(onPhotoDataSuccessModal);
                                    }
                                    function cargarEmpresa(url, callback) {
                                        var pie = document.getElementsByTagName("fwm")[0];
                                        var script = document.createElement("script");
                                        script.type = "text/javascript";
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
            },
        });
        camera.open();
    } else {
        navigator.camera.getPicture(onPhotoDataSuccessModal, onFail, {
            quality: 100,
            destinationType: destinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            correctOrientation: true,
        });
    }
}
