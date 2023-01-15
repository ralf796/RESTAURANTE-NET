$(document).ready(function () {
    fillAllInputs();
    llenarReporte();

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

    function GuardarCliente(nombre, nit, telefono, direccion) {
        $.ajax({
            type: 'GET',
            url: '/PEDCliente/GuardarCliente',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { nombre, nit, telefono, direccion },
            cache: false,
            success: function (data) {
                if (data['Estado'] == 1) {
                    llenarReporte();
                    $('#modalCrearCliente').modal('hide');
                    showNotification('top', 'right', 'success', 'Se ha creado un cliente nuevo.', 'success');
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
    function EditarCliente(id, nombre, nit, telefono, direccion) {
        $.ajax({
            type: 'GET',
            url: '/PEDCliente/EditarCliente',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { id, nombre, nit, telefono, direccion },
            cache: false,
            success: function (data) {
                if (data['Estado'] == 1) {
                    llenarReporte();
                    $('#modalEditarCliente').modal('hide');
                    showNotification('top', 'right', 'success', 'Se ha modificado el cliente seleccionado.', 'success');
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

    function Inactivar(id) {
        $.ajax({
            type: 'GET',
            url: '/PEDCliente/Inactivar',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { id},
            cache: false,
            success: function (data) {
                if (data['Estado'] == 1) {
                    llenarReporte();
                    showNotification('top', 'right', 'success', 'Se ha cambiado de estado el cliente seleccionado.', 'success');
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
    $('#btnEditarCliente').on('click', function (e) {
        e.preventDefault();
        var id = $('#hfIdCliente').val();
        var nombre = $('#txtNombreClienteEditar').val();
        var nit = $('#txtNitClienteEditar').val();
        var telefono = $('#txtTelefonoClienteEditar').val();
        var direccion = $('#txtDireccionEditarCliente').val();
        EditarCliente(id, nombre, nit, telefono, direccion);
    });


    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/PEDCliente/CargarClientes',
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
                    dataField: "ID_CLIENTE",
                    caption: "ID EMPLEADO",
                    visible:false
                },
                {
                    dataField: "NOMBRE_CLIENTE",
                    caption: "CLIENTE"
                },
                {
                    dataField: "DIRECCION",
                    caption: "DIRECCION"
                },
                {
                    dataField: "NIT",
                    caption: "NIT"
                },
                {
                    dataField: "TELEFONO",
                    caption: "TELEFONO"
                },
                {
                    dataField: "CORREO_ELECTRONICO",
                    caption: "CORREO ELECTRONICO",
                    visible:false
                },
                {
                    dataField: "ESTADO",
                    caption: "ESTADO",
                    cellTemplate: function (container, options) {
                        var fieldData = options.data;

                        container.addClass(fieldData.ESTADO != 'A' ? "dec" : "");

                        if (fieldData.ESTADO == 'A')
                            $("<span>").addClass("current-value").text('ACTIVO').appendTo(container);
                        else
                            $("<span>").addClass("current-value").text('INACTIVO').appendTo(container);

                    }
                },
                {
                    type: "buttons",
                    width: 100,
                    alignment: "center",
                    buttons: [
                        {
                            hint: "Actualizar",
                            icon: "edit",
                            onClick: function (e) {
                                $('#hfIdCliente').val(e.row.data['ID_CLIENTE']);
                                $('#txtNombreClienteEditar').val(e.row.data['NOMBRE_CLIENTE']);
                                $('#txtNitClienteEditar').val(e.row.data['NIT']);
                                $('#txtTelefonoClienteEditar').val(e.row.data['TELEFONO']);
                                $('#txtDireccionEditarCliente').val(e.row.data['DIRECCION']);
                                $('#modalEditarCliente').modal('show');
                            }
                        },
                        {
                            hint: "Cambiar estado",
                            icon: "refresh",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_CLIENTE']);
                            }
                        }
                    ]
                }
            ]
        });
    }

});