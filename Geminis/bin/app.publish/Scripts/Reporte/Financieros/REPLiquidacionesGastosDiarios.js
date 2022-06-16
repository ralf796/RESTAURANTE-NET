$(document).ready(function () {
    loadpage();
    //CARGAR LA PLANTA Y PUNTO DE VENTA
    setFormValidation('#forreporte');
    //CARGAR LOS SELECT DE FECHA
    $('.datepicker').datetimepicker({
        format: 'DD/MM/YYYY',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });




    //CARGA LISTAPLANTAS
    function loadpage() {

        ListarPlantas();

    };

    //mostra mensajes
    function ShowShortMessage(type, title, text) {
        Swal.fire({
            position: 'inherit',
            type: type,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2500
        })
    }


    //muestra las plantas que tiene el usuario
    function ListarPlantas() {
        CallLoadingFire();
        $.ajax({
            type: 'GET',
            url: '/REPLiquidacionesGastosDiarios/ListarPlantas',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: {},
            cache: false,
            success: function (data) {

                if (data["Estado"] == -1) {
                    var msg = data["Mensaje"];
                    ShowMessage('error', 'Error', msg);
                    return;
                }

                if (data["Estado"] == 1) {
                    var listPLANTA = data['planta'];
                   
                    $('#selPlanta').empty();
                    listPLANTA.forEach(function (planta) {
                        $('#selPlanta').append('<option value="' + planta.PLANTAS + '">' + planta.DESCRIPCION + '</option>');
                    });

                    $('#selPlanta').selectpicker();
                    $('#selPlanta').selectpicker('refresh');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }




    //OBJETO PLANTA PARA MOSTRAR PLANTAS
    function PLANTAS(PLANTAS) {
        this.PLANTA = PLANTAS;
    }
    //cargar reporte 
    //permite generar el reporte a travez del evento click
    $('#btnGenerarReporte').on('click', function (e) {
        e.preventDefault();
        if ($('#forreporte').valid()) {
          
        
                var cantPlantas = $('#selPlanta').val().split(',');

                var listaplantas = [];
                listaplantas.length = 0;
                for (var i = 0; i < cantPlantas.length; i++) {
                    var listado = new PLANTAS(cantPlantas[i]);
                    listaplantas.push(listado);
                }

                generarReporte($('#txtFechaInicio').val(), $('#txtFechaFinal').val(), listaplantas);
               
           
        }//
        

    });

    //carga del reporte
    function generarReporte(pfechaI, pfechaF, pPlanta) {
    
     
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                CallLoadingFire();
                $.ajax({
                    type: 'GET',
                    url: '/REPLiquidacionesGastosDiarios/ObtenerInformacionReporte',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { fechaI: pfechaI, fechaF: pfechaF, plantas: JSON.stringify(pPlanta) },
                    cache: false,
                    success: function (data) {
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);
                    },
                    error: function (jqXHR, exception) {
                    }
                });
                return d.promise();
            },
            byKey: function (key, extra) {
            },
            update: function (key, values) {
            }
        });

        var PivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            keyExpr: "CONSUMO_INTERNO",
            headerFilter: {
                visible: true,
                allowSearch: true
            },
            wordWrapEnabled: true,
            showBorders: true,
            rowAlternationEnabled: true,
            columnHidingEnabled: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            headerFilter: {
                visible: true
            },
            groupPanel: {
                visible: true,
                emptyPanelText: 'Arrastra una columna aquí para agrupar por ella'
            },
            grouping: {
                autoExpandAll: true,
            },
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100],
                showNavigationButtons: true,
                showInfo: true,
                infoText: "Pagina {0} de {1} ({2} items)"
            },
            sortByGroupSummaryInfo: [{
                summaryItem: "count"
            }],
            columns: [
                {
                    dataField: "FECHA",
                    caption: "FECHA.",
                    columnAutoWidth: true,
                    visible: true
                },
                  {
                      dataField: "LIQUIDACION",
                      caption: "# LIQUIDACION",
                      columnAutoWidth: true,
                      visible: true
                  },
                    {
                        dataField: "DATO_FACTURA",
                        caption: "FACTURA",
                        columnAutoWidth: true,
                        visible: true
                    },
                {
                    dataField: "PROVEEDOR",
                    caption: "PROVEEDOR",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "DESCRIPCION",
                    caption: "DESCRIPCION",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "ID_CANAL_VENTA",
                    caption: "ID_CANAL_VENTA",
                    columnAutoWidth: true,
                    visible: false
                },
                {
                    dataField: "CANAL",
                    caption: "CANAL",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "PUNTO_VENTA",
                    caption: "PUNTO_VENTA",
                    columnAutoWidth: true,
                    visible: false
                },
                {
                    dataField: "UNIDAD_DE_VENTA",
                    caption: "UNIDAD DE VENTA",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "ID_RESPONSABLE",
                    caption: "ID_RESPONSABLE",
                    columnAutoWidth: true,
                    visible: false
                },
                {
                    dataField: "NOMBRE_RESPONSABLE",
                    caption: "RESPONSABLE",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "RUBRO",
                    caption: "RUBRO",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "SUBRUBRO",
                    caption: "SUBRUBRO",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "PLACA",
                    caption: "PLACA",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "MARCA",
                    caption: "MARCA",
                    columnAutoWidth: true
                
                },
                {
                    dataField: "ID_PLANTA",
                    caption: "ID_PLANTA",
                    columnAutoWidth: true,
                    visible: false
                },
                {
                    dataField: "CEDIS",
                    caption: "CEDIS",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "TIPO",
                    caption: "TIPO",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
                    columnAutoWidth: true,
                    visible: true
                },
                {
                    dataField: "GALONES",
                    caption: "GALONES",
                    columnAutoWidth: true,
                    visible: true
                }
           
            ],

            export: {
                enabled: true,
                fileName: 'REPORTE lIQUIDACION OTROS GASTOS'
            },
        });
    }


    //validacion
    function setFormValidation(id) {
        $(id).validate({
            highlight: function (element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');

            },
            success: function (element) {
                $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');

            },
            errorPlacement: function (error, element) {
                $(element).closest('.form-group').append(error);
            },
        });
    };


});