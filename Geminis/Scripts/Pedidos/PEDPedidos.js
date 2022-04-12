$(document).ready(function () {
    fillAllInputs();
    GetInicio();
    GetFormaPago();

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

    //$('#btnBuscarDatosCliente').on('click', function (e) {
    //    e.preventDefault();
    //    $('#modalCliente').modal('show');
    //});
    $('#btnDireccionesCliente').on('click', function (e) {
        e.preventDefault();
        if (!isNullOrEmpty($('#txtClienteID').val())) {
            $('#modalDireccionesCliente').modal('show');
            GetTableDirecciones();
        }
        else
            showNotification('top', 'right', 'warning', 'Debe seleccionar un cliente antes de ingresar una dirección.', 'warning');
    });
    function ObtenerDatosCliente(telefono, nit) {
        CallLoadingFire();
        $.ajax({
            type: 'GET',
            url: '/PEDPedidos/GetDatosCliente',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { telefono, nit },
            cache: false,
            success: function (data) {
                var state = data["ESTADO"];
                if (state == 1) {
                    var cliente = data["DATA"];
                    if (!isNullOrEmpty(cliente)) {
                        $('#txtClienteID').val(cliente.ID_CLIENTE);
                        $('#txtNit').val(cliente.NIT);
                        $('#txtNombre').val(cliente.NOMBRE);
                        $('#txtNombreRecibe').val(cliente.NOMBRE);
                        $('#txtTelefono').val(cliente.TELEFONO);
                        $('#txtDireccion').val(cliente.DIRECCION);
                    }
                    else
                        showNotification('top', 'right', 'warning', 'El cliente no existe con los datos ingresados', 'warning');
                }
                if (state == -1)
                    showNotification('top', 'right', 'error', data["Mensaje"], 'warning');
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    $("#txtTelefono").keypress(function (e) {
        var var1 = $('#txtTelefono').val();
        var var2 = $('#txtNit').val().replace("-", "").replace("/", "");
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            ObtenerDatosCliente(var1, var2);
        }
    });
    $("#txtNit").keypress(function (e) {
        var var1 = $('#txtTelefono').val();
        var var2 = $('#txtNit').val().replace("-", "").replace("/", "");
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            ObtenerDatosCliente(var1, var2);
        }
    });
    $('#txtNit').on('click', function (e) {
        e.preventDefault();
        $('#txtTelefono').val('');
        $('#txtNit').val('');
    });
    $('#txtTelefono').on('click', function (e) {
        e.preventDefault();
        $('#txtTelefono').val('');
        $('#txtNit').val('');
    });


    var tableDetalles = $('#tblDetallesPedido').DataTable({
        columns: [
            { title: 'CANTIDAD' },
            { title: 'ID_PRODUCTO', visible: false },
            { title: 'PRODUCTO' },
            { title: 'PRECIO' },
            { title: 'SUBTOTAL' },
            { title: 'OBSERVACIONES' },
            {
                className: 'text-center',
                render: function () {
                    return '<a title="ELIMINAR DETALLE" class="btn btn-link btn-danger btn-just-icon remove" style="margin: 0 0 !important"><i class="material-icons">clear</i></a>';
                }
            }
        ],
        columnDefs: [
            {
                targets: [0, 1, 2, 3, 4, 5],
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
    function GetTableDirecciones() {
        CallLoadingFire();
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: "/PEDPedidos/GetDirecciones",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { cliente: $('#txtClienteID').val() },
                    cache: false,
                    success: function (data) {
                        var state = data["Estado"];
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);
                        if (state == -1) {
                            showNotification('top', 'right', 'warning', data["Mensaje"], 'danger');
                        }
                    }
                });
                return d.promise();
            }
        });
        var salesPivotGrid = $('#gridDirecciones').dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            columnAutoWidth: true,
            wordWrapEnabled: true,
            showBorders: true,
            rowAlternationEnabled: true,
            headerFilter: {
                visible: true
            },
            paging: {
                pageSize: 5,
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
                    dataField: "DIRECCION",
                    caption: "DIRECCIÓN"
                },
                {
                    caption: "SELECCIÓN",
                    type: "buttons",
                    alignment: "center",
                    buttons: [
                        {
                            hint: "Seleccionar",
                            icon: "todo",
                            onClick: function (e) {
                                $('#txtDireccion').val(e.row.data["DIRECCION"]);
                                $('#modalDireccionesCliente').modal('hide');
                            }
                        }
                    ]
                }
            ]
        });
    }
    function GetInicio() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDPedidos/GetTipoPedidos',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var list = data["DATA"];
                    var listREPARTIDOR = data["REPARTIDOR"];
                    $('#selTipoPedido').empty();
                    $('#selRepartidor').empty();
                    list.forEach(function (dato) {
                        $('#selTipoPedido').append('<option value="' + dato.ID_TIPO_PEDIDO + '">' + dato.NOMBRE + '</option>');
                    });
                    listREPARTIDOR.forEach(function (dato) {
                        $('#selRepartidor').append('<option value="' + dato.ID_EMPLEADO + '">' + dato.NOMBRE + '</option>');
                    });
                    $('.selectpicker').selectpicker();
                    $('.selectpicker').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetTipoMenu() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDPedidos/GetTipoMenu',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    if (!isNullOrEmpty(traerDatos)) {
                        $('#selCategoria').empty();
                        traerDatos.forEach(function (dato) {
                            $('#selCategoria').append('<option value="' + dato.ID_TIPO_MENU + '">' + dato.NOMBRE + '</option>');
                        });
                        $('#selCategoria').selectpicker();
                        $('#selCategoria').selectpicker('refresh');
                        $('#modalCrearDetalleProducto').modal('show');
                        resolve(1);
                    }
                    else
                        showNotification('top', 'right', 'warning', 'No existen tipos de menu disponibles.', 'warning');
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetMenu(idTipoMenu) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDPedidos/GetMenu',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: { idTipoMenu },
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    if (!isNullOrEmpty(traerDatos)) {
                        $('#selMenu').empty();
                        traerDatos.forEach(function (dato) {
                            $('#selMenu').append('<option data-precio="' + dato.PRECIO + '" value="' + dato.ID_MENU + '">' + dato.NOMBRE + ' - Q.' + dato.PRECIO + '</option>');
                        });
                        $('#selMenu').selectpicker();
                        $('#selMenu').selectpicker('refresh');
                        resolve(1);
                    }
                    else
                        showNotification('top', 'right', 'warning', 'No existen menu disponibles.', 'warning');
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function AgregarProducto(cantidad, idproducto, producto, precio, observaciones) {
        var subtotal = parseFloat(cantidad) * parseFloat(precio);
        var eliminarDetalle = '<a title="Eliminar detalle" class="btn btn-link btn-danger QuitarDetalle" style="margin: 0 0 !important"><i class="material-icons">close</i></a>';

        tableDetalles.row.add([
            cantidad,
            idproducto,
            producto,
            precio,
            subtotal,
            observaciones
        ]).draw(false);

        $('#txtProductoCantidad').val('');
        $('#txtProductoPrecio').val('');
        $('#txtObservaciones').val('');
        $('#selMenu').empty();
        $('#selMenu').selectpicker();
        $('#selMenu').selectpicker('refresh');
    }
    function ActualizarTotalPedido() {
        var totalPedido = 0;
        tableDetalles.rows().every(function () {
            var row = this.data();
            totalPedido += parseFloat(row[4]);
        });

        $('#txtTotalPedido').val(totalPedido.toFixed(2));
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

    $('#btnBuscarProducto').on('click', function (e) {
        e.preventDefault();

        GetTipoMenu();
        $('#modalCrearDetalleProducto').modal('show');
    });
    $('#selCategoria').on('change', function (e) {
        e.preventDefault();
        var tipomenu = $(this).val();
        GetMenu(tipomenu);
    });
    $('#selMenu').on('change', function (e) {
        e.preventDefault();
        var precio = $('#selMenu option:selected').attr('data-precio');
        $("#txtProductoPrecio").val(precio);
    });

    $('#btnAgregarProducto').on('click', function (e) {
        e.preventDefault();
        if ($('#formProducto').valid()) {
            AgregarProducto($('#txtProductoCantidad').val(), $('#selMenu').val(), $("#selMenu option:selected").text(), $('#txtProductoPrecio').val().replace(",", ""), $('#txtObservaciones').val())
            $('#modalCrearDetalleProducto').modal('hide');
            ActualizarTotalPedido();
        }
    });
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

    function PEDIDO(ID_MESA, TOTAL, ID_TIPO_PEDIDO, NOMBRE,
        NIT, DIRECCION, REPARTIDOR, NOMBRE_RECIBE, TELEFONO, ID_CLIENTE) {
        this.ID_MESA = ID_MESA;
        this.TOTAL = TOTAL;
        this.ID_TIPO_PEDIDO = ID_TIPO_PEDIDO;
        this.NOMBRE = NOMBRE;
        this.NIT = NIT;
        this.DIRECCION = DIRECCION;
        this.REPARTIDOR = REPARTIDOR;
        this.NOMBRE_RECIBE = NOMBRE_RECIBE;
        this.TELEFONO = TELEFONO;
        this.ID_CLIENTE= ID_CLIENTE;
    }
    function PEDIDO_DETALLE(ID_MENU, CANTIDAD, OBSERVACIONES, PRECIO, SUBTOTAL) {
        this.ID_MENU = ID_MENU;
        this.CANTIDAD = CANTIDAD;
        this.OBSERVACIONES = OBSERVACIONES;
        this.PRECIO = PRECIO;
        this.SUBTOTAL = SUBTOTAL;
    }
    function GuardarPedido(pEncabezado, pDetalles) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDPedidos/GuardarPedido',
            data: {
                encabezadoPedido: JSON.stringify(pEncabezado),
                detallePedido: JSON.stringify(pDetalles)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    var vMensaje = 'PEDIDO CREADO';
                    var vMensaje2 = '<div><br />No.: ' + data['PEDIDO'] + '<br /></div>';
                    swal(vMensaje, vMensaje2, "success");
                    tableDetalles.clear().draw();
                    tableDodumentos.clear().draw();
                    //location.reload();
                    window.open("/PEDPEdidos/ImprimirTicketPortatil?cobro=" + data['PEDIDO']);
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    $('#btnCrearPedido').on('click', function (e) {
        e.preventDefault();

        //----------------VALIDACION DE FORMULARIO----------------
        if ($('#formPedido').valid()) {
            var cobro = $('#txtTotalCobro').val();

            var idmesa = $('#selMesa').val();
            var total = $('#txtTotalPedido').val();
            var idtipopedido = $('#selTipoPedido').val();
            var nombre = $('#txtNombre').val();
            var nit = $('#txtNit').val();
            var direccion = $('#txtDireccion').val();
            var repartidor = $('#selRepartidor').val();
            var nombrerecibe = $('#txtNombreRecibe').val();
            var telefono = $('#txtTelefono').val();
            var idCliente = $('#txtClienteID').val();
            var encabezado = new PEDIDO(idmesa, total, idtipopedido, nombre, nit, direccion, repartidor, nombrerecibe, telefono, idCliente);
            var listDetalles = [];

            tableDetalles.rows().every(function (rowIdx) {
                var row = this.data();
                var vidmenu = parseFloat(row[1]);
                var vcantidad = parseFloat(row[0]);
                var vobservaciones = (row[5]);
                var vprecio = parseFloat(row[3]);
                var vsubtotal = parseFloat(row[4]);
                var detalle = new PEDIDO_DETALLE(vidmenu, vcantidad, vobservaciones, vprecio, vsubtotal);
                listDetalles.push(detalle);
            });


            if (listDetalles.length > 0) {
                //if (cobro == total)
                    GuardarPedido(encabezado, listDetalles);
                //else
                    //ShowShortMessage('warning', 'Advertencia!', 'El cobro ingresado no coincide con el total del pedido.');
            }
            else
                showNotification('top', 'right', 'warning', 'Debe de ingresar como mínimo un detalle', 'warning');

        }
    });


    function GuardarDireccion(idCliente, direccion) {
        $.ajax({
            type: 'GET',
            url: '/PEDPedidos/GuardarDireccion',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { idCliente, direccion },
            cache: false,
            success: function (data) {
                if (data['Estado'] == 1) {
                    GetTableDirecciones();
                    $('#modalCrearDireccion').modal('hide');
                    showNotification('top', 'right', 'success', 'Se ha creado una dirección nueva.', 'success');
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
    function GuardarCliente(nombre, nit, telefono, direccion) {
        $.ajax({
            type: 'GET',
            url: '/PEDPedidos/GuardarCliente',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { nombre, nit, telefono, direccion },
            cache: false,
            success: function (data) {
                if (data['Estado'] == 1) {
                    $('#modalCrearCliente').modal('hide');
                    $('#txtNombre').val(nombre);
                    $('#txtNombreRecibe').val(nombre);
                    $('#txtNit').val(nit);
                    $('#txtTelefono').val(telefono);
                    $('#txtDireccion').val(direccion);
                    $('#txtClienteID').val(data['IDCLIENTE']);
                    showNotification('top', 'right', 'success', 'Se ha creado una dirección nueva.', 'success');

                    $('#txtNombreClienteCrear').val('');
                    $('#txtNitClienteCrear').val('');
                    $('#txtTelefonoClienteCrear').val('');
                    $('#txtDireccionCrearCliente').val('');
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

    $('#btnAbrirModalCrearCliente').on('click', function (e) {
        e.preventDefault();
        $('#modalCrearCliente').modal('show');
    });
    $('#btnCrearCliente').on('click', function (e) {
        e.preventDefault();
        var nombre = $('#txtNombreClienteCrear').val();
        var nit = $('#txtNitClienteCrear').val();
        var telefono = $('#txtTelefonoClienteCrear').val();
        var direccion = $('#txtDireccionCrearCliente').val();
        GuardarCliente(nombre, nit, telefono, direccion);
    });


    $('#btnAbrirModalCrearDireccion').on('click', function (e) {
        e.preventDefault();
        $('#modalCrearDireccion').modal('show');
    });
    $('#btnCrearDireccion').on('click', function (e) {
        e.preventDefault();
        var idCliente = $('#txtClienteID').val();
        var direccion = $('#txtDireccionCrear').val();
        GuardarDireccion(idCliente, direccion);
    });

});