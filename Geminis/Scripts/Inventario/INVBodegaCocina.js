$(document).ready(function () {
    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
  /*  ObtenerUnidadMedidaSelect()*/
    /*   ObtenerTipoEmpleadoSelect();*/
    llenarReporte();
    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    // --------------------funcion de llenado de reporte---------------------------
    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/INVBodegaCocina/CargarTablaInventarioCocina',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: {},
                    cache: false,
                    success: function (data) {
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);
                    },
                    error: function (jqXHR, exception) {
                    }
                });
                return d.promise();
            }
        });
        var salesPivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            columnAutoWidth: true,
            wordWrapEnabled: true,
            showBorders: true,
            rowAlternationEnabled: true,
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100],
                showNavigationButtons: true,
                showInfo: true,
                infoText: "Pagina {0} de {1} ({2} items)"
            },
            columns: [
                {
                    dataField: "ID_INVENTARIO_COCINA",
                    caption: "ID COCINA",
                    visible: false
                },

                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE PRODUCTO"
                },
                {
                    dataField: "ID_UNIDAD_MEDIDA",
                    caption: "UNIDAD MEDIDA",
                    visible: false
                },
                {
                    dataField: "UNIDAD_MEDIDA",
                    caption: "UNIDAD DE MEDIDA"
                }
                ,
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "FECHA_INGRESO",
                    caption: "FECHA INGRESO"
                },
                {
                    dataField: "PRECIO",
                    caption: "PRECIO",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "SUBTOTAL",
                    caption: "SUBTOTAL",
                    format: { type: 'fixedPoint', precision: 2 }
                }    
            ]    
        });
    }
    
});