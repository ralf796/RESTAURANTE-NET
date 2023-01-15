$(document).ready(function () {

    fillAllInputs();

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
            rowAlternationEnabled: false,
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
                    caption: "PEDIDO",
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
                    alignment: "center",
                    visible:false
                },
                {
                    dataField: "EMPLEADO",
                    caption: "RESPONSABLE",
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
                    type: "buttons",
                    buttons: [
                        {
                            icon: "money",
                            hint:"Ingresar dinero",
                            onClick: function (e) {
                                $('#modalCobro').modal('show');
                                $('#hfIdCobro').val((e.row.data['ID_PEDIDO']));
                                $('#txtTotalPedido').val((e.row.data['TOTAL']).toFixed(2));
                                GetFormaPago();
                            }
                        },
                        {
                            //icon: "todo",
                            //hint: "Aceptar pedido",
                            //onClick: function (e) {
                            //    $('#hfIdCobro').val((e.row.data['ID_PEDIDO']));
                            //    $('#txtTotalPedido').val((e.row.data['TOTAL']).toFixed(2));
                            //    GetFormaPago();
                            //}
                        }
                    ]
                }
            ],
            onRowPrepared(e) {
                console.log(e.data)
                if (e.rowType == 'data' && e.data.ID_TIPO_PEDIDO == 1) {
                    e.rowElement.css("background-color", "#ABEBC6");
                    //e.rowElement.css("color", "#D0D3D4");
                }
            },
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

    //$('#btnCrearPago').on('click', function (e) {
    //    e.preventDefault();
    //    if (Number($('#txtTotalCobro').val()) != Number($('#txtTotalPedido').val())) {
    //        ShowShortMessage('warning', 'No se puede realizar el cobro', 'El total del dinero no puede ser diferente al total del pedido.')
    //    }
    //});
    $('#btnAgregarDocumento').on('click', function (e) {
        e.preventDefault();
        if (!isNullOrEmpty($('#selTipo').val()) && !isNullOrEmpty($('#txtImporte').val()) && Number($('#txtImporte').val()) > 0) {
            var cobrado = Number($('#txtTotalCobro').val());
            var cobroGuardar = Number($('#txtImporte').val());
            var pedido = Number($('#txtTotalPedido').val());

            if ((cobrado + cobroGuardar) > pedido)
                ShowShortMessage('warning', 'No se puede guardar el dinero', 'El total del dinero( Q' + (cobrado + cobroGuardar).toFixed(2) + ') no puede ser mayor al total del pedido ( Q' + pedido.toFixed(2) + ').')
            else
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

    function COBRO(ID_PEDIDO, MONTO) {
        this.ID_PEDIDO = ID_PEDIDO;
        this.MONTO = MONTO;
    }
    function COBRO_DETALLE(ID_PEDIDO_FORMA_PAGO, MONTO, DOCUMENTO) {
        this.ID_PEDIDO_FORMA_PAGO = ID_PEDIDO_FORMA_PAGO;
        this.MONTO = MONTO;
        this.DOCUMENTO = DOCUMENTO;
    }
    function GuardarCobro(pEncabezado, pDetalles) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/CAJCobro/GuardarCobro',
            data: {
                encabezado: JSON.stringify(pEncabezado),
                detalle: JSON.stringify(pDetalles)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    var vMensaje = 'COBRO REALIZADO';
                    var vMensaje2 = '<div><br />El cobro se realizó correctamente.<br /></div>';
                    swal(vMensaje, vMensaje2, "success");
                    llenarReporte();
                    tableDodumentos.clear().draw();
                    $('#modalCobro').modal('hide');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    $('#btnCrearPago').on('click', function (e) {
        e.preventDefault();

        var pedido = $('#hfIdCobro').val();
        var total = $('#txtTotalPedido').val();
        var encabezado = new COBRO(pedido, total);


        var cobrado = Number($('#txtTotalCobro').val());


        var listDetalles = [];

        tableDodumentos.rows().every(function (rowIdx) {
            var row = this.data();
            var formaPago = parseFloat(row[0]);
            var monto = parseFloat(row[3]);
            var documento = parseFloat(row[2]);
            var detalle = new COBRO_DETALLE(formaPago, monto, documento);
            listDetalles.push(detalle);
        });

        if (listDetalles.length > 0) {
            if (Number($('#txtTotalCobro').val()) != Number($('#txtTotalPedido').val()))
                ShowShortMessage('warning', 'No se puede guardar el dinero', 'El total del dinero( Q' + cobrado.toFixed(2) + ') no puede ser mayor al total del pedido ( Q' + Number(total).toFixed(2) + ').')
            else
                GuardarCobro(encabezado, listDetalles);
        }
        else
            showNotification('top', 'right', 'warning', 'Debe datos de cobro', 'warning');

    });



});