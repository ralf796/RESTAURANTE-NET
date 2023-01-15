// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(function () {
    //Verifica si tiene el loader
    var iloader = $('body').find('.loader');
    if (iloader.length == 0) {
        $('body').append('<div class="loader"></div>');
    }
    $(document).bind('ajaxStart', function () {
        blockUI();
    }).bind('ajaxStop', function () {
        unblockUI();
    });
    //form submit
    $('form').on('submit', function () {
        blockUI();
    });
    //Tips
    LoadTips();
});
$.ajaxSetup({
    error: function (event, request, settings) {
        unblockUI();
    }
});
blockUI = () => {
    $('.loader').fadeIn('fast');
}
unblockUI = () => {
    $('.loader').fadeOut('slow');
}
$(document).ready(function () {
    // Menu activo  
    MarcarMenuActivo();
});

//Cambio de Empresa
$('#CurrentEmpresa').on('change', function () {
    let cod_emp = $('#CurrentEmpresa option:selected')[0].value;
    let url = $('#CurrentEmpresa').attr('data-url');
    $.post(url, { cod_emp }, function () {
        window.location.reload();
    });
});
//Color Picker
$('#btnColorPicker').on('click', function () {
    let theme_color = $('body').attr("data-theme");
    $('#btnColorPicker > i').toggleClass('fa-chevron-up');
    $('#btnColorPicker > i').toggleClass('fa-chevron-down');
    $('#ColorPicker').fadeToggle();
});
$('#btnColorPicker').on('click', function () {
    let theme_color = $('body').attr("data-theme");
    $('#btnColorPicker > .color-picker').removeClass('active');
    $('#btnColorPicker > .color-picker[data-theme="' + theme_color + '"]').addClass('active');
});
$('.color-picker').on('click', function () {
    let theme_color = $(this).attr("data-theme");
    let url = $(this).attr('data-url');
    $('#btnColorPicker > .color-picker').removeClass('active');
    $('#btnColorPicker > .color-picker[data-theme="' + theme_color + '"]').addClass('active');
    $('body').attr("data-theme", theme_color);
    $.post(url, { theme_color });
});
//Salir
$('#bntSalir').on('click', function () {
    Confirm('Desea salir del módulo de contabilidad', function () {
        window.location = $('#bntSalir').attr('data-url');
    });
});

function MarcarMenuActivo() {
    $('#accordionMenu .list-group-item-action').on('click', function () {
        let menuId = $(this).attr('menu-id');
        let menuPadre = $(this).attr('menu-padre');
        localStorage.setItem("menu-id", menuId);
        localStorage.setItem("menu-padre", menuPadre);
    });
    let markId = localStorage.getItem('menu-id');
    let markPadre = localStorage.getItem('menu-padre');
    $('#accordionMenu .accordion-header[menu-id="' + markPadre + '"] button').click();
    $('#accordionMenu .list-group-item-action[menu-id="' + markId + '"]').addClass('active');
}

function LoadTips() {

    $('[data-bs-toggle="tooltip"]').tooltip({
        placement: 'bottom'
    });

    //Form control nav with enter
    let list_controls = '.form-next';
    var $inp = $(list_controls);
    $inp.bind('keypress', function (e) {
        var n = $(list_controls).length;
        var key = e.which;
        if (key == 13) {
            e.preventDefault();
            var nextIndex = $inp.index(this) + 1;
            if (nextIndex < n) {
                $(list_controls)[nextIndex].focus();
            }
        }
    });
}
function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function DownloadFile(request, data = null) {
    $.post(request, data, function (result) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:' + result.mimeType + ';base64,' + result.file);
        pom.setAttribute('download', result.fileName);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    });
}