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
  addDesincorHeader: function (id_cedula,nombre_cliente,fecha,estatusd,nombre_usuario, estatus_servidor, id_servidor){
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "insert into desincorporaciones(id_cedula, empresa, fecha, estatus, userApertura, estatus_servidor, id_servidor) values(?, ?, ?, ?, ?, ?, ?)",
            [id_cedula,nombre_cliente,fecha,estatusd,nombre_usuario,estatus_servidor, id_servidor],
            function (tx, results) { },
            function (tx, error) { console.error("Error registrar:" + error.message); }
          );
        },
        function (error) {},
        function () {}
      );
  },
  addDesincorHeader2: function (id_cedula,nombre_cliente,fecha,estatusd,nombre_usuario, estatus_servidor, id_servidor, usuarioCierre){
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "insert into desincorporaciones(id_cedula, empresa, fecha, estatus, userApertura, estatus_servidor, id_servidor, userCierre) values(?, ?, ?, ?, ?, ?, ?, ?)",
            [id_cedula,nombre_cliente,fecha,estatusd,nombre_usuario,estatus_servidor, id_servidor, usuarioCierre],
            function (tx, results) { },
            function (tx, error) { console.error("Error registrar:" + error.message); }
          );
        },
        function (error) {},
        function () {}
      );
  },
  addDetailsDes: function (ID, IDCabecero, Apoyo, JornadasNoIncorporadas, HoraD, HoraI, UnidadDID, UnidadD, UnidadIID, UnidadI, Itinerario, Motivo, Falla, SentidoD, SentidoI, UbicacionD, Incumplimiento, OperadorD, OperadorI, KmD, KmI, KmPerdidos, FolioD, FolioI, UsuarioI, UsuarioD, HoraCapturaD, HoraCapturaI, Origen, UbicacionI, JornadaSinIncorporacion, x, length, id_cedula){
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "SELECT COUNT(id_cedula) as cont from desincorporacionesD WHERE id_servidor = ?",
            [ID],
            function (tx, results) {
              var item = results.rows.item(0);
              if(item.cont == 0){
                databaseHandler.db.transaction(
                  function (tx) {
                    if(UnidadI){
                      var estatus_servidor = 4;
                    } else {
                      var estatus_servidor = 2;
                    }
                    tx.executeSql(//
                      "insert into desincorporacionesD(id_cedula, apoyo, jornadas, HoraDes, UnidadDesinID, UnidadDesin, Itinerario, Falla, DetalleFalla, SentidoDes, UbicacionDes, OperadorDes, KmDes, FolioDes, UsuarioDes,estatus_servidor, id_servidor, HoraDesR, HoraInc, UnidadIncID, UnidadInc, SentidoInc, Inclumplimiento, OperadorInc, KmInc, KmPerdidos, FolioInc, Usuarioinc, HoraIncR, UbicacionInc, jornadaSIncorporacion) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                      [id_cedula, Apoyo, JornadasNoIncorporadas, HoraD, UnidadDID, UnidadD, Itinerario, Motivo, Falla, SentidoD, UbicacionD, OperadorD, KmD, FolioD, UsuarioD,estatus_servidor, ID, HoraCapturaD, HoraI, UnidadIID, UnidadI, SentidoI, Incumplimiento, OperadorI, KmI, KmPerdidos, FolioI, UsuarioI, HoraCapturaI, UbicacionI, JornadaSinIncorporacion],
                      function (tx, results) {
                        console.log("inserta")
                      },
                      function (tx, error) { }
                    );
                  },
                  function (error) { },
                  function (error ) { }
                );
              } else{
                databaseHandler.db.transaction(
                  function (tx) {
                    if(UnidadI){
                      var estatus_servidor = 4;
                    } else {
                      var estatus_servidor = 2;
                    }
                    tx.executeSql(
                      "UPDATE desincorporacionesD SET apoyo = ?, jornadas = ?, HoraDes = ?, UnidadDesinID = ?, UnidadDesin = ?, Itinerario = ?, Falla = ?, DetalleFalla = ?, SentidoDes = ?, UbicacionDes = ?, OperadorDes = ?, KmDes = ?, FolioDes = ?, UsuarioDes = ?,estatus_servidor = ?, HoraDesR = ?, HoraInc = ?, UnidadIncID = ?, UnidadInc = ?, SentidoInc = ?, Inclumplimiento = ?, OperadorInc = ?, KmInc = ?, KmPerdidos = ?, FolioInc = ?, Usuarioinc = ?, HoraIncR = ?, UbicacionInc = ?, jornadaSIncorporacion = ? WHERE id_servidor = ?",
                      [Apoyo, JornadasNoIncorporadas, HoraD, UnidadDID, UnidadD, Itinerario, Motivo, Falla, SentidoD, UbicacionD, OperadorD, KmD, FolioD, UsuarioD,estatus_servidor, HoraCapturaD, HoraI, UnidadIID, UnidadI, SentidoI, Incumplimiento, OperadorI, KmI, KmPerdidos, FolioI, UsuarioI, HoraCapturaI, UbicacionI, JornadaSinIncorporacion, ID],
                      function (tx, results) {
                          console.log("actualiza")
                      },
                      function (tx, error) { }
                    );
                  },
                  function (error) { },
                  function (error) { }
                ); 
              }
             },
            function (tx, error) {  }
          );
        },
        function (error) {},
        function () {}
      );
  },
  addDetailsApoyo: function (ID, IDCabecero, Apoyo, TipoUnidad, Hora, UnidadID,Unidad,Ubicacion,Itinerario,TramoDeApoyo,Sentido,kilometrajeUnidad,kilometrajeApoyo,Operador,Usuario,HoraCaptura,Origen, x, length, id_cedula){
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "SELECT COUNT(id_cedula) as cont from TRFapoyo WHERE id_servidor = ?",
            [ID],
            function (tx, results) {
              var item = results.rows.item(0);
              if(item.cont == 0){
                databaseHandler.db.transaction(
                  function (tx) {
                    var estatus_servidor = 4;
                    tx.executeSql(//
                      "insert into TRFapoyo(id_cedula,estatus_servidor, id_servidor, Apoyo, TipoUnidad, Hora, UnidadID,Unidad,Ubicacion,Itinerario,TramoDeApoyo,Sentido,kilometrajeUnidad,kilometrajeApoyo,Operador,Usuario,HoraCaptura) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      [id_cedula, estatus_servidor, ID, Apoyo, TipoUnidad, Hora, UnidadID,Unidad,Ubicacion,Itinerario,TramoDeApoyo,Sentido,kilometrajeUnidad,kilometrajeApoyo,Operador,Usuario,HoraCaptura],
                      function (tx, results) {
                        console.log("inserta")
                      },
                      function (tx, error) { }
                    );
                  },
                  function (error) { },
                  function (error ) { }
                );
              } else{
                databaseHandler.db.transaction(
                  function (tx) {
                    var estatus_servidor = 4;
                    tx.executeSql(
                      "UPDATE TRFapoyo SET estatus_servidor = ?, Apoyo = ?, TipoUnidad = ?, Hora = ?, UnidadID = ?,Unidad = ?,Ubicacion = ?,Itinerario = ?,TramoDeApoyo = ?,Sentido = ?,kilometrajeUnidad = ?,kilometrajeApoyo = ?,Operador = ?,Usuario = ?,HoraCaptura = ? WHERE id_servidor = ?",
                      [estatus_servidor, Apoyo, TipoUnidad, Hora, UnidadID,Unidad,Ubicacion,Itinerario,TramoDeApoyo,Sentido,kilometrajeUnidad,kilometrajeApoyo,Operador,Usuario,HoraCaptura, ID],
                      function (tx, results) {
                          console.log("actualiza")
                      },
                      function (tx, error) { }
                    );
                  },
                  function (error) { },
                  function (error) { }
                ); 
              }
             },
            function (tx, error) {  }
          );
        },
        function (error) {},
        function () {}
      );
  },
  addDatosGenerales_Recaudo: function (id_cedula, fecha, id_usuario, id_empresa){
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
            console.log(error)
        },
        function () {}
      );
  },
  addDetalle_Recaudo: function (id_cedula, eco, Moneda50c, Moneda1, Moneda2, Moneda5, Moneda10, Moneda20, Moneda50, Moneda100, Moneda200, Moneda500, importe50c, importe1, importe2, importe5, importe10, importe20, importe50, importe100, importe200, importe500, piezas_totales, importe_total){
    databaseHandler.db.transaction(
        function (tx) {
          tx.executeSql(
            "insert into detalle_recaudo(id_cedula, eco, Moneda50c, Moneda1, Moneda2, Moneda5, Moneda10, Moneda20, Moneda50, Moneda100, Moneda200, Moneda500, importe50c, importe1, importe2, importe5, importe10, importe20, importe50, importe100, importe200, importe500, piezas_totales, importe_total) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id_cedula, eco, Moneda50c, Moneda1, Moneda2, Moneda5, Moneda10, Moneda20, Moneda50, Moneda100, Moneda200, Moneda500, importe50c, importe1, importe2, importe5, importe10, importe20, importe50, importe100, importe200, importe500, piezas_totales, importe_total],
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
};