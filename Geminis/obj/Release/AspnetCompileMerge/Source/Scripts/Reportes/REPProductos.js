$(document).ready(function () {
    fillAllInputsForms();

    var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    function fillAllInputsForms() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }

    function mesLetras(mes) {
        return meses[mes];
    }

    function ShowShortMessage(type, title, text) {
        Swal.fire({
            position: 'inherit',
            type: type,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2500
        })
    };

    $('.datepicker').datetimepicker({
        format: 'DD/MM/YYYY',
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

    DevExpress.localization.locale(navigator.language);
    function generarReporte(fechaInicial, fechaFinal) {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                CallLoadingFire();
                $.ajax({
                    type: 'GET',
                    url: '/REPProductos/GenerarReporte',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { fechaInicial, fechaFinal },
                    cache: false,
                    success: function (data) {
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);

                        if (data["Estado"] == -1) {
                            var msg = data["Mensaje"];
                            ShowShortMessage('error', 'Error', msg);
                        }
                    },
                    error: function (jqXHR, ex) {
                        getErrorMessage(jqXHR, ex);
                    }
                });
                return d.promise();
            }
        });

        var customGraphics = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                CallLoadingFire();
                $.ajax({
                    type: 'GET',
                    url: '/REPProductos/GenerarGrafica',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { fechaInicial, fechaFinal },
                    cache: false,
                    success: function (data) {
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);

                        if (data["Estado"] == -1) {
                            var msg = data["Mensaje"];
                            ShowShortMessage('error', 'Error', msg);
                        }
                    },
                    error: function (jqXHR, ex) {
                        getErrorMessage(jqXHR, ex);
                    }
                });
                return d.promise();
            }
        });


        var PivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            headerFilter: {
                visible: true,
                allowSearch: true
            },
            scrolling: {
                showScrollbar: 'always'
            },
            wordWrapEnabled: true,
            showBorders: true,
            rowAlternationEnabled: true,
            columnHidingEnabled: false,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            headerFilter: {
                visible: true
            },
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100],
                showNavigationButtons: true,
                showInfo: true,
                infoText: "Pagina {0} de {1} ({2} items)"
            },
            sortByGroupSummaryInfo: [{
                summaryItem: "count"
            }],
            columns: [
                {
                    dataField: "FECHA",
                    caption: "FECHA"
                },
                {
                    dataField: "CATEGORIA",
                    caption: "CATEGORIA"
                },
                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE"
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                },
                {
                    dataField: "TOTAL",
                    caption: "TOTAL",
                    dataType: "number",
                    format: { type: 'fixedPoint', precision: 2 }
                }
            ],
            export: {
                enabled: true
            },
            onExporting: function (e) {
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('REPORTE');

                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet: worksheet,
                    topLeftCell: { row: 2, column: 1 },
                }).then(function (dataGridRange) {

                    // header
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


                    worksheet.mergeCells('A1:G1');
                    headerRow.getCell(1).value = 'Reporte de productos de ' + fechaInicial + ' hasta ' + fechaFinal + ', Restaurante Maxima';
                    headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22, bold: true };
                    headerRow.getCell(1).alignment = { horizontal: 'left' };

                    // footer
                    var footerRowIndex = dataGridRange.to.row + 2;
                    var footerRow = worksheet.getRow(footerRowIndex);
                    worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 19);

                    //footerRow.getCell(1).value = 'https://genesyssv.tomzagroup.com/';
                    footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
                    footerRow.getCell(1).alignment = { horizontal: 'left' };
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'REPORTE_PRODUCTOS.xlsx');
                    });
                });
                e.cancel = true;
            },

        });

        $('#chart1').dxChart({
            palette: 'soft',
            dataSource: new DevExpress.data.DataSource(customGraphics),
            commonSeriesSettings: {
                ignoreEmptyPoints: true,
                argumentField: 'NOMBRE',
                type: 'bar',
            },
            series: [
                {
                    label: {
                        visible: true,
                        backgroundColor: '#000000',
                    },
                    color: '#E61740',
                    type: 'bar',
                    valueField: 'CANTIDAD',
                    name: 'CANTIDAD'
                },
                {
                    label: {
                        visible: true,
                        backgroundColor: '#000000',
                    },
                    color: '#1518ED',
                    type: 'bar',
                    valueField: 'TOTAL',
                    name: 'TOTAL'
                }
            ],
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center',
            },
            export: {
                enabled: true,
            },
            title: 'VENTA DE PRODUCTOS/MENU',
        });

        
        $('#chart2').dxChart({
            dataSource: new DevExpress.data.DataSource(customGraphics),
            series: {
                label: {
                    visible: true,
                    backgroundColor: '#000000',
                },
                color: '#E61740',
                type: 'bar',
                argumentField: 'NOMBRE',
                valueField: 'CANTIDAD'
            },
            title:'CANTIDAD',
            argumentAxis: {
                label: {
                    customizeText() {
                        return ` ${this.valueText}`;
                    },
                },
            },
            valueAxis: {
                tick: {
                    visible: false,
                },
                label: {
                    visible: false,
                },
            },
            export: {
                enabled: true,
            },
            legend: {
                visible: false,
            },
        });
        $('#chart3').dxChart({
            dataSource: new DevExpress.data.DataSource(customGraphics),
            series: {
                label: {
                    visible: true,
                    backgroundColor: '#000000',
                },
                color: '#1518ED',
                type: 'bar',
                argumentField: 'NOMBRE',
                valueField: 'TOTAL',
            },
            title: 'TOTAL',
            argumentAxis: {
                label: {
                    customizeText() {
                        return ` ${this.valueText}`;
                    },
                },
            },
            valueAxis: {
                tick: {
                    visible: false,
                },
                label: {
                    visible: false,
                },
            },
            export: {
                enabled: true,
            },
            legend: {
                visible: false,
            },
        });
    };

    $('#btnGenerarReporte').on('click', function (e) {
        e.preventDefault();
        if ($('#formReporteporPiloto').valid()) {
            var desde = $('#txtFechaInicial').val();
            var hasta = $('#txtFechaFinal').val();
            generarReporte(desde, hasta)
        }
    })

});