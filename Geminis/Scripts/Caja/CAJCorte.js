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
                },
                {
                    dataField: "FECHA_CREACION",
                    caption: "FECHA PEDIDO",
                    alignment: "center"
                },
                {
                    type: "buttons",
                    width: 50,
                    buttons: [{
                        icon: "money",
                        onClick: function (e) {
                            var valor = e.row.data['ID_PEDIDO'];
                            //EntregarPedido(valor);
                        }
                    }]
                }
            ],
            onToolbarPreparing: function (e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift(
                    {
                        location: "after",
                        widget: "dxButton",
                        options: {
                            icon: "add",
                            text: "",
                            onClick: function (e) {
                                //AbrirModalPedido();
                            }
                        }
                    })
            }
        });
    }
});