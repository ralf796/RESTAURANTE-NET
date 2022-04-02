$(document).ready(function () {
    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    ObtenerUnidadMedidaSelect()
    /*   ObtenerTipoEmpleadoSelect();*/
    llenarReporte();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }

    function Limpiar() {
        $('#selUnidadMedida').selectpicker();
        $('#selUnidadMedida').val(0);
        $('#selUnidadMedida').selectpicker('refresh');

        $('#txtNombreProducto').val('');
        $('#txtDescripcion').val('');
        $('#txtCantidad').val('');
        $('#txtPrecio').val('');
        $('#txtIngreso').val('');
        $('#txtSalida').val('');

    }

    // --------------------funcion de llenado de reporte---------------------------
    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/INVBodegaGeneral/CargarTablaInventarioGeneral',
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
                    caption: "ID BODEGA",
                    visible: false
                },

                {
                    dataField: "NOMBRE_PRODUCTO",
                    caption: "NOMBRE PRODUCTO"
                },
                {
                    dataField: "ID_UNIDAD_MEDIDA",
                    caption: "UNIDAD MEDIDA",
                    visible: false
                },
                {
                    dataField: "UNIDADMEDIDA",
                    caption: "UNIDAD DE MEDIDA"
                },
                {
                    dataField: "DESCRIPCION",
                    caption: "DESCRIPCION"
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "FECHA_INGRESO",
                    caption: "FECHA INGRESO"
                },
                {
                    dataField: "PRECIO",
                    caption: "PRECIO",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "SUBTOTAL",
                    caption: "SUBTOTAL",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "CREADO_POR",
                    caption: "CREADO POR"
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
                // botones editar, eliminar cargar producto
                {
                    type: "buttons",
                    width: 100,
                    alignment: "center",
                    buttons: [
                        {
                            hint: "Agregar",
                            icon: "arrowup",
                            onClick: function (e) {
                                $('#txtIngreso').val('');
                                id = e.row.data['ID_BODEGA_GENERAL'];
                                $('#hfIDBodega2').val(e.row.data['ID_BODEGA_GENERAL']);
                                $('#hfSubtotal').val(e.row.data['PRECIO']);
                                $('#hfCantidad').val(e.row.data['CANTIDAD']);
                                $('#hfControlador2').val('Agregar');
                                $('#modalIngreso').modal('show');
                            }
                        },
                        {
                            hint: "Quitar",
                            icon: "arrowdown",
                            onClick: function (e) {
                                $('#hfIDBodega3').val(e.row.data['ID_BODEGA_GENERAL']);
                                $('#hfControlador3').val('Extraer');
                                $('#hfcantidad').val(e.row.data['CANTIDAD']);
                                $('#hfNombre').val(e.row.data['NOMBRE_PRODUCTO']);
                                $('#hfPrecio').val(e.row.data['PRECIO']);
                                $('#modalExtraer').modal('show');
                            }
                        },
                        {
                            int: "Actualizar",
                            icon: "edit",
                            onClick: function (e) {
                                $('#hfIDBodega').val(e.row.data['ID_BODEGA_GENERAL']);
                                $('#txtNombreProducto').val(e.row.data['NOMBRE_PRODUCTO']);
                                $('#selUnidadMedida').selectpicker();
                                $('#selUnidadMedida').val(e.row.data['ID_UNIDAD_MEDIDA']);
                                $('#selUnidadMedida').selectpicker('refresh');
                                $('#txtDescripcion').val(e.row.data['DESCRIPCION']);
                                $('#txtCantidad').val(e.row.data['CANTIDAD']);
                                $('#txtPrecio').val(e.row.data['PRECIO']);
                                $('#hfControlador').val('Editar');
                                $('#modalBodega').modal('show');
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
                },
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
                fileName: 'lISTADO B'
            },
        });
    }
    // --------------------funcion de llenado de reporte---------------------------

    //------------------funcion PROCESAR GUARDAR Y EDITA----------------------------
    function Procesar(pDatos, controller) {
        //CallLoadingFire();

        $.ajax({
            type: 'POST',
            url: '/INVBodegaGeneral/' + controller,
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
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    //------------------funcion PROCESAR GUARDAR Y EDITA---------------------------

    function ObtenerUnidadMedidaSelect() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/INVBodegaGeneral/ObtenerBodegaSelect',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    console.log(data);
                    $('#selUnidadMedida').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selUnidadMedida').append('<option value="' + dato.ID_UNIDAD_MEDIDA + '">' + dato.DESCRIPCION + '</option>');
                    });
                    $('#selUnidadMedida').selectpicker();
                    $('#selUnidadMedida').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    // ---------------------funcion UNIDAD DE MEDIDA--------------------------------

    // -------------------funcion que permita recibir los datos de html---------------
    function INVENTARIOGENERAL(ID_BODEGA_GENERAL, ID_UNIDAD_MEDIDA, NOMBRE_PRODUCTO, DESCRIPCION, CANTIDAD, PRECIO) {
        this.ID_BODEGA_GENERAL = ID_BODEGA_GENERAL;
        this.ID_UNIDAD_MEDIDA = ID_UNIDAD_MEDIDA;
        this.NOMBRE_PRODUCTO = NOMBRE_PRODUCTO;
        this.DESCRIPCION = DESCRIPCION;
        this.CANTIDAD = CANTIDAD;
        this.PRECIO = PRECIO;
    }


    // codigo que permitira utilizar el boton guardar ---------------

    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        if ($('#formCrearBodega').valid()) {
            var id_bodega_general = $('#hfIDBodega').val();
            var id_unidad_medida = $('#selUnidadMedida').val();
            var nombre_producto = $('#txtNombreProducto').val();
            var descripcion = $('#txtDescripcion').val();
            var cantidad = $('#txtCantidad').val();
            var precio = $('#txtPrecio').val();
            var controlador = $('#hfControlador').val();

            //------------- se enviara a la funcion inventario general-------------------
            var DATOS = new INVENTARIOGENERAL(id_bodega_general, id_unidad_medida, nombre_producto, descripcion, cantidad, precio);
            Procesar(DATOS, controlador);
        }

    });

    // funcion agregarStockProducto-------------------------------------------------
    function UPSTOCK(ID_BODEGA_GENERAL, CANTIDAD, SUBTOTAL) {
        this.ID_BODEGA_GENERAL = ID_BODEGA_GENERAL;
        this.CANTIDAD = CANTIDAD;
        this.SUBTOTAL = SUBTOTAL;
    }

    // boton agregarStockProducto-------------------------------------------------
    $('#btnGuardar2').on('click', function (e) {
        e.preventDefault();
        var id_bodega_general = $('#hfIDBodega2').val();
        /*console.log(id_bodega_general);*/
        var cantidad = parseFloat($('#txtIngreso').val()) + parseFloat($('#hfCantidad').val());
        var subtotal = parseFloat($('#hfSubtotal').val()) * cantidad;
        var controlador = $('#hfControlador2').val();

        //------------- se enviara a la funcion inventario general-------------------
        var DATOS = new UPSTOCK(id_bodega_general, cantidad, subtotal);
        Procesar(DATOS, controlador);
        $('#modalIngreso').modal('hide');
        Limpiar()
    });

    // funcion Quitar Stock Producto
    function DOWNSTOCK(ID_BODEGA_GENERAL, CANTIDAD, NOMBRE_PRODUCTO, PRECIO) {
        this.ID_BODEGA_GENERAL = ID_BODEGA_GENERAL;
        this.CANTIDAD = CANTIDAD;
        this.NOMBRE_PRODUCTO = NOMBRE_PRODUCTO;
        this.PRECIO = PRECIO;
    }

    // ----------------boton extraerStockProducto---------------------
    $('#btnGuardar3').on('click', function (e) {
        e.preventDefault();
        var id_bodega_general = $('#hfIDBodega3').val();
        var cantidadExtraer = $('#txtSalida').val();
        var Nombre_producto = $('#hfNombre').val();
        var precio = $('#hfPrecio').val();
        if (cantidadExtraer > parseFloat($('#hfcantidad').val())) {
            alert("La cantidad que intenta extraer es mas grande de lo que hay en bodega")
            $('#txtSalida').val('');
        }
        else {
            var controlador = $('#hfControlador3').val();
            var DATOS = new DOWNSTOCK(id_bodega_general, cantidadExtraer, Nombre_producto, precio);
            Procesar(DATOS, controlador);
            $('#modalExtraer').modal('hide');
        }
        Limpiar()
    });

});