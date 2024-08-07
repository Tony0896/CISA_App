var productHandler = {
    addCedulayb: function (
        id_usuario,
        nombre_usuario,
        fecha_entrada,
        geolocalizacion_entrada,
        id_cliente,
        nombre_cliente,
        horario_programado,
        estatus,
        tipo_cedula
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into cedulas_general(id_usuario,nombre_usuario,fecha_entrada,geolocalizacion_entrada,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula) values(?,?,?,?,?,?,?,?,?)",
                    [
                        id_usuario,
                        nombre_usuario,
                        fecha_entrada,
                        geolocalizacion_entrada,
                        id_cliente,
                        nombre_cliente,
                        horario_programado,
                        estatus,
                        tipo_cedula,
                    ],
                    function (tx, results) {
                        // console.log("Registro de cedula creado exitosamente");
                    },
                    function (tx, error) {
                        console.error("Error registrar cedula general:" + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDatosGenerales: function (
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
        fecha_revision
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_checklist(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision],
                    function (tx, results) {
                        //console.log("Frio correcto");
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },

            function () {}
        );
    },
    insertPreguntas: function (
        id_cedula,
        id_pregunta,
        revision,
        nombre_fase,
        nombre_seccion,
        fase,
        obligatorio,
        no_pregunta,
        respuesta,
        modelos,
        aux,
        aux2,
        multiple
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into checklist(id_cedula, id_pregunta, revision, nombre_fase, int_ext, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple) values(?,?,?,?,?,?,?,?,?,?,?)",
                    [id_cedula, id_pregunta, revision, nombre_fase, nombre_seccion, fase, obligatorio, no_pregunta, respuesta, modelos, multiple],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formCheck1",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },

            function () {}
        );
    },
    addDatosGenerales_limp: function (
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
        fecha_revision
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_revlimp(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision],
                    function (tx, results) {
                        //console.log("Frio correcto");
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },

            function () {}
        );
    },
    insertPreguntas_limp: function (
        id_cedula,
        id_pregunta,
        revision,
        nombre_fase,
        nombre_seccion,
        fase,
        obligatorio,
        no_pregunta,
        respuesta,
        modelos,
        aux,
        aux2,
        multiple
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into checklist_revlimp(id_cedula, id_pregunta, revision, nombre_fase, int_ext, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple) values(?,?,?,?,?,?,?,?,?,?,?)",
                    [id_cedula, id_pregunta, revision, nombre_fase, nombre_seccion, fase, obligatorio, no_pregunta, respuesta, modelos, multiple],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formLimp1",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },

            function () {}
        );
    },
    addDesincorHeader: function (
        id_cedula,
        nombre_cliente,
        fecha,
        estatusd,
        nombre_usuario,
        estatus_servidor,
        id_servidor,
        fechaApertura,
        OrigenApertura,
        OrigenCierre
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into desincorporaciones(id_cedula, empresa, fecha, estatus, userApertura, estatus_servidor, id_servidor, fechaApertura, OrigenApertura, OrigenCierre) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        nombre_cliente,
                        fecha,
                        estatusd,
                        nombre_usuario,
                        estatus_servidor,
                        id_servidor,
                        fechaApertura,
                        OrigenApertura,
                        OrigenCierre,
                    ],
                    function (tx, results) {},
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDesincorHeader2: function (
        id_cedula,
        nombre_cliente,
        fecha,
        estatusd,
        nombre_usuario,
        estatus_servidor,
        id_servidor,
        usuarioCierre,
        OrigenApertura,
        OrigenCierre
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into desincorporaciones(id_cedula, empresa, fecha, estatus, userApertura, estatus_servidor, id_servidor, userCierre, OrigenApertura, OrigenCierre) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        nombre_cliente,
                        fecha,
                        estatusd,
                        nombre_usuario,
                        estatus_servidor,
                        id_servidor,
                        usuarioCierre,
                        OrigenApertura,
                        OrigenCierre,
                    ],
                    function (tx, results) {},
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDetailsDes: function (
        ID,
        IDCabecero,
        Apoyo,
        JornadasNoIncorporadas,
        HoraD,
        HoraI,
        UnidadDID,
        UnidadD,
        UnidadIID,
        UnidadI,
        Itinerario,
        Motivo,
        Falla,
        SentidoD,
        SentidoI,
        UbicacionD,
        Incumplimiento,
        OperadorD,
        OperadorI,
        KmD,
        KmI,
        KmPerdidos,
        FolioD,
        FolioI,
        UsuarioI,
        UsuarioD,
        HoraCapturaD,
        HoraCapturaI,
        Origen,
        UbicacionI,
        JornadaSinIncorporacion,
        x,
        length,
        id_cedula
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT COUNT(id_cedula) as cont from desincorporacionesD WHERE id_servidor = ?",
                    [ID],
                    function (tx, results) {
                        var item = results.rows.item(0);
                        if (item.cont == 0) {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    if (JornadaSinIncorporacion == 1) {
                                        var estatus_servidor = 4;
                                    } else {
                                        if (UnidadI) {
                                            var estatus_servidor = 4;
                                        } else {
                                            var estatus_servidor = 2;
                                        }
                                    }
                                    tx.executeSql(
                                        //
                                        "insert into desincorporacionesD(id_cedula, apoyo, jornadas, HoraDes, UnidadDesinID, UnidadDesin, Itinerario, Falla, DetalleFalla, SentidoDes, UbicacionDes, OperadorDes, KmDes, FolioDes, UsuarioDes,estatus_servidor, id_servidor, HoraDesR, HoraInc, UnidadIncID, UnidadInc, SentidoInc, Inclumplimiento, OperadorInc, KmInc, KmPerdidos, FolioInc, Usuarioinc, HoraIncR, UbicacionInc, jornadaSIncorporacion) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                        [
                                            id_cedula,
                                            Apoyo,
                                            JornadasNoIncorporadas,
                                            HoraD,
                                            UnidadDID,
                                            UnidadD,
                                            Itinerario,
                                            Motivo,
                                            Falla,
                                            SentidoD,
                                            UbicacionD,
                                            OperadorD,
                                            KmD,
                                            FolioD,
                                            UsuarioD,
                                            estatus_servidor,
                                            ID,
                                            HoraCapturaD,
                                            HoraI,
                                            UnidadIID,
                                            UnidadI,
                                            SentidoI,
                                            Incumplimiento,
                                            OperadorI,
                                            KmI,
                                            KmPerdidos,
                                            FolioI,
                                            UsuarioI,
                                            HoraCapturaI,
                                            UbicacionI,
                                            JornadaSinIncorporacion,
                                        ],
                                        function (tx, results) {
                                            // console.log("inserta")
                                        },
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function (error) {}
                            );
                        } else {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    if (JornadaSinIncorporacion == 1) {
                                        var estatus_servidor = 4;
                                    } else {
                                        if (UnidadI) {
                                            var estatus_servidor = 4;
                                        } else {
                                            var estatus_servidor = 2;
                                        }
                                    }
                                    tx.executeSql(
                                        "UPDATE desincorporacionesD SET apoyo = ?, jornadas = ?, HoraDes = ?, UnidadDesinID = ?, UnidadDesin = ?, Itinerario = ?, Falla = ?, DetalleFalla = ?, SentidoDes = ?, UbicacionDes = ?, OperadorDes = ?, KmDes = ?, FolioDes = ?, UsuarioDes = ?,estatus_servidor = ?, HoraDesR = ?, HoraInc = ?, UnidadIncID = ?, UnidadInc = ?, SentidoInc = ?, Inclumplimiento = ?, OperadorInc = ?, KmInc = ?, KmPerdidos = ?, FolioInc = ?, Usuarioinc = ?, HoraIncR = ?, UbicacionInc = ?, jornadaSIncorporacion = ? WHERE id_servidor = ?",
                                        [
                                            Apoyo,
                                            JornadasNoIncorporadas,
                                            HoraD,
                                            UnidadDID,
                                            UnidadD,
                                            Itinerario,
                                            Motivo,
                                            Falla,
                                            SentidoD,
                                            UbicacionD,
                                            OperadorD,
                                            KmD,
                                            FolioD,
                                            UsuarioD,
                                            estatus_servidor,
                                            HoraCapturaD,
                                            HoraI,
                                            UnidadIID,
                                            UnidadI,
                                            SentidoI,
                                            Incumplimiento,
                                            OperadorI,
                                            KmI,
                                            KmPerdidos,
                                            FolioI,
                                            UsuarioI,
                                            HoraCapturaI,
                                            UbicacionI,
                                            JornadaSinIncorporacion,
                                            ID,
                                        ],
                                        function (tx, results) {
                                            // console.log("actualiza")
                                        },
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function (error) {}
                            );
                        }
                    },
                    function (tx, error) {}
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDetailsApoyo: function (
        ID,
        IDCabecero,
        Apoyo,
        TipoUnidad,
        Hora,
        UnidadID,
        Unidad,
        Ubicacion,
        Itinerario,
        TramoDeApoyo,
        Sentido,
        kilometrajeUnidad,
        kilometrajeApoyo,
        Operador,
        Usuario,
        HoraCaptura,
        Origen,
        x,
        length,
        id_cedula
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT COUNT(id_cedula) as cont from TRFapoyo WHERE id_servidor = ?",
                    [ID],
                    function (tx, results) {
                        var item = results.rows.item(0);
                        if (item.cont == 0) {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    var estatus_servidor = 4;
                                    tx.executeSql(
                                        //
                                        "insert into TRFapoyo(id_cedula,estatus_servidor, id_servidor, Apoyo, TipoUnidad, Hora, UnidadID,Unidad,Ubicacion,Itinerario,TramoDeApoyo,Sentido,kilometrajeUnidad,kilometrajeApoyo,Operador,Usuario,HoraCaptura) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                        [
                                            id_cedula,
                                            estatus_servidor,
                                            ID,
                                            Apoyo,
                                            TipoUnidad,
                                            Hora,
                                            UnidadID,
                                            Unidad,
                                            Ubicacion,
                                            Itinerario,
                                            TramoDeApoyo,
                                            Sentido,
                                            kilometrajeUnidad,
                                            kilometrajeApoyo,
                                            Operador,
                                            Usuario,
                                            HoraCaptura,
                                        ],
                                        function (tx, results) {
                                            // console.log("inserta")
                                        },
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function (error) {}
                            );
                        } else {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    var estatus_servidor = 4;
                                    tx.executeSql(
                                        "UPDATE TRFapoyo SET estatus_servidor = ?, Apoyo = ?, TipoUnidad = ?, Hora = ?, UnidadID = ?,Unidad = ?,Ubicacion = ?,Itinerario = ?,TramoDeApoyo = ?,Sentido = ?,kilometrajeUnidad = ?,kilometrajeApoyo = ?,Operador = ?,Usuario = ?,HoraCaptura = ? WHERE id_servidor = ?",
                                        [
                                            estatus_servidor,
                                            Apoyo,
                                            TipoUnidad,
                                            Hora,
                                            UnidadID,
                                            Unidad,
                                            Ubicacion,
                                            Itinerario,
                                            TramoDeApoyo,
                                            Sentido,
                                            kilometrajeUnidad,
                                            kilometrajeApoyo,
                                            Operador,
                                            Usuario,
                                            HoraCaptura,
                                            ID,
                                        ],
                                        function (tx, results) {
                                            // console.log("actualiza")
                                        },
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function (error) {}
                            );
                        }
                    },
                    function (tx, error) {}
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDatosGenerales_Recaudo: function (id_cedula, fecha, id_usuario, id_empresa) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_recaudo(id_cedula, fecha, id_usuario, id_empresa) values(?, ?, ?, ?)",
                    [id_cedula, fecha, id_usuario, id_empresa],
                    function (tx, results) {
                        //console.log("Frio correcto");
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },
            function () {}
        );
    },
    addDetalle_Recaudo: function (
        id_cedula,
        id_unidad,
        eco,
        fecha,
        Moneda50c,
        Moneda1,
        Moneda2,
        Moneda5,
        Moneda10,
        Moneda20,
        Moneda50,
        Moneda100,
        Moneda200,
        Moneda500,
        importe50c,
        importe1,
        importe2,
        importe5,
        importe10,
        importe20,
        importe50,
        importe100,
        importe200,
        importe500,
        piezas_totales,
        importe_total
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into detalle_recaudo(id_cedula, id_unidad, eco, fecha, Moneda50c, Moneda1, Moneda2, Moneda5, Moneda10, Moneda20, Moneda50, Moneda100, Moneda200, Moneda500, importe50c, importe1, importe2, importe5, importe10, importe20, importe50, importe100, importe200, importe500, piezas_totales, importe_total) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
                        id_unidad,
                        eco,
                        fecha,
                        Moneda50c,
                        Moneda1,
                        Moneda2,
                        Moneda5,
                        Moneda10,
                        Moneda20,
                        Moneda50,
                        Moneda100,
                        Moneda200,
                        Moneda500,
                        importe50c,
                        importe1,
                        importe2,
                        importe5,
                        importe10,
                        importe20,
                        importe50,
                        importe100,
                        importe200,
                        importe500,
                        piezas_totales,
                        importe_total,
                    ],
                    function (tx, results) {
                        //console.log("Frio correcto");
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },
            function () {}
        );
    },
    addDesincorHeaderRecaudo: function (
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
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_recaudo(id_cedula, fecha, id_usuario, id_empresa, observaciones, folio, folio2, recaudo_total, recaudo_sin_billetes, total_billetes, total_cacharpa, bolsas_totales, plomo, monto1, total_unidades, unidades_recaudads, promedio, bolsa50c, bolsa1, bolsa2, bolsa5, bolsa10, pico50c, pico1, pico2, pico5, pico10, opc_cacharpa, opc_adicional, bolsaCacharpa10, bolsaCacharpa20, bolsaCacharpa50, monto_adicional, bolsaAdd50c, bolsaAdd1, bolsaAdd2, bolsaAdd5, bolsaAdd10, importe_cacharpa, plomo2, plomo3, plomo4, plomo5, peso_cacharpa, estatus, origen, id_servidor) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id_cedula,
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
                        id,
                    ],
                    function (tx, results) {
                        //console.log("Frio correcto");
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },
            function () {}
        );
    },
    addDetailsDesRecaudo: function (
        ID,
        id_cedula,
        eco,
        Moneda50c,
        Moneda1,
        Moneda2,
        Moneda5,
        Moneda10,
        Moneda20,
        Moneda50,
        Moneda100,
        Moneda200,
        Moneda500,
        importe50c,
        importe1,
        importe2,
        importe5,
        importe10,
        importe20,
        importe50,
        importe100,
        importe200,
        importe500,
        piezas_totales,
        importe_total,
        id_unidad
    ) {
        Moneda50c ? null : (Moneda50c = 0);
        Moneda1 ? null : (Moneda1 = 0);
        Moneda2 ? null : (Moneda2 = 0);
        Moneda5 ? null : (Moneda5 = 0);
        Moneda10 ? null : (Moneda10 = 0);
        Moneda20 ? null : (Moneda20 = 0);
        Moneda50 ? null : (Moneda50 = 0);
        Moneda100 ? null : (Moneda100 = 0);
        Moneda200 ? null : (Moneda200 = 0);
        Moneda500 ? null : (Moneda500 = 0);
        importe50c ? null : (importe50c = 0);
        importe1 ? null : (importe1 = 0);
        importe2 ? null : (importe2 = 0);
        importe5 ? null : (importe5 = 0);
        importe10 ? null : (importe10 = 0);
        importe20 ? null : (importe20 = 0);
        importe50 ? null : (importe50 = 0);
        importe100 ? null : (importe100 = 0);
        importe200 ? null : (importe200 = 0);
        importe500 ? null : (importe500 = 0);
        piezas_totales ? null : (piezas_totales = 0);
        importe_total ? null : (importe_total = 0);
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT COUNT(id_cedula) as cont from detalle_recaudo WHERE id_servidor = ?",
                    [ID],
                    function (tx, results) {
                        var item = results.rows.item(0);
                        if (item.cont == 0) {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        //
                                        "insert into detalle_recaudo(id_cedula,id_unidad,id_servidor,eco, Moneda50c, Moneda1, Moneda2, Moneda5, Moneda10, Moneda20, Moneda50, Moneda100, Moneda200, Moneda500, importe50c, importe1, importe2, importe5, importe10, importe20, importe50, importe100, importe200, importe500, piezas_totales, importe_total) values(? ,? ,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)",
                                        [
                                            id_cedula,
                                            id_unidad,
                                            ID,
                                            eco,
                                            Moneda50c,
                                            Moneda1,
                                            Moneda2,
                                            Moneda5,
                                            Moneda10,
                                            Moneda20,
                                            Moneda50,
                                            Moneda100,
                                            Moneda200,
                                            Moneda500,
                                            importe50c,
                                            importe1,
                                            importe2,
                                            importe5,
                                            importe10,
                                            importe20,
                                            importe50,
                                            importe100,
                                            importe200,
                                            importe500,
                                            piezas_totales,
                                            importe_total,
                                        ],
                                        function (tx, results) {
                                            // console.log("inserta")
                                        },
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function (error) {}
                            );
                        } else {
                            databaseHandler.db.transaction(
                                function (tx) {
                                    tx.executeSql(
                                        "UPDATE detalle_recaudo SET eco = ?, id_unidad = ? Moneda50c = ?, Moneda1 = ?, Moneda2 = ?, Moneda5 = ?, Moneda10 = ?, Moneda20 = ?, Moneda50 = ?, Moneda100 = ?, Moneda200 = ?, Moneda500 = ?, importe50c = ?, importe1 = ?, importe2 = ?, importe5 = ?, importe10 = ?, importe20 = ?, importe50 = ?, importe100 = ?, importe200 = ?, importe500 = ?, piezas_totales = ?, importe_total = ?, fecha WHERE id_servidor = ?",
                                        [
                                            eco,
                                            id_unidad,
                                            Moneda50c,
                                            Moneda1,
                                            Moneda2,
                                            Moneda5,
                                            Moneda10,
                                            Moneda20,
                                            Moneda50,
                                            Moneda100,
                                            Moneda200,
                                            Moneda500,
                                            importe50c,
                                            importe1,
                                            importe2,
                                            importe5,
                                            importe10,
                                            importe20,
                                            importe50,
                                            importe100,
                                            importe200,
                                            importe500,
                                            piezas_totales,
                                            importe_total,
                                            fecha,
                                            ID,
                                        ],
                                        function (tx, results) {
                                            // console.log("actualiza")
                                        },
                                        function (tx, error) {}
                                    );
                                },
                                function (error) {},
                                function (error) {}
                            );
                        }
                    },
                    function (tx, error) {}
                );
            },
            function (error) {},
            function () {}
        );
    },
    addDatosGenerales_Diesel: function (id_cedula, fecha, id_usuario, id_empresa, estatus, origen, nombre_usuario, fechaReal) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datos_generales_diesel(id_cedula, fecha, id_usuario, id_empresa,estatus, origen, nombre_usuario, fechaReal) values(?, ?, ?, ?, ?, ?, ?, ?)",
                    [id_cedula, fecha, id_usuario, id_empresa, estatus, origen, nombre_usuario, fechaReal],
                    function (tx, results) {
                        //console.log("Frio correcto");
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },
            function () {}
        );
    },
    addDatosGeneralesFlota: function (
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
        intervalo
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into datosGeneralesFlota(id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision, flagInspeccion, VIN, ultimoMantenimiento, tipoMannto, medidor, intervalo) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
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
                    ],
                    function (tx, results) {
                        if (flag == 0) {
                            app.views.main.router.back("/formFlota4/", {
                                force: true,
                                ignoreCache: true,
                                reload: true,
                            });
                        }
                        localStorage.setItem("IdHeader", flag);
                        // if (flag == 0) {
                        //     databaseHandler.db.transaction(
                        //         function (tx) {
                        //             tx.executeSql(
                        //                 "UPDATE cedulas_general SET fecha_salida  = ?,estatus = ? WHERE id_cedula = ?",
                        //                 [getDateWhitZeros(), 1, id_cedula],
                        //                 function (tx, results) {

                        //                 },
                        //                 function (tx, error) {
                        //                     swal(
                        //                         "Error al guardar",
                        //                         error.message,
                        //                         "error"
                        //                     );
                        //                 }
                        //             );
                        //         },
                        //         function (error) {},
                        //         function () {}
                        //     );
                        // }
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },

            function () {}
        );
    },
    insertPreguntasFlota: function (
        id_cedula,
        id_pregunta,
        revision,
        nombre_fase,
        fase,
        obligatorio,
        no_pregunta,
        respuesta,
        modelos,
        aux,
        aux2,
        multiple,
        criterio,
        ponderacion
    ) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into checklistFlota(id_cedula, id_pregunta, revision, nombre_fase, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple, criterio, ponderacion) values(?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        id_cedula,
                        id_pregunta,
                        revision,
                        nombre_fase,
                        fase,
                        obligatorio,
                        no_pregunta,
                        respuesta,
                        modelos,
                        multiple,
                        criterio,
                        ponderacion,
                    ],
                    function (tx, results) {
                        if (aux == aux2) {
                            app.dialog.close();
                            app.views.main.router.navigate({
                                name: "formFlota1",
                            });
                        } else {
                            var dialog = app.dialog.get();
                            dialog.setProgress((aux2 * 100) / aux);
                            dialog.setText(aux2 + " de " + aux);
                        }
                    },
                    function (tx, error) {
                        console.error("Error registrar:" + error.message);
                    }
                );
            },
            function (error) {
                console.log(error);
            },

            function () {}
        );
    },
};
