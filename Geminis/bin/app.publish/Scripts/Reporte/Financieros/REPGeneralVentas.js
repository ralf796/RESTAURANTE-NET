$(document).ready(function () {
    //INICIA
    $('#minimizeSidebar').trigger('click');

    ListarPlantas();
    fillAllInputsForms();

    //FUNCIONES
    function ShowShortMessage(type, title, text) {
        Swal.fire({
            position: 'inherit',
            type: type,
            title: title,
            text: text,
            showConfirmButton: true,
            timer: 6500
        })
    }
    function ListarPlantas() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/REPGeneralVentas/ListarPlantas',
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
    function fillAllInputsForms() {
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

    //GENERAR REPORTE
    function generaReporteCanalVentas(pFechaI, pFechaF, pPlanta) {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/REPGeneralVentas/CargarReporteCanalVentas',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { plantas: JSON.stringify(pPlanta), fechaI: pFechaI, fechaF: pFechaF },
                    cache: false,
                    success: function (data) {
                        var state = data["Estado"];
                        if (state == 1) {
                            data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                            d.resolve(data);
                            console.log(data);
                        }
                        else if (state == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                    }
                });
                return d.promise();
            }
        });

        var salesPivotGrid = $("#gridContainerCanalVentas").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            showColumnLines: false,
            showRowLines: false,
            rowAlternationEnabled: false,
            showBorders: true,
            columnAutoWidth: true,
            paging: {
                pageSize: 1000
            },
            sortByGroupSummaryInfo: [{
                summaryItem: "count"
            }],
            loadPanel: {
                text: "Cargando..."
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            export: {
                enabled: true
            },
            onExporting: function (e) {
                var dataGrid1 = $("#gridContainerCanalVentas").dxDataGrid("instance");
                var dataGrid2 = $("#gridContainerResumenVentas").dxDataGrid("instance");
                var dataGrid3 = $("#gridContainerBoletas").dxDataGrid("instance");
                var dataGrid4 = $("#gridContainerLiquidaciones").dxDataGrid("instance");
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('Rpte. General de ventas');

                Object.assign(
                    worksheet.getRow(1).getCell(1),
                    { value: "CANAL DE VENTAS:", font: { bold: true, size: 16, underline: 'double' } }
                );
                
                DevExpress.excelExporter.exportDataGrid({
                    component: dataGrid1,
                    worksheet: worksheet,
                    topLeftCell: { row: 2, column: 1 },
                    saveEnabled: false
                }).then(function (dataGridRange) {
                    Object.assign(
                        worksheet.getRow((dataGridRange.to.row + 2)).getCell(1),
                        { value: "RESUMEN DE VENTAS:", font: { bold: true, size: 16, underline: 'double' } }
                    );
                    return DevExpress.excelExporter.exportDataGrid({
                        worksheet, component: dataGrid2, topLeftCell: { row: (dataGridRange.to.row + 3), column: 1 },
                        saveEnabled: true, workbook,
                    });
                }).then(function (dataGridRange) {
                    Object.assign(
                        worksheet.getRow((dataGridRange.to.row + 2)).getCell(1),
                        { value: "BOLETAS:", font: { bold: true, size: 16, underline: 'double' } }
                    );
                    return DevExpress.excelExporter.exportDataGrid({
                        worksheet, component: dataGrid3, topLeftCell: { row: (dataGridRange.to.row + 3), column: 1 },
                        saveEnabled: true, workbook,
                    });
                }).then(function (dataGridRange) {
                    Object.assign(
                        worksheet.getRow((dataGridRange.to.row + 2)).getCell(1),
                        { value: "LIQUIDACIONES:", font: { bold: true, size: 16, underline: 'double' } }
                    );
                    return DevExpress.excelExporter.exportDataGrid({
                        worksheet, component: dataGrid4, topLeftCell: { row: (dataGridRange.to.row + 3), column: 1 },
                        saveEnabled: true, workbook,
                    });
                }).then(function () {
                    // https://github.com/exceljs/exceljs#writing-xlsx

                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ReporteGeneralVentas.xlsx');
                    });
                });
                e.cancel = true;
            },

            summary: {
                totalItems: [{
                    column: "LBS_5",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_10",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_15",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_20",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_25",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_35",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_40",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_60",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_100",
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
                },
                {
                    column: "LIBRAS",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "DOLARES",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }]
            },
            columns: [
                {
                    dataField: "CANAL_VENTA",
                    caption: "CANAL DE VENTAS",
                    fixed: true
                },
                {
                    dataField: "LBS_5",
                    caption: "5 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_10",
                    caption: "10 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_15",
                    caption: "15 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_20",
                    caption: "20 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_25",
                    caption: "25 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_35",
                    caption: "35 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_40",
                    caption: "40 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_60",
                    caption: "60 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_100",
                    caption: "100 LBS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "GALONES",
                    caption: "GALONES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LIBRAS",
                    caption: "LIBRAS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "DOLARES",
                    caption: "DOLARES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                }
            ],
            onRowPrepared: function (e) {
                e.rowElement.css({ height: 10 });
            }

        }).dxDataGrid('instance');
    }
    function generaReporteResumenVentas(pFechaI, pFechaF, pPlanta) {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/REPGeneralVentas/CargarReporteResumenVentas',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { plantas: JSON.stringify(pPlanta), fechaI: pFechaI, fechaF: pFechaF },
                    cache: false,
                    success: function (data) {
                        var state = data["Estado"];
                        if (state == 1) {
                            data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                            d.resolve(data);
                            console.log(data);
                        }
                        else if (state == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                    }
                });
                return d.promise();
            }
        });

        var salesPivotGrid = $("#gridContainerResumenVentas").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            showColumnLines: false,
            showRowLines: false,
            rowAlternationEnabled: false,
            showBorders: true,
            columnAutoWidth: true,
            paging: {
                pageSize: 1000
            },
            sortByGroupSummaryInfo: [{
                summaryItem: "count"
            }],
            loadPanel: {
                text: "Cargando..."
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            summary: {
                totalItems: [{
                    column: "GAL_CONTADO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_CONTADO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "TOTAL_CONTADO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "TOTAL_DESCUENTO_CONTADO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "GAL_CREDITO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "LBS_CREDITO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "TOTAL_CREDITO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                },
                {
                    column: "TOTAL_DESCUENTO_CREDITO",
                    summaryType: "sum",
                    customizeText: function (cellInfo) {
                        return formatNumber(cellInfo.value.toFixed(2));
                    }
                }]
            },
            columns: [
                {
                    dataField: "CANAL_VENTA",
                    caption: "RESUMEN DE VENTA",
                    fixed: true
                },
                {
                    dataField: "GAL_CONTADO",
                    caption: "GALONES CONTADO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_CONTADO",
                    caption: "LBS CONTADO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TOTAL_CONTADO",
                    caption: "DOLARES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TOTAL_DESCUENTO_CONTADO",
                    caption: "DESC CONTADO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "GAL_CREDITO",
                    caption: "GALONES CREDITO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "LBS_CREDITO",
                    caption: "LBS CREDITO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TOTAL_CREDITO",
                    caption: "DOLARES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TOTAL_DESCUENTO_CREDITO",
                    caption: "DESCUENTO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                }
            ],
            onRowPrepared: function (e) {
                e.rowElement.css({ height: 10 });
            }
        }).dxDataGrid('instance');
    }
    function generaReporteResumenBoletas(pFechaI, pFechaF, pPlanta) {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/REPGeneralVentas/CargarReporteBoletas',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { plantas: JSON.stringify(pPlanta), fechaI: pFechaI, fechaF: pFechaF },
                    cache: false,
                    success: function (data) {
                        var state = data["Estado"];
                        if (state == 1) {
                            data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                            d.resolve(data);
                            debugger;
                        }
                        else if (state == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                    }
                });
                return d.promise();
            }
        });

        var salesPivotGrid = $("#gridContainerBoletas").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            columnAutoWidth: true,
            paging: {
                pageSize: 10
            },
            loadPanel: {
                text: "Cargando..."
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "onScroll" // or "onScroll" | "always" | "never"
            },
            headerFilter: {
                visible: true
            },
            columnAutoWidth: true,
            summary: {
                totalItems: [
                    {
                        column: "VTAS_EFECTIVO",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "VTAS_CHEQUES",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "TRANSFERENCIA",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "SUBSIDIOS",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "GASTOS_OPERACION",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "VTAS_BR",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "RECUPERACION",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "GASTOS_ADMINISTRATIVOS",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "COBRANZA",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "INSTALACION",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    },
                    {
                        column: "CANJE",
                        summaryType: "sum",
                        customizeText: function (cellInfo) { return formatNumber(cellInfo.value.toFixed(2)); }
                    }
                ]
            },
            columns: [
                {
                    dataField: "DOCUMENTO",
                    caption: "DOCUMENTO",
                    fixed: true
                },
                {
                    dataField: "VTAS_EFECTIVO",
                    caption: "VTAS. EFECTIVO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "VTAS_CHEQUES",
                    caption: "VTAS. CHEQUES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "SUBSIDIOS",
                    caption: "SUBSIDIOS",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TRANSFERENCIA",
                    caption: "TRANSFERENCIA",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "GASTOS_OPERACION",
                    caption: "GTOS. OPERACION",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "VTAS_BR",
                    caption: "VTAS. BR",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 },
                    visible: false
                },
                {
                    dataField: "RECUPERACION",
                    caption: "CHEQUE RECUPERADO",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "GASTOS_ADMINISTRATIVOS",
                    caption: "GTOS. ADMINISTRACION",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "COBRANZA",
                    caption: "COBRANZA",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "INSTALACION",
                    caption: "INSTALACIONES",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "CANJE",
                    caption: "CANJE",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 },
                    visible: false
                }
            ]
        }).dxDataGrid('instance');
    }
    function generaReporteLiquidaciones(pFechaI, pFechaF, pPlanta) {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/REPGeneralVentas/CargarReporteLiquidaciones',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { plantas: JSON.stringify(pPlanta), fechaI: pFechaI, fechaF: pFechaF },
                    cache: false,
                    success: function (data) {
                        var state = data["Estado"];
                        if (state == 1) {
                            data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                            d.resolve(data);
                            debugger;
                        }
                        else if (state == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, exception) {
                        console.log(exception);
                    }
                });
                return d.promise();
            }
        });

        var salesPivotGrid = $("#gridContainerLiquidaciones").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            showColumnLines: false,
            showRowLines: false,
            rowAlternationEnabled: false,
            showBorders: true,
            columnAutoWidth: true,
            paging: {
                pageSize: 1000
            },
            sortByGroupSummaryInfo: [{
                summaryItem: "count"
            }],
            loadPanel: {
                text: "Cargando..."
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            columns: [
                {
                    dataField: "NO_LIQ",
                    caption: "NO. LIQ.",
                    fixed: true
                },
                {
                    dataField: "FECHA",
                    caption: "FECHA"
                },
                {
                    dataField: "PDV",
                    caption: "PDV"
                },
                {
                    dataField: "PILOTO",
                    caption: "PILOTO"
                },
                {
                    dataField: "EMPLEADO_LIQUIDA",
                    caption: "EMPLEADO LIQUIDA"
                },
                {
                    dataField: "CAJERO",
                    caption: "CAJERO"
                }
            ]
        }).dxDataGrid('instance');
    }
    function PLANTAS(COD) {
        this.COD = COD;
    }
    $('#btnGenerarReporte').on('click', function (e) {
        e.preventDefault();
        debugger;
        if (($('#txtFechaI').val() == '') || $('#txtFechaF').val() == '' || $('#selPlanta').val() == '')
            showNotification('top', 'right', 'warning', 'Todos los campos son requeridos.', 'warning');
        else {
            var cantPlantas = $('#selPlanta').val().split(',');
            var listPlantas = [];
            listPlantas.length = 0;
            for (var i = 0; i < cantPlantas.length; i++) {
                var listado = new PLANTAS(cantPlantas[i]);
                listPlantas.push(listado);
            }

            generaReporteCanalVentas($('#txtFechaI').val(), $('#txtFechaF').val(), listPlantas);
            generaReporteResumenVentas($('#txtFechaI').val(), $('#txtFechaF').val(), listPlantas);
            generaReporteResumenBoletas($('#txtFechaI').val(), $('#txtFechaF').val(), listPlantas);;
            generaReporteLiquidaciones($('#txtFechaI').val(), $('#txtFechaF').val(), listPlantas);;
        }
    });
});