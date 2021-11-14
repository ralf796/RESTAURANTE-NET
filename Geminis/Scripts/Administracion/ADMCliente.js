$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }

    $('#btnCrear').on('click', function (e) {
        e.preventDefault();
        $('#modalCrear').modal('show');
    });

    function Guardar(pDatos) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/ADMCliente/Guardar',
            data: {
                datos: JSON.stringify(pDatos)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Cliente guardado con éxito', 'success');
                    $('#modalCrear').modal('hide');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function CAT_CLIENTE(
        NOMBRE_CLIENTE,
        NIT,
        TELEFONO,
        DIRECCION,
        CORREO_ELECTRONICO) {
        this.NOMBRE_CLIENTE = NOMBRE_CLIENTE;
        this.NIT = NIT;
        this.TELEFONO = TELEFONO;
        this.DIRECCION = DIRECCION;
        this.CORREO_ELECTRONICO = CORREO_ELECTRONICO;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var nombre = $('#txtNombre').val();
        var nit = $('#txtNit').val();
        var telefono = $('#txtTelefono').val();
        var direccion = $('#txtDireccion').val();
        var correo = $('#txtCorreo').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new CAT_CLIENTE(
            nombre, nit, telefono, direccion, correo
        );

        Guardar(DATOS);

    });
});