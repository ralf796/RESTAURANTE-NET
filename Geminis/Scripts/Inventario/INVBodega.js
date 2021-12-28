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
        $('#txtPrecio').val('');
        $('#txtCantidad').val('');
        $('#txtDescripcion').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/INVBodega/' + controller,
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
                    $('#modalBodega').modal('hide');
                    $('#modalBodega2').modal('hide');
                    llenarReporte();
                }
                else if (data["Estado"] == 0) {
                    showNotification('top', 'right', 'error', 'LA CANTIDAD A RETIRAR EXCEDE A LA CANTIDAD EN EXISTENCIA', 'danger');
                    $('#modalBodega2').modal('hide');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    
    function BODEGA(ID_BODEGA_GENERAL, NOMBRE_PRODUCTO, CANTIDAD, PRECIO, DESCRIPCION) {
        this.ID_BODEGA_GENERAL = ID_BODEGA_GENERAL;
        this.NOMBRE_PRODUCTO = NOMBRE_PRODUCTO;
        this.CANTIDAD = CANTIDAD;
        this.PRECIO = PRECIO;
        this.DESCRIPCION = DESCRIPCION;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var idBodegaGeneral = $('#hfIDBodega').val();
        var nombre = $('#txtNombre').val();
        var precio = $('#txtPrecio').val();
        var cantidad = $('#txtCantidad').val();
        var descripcion = $('#txtDescripcion').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new BODEGA(idBodegaGeneral, nombre, cantidad, precio, descripcion);

        Procesar(DATOS, controlador);

    });

    $('#btnGuardar2').on('click', function (e) {
        e.preventDefault();

        var idBodegaGeneral2 = $('#hfIDBodega2').val();
        var nombre2 = $('#txtNombre2').val();
        var cantidad2 = $('#txtCantidad2').val();
        var controlador2 = $('#hfControlador2').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS2 = new BODEGA(idBodegaGeneral2, nombre2, cantidad2);

        Procesar(DATOS2, controlador2);

    });

    function llenarReporte() {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/INVBodega/CargarTablaBodega',
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
                    dataField: "ID_BODEGA_GENERAL",
                    caption: "ID BODEGA GENERAL",
                    visible: false
                },
                {
                    dataField: "NOMBRE_PRODUCTO",
                    caption: "NOMBRE"
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD"
                },
                {
                    dataField: "FECHA_INGRESO",
                    caption: "FECHA DE INGRESO"
                },
                {
                    dataField: "FECHA_SALIDA",
                    caption: "FECHA DE ULTIMA SALIDA"
                },
                {
                    dataField: "INGRESADO_POR",
                    caption: "INGRESADO POR"
                },
                {
                    dataField: "PRECIO",
                    caption: "PRECIO",
                },
                {
                    dataField: "DESCRIPCION",
                    caption: "DESCRIPCION"
                },
                {
                    dataField: "EXISTENCIA",
                    caption: "EXISTENCIA",
                    cellTemplate: function (container, options) {
                        var fieldData = options.data;

                        container.addClass(fieldData.EXISTENCIA != 1 ? "dec" : "");

                        if (fieldData.EXISTENCIA == '1')
                            $("<span>").addClass("current-value").text('EN EXISTENCIA').appendTo(container);
                        else
                            $("<span>").addClass("current-value").text('NO AY EXISTENCIA').appendTo(container);

                    }
                },
                {
                    type: "buttons",
                    width: 100,
                    alignment: "center",
                    buttons: [
                        {
                            hint: "Agregar",
                            icon: "add",
                            onClick: function (e) {
                                $('#hfIDBodega2').val(e.row.data['ID_BODEGA_GENERAL']);
                                $('#txtNombre2').val(e.row.data['NOMBRE_PRODUCTO']);
                                $('#txtCantidad2').val('');
                                var stock = $('#txtCantidad2').val();

                                $('#hfControlador2').val('Agregar');

                                $('#modalBodega2').modal('show');
                            }
                        },
                        {
                            hint: "Quitar",
                            icon: "minus",
                            onClick: function (e) {
                                $('#hfIDBodega2').val(e.row.data['ID_BODEGA_GENERAL']);
                                $('#txtNombre2').val(e.row.data['NOMBRE_PRODUCTO']);
                                $('#txtCantidad2').val('');

                                $('#hfControlador2').val('Quitar');

                                $('#modalBodega2').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_BODEGA_GENERAL']);
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
                                $('#hfIDBodega').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalBodega').modal('show');
                            }
                        }
                    })
            },
            export: {
                enabled: true,
                fileName: 'LISTADO DE PRODUCTOS'
            },
        });
    }

});