$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }

    $('#linkSopas').on('click', function (e) {
        e.preventDefault();
        $('#modalCrear').modal('show');
    });

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
                //----------------ERROR CATCH----------------
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["MENSAJE"], 'danger');
                    return;
                }
                //----------------PEDIDO GUARDADO----------------
                else if (data["Estado"] == 1) {
                    var vMensaje = 'PEDIDO CREADO';
                    var vMensaje2 = '<div><br />NO. PEDIDO: ' + data["PEDIDO"] + '</div>';
                    swal(vMensaje, vMensaje2, "success");
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    $('#btnGuardarNCRefacturación').on('click', function (e) {
        e.preventDefault();

        //----------------VALIDACION DE FORMULARIO----------------
        if ($('#formNCRefacturacion').valid()) {
            var totalRefactura = $('#txtTotalRefacturas').val().replace(",", "");
            var total = $('#tdTotalFactura1Refac').val().replace(",", "");

            //if (parseFloat(totalRefactura) != parseFloat(total))
            //    showNotification('top', 'right', 'warning', 'El total de refacturas no coincide con el saldo disponible.', 'warning');
            //else {

            //----------------DEFINIR VARIABLES----------------
            var corporacion = $('#txtCorporacionRefac').val();
            var tipoNC = 2;
            var serieNC = $('#selSerieNCPorRefactura').val();
            var resolucionNC = $('#selSerieNCPorRefactura option:selected').attr('data-resolucion');
            var noNC = $('#selSerieNCPorRefactura option:selected').attr('data-noSiguiente');
            var serieF = $('#txtSerieFacRefac').val();
            var resolucionF = $('#txtNoresolucionFacRefactura').val();
            var noF = $('#txtNoFacturaRefac').val();
            var iva = $('#txtTotalIvaFacRefactura').val().replace(",", "");
            var serieFelF = $('#txtSerieFel1Refac').val();
            var noFelF = $('#txtNoFel1Refac').val();
            var motivo = 'Por refacturacion de factura: ' + serieF + ' - ' + noF + ' (' + serieFelF + '  -  ' + noFelF + ')';
            var uuidFelF = $('#txtUuid1Refac').val();
            var nit = $('#txtNit1Refac').val();
            var nombre = $('#txtNombreCliente1Refac').val();
            var direccion = $('#txtDireccionFacRefactura').val();
            var totalGalones = $('#txtTotalGalonesFacRefactura').val();
            var idp = parseFloat($('#txtTotalIdpFacRefactura').val().replace(",", ""));
            var fechaF = $('#txtFechaFactura1Refac').val();

            //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
            var encabezado = new JSON_ENCABEZADO(corporacion, tipoNC, serieNC, resolucionNC, noNC, serieF,
                resolucionF, noF, iva, total, motivo, serieFelF, noFelF, uuidFelF,
                nit, nombre, direccion, totalGalones, idp, fechaF);

            //----------------ENCAPSULAMIENTO DETALLE REFACTURA----------------
            var listRefacturas = [];
            $('#tbodyDatosFactura tr').each(function () {
                var vCliente = $(this).find("td").eq(0).text();
                var vNombreCliente = $(this).find("td").eq(1).text();
                var vNit = $(this).find("td").eq(2).text();
                var vDireccion = $(this).find("td").eq(3).text();
                var vSerie = $(this).find("td").eq(4).text();
                var vResolucion = $(this).find("td").eq(5).text();
                var vNoFac = $(this).find("td").eq(6).text();
                var vListaCantidades = $(this).find("td").eq(7).text();
                var vListaProductos = $(this).find("td").eq(8).text();
                var vListaPrecios = $(this).find("td").eq(9).text();
                var vTotal = $(this).find("td").eq(10).text();
                var vIVA = $(this).find("td").eq(11).text();
                var vAplica = $(this).find("td").eq(13).text();
                var vMonto = $(this).find("td").eq(14).text();

                var dpi = '';
                if (cuiIsValid(vNit))
                    dpi = vNit;

                var listado = new JSON_REFACTURAS(vCliente, vNombreCliente, vNit, vDireccion, vSerie, vResolucion, vNoFac, vListaCantidades, vListaProductos, vListaPrecios, vTotal, vIVA, vAplica, vMonto, dpi);
                listRefacturas.push(listado);
            });

            //----------------ENCAPSULAMIENTO DETALLE NC---------------- 
            var listDetalleNC = [];
            $('#tbodyDatosFactura tr').each(function () {
                var vSerie = $(this).find("td").eq(4).text();
                var vResolucion = $(this).find("td").eq(5).text();
                var vNoFac = $(this).find("td").eq(6).text();
                var listado = new CYC_NOTA_CREDITO_FACTURA(1, vSerie, vNoFac, vResolucion);
                listDetalleNC.push(listado);
            });

            var nitFacAplicada = $("#txtNit1Refac").val().trim();
            var dpiFac = '';
            if (cuiIsValid(nitFacAplicada))
                dpiFac = nitFacAplicada;

            //----------------MANDAR A LLAMAR A LA FUNCION PARA GUARDAR NC DESCUENTO----------------
            if (listRefacturas.length > 0)
                FirmarNotaCreditoRefactura(encabezado, listRefacturas, listDetalleNC, dpiFac);
            else
                showNotification('top', 'right', 'warning', 'Debe de ingresar como mínimo una refactura', 'warning');
            //}
        }
    });



});