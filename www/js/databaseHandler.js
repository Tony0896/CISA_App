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
                if(localStorage.getItem("Modulos") == 'Imagen' || localStorage.getItem("Modulos") == 'Checklist' || localStorage.getItem("Modulos") == 'Limpieza'){
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
                } else if(localStorage.getItem("Modulos") == 'Desincorporaciones'){
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
                }
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