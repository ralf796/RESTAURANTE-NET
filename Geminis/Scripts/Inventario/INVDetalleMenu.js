$(document).ready(function () {
    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    ObtenerUnidadMenuSelect();
    ObtenerUnidadCodinaSelect();
    /*   ObtenerTipoEmpleadoSelect();*/
    llenarReporte();
    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function Limpiar() {
        $('#selMenu').selectpicker();
        $('#selMenu').val();
        $('#selMenu').selectpicker('refresh');
        $('#selCocina').selectpicker();
        $('#selCocina').val();
        $('#selCocina').selectpicker('refresh');
        $('#txtCantidad').val('');
    }
    //------------------funcion PROCESAR GUARDAR Y EDITA----------------------------
    function Procesar(pDatos, controller) {
        //CallLoadingFire();

        $.ajax({
            type: 'POST',
            url: '/INVDetalleMenu/' + controller,
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
                    $('#modalDetalleMenu').modal('hide');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    //------------------funcion PROCESAR GUARDAR Y EDITA---------------------------
    // ---------------------funcion MENU--------------------------------
    function ObtenerUnidadMenuSelect() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/INVDetalleMenu/ObtenerMenuSelect',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selMenu').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selMenu').append('<option value="' + dato.ID_MENU + '">' + dato.NOMBRE + '</option>');
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
    // ---------------------funcion MENU--------------------------------
    // ---------------------funcion BODEGA COCINA--------------------------------
    function ObtenerUnidadCodinaSelect() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/INVDetalleMenu/ObtenerCocinaSelect',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selCocina').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selCocina').append('<option value="' + dato.ID_INVENTARIO_COCINA + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selCocina').selectpicker();
                    $('#selCocina').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    // ---------------------funcion BODEGA CODIGA--------------------------------
    // --------------------funcion de llenado de reporte---------------------------
    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/INVDetalleMenu/CargarDetalleMenu',
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
                    dataField: "ID_MENU_DETALLE",
                    caption: "ID MENU DETALLE",
                    visible: false
                },
                {
                    dataField: "ID_MENU",
                    caption: "ID MENU",
                    visible: false
                },
                {
                    dataField: "NOMBRE_MENU",
                    caption: "MENU"
                },
                {
                    dataField: "ID_INVENTARIO_COCINA",
                    caption: "ID_COCINA",
                    visible: false
                },
                {
                    dataField: "PRODUCTO",
                    caption: "INGREDIENTE"
                }
                ,
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "CREADO_POR",
                    caption: "CREADO_POR"
                },
                {
                    dataField: "FECHA_CREACION",
                    caption: "FECHA_CREACION",
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
                            int: "Actualizar",
                            icon: "edit",
                            onClick: function (e) {
                                $('#hfIDDetalleMenu').val(e.row.data['ID_MENU_DETALLE']);
                                $('#selMenu').selectpicker();
                                $('#selMenu').val(e.row.data['ID_MENU']);
                                $('#selMenu').selectpicker('refresh');
                                $('#selCocina').selectpicker();
                                $('#selCocina').val(e.row.data['ID_INVENTARIO_COCINA']);
                                console.log($('#selCocina').val());
                                $('#selCocina').selectpicker('refresh');
                                $('#txtCantidad').val(e.row.data['CANTIDAD']);
                                $('#hfControlador').val('Editar');
                                $('#modalDetalleMenu').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_MENU_DETALLE']);
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
                                $('#hfIDDetalleMenu').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalDetalleMenu').modal('show');
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

    //FUNCION MENU DETALLE
    function MENU_DETALLE(ID_MENU_DETALLE, ID_MENU, ID_INVENTARIO_COCINA, CANTIDAD) {
        this.ID_MENU_DETALLE = ID_MENU_DETALLE;
        this.ID_MENU = ID_MENU;
        this.ID_INVENTARIO_COCINA= ID_INVENTARIO_COCINA;
        this.CANTIDAD = CANTIDAD;
    }
    $('#btnGuardar').on('click', function () {
        var id_menu_detalle = $('#hfIDDetalleMenu').val();
        var id_menu = $('#selMenu').val();
        var id_inventario_cocina = $('#selCocina').val();
        var cantidad = $('#txtCantidad').val();
        var controlador = $('#hfControlador').val();
        var DATOS = new MENU_DETALLE(id_menu_detalle, id_menu, id_inventario_cocina, cantidad);
        Procesar(DATOS, controlador);
    });
       
});