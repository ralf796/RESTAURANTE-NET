$(document).ready(function () {
    //INICIA
    ListarPlantas();
    fillAllInputs();

    //FUNCIONES
    function ShowShortMessage(type, title, text) {
        Swal.fire({
            position: 'inherit',
            type: type,
            title: title,
            text: text,
            showConfirmButton: true
        })
    }
    function ListarPlantas() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/REPLiquidaciones/ListarPlantas',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerPlantas = data["Lista"];
                    $('#selPlanta').empty();
                    $('#selPlanta').append('<option value="">SELECCIONE</option> ');
                    traerPlantas.forEach(function (planta) {
                        $('#selPlanta').append('<option value="' + planta.PLANTAS + '">' + planta.DESCRIPCION + '</option>');
                    });
                    $('#selPlanta').selectpicker();
                    $('#selPlanta').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    $('.datepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    $('.datepicker').val(output);

    //LLENAR TABLA CON Clientes
    $('#txtCliente').on('click', function (e) {
        e.preventDefault();
        if ($('#selPlanta').val() == '')
            showNotification('top', 'right', 'warning', 'Debe seleccionar una planta.', 'warning');
        else {
            $('#modalClientes').modal('show');
            $('#txtCodigoRef').val('');
            $('#txtnombreCliente').val('');
            $('#txtNit').val('');
            $('#txtCliente').val('');
            vCliente = '';
        }
    });
    var iniciaTableClientes = false, vPlanta, vCliente;
    var tableClientes = $('#tblListadoClientes').DataTable({
        ajax: function (data, callback, settings) {
            dataSourcetableClientes().then(function (_data) {
                callback(_data);
            });
        },
        columns: [
            { data: 'CLIENTE', visible: false },
            { data: 'NOMBRE_PLANTA' },
            { data: 'CODIGO_REFERENCIA' },
            { data: 'NOMBRE_CLIENTE' },
            { data: 'NIT' }
        ],
        columnDefs: [
            {
                targets: [0],
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
                filename: 'Listado de Corporaciones',
                sheetName: 'Corporaciones',
                title: 'LISTADO DE CORPORACIONES',
                exportOptions: {
                    columns: [0, 1, 2, 3]
                },
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary btn-default')
                }
            }
        ],
        "scrollCollapse": true,
        "pagingType": "full_numbers",
        "lengthMenu": [
            [5, 10, 15, 20, 25, 50, -1],
            [5, 10, 15, 20, 25, 50, "Todo"]
        ],
        responsive: true,
        language: {
            url: "/assets/datatable-spanish.json"
        },
        initComplete: function () {
            iniciaTableClientes = true;
        }
    });
    function dataSourcetableClientes() {
        return new Promise(function (resolve, reject) {
            if (!iniciaTableClientes) {
                resolve({
                    data: {},
                });
            }
            else {
                $.ajax({
                    dataSrc: "Data",
                    url: "/REPLiquidaciones/CargarTableClientes",
                    dataType: 'json',
                    data: { plantas: $('#selPlanta').val(), codRef: $('#txtCodigoRef').val(), nombre: $('#txtnombreCliente').val(), nit: $('#txtNit').val() },
                    success: function (json) {

                        var data = json["data"];
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
    function CargarTableClientes() {
        CallLoadingFire();
        iniciaTableClientes = true;
        tableClientes.clear().draw();
        $('#tblListadoClientes').DataTable().ajax.reload();
    }
    $('#btnBuscarClientes').on('click', function (e) {
        e.preventDefault();

        if (($('#txtCodigoRef').val() == '') && ($('#txtnombreCliente').val() == '') && ($('#txtNit').val() == ''))
            showNotification('top', 'right', 'warning', 'Debe ingresar al menos un filtro', 'warning');
        else {
            if ($('#txtCodigoRef').val() == '')
                $('#txtCodigoRef').val('0');
            CargarTableClientes();
            $('#txtCodigoRef').val('');
            $('#txtnombreCliente').val('');
            $('#txtNit').val('');
        }
    });
    tableClientes.on('dblclick', 'tr', function () {
        var tr = $(this).closest('tr');
        var data = tableClientes.row(tr).data();
        $('#txtCliente').val(data["NOMBRE_CLIENTE"]);
        vCliente = data["CLIENTE"];
        $('#modalClientes').modal('hide');
        fillAllInputs();
    });

    //GENERAR REPORTE
    function generaReporte(pFechaI, pFechaF, pCliente, pPlanta) {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/REPLiquidaciones/CargarReporte',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { plantas: JSON.stringify(pPlanta), cliente: pCliente, fechaI: pFechaI, fechaF: pFechaF },
                    cache: false,
                    success: function (data) {
                        var state = data["Estado"];
                        if (state == 1) {
                            data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                            d.resolve(data);
                            //console.log(data);
                        }
                        else if (state == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, exception) {
                        getErrorMessage(jqXHR, exception);
                        //console.log(exception);
                    }
                });
                return d.promise();
            }
        });
        var salesPivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            //showBorders: false,
            loadPanel: {
                text: "Cargando..."
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            headerFilter: {
                visible: true
            },
            columnAutoWidth: true,
            export: {
                enabled: true
            },
            onExporting: function (e) {
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('Liquidaciones');

                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet: worksheet,
                    topLeftCell: { row: 2, column: 1 },
                }).then(function (dataGridRange) {
                    // header
                    // https://github.com/exceljs/exceljs#rows
                    var headerRow = worksheet.getRow(1);
                    headerRow.height = 30;

                    //Titles
                    var titleColumnRow = worksheet.getRow(2);
                    titleColumnRow.font = {
                        bold: true
                    };
                    for (var i = 1; i <= worksheet.actualColumnCount; i++) {
                        titleColumnRow.getCell(i).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'BEDFE6' }
                        };
                    }

                    // https://github.com/exceljs/exceljs#merged-cells
                    worksheet.mergeCells('A1:Q1');
                    // https://github.com/exceljs/exceljs#value-types
                    headerRow.getCell(1).value = 'Reporte Liquidaciones desde ' + pFechaI + ' hasta ' + pFechaF + ', Grupo TOMZA';
                    // https://github.com/exceljs/exceljs#fonts
                    headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22, bold: true };
                    // https://github.com/exceljs/exceljs#alignment
                    headerRow.getCell(1).alignment = { horizontal: 'left' };

                    // footer
                    var footerRowIndex = dataGridRange.to.row + 2;
                    var footerRow = worksheet.getRow(footerRowIndex);
                    worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 19);

                    footerRow.getCell(1).value = 'https://genesys.tomzagroup.com/';
                    footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
                    footerRow.getCell(1).alignment = { horizontal: 'left' };
                }).then(function () {
                    // https://github.com/exceljs/exceljs#writing-xlsx
                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ReporteLiquidaciones.xlsx');
                    });
                });
                e.cancel = true;
            },
            columns: [
                {
                    dataField: "NO_LIQUIDACION",
                    caption: "NO. LIQ."
                },
                {
                    dataField: "PUNTO_VENTA",
                    caption: "PUNTO DE VENTA"
                },
                {
                    dataField: "FECHA_LIQUIDACION",
                    caption: "FECHA LIQUIDACION"
                },
                {
                    dataField: "CODIGO_REFERENCIA",
                    caption: "COD."
                },
                {
                    dataField: "NOMBRE_CLIENTE",
                    caption: "NOMBRE"
                },
                {
                    dataField: "SERIE",
                    caption: "SERIE"
                },
                {
                    dataField: "NO_FACTURA",
                    caption: "NO. FACTURA"
                },
                {
                    dataField: "PRODUCTO",
                    caption: "PRODUCTO"
                },
                {
                    dataField: "FORMA_PAGO",
                    caption: "FORMA DE PAGO"
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "PRECIO",
                    caption: "PRECIO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "DESCUENTO",
                    caption: "DESCUENTO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "COMISION",
                    caption: "COMISION",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TOTAL",
                    caption: "TOTAL",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "CAJERO",
                    caption: "CAJERO"
                },
                {
                    dataField: "PLANTA",
                    caption: "PLANTA / CEDI"
                },
                {
                    dataField: "GALONES",
                    caption: "GALONES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "VEHICULO",
                    caption: "VEHICULO",
                    visible: false
                },
                {
                    dataField: "PLACA",
                    caption: "PLACA",
                    visible: false
                }
            ],
            summary: {
                totalItems: [{
                    column: "CANTIDAD",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }, {
                    column: "PRECIO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }, {
                    column: "DESCUENTO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }, {
                    column: "COMISION",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }, {
                    column: "TOTAL",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "TOTAL_VENTA",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "GALONES",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }]
            }
        }).dxDataGrid('instance');
    }
    function PLANTAS(COD) {
        this.COD = COD;
    }
    $('#btnGenerarReporte').on('click', function (e) {
        e.preventDefault();

        if ($('#selPlanta').val() == '')
            showNotification('top', 'right', 'warning', 'Debe seleccionar una planta.', 'warning');
        else if (($('#txtFechaI').val() == '') || $('#txtFechaF').val() == '')
            showNotification('top', 'right', 'warning', 'Debe ingresar un rango de fechas', 'warning');
        else {
            var cantPlantas = $('#selPlanta').val().split(',');
            var listPlantas = [];
            listPlantas.length = 0;
            for (var i = 0; i < cantPlantas.length; i++) {
                var listado = new PLANTAS(cantPlantas[i]);
                listPlantas.push(listado);
            }
            generaReporte($('#txtFechaI').val(), $('#txtFechaF').val(), vCliente, listPlantas);

        }
    });
});