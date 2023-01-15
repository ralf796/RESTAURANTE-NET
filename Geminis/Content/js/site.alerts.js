const NotifyIcon = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
    none: 'none'
};

// Notifiaciones
Notify = (text, icon = NotifyIcon.info) => {
    $.toast({
        heading: '',
        text: text,
        icon: icon,
        showHideTransition: 'slide',
        position: 'bottom-right',
        bgColor: '#fff',
        textColor: '#6a0527',
        hideAfter: 2000
    });
}
Notify = (text, icon = NotifyIcon.info, callback = null) => {
    if (callback == null) {
        $.toast({
            text: text,
            icon: icon,
            showHideTransition: 'slide',
            position: 'bottom-center',
            //bgColor: '#fff',
            textColor: '#fff',
            hideAfter: 3000,
            position: 'bottom-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'center',
            loader: false
        });
    } else {
        $.toast({
            heading: '',
            text: text,
            icon: icon,
            showHideTransition: 'slide',
            position: 'bottom-center',
            //bgColor: '#fff',
            textColor: '#fff',
            hideAfter: 5000,
            afterHidden: callback,
            loader:false
        });
    }
}

// Alerta
Alert = (text, icon = NotifyIcon.info, callback = null) => {
    if (callback == null) {
        swal({ title: '', html: text, type: icon, confirmButtonText: 'Cerrar' });
    } else {
        swal({ title: '', html: text, type: icon, confirmButtonText:'Cerrar' }, callback);
    }
}

// Confirmación de accion
Confirm = (text, callback) => {
    swal({ title: '', text: text, type: 'info', showCancelButton: true, cancelButtonText: 'No', confirmButtonText: 'Si' }, function (isConfirm) {
        if (isConfirm) {
            callback();
        }
    });
}