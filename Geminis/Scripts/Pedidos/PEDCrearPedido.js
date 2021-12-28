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
    function GetMesas() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDCrearPedido/GetMesasDisponibles',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selMesa').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selMesa').append('<option value="' + dato.ID_MESA + '">' + dato.NUMERO + '</option>');
                    });
                    $('#selMesa').selectpicker();
                    $('#selMesa').selectpicker('refresh');
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
                url: '/PEDCrearPedido/GetTipoMenu',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selCategoria').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selCategoria').append('<option value="' + dato.ID_TIPO_MENU + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selCategoria').selectpicker();
                    $('#selCategoria').selectpicker('refresh');

                    $('#modalCrearDetalleProducto').modal('show');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetTipoMenuEditar() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDCrearPedido/GetTipoMenu',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selCategoriaEditar').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selCategoriaEditar').append('<option value="' + dato.ID_TIPO_MENU + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selCategoriaEditar').selectpicker();
                    $('#selCategoriaEditar').selectpicker('refresh');

                    $('#ModalMenuEditar').modal('show');
                    resolve(1);
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
                url: '/PEDCrearPedido/GetMenu',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: { idTipoMenu },
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selMenu').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selMenu').append('<option data-precio="' + dato.PRECIO + '" value="' + dato.ID_MENU + '">' + dato.NOMBRE + ' - Q.' + dato.PRECIO + '</option>');
                    });
                    $('#selMenu').selectpicker();
                    $('#selMenu').selectpicker('refresh');

                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetMenuEditar(idTipoMenu) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PEDCrearPedido/GetMenu',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: { idTipoMenu },
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selMenuEditar').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selMenuEditar').append('<option data-precio="' + dato.PRECIO + '" value="' + dato.ID_MENU + '">' + dato.NOMBRE + ' - Q.' + dato.PRECIO + '</option>');
                    });
                    $('#selMenuEditar').selectpicker();
                    $('#selMenuEditar').selectpicker('refresh');

                    resolve(1);
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
    function AgregarProductoEditar(cantidad, idproducto, producto, precio, observaciones) {
        var subtotal = parseFloat(cantidad) * parseFloat(precio);
        var eliminarDetalle = '<a title="Eliminar detalle" class="btn btn-link btn-danger QuitarDetalle" style="margin: 0 0 !important"><i class="material-icons">close</i></a>';

        tableDetallesEditar.row.add([
            cantidad,
            idproducto,
            producto,
            precio,
            subtotal,
            observaciones
        ]).draw(false);

        $('#txtCantidadEditar').val('');
        $('#txtObservacionesEditar').val('');
        $('#txtPrecioEditar').val('');
        $('#selMenuEditar').empty();
        $('#selMenuEditar').selectpicker();
        $('#selMenuEditar').selectpicker('refresh');
    }
    function ActualizarTotalPedido() {
        var totalPedido = 0;
        tableDetalles.rows().every(function () {
            var row = this.data();
            totalPedido += parseFloat(row[4]);
        });

        $('#txtTotalPedido').val(totalPedido.toFixed(2));
    }
    function AbrirModalPedido() {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDCrearPedido/ContMesas',
            data: {},
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["ESTADO"] == 1) {
                    if (data["CONTADOR"] > 0) {
                        GetMesas();
                        $('#modalCrearRefactura').modal('show');
                    }
                    else {
                        showNotification('top', 'right', 'warning', 'No hay mesas disponibles para crear un pedido.', 'warning');
                    }
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function AbrirModalPedidoEditar() {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDCrearPedido/ContMesas',
            data: {},
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["ESTADO"] == 1) {
                    if (data["CONTADOR"] > 0) {
                        GetMesas();
                        $('#ModalEditarPedido').modal('show');
                    }
                    else {
                        showNotification('top', 'right', 'warning', 'No hay mesas disponibles para crear un pedido.', 'warning');
                    }
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    $('#btnBuscarProducto').on('click', function (e) {
        e.preventDefault();
        if ($('#formRefactura').valid()) {
            GetTipoMenu();
        }
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
    var tableDetalles = $('#tblDetallesPedido').DataTable({
        columns: [
            { title: 'CANTIDAD' },
            { title: 'ID_PRODUCTO', visible: false },
            { title: 'PRODUCTO' },
            { title: 'PRECIO' },
            { title: 'SUBTOTAL' },
            { title: 'OBSERVACIONES' },
            {
                render: function () {
                    return '<a title="ELIMINAR DETALLE" class="btn btn-link btn-danger btn-just-icon remove" style="margin: 0 0 !important"><i class="material-icons">clear</i></a>';
                }
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
    var tableDetallesEditar = $('#tblDetallesPedidoEditar').DataTable({
        columns: [
            { title: 'CANTIDAD' },
            { title: 'ID_PRODUCTO', visible: false },
            { title: 'PRODUCTO' },
            { title: 'PRECIO' },
            { title: 'SUBTOTAL' },
            { title: 'OBSERVACIONES' },
            {
                render: function () {
                    return '<a title="ELIMINAR DETALLE" class="btn btn-link btn-danger btn-just-icon removeEditar" style="margin: 0 0 !important"><i class="material-icons">clear</i></a>';
                }
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

    function PEDIDO(ID_MESA, TOTAL) {
        this.ID_MESA = ID_MESA;
        this.TOTAL = TOTAL;
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
            url: '/PEDCrearPedido/GuardarPedido',
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
                    llenarReporte();
                    tableDetalles.clear().draw();
                    $('#modalCrearRefactura').modal('hide');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function EditarPedido(pPedido, pDetalles) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDCrearPedido/EditarPedido',
            data: {
                pedido: pPedido,
                detallePedido: JSON.stringify(pDetalles)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Pedido actualizado satisfactoriamente.', 'success');
                    llenarReporte()
                    tableDetallesEditar.clear().draw();
                    $('#ModalEditarPedido').modal('hide');
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
        if ($('#formRefactura').valid()) {
            var idmesa = $('#selMesa').val();
            var total = $('#txtTotalPedido').val();
            var encabezado = new PEDIDO(idmesa, total);
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

            if (listDetalles.length > 0)
                GuardarPedido(encabezado, listDetalles);
            else
                showNotification('top', 'right', 'warning', 'Debe de ingresar como mínimo un detalle', 'warning');
            //}
        }
    });

    var idPedidoEditar;
    function QuitarDetallePedido(idDetallePedido) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDCrearPedido/QuitarDetalle',
            data: { idDetallePedido },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Se eliminó el detalle satisfactoriamente.', 'success');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function EntregarPedido(pedido) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDCrearPedido/EntregarPedido',
            data: { pedido },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Se anuló el pedido satisfactoriamente.', 'success');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function AnularPedido(pedido) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PEDCrearPedido/CancelarPedido',
            data: { pedido },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Se anuló el pedido satisfactoriamente.', 'success');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    $('#btnBuscarMenuEditar').on('click', function (e) {
        e.preventDefault();
        GetTipoMenuEditar();
    });
    $('#selCategoriaEditar').on('change', function (e) {
        e.preventDefault();
        var tipomenu = $(this).val();
        GetMenuEditar(tipomenu);
    });
    $('#selMenuEditar').on('change', function (e) {
        e.preventDefault();
        var precio = $('#selMenuEditar option:selected').attr('data-precio');
        $("#txtPrecioEditar").val(precio);
    });
    $('#btnAgregarMenuEditar').on('click', function (e) {
        e.preventDefault();
        if ($('#formProductoEditar').valid()) {
            AgregarProductoEditar($('#txtCantidadEditar').val(), $('#selMenuEditar').val(), $("#selMenuEditar option:selected").text(), $('#txtPrecioEditar').val().replace(",", ""), $('#txtObservacionesEditar').val())
            $('#ModalMenuEditar').modal('hide');
        }
    });
    $('#btnEditarPedido').on('click', function (e) {
        e.preventDefault();
        var listDetalles = [];
        tableDetallesEditar.rows().every(function (rowIdx) {
            var row = this.data();
            var vidmenu = parseFloat(row[1]);
            var vcantidad = parseFloat(row[0]);
            var vobservaciones = (row[5]);
            var vprecio = parseFloat(row[3]);
            var vsubtotal = parseFloat(row[4]);
            var detalle = new PEDIDO_DETALLE(vidmenu, vcantidad, vobservaciones, vprecio, vsubtotal);
            listDetalles.push(detalle);
        });

        console.log(listDetalles);
        if (listDetalles.length > 0)
            EditarPedido(idPedidoEditar, listDetalles);
        else
            showNotification('top', 'right', 'warning', 'Debe de ingresar como mínimo un detalle', 'warning');

    });




    llenarReporte();
    var ppedido;
    DevExpress.localization.locale(navigator.language);
    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/PEDCrearPedido/GetPedidos',
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
                    caption: "NO. PEDIDO"
                },
                {
                    dataField: "NUMERO",
                    caption: "MESA"
                },
                {
                    dataField: "DESCRIPCION",
                    caption: "ESTADO"
                },
                {
                    dataField: "TOTAL",
                    caption: "TOTAL",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    type: "buttons",
                    width: 50,
                    buttons: [{
                        icon: "add",
                        onClick: function (e) {
                            idPedidoEditar = e.row.data['ID_PEDIDO'];
                            AbrirModalPedidoEditar();
                        }
                    }]
                },
                {
                    type: "buttons",
                    width: 50,
                    buttons: [{
                        icon: "todo",
                        onClick: function (e) {
                            var valor = e.row.data['ID_PEDIDO'];
                            EntregarPedido(valor);
                        }
                    }]
                },
                {
                    type: "buttons",
                    width: 50,
                    buttons: [{
                        icon: "trash",
                        onClick: function (e) {
                            var valor = e.row.data['ID_PEDIDO'];
                            AnularPedido(valor);
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
                                AbrirModalPedido();
                            }
                        }
                    })
            },
            masterDetail: {
                enabled: true,
                template: function (container, options) {
                    var traerData = options.data;
                    ppedido = traerData.ID_PEDIDO;

                    $("<div>").addClass("master-detail-caption").text("DETALLE DE PEDIDO: ").appendTo(container);

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
                                    dataField: "OBSERVACIONES",
                                    caption: "OBSERVACIONES"
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
                                },
                                {
                                    type: "buttons",
                                    width: 50,
                                    buttons: [{
                                        icon: "trash",
                                        onClick: function (e) {
                                            var valor = e.row.data['ID_DETALLE_PEDIDO'];
                                            QuitarDetallePedido(valor);
                                        }
                                    }]
                                }
                            ],
                            dataSource: new DevExpress.data.DataSource(store)
                        }).appendTo(container);
                }
            }
        });
    }
});