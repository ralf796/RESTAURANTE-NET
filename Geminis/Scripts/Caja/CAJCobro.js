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
                    url: '/CAJCobro/GetPedidos',
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
                    visible:false
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
                            //var valor = e.row.data['ID_PEDIDO'];
                            $('#modalCobro').modal('show');
                        }
                    }]
                }
            ]
        });
    }


    function GetFormaPago() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDPedidos/GetFormaPago',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    if (!isNullOrEmpty(traerDatos)) {
                        $('#selTipo').empty();
                        traerDatos.forEach(function (dato) {
                            $('#selTipo').append('<option value="' + dato.ID_PEDIDO_FORMA_PAGO + '">' + dato.NOMBRE + '</option>');
                        });
                        $('#selTipo').selectpicker();
                        $('#selTipo').selectpicker('refresh');
                        resolve(1);
                    }
                    else
                        showNotification('top', 'right', 'warning', 'No existen forma de pagos disponibles.', 'warning');
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    var tableDodumentos = $('#tblDocumentos').DataTable({
        columns: [
            { title: 'ID_PAGO', visible: false },
            { title: 'PAGO' },
            { title: 'NÚMERO' },
            { title: 'MONTO' },
            {
                className: 'text-center',
                render: function () {
                    return '<a title="ELIMINAR DETALLE" class="btn btn-link btn-danger btn-just-icon remove" style="margin: 0 0 !important"><i class="material-icons">clear</i></a>';
                }
            }
        ],
        columnDefs: [
            {
                targets: [0, 1, 2],
                className: 'text-center'
            }
        ],
        "lengthMenu": [
            [5, 10, 15, 20, 25, 50, -1],
            [5, 10, 15, 20, 25, 50, "Todo"]
        ],
        "searching": false,
        "bLengthChange": false, //thought this line could hide the LengthMenu        
        responsive: true,
        language: {
            url: "/assets/datatable-spanish.json"
        }
    });
    function AgregarFormaPago(idPago, pago, referencia, monto) {
        tableDodumentos.row.add([idPago, pago, referencia, monto]).draw(false);
        $('#selTipo').selectpicker();
        $('#selTipo').val(-1);
        $('#selTipo').selectpicker('refresh');
        $('#txtNumeroDocumento').val('');
        $('#txtImporte').val('');
        CalcularCobros();
    }
    function CalcularCobros() {
        var suma = 0;
        tableDodumentos.rows().every(function () {
            var row = this.data();
            suma += parseFloat(row[3]);
        });
        $('#txtTotalCobro').val(suma.toFixed(2));
    }

    $('#btnAgregarDocumento').on('click', function (e) {
        e.preventDefault();
        if (!isNullOrEmpty($('#selTipo').val()) && !isNullOrEmpty($('#txtImporte').val())) {
            AgregarFormaPago($('#selTipo').val(), $("#selTipo option:selected").text(), $('#txtReferencia').val(), $('#txtImporte').val().replace(",", ""))
        }
    });
    $('#selTipo').on('change', function () {
        var valor = $(this).val();
        if (valor == 1)
            $('#divRef').addClass('d-none');
        else
            $('#divRef').removeClass('d-none');
    });

});