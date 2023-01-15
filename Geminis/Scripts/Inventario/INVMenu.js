$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    ObtenerTipoMenuSelect();
    llenarReporte();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function Limpiar() {
        $('#selTipoMenu').selectpicker();
        $('#selTipoMenu').val(0);
        $('#selTipoMenu').selectpicker('refresh');

        $('#txtNombre').val('');
        $('#txtPrecio').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/INVMenu/' + controller,
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
                    $('#modalMenu').modal('hide');
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
            text: '¿Esta seguro que desea inactivar el MENU solicitado?',
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
                    url: '/INVMenu/Eliminar',
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

    function MENU(ID_MENU, ID_TIPO_MENU, NOMBRE, PRECIO) {
        this.ID_MENU = ID_MENU;
        this.ID_TIPO_MENU = ID_TIPO_MENU;
        this.NOMBRE = NOMBRE;
        this.PRECIO = PRECIO;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var idTipoMenu = $('#selTipoMenu').val();
        var idMenu = $('#hfIDMenu').val();
        var nombre = $('#txtNombre').val();
        var precio = $('#txtPrecio').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new MENU(idMenu, idTipoMenu, nombre, precio);

        Procesar(DATOS, controlador);

    });

    function ObtenerTipoMenuSelect() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/INVMenu/ObtenerTipoMenuSelect',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selTipoMenu').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selTipoMenu').append('<option value="' + dato.ID_TIPO_MENU + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selTipoMenu').selectpicker();
                    $('#selTipoMenu').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }

    function llenarReporte() {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/INVMenu/CargarTablaMenu',
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
                    dataField: "ID_MENU",
                    caption: "ID MENU",
                    visible: false
                },
                {
                    dataField: "ID_TIPO_MENU",
                    caption: "ID TIPO MENU",
                    visible: false
                },
                {
                    dataField: "TIPO_MENU",
                    caption: "TIPO MENU"
                },
                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE"
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
                    dataField: "PRECIO",
                    caption: "PRECIO",
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
                                $('#hfIDMenu').val(e.row.data['ID_MENU']);

                                $('#selTipoMenu').selectpicker();
                                $('#selTipoMenu').val(e.row.data['ID_TIPO_MENU']);
                                $('#selTipoMenu').selectpicker('refresh');

                                $('#txtNombre').val(e.row.data['NOMBRE']);
                                $('#txtPrecio').val(e.row.data['PRECIO']);

                                $('#hfControlador').val('Editar');

                                $('#modalMenu').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_MENU']);
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
                                $('#hfIDMenu').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalMenu').modal('show');
                            }
                        }
                    })
            }
        });
    }

});