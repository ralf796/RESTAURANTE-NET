$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    llenarReporte();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function Limpiar() {
        $('#txtNombre').val('');
        $('#txtReferencia').val('');
        $('#txtTelefono').val('');
        $('#txtCorreo').val('');
        $('#txtDireccion').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/ADMProveedor/' + controller,
            data: {
                datos: JSON.stringify(pDatos)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Proceso realizado con éxito', 'success');
                    $('#modalProveedor').modal('hide');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function Inactivar(id) {
        Swal.fire({
            title: 'ELIMINAR',
            text: '¿Esta seguro que desea inactivar al proveedor solicitado?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                CallLoadingFire();
                $.ajax({
                    type: 'POST',
                    url: '/ADMProveedor/Eliminar',
                    data: {
                        id: id
                    },
                    success: function (data) {
                        if (data["Estado"] == -1) {
                            showNotification('top', 'right', 'error', data["MENSAJE"], 'danger');
                            return;
                        }
                        if (data["Estado"] == 1) {
                            showNotification('top', 'right', 'success', 'Proceso realizado con éxito', 'success');
                            llenarReporte();
                        }
                    },
                    error: function (jqXHR, ex) {
                        getErrorMessage(jqXHR, ex);
                    }
                });
            }
        })
    }

    function PROVEEDOR(ID_PROVEEDOR, NOMBRE, REFERENCIA, TELEFONO, DIRECCION) {
        this.ID_PROVEEDOR= ID_PROVEEDOR;
        this.NOMBRE = NOMBRE;
        this.REFERENCIA= REFERENCIA;
        this.TELEFONO = TELEFONO;
        this.DIRECCION = DIRECCION;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();
        var idProveedor= $('#hfIDProveedor').val();
        var nombre = $('#txtNombre').val();
        var referencia= $('#txtReferencia').val();
        var telefono = $('#txtTelefono').val();
        var direccion = $('#txtDireccion').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new PROVEEDOR(idProveedor, nombre, referencia, telefono, direccion);

        Procesar(DATOS, controlador);

    });

    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/ADMProveedor/CargarTabla',
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
                    dataField: "ID_PROVEEDOR",
                    caption: "ID PROVEEDOR",
                    visible: false
                },
                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE"
                },
                {
                    dataField: "REFERENCIA",
                    caption: "REFERENCIA"
                },
                {
                    dataField: "TELEFONO",
                    caption: "TELEFONO"
                },
                {
                    dataField: "DIRECCION",
                    caption: "DIRECCION"
                },
                {
                    dataField: "FECHA_CREACION",
                    caption: "FECHA CREACION",
                    visible: false
                },
                {
                    dataField: "CREADO_POR",
                    caption: "CREADO POR",
                    visible: false
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
                                $('#hfIDProveedor').val(e.row.data['ID_PROVEEDOR']);

                                $('#txtNombre').val(e.row.data['NOMBRE']);
                                $('#txtTelefono').val(e.row.data['TELEFONO']);
                                $('#txtReferencia').val(e.row.data['REFERENCIA']);
                                $('#txtDireccion').val(e.row.data['DIRECCION']);

                                $('#hfControlador').val('Editar');

                                $('#modalProveedor').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_PROVEEDOR']);
                            }
                        }
                    ]
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
                                Limpiar();
                                $('#hfIDProveedor').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalProveedor').modal('show');
                            }
                        }
                    })
            }
        });
    }

});