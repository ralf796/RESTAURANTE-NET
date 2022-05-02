$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    ObtenerTipoEmpleadoSelect();
    llenarReporte();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function Limpiar() {
        $('#selTipoEmpleado').selectpicker();
        $('#selTipoEmpleado').val(0);
        $('#selTipoEmpleado').selectpicker('refresh');

        $('#txtNombre').val('');
        $('#txtSalario').val('');
        $('#txtTelefono').val('');
        $('#txtCorreo').val('');
        $('#txtDireccion').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/ADMEmpleado/' + controller,
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
                    $('#modalEmpleado').modal('hide');
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
            text: '¿Esta seguro que desea inactivar al empleado solicitado?',
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
                    url: '/ADMEmpleado/Eliminar',
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

    function EMPLEADO(ID_EMPLEADO, ID_TIPO_EMPLEADO, NOMBRE, SALARIO, TELEFONO, CORREO_ELECTRONICO, DIRECCION) {
        this.ID_EMPLEADO = ID_EMPLEADO;
        this.ID_TIPO_EMPLEADO = ID_TIPO_EMPLEADO;
        this.NOMBRE = NOMBRE;
        this.SALARIO = SALARIO;
        this.TELEFONO = TELEFONO;
        this.CORREO_ELECTRONICO = CORREO_ELECTRONICO;
        this.DIRECCION = DIRECCION;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var idTipoEmpleado = $('#selTipoEmpleado').val();
        var idEmpleado = $('#hfIDEmpleado').val();
        var nombre = $('#txtNombre').val();
        var salario = $('#txtSalario').val();
        var telefono = $('#txtTelefono').val();
        var correo = $('#txtCorreo').val();
        var direccion = $('#txtDireccion').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new EMPLEADO(idEmpleado, idTipoEmpleado, nombre, salario, telefono, correo, direccion);

        Procesar(DATOS, controlador);

    });

    function ObtenerTipoEmpleadoSelect() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/ADMEmpleado/ObtenerTipoEmpleadoSelect',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selTipoEmpleado').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selTipoEmpleado').append('<option value="' + dato.ID_TIPO_EMPLEADO + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selTipoEmpleado').selectpicker();
                    $('#selTipoEmpleado').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }

    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/ADMEmpleado/CargarTablaEmpleado',
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
                    dataField: "ID_EMPLEADO",
                    caption: "ID EMPLEADO",
                    visible: false
                },
                {
                    dataField: "ID_TIPO_EMPLEADO",
                    caption: "ID TIPO EMPLEADO",
                    visible: false
                },
                {
                    dataField: "TIPO_EMPLEADO",
                    caption: "TIPO EMPLEADO"
                },
                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE"
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
                    dataField: "SALARIO",
                    caption: "SALARIO",
                    visible: false
                },
                {
                    dataField: "CORREO_ELECTRONICO",
                    caption: "CORREO ELECTRONICO"
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
                                $('#hfIDEmpleado').val(e.row.data['ID_EMPLEADO']);

                                $('#selTipoEmpleado').selectpicker();
                                $('#selTipoEmpleado').val(e.row.data['ID_TIPO_EMPLEADO']);
                                $('#selTipoEmpleado').selectpicker('refresh');

                                $('#txtNombre').val(e.row.data['NOMBRE']);
                                $('#txtSalario').val(e.row.data['SALARIO']);
                                $('#txtTelefono').val(e.row.data['TELEFONO']);
                                $('#txtCorreo').val(e.row.data['CORREO_ELECTRONICO']);
                                $('#txtDireccion').val(e.row.data['DIRECCION']);

                                $('#hfControlador').val('Editar');

                                $('#modalEmpleado').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_EMPLEADO']);
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
                                $('#hfIDEmpleado').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalEmpleado').modal('show');
                            }
                        }
                    })
            }
        });
    }

});