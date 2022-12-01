var productHandler={
    addCedulayb: function(id_usuario,nombre_usuario,fecha_entrada,geolocalizacion_entrada,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula){
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql(
                    "insert into cedulas_general(id_usuario,nombre_usuario,fecha_entrada,geolocalizacion_entrada,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula) values(?,?,?,?,?,?,?,?,?)",
                    [id_usuario,nombre_usuario,fecha_entrada,geolocalizacion_entrada,id_cliente,nombre_cliente,horario_programado,estatus,tipo_cedula],
                    function(tx, results){
                        // console.log("Registro de cedula creado exitosamente");
                    },
                    function(tx, error){
                        console.error("Error registrar cedula general:" + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    },
    addDatosGenerales: function (id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision){
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
                console.log(error)
            },
      
            function () {}
          );
    },
    insertPreguntas: function (id_cedula,id_pregunta,revision,nombre_fase,nombre_seccion,fase,obligatorio,no_pregunta,respuesta,modelos,aux,aux2,multiple){
      databaseHandler.db.transaction(
          function (tx) {
            tx.executeSql(
              "insert into checklist(id_cedula, id_pregunta, revision, nombre_fase, int_ext, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple) values(?,?,?,?,?,?,?,?,?,?,?)",
              [id_cedula,id_pregunta,revision,nombre_fase,nombre_seccion,fase,obligatorio,no_pregunta,respuesta,modelos,multiple],
              function (tx, results) {
                if(aux == aux2){
                  app.dialog.close();
                  app.views.main.router.navigate({ name: 'formCheck1'});
                }else{
                  var dialog = app.dialog.get();
                  dialog.setProgress((aux2 * 100) / aux);
                  dialog.setText(aux2+' de '+aux);
                }
              },
              function (tx, error) {
                console.error("Error registrar:" + error.message);
              }
            );
          },
          function (error) {
              console.log(error)
          },
    
          function () {}
        );
  },
  addDatosGenerales_limp: function (id_cedula, Unidad, Chasis, Familia, marca, Empresa, FK_id_unidad, id_unidad_vs, FK_id_empresa, id_modelo_check, fecha_revision){
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
            console.log(error)
        },
  
        function () {}
      );
  },
  insertPreguntas_limp: function (id_cedula,id_pregunta,revision,nombre_fase,nombre_seccion,fase,obligatorio,no_pregunta,respuesta,modelos,aux,aux2,multiple){
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "insert into checklist_revlimp(id_cedula, id_pregunta, revision, nombre_fase, int_ext, id_fase, obligatorio, no_pregunta, respuesta, modelo, multiple) values(?,?,?,?,?,?,?,?,?,?,?)",
            [id_cedula,id_pregunta,revision,nombre_fase,nombre_seccion,fase,obligatorio,no_pregunta,respuesta,modelos,multiple],
            function (tx, results) {
              if(aux == aux2){
                app.dialog.close();
                app.views.main.router.navigate({ name: 'formLimp1'});
              }else{
                var dialog = app.dialog.get();
                dialog.setProgress((aux2 * 100) / aux);
                dialog.setText(aux2+' de '+aux);
              }
            },
            function (tx, error) {
              console.error("Error registrar:" + error.message);
            }
          );
        },
        function (error) {
            console.log(error)
        },

        function () {}
      );
  },
};