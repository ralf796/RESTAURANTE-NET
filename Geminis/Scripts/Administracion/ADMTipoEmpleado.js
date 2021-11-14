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
            url: '/ADMTipoEmpleado/Guardar',
            data: {
                datos: JSON.stringify(pDatos)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Tipo empleado guardado con éxito', 'success');
                    $('#modalCrear').modal('hide');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function CAT_TIPO_EMPLEADO(NOMBRE, DESCRIPCION) {
        this.NOMBRE = NOMBRE;
        this.DESCRIPCION = DESCRIPCION;

    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var nombre = $('#txtNombre').val();
        var descripcion = $('#txtDescripcion').val();

        //----------------ENCAPSULAMIENTO JSON----------------        
        var DATOS = new CAT_TIPO_EMPLEADO(nombre, descripcion);
        Guardar(DATOS);

    });
});