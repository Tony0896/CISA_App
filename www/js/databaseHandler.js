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
                        // console.log("Se creo Actualizaciones correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de cedulas_general: " + error.message);
                    }
                );
                tx.executeSql(
                    "create table if not exists cedulas_general(id_cedula integer primary key,tipo_cedula text,id_usuario integer,nombre_usuario text,fecha_entrada text,geolocalizacion_entrada text,id_cliente text,nombre_cliente text,horario_programado text,calificacion text,fecha_salida text,geolocalizacion_salida text,estatus integer,comentario_cliente text,nombre_evalua text)",
                    [],
                    function(tx, results){
                        // console.log("Se creo cedulas_general correctamente!");
                    },
                    function(tx, error){
                        console.error("Error al crear la tabla de cedulas_general: " + error.message);
                    }
                );
                var empresa = localStorage.getItem("nombre_empresa");
                //if(empresa == "DIPREC"){
                    tx.executeSql(
                        "create table if not exists checklist(id_check integer primary key, id_cedula integer, id_pregunta integer, revision text, nombre_fase text, int_ext text, id_fase int, obligatorio int, no_pregunta int, respuesta int, modelo int, comentarios text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de levantamiento_smc: " + error.message);
                        }
                    );
                    tx.executeSql(
                        "create table if not exists datos_generales_checklist(id_dato integer primary key,id_cedula integer, Unidad text, Chasis text, Familia text, marca text, Empresa text, FK_id_unidad int, id_unidad_vs int, FK_id_empresa int, id_modelo_check int, comentarios_generales text)",
                        [],
                        function(tx, results){
                            // console.log("Se creo Servicio tecnico DIPREC correctamente!");
                        },
                        function(tx, error){
                            console.error("Error al crear la tabla de levantamiento_smc: " + error.message);
                        }
                    );
                //}
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
