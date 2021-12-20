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
    }
    function ActualizarTotalPedido() {
        var totalPedido = 0;
        tableDetalles.rows().every(function () {
            var row = this.data();
            totalPedido += parseFloat(row[4]);
        });

        $('#txtTotalPedido').val(totalPedido.toFixed(2));
    }

    /*
    $('#linkSopas').on('click', function (e) {
        e.preventDefault();
        $('#modalCrear').modal('show');
    });
    */

    $('#btnAbrirModalCrearRefactura').on('click', function (e) {
        e.preventDefault();
        GetMesas();
        $('#modalCrearRefactura').modal('show');
    });
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
                    habilitartablePedidos();
                    LimpiarTodo();
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
                showNotification('top', 'right', 'warning', 'Debe de ingresar como mínimo una refactura', 'warning');
            //}
        }
    });

    var iniciciarTablePedidos = false;
    function habilitartablePedidos() {
        CallLoadingFire();
        iniciciarTablePedidos = true;
        tablaDatosPedidos.clear().draw();
        $('#tblPedidosCreados').DataTable().ajax.reload();
    }
    var tablaDatosPedidos = $('#tblPedidosCreados').DataTable({
        ajax: function (data, callback, settings) {
            tablaDatodataSourcePedidos().then(function (_data) {
                callback(_data);
            });
        },
        columns: [
            {
                "class": "remover-control",
                "orderable": false,
                "data": null,
                "defaultContent": "",
            },
            { data: 'ID_PEDIDO' },
            { data: 'NUMERO' },
            { data: 'DESCRIPCION' },
            { data: 'TOTAL' },
            {
                data: null,
                className: "center",
                render: function (data, type, row, full, meta) {
                    var editar = '';
                    var eliminar = '';
                    editar = '<a title="MODIFICAR" class="btn btn-link btn-info btn-just-icon modificarPedido" style="margin: 0 0 !important"><i class="material-icons">edit</i></a>'
                    eliminar = '<a title="ANULAR" class="btn btn-link btn-danger btn-just-icon anularPedido" style="margin: 0 0 !important"><i class="material-icons">close</i></a>';
                    return editar + eliminar;
                }
            }
        ],
        columnDefs: [
            {
                targets: 3,
                render: $.fn.dataTable.render.number(',', '.', 2)
            },
            {
                targets: [0,1,2,3,4],
                className: 'text-center'
            },
        ],
        dom: 'Blfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '',
                titleAttr: 'Exportar a Excel',
                className: 'btn-sm btn-link',
                filename: '',
                sheetName: 'Reporte',
                title: '',
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary btn-default')
                }
            }
        ],
        "scrollX": true,
        "order": [[1, 'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [
            [7, 10, 15, 20, 25, 50, -1],
            [7, 10, 15, 20, 25, 50, "Todo"]
        ],
        responsive: false,
        language: {
            url: "/assets/datatable-spanish.json"
        },
        initComplete: function () {
            iniciciarTablePedidos = true;
        }
    });
    function tablaDatodataSourcePedidos() {
        return new Promise(function (resolve, reject) {
            if (!iniciciarTablePedidos) {
                resolve({
                    data: {},
                });
            }
            else {
                $.ajax({
                    url: "/PEDCrearPedido/GetPedidos",
                    dataType: 'json',
                    data: {},
                    success: function (json) {
                        var data = json["DATA"];
                        resolve({
                            data: data,
                        });
                    },
                    error: function (jqXHR, ex) {
                        getErrorMessage(jqXHR, ex);
                        reject();
                    }
                });
            }
        });
    }
    
    habilitartablePedidos();
});