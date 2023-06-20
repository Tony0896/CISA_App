var databaseHandler = {
    db: null,
    createDatabase: function(){
        this.db = window.sqlitePlugin.openDatabase({name: 'cisa.db', location: 'default', androidDatabaseProvider: 'system'});
        this.db.transaction(
            function(tx){
                // General
                tx.executeSql(
                    "create table if not exists Actualizaciones (idActualizacion integer primary key,IdUsuario integer, Fecha text)",
                    [],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de cedulas_general: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists cedulas_general(id_cedula integer primary key,tipo_cedula text,id_usuario text,nombre_usuario text,fecha_entrada text,geolocalizacion_entrada text,id_cliente text,nombre_cliente text,horario_programado text,calificacion text,fecha_salida text,geolocalizacion_salida text,estatus integer,comentario_cliente text,nombre_evalua text)",
                    [],
                    function(tx, results){
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de cedulas_general: " + error.message);
                    }
                );
                // if(localStorage.getItem("Modulos") == 'Imagen' || localStorage.getItem("Modulos") == 'Checklist' || localStorage.getItem("Modulos") == 'Limpieza'){
                    tx.executeSql(
                        "create table if not exists checklist(id_check integer primary key, id_cedula integer, id_pregunta integer, revision text, nombre_fase text, int_ext text, id_fase int, obligatorio int, no_pregunta int, respuesta int, modelo int, comentarios text, multiple int)",
                        [],
                        function(tx, results){
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists datos_generales_checklist(id_dato integer primary key,id_cedula integer, Unidad text, Chasis text, Familia text, marca text, Empresa text, FK_id_unidad int, id_unidad_vs int, FK_id_empresa int, id_modelo_check int, comentarios_generales text, fecha_revision text)",
                        [],
                        function(tx, results){
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists datos_generales_revlimp(id_dato integer primary key,id_cedula integer, Unidad text, Chasis text, Familia text, marca text, Empresa text, FK_id_unidad int, id_unidad_vs int, FK_id_empresa int, id_modelo_check int, comentarios_generales text, fecha_revision text)",
                        [],
                        function(tx, results){
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists checklist_revlimp(id_check integer primary key, id_cedula integer, id_pregunta integer, revision text, nombre_fase text, int_ext text, id_fase int, obligatorio int, no_pregunta int, respuesta int, modelo int, comentarios text, multiple int)",
                        [],
                        function(tx, results){
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                // } else if(localStorage.getItem("Modulos") == 'Desincorporaciones'){
                    tx.executeSql(  
                        "create table if not exists desincorporaciones(id_des integer primary key, id_cedula integer, empresa text, fecha text, estatus text, userApertura text, userCierre text, Folio text, estatus_servidor int, id_servidor int, fecha2 text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo desincorporaciones correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                    tx.executeSql(  
                        "create table if not exists desincorporacionesD(id_desD integer primary key, id_cedula integer, apoyo int, jornadas int, HoraDes text, HoraInc text, UnidadDesinID int, UnidadDesin text, UnidadIncID int, UnidadInc text, Itinerario text, Falla text, DetalleFalla text, SentidoDes text, SentidoInc text, UbicacionDes text, UbicacionInc text, Inclumplimiento text, OperadorDes text, id_operador_des text, id_operador_inc text, OperadorInc text, KmDes text, KmInc text, FolioDes text, FolioInc text, Usuarioinc text, UsuarioDes text, KmPerdidos text, estatus_servidor int, id_servidor int, HoraIncR text, HoraDesR text, jornadaSIncorporacion int)",
                        [],
                        function(tx, results){
                            // console.log("Se creo desincorporacionesD correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                    tx.executeSql(  
                        "create table if not exists TRFapoyo(id_apoyo integer primary key, id_cedula integer, Apoyo int, TipoUnidad int, Hora text, UnidadID int, Unidad text, Itinerario text, Sentido text, Ubicacion text, Operador text, id_operador text, kilometrajeUnidad text, Usuario text, estatus_servidor int, id_servidor int, HoraCaptura text, TramoDeApoyo text, kilometrajeApoyo text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo desincorporacionesD correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla" + error.message);
                        }
                    );
                // } else if(localStorage.getItem("Modulos") == 'Recaudo'){
                    tx.executeSql(
                        "create table if not exists datos_generales_recaudo(id_dato integer primary key, id_cedula integer, fecha text, id_usuario text, id_empresa integer, observaciones text, folio text, folio2 text, recaudo_total float, recaudo_sin_billetes float, total_billetes float, total_cacharpa float, bolsas_totales integer, plomo text, monto1 float, total_unidades integer, unidades_recaudads integer, promedio float, bolsa50c integer, bolsa1 integer, bolsa2 integer, bolsa5 integer, bolsa10 integer, pico50c integer, pico1 integer, pico2 integer, pico5 integer, pico10 integer, opc_cacharpa integer, opc_adicional integer, bolsaCacharpa10 integer, bolsaCacharpa20 integer, bolsaCacharpa50 integer, monto_adicional integer, bolsaAdd50c integer, bolsaAdd1 integer, bolsaAdd2 integer, bolsaAdd5 integer, bolsaAdd10 integer, importe_cacharpa integer, plomo2 text, plomo3 text, plomo4 text, plomo5 text, peso_cacharpa float, origen int, id_servidor int, estatus int)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de datos_generales_recaudo: " + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists detalle_recaudo(id_detalle integer primary key, id_cedula integer, id_unidad integer, eco text, Moneda50c integer, Moneda1 integer, Moneda2 integer, Moneda5 integer, Moneda10 integer, Moneda20 integer, Moneda50 integer, Moneda100 integer, Moneda200 integer, Moneda500 integer, importe50c float, importe1 float, importe2 float, importe5 float, importe10 float, importe20 float, importe50 float, importe100 float, importe200 float, importe500 float, piezas_totales integer, importe_total float, fecha text, origen int, id_servidor int)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de detalle_recaudo: " + error.message);
                        }
                    );
                // }
            },
            function(error){
                console.error("Error al crear la base de datos: " + error.message);
            },
            function(){
                // console.log("Base de datos creada exitosamente");
            }
        );
    }
}