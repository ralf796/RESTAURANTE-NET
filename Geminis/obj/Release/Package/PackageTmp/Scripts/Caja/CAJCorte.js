$(document).ready(function () {

    fillAllInputs();


    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function ShowShortMessage(type, title, text) {
        Swal.fire({
            position: 'inherit',
            type: type,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 5000
        })
    }

    llenarReporte();
    var ppedido;
    DevExpress.localization.locale(navigator.language);
    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/CAJCorte/GetPedidos',
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
            },
            byKey: function (key, extra) {
            },
            update: function (key, values) {
            }
        });
        var store = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/PEDCrearPedido/GetDetallePedido',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { pedido: ppedido },
                    cache: false,
                    success: function (data) {
                        debugger;
                        var state = data["ESTADO"];
                        if (state == 1) {
                            data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                            d.resolve(data);
                        }
                        else if (state == 2)
                            ShowShortMessage('warning', '¡Advertencia!', 'No se encuentran refacturas para la nota seleccionada.');
                        else if (state == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                    }
                });
                return d.promise();
            },
            byKey: function (key, extra) { },
            update: function (key, values) { }
        });

        var salesPivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            showBorders: true,
            rowAlternationEnabled: true,
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100],
                showNavigationButtons: true,
                showInfo: true,
                infoText: "Pagina {0} de {1} ({2} items)"
            },
            columnAutoWidth: true,
            summary: {
                totalItems: [
                    {
                        column: 'TOTAL',
                        summaryType: 'sum',
                        displayFormat: "{0}",
                        valueFormat: {
                            type: "fixedPoint",
                            precision: 2
                        }
                    }
                ]
            },
            columns: [
                {
                    dataField: "ID_PEDIDO",
                    caption: "NO. PEDIDO",
                    alignment: "center"
                },
                {
                    dataField: "FECHA_CREACION",
                    caption: "FECHA PEDIDO",
                    alignment: "center"
                },
                {
                    dataField: "MESA",
                    caption: "MESA",
                    alignment: "center"
                },
                {
                    dataField: "USUARIO",
                    caption: "USUARIO",
                    alignment: "center"
                },
                {
                    dataField: "EMPLEADO",
                    caption: "EMPLEADO",
                    alignment: "center"
                },
                {
                    dataField: "ID_TIPO_PEDIDO",
                    caption: "ID_TIPO_PEDIDO",
                    visible: false
                },
                {
                    dataField: "TIPO_PEDIDO",
                    caption: "TIPO PEDIDO",
                    alignment: "center"
                },
                {
                    dataField: "TOTAL",
                    caption: "TOTAL",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 },
                    alignment: "center"
                }
            ],
            masterDetail: {
                enabled: true,
                template: function (container, options) {
                    var traerData = options.data;
                    ppedido = traerData.ID_PEDIDO;

                    $("<div>").addClass("master-detail-caption").text("DATOS DE PEDIDO: ").appendTo(container);

                    $("<div id='gridContainerDet'>")
                        .dxDataGrid({
                            columnAutoWidth: true,
                            showBorders: true,
                            columns: [
                                {
                                    dataField: "ID_DETALLE_PEDIDO",
                                    caption: "ID_DETALLE",
                                    visible: false
                                },
                                {
                                    dataField: "MENU",
                                    caption: "MENU"
                                },
                                {
                                    dataField: "CANTIDAD",
                                    caption: "CANTIDAD"
                                },
                                {
                                    dataField: "PRECIO",
                                    caption: "PRECIO"
                                },
                                {
                                    dataField: "SUBTOTAL",
                                    caption: "SUBTOTAL",
                                    dataType: "number",
                                    format: { type: 'fixedPoint', precision: 2 }
                                }
                            ],
                            dataSource: new DevExpress.data.DataSource(store)
                        }).appendTo(container);
                }
            }

        });
    }

    function GuardarCorte() {
        $.ajax({
            type: 'GET',
            url: '/CAJCorte/GuardarCorte',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: {},
            cache: false,
            success: function (data) {
                if (data['Estado'] == 1) {
                    llenarReporte();
                    showNotification('top', 'right', 'success', 'Se ha creado un nuevo corte de venta.', 'success');
                }
                else
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
                reject(ex);
            }
        });
    }

    $('#btnCrearCorte').on('click', function (e) {
        e.preventDefault();
        GuardarCorte();
    });
});