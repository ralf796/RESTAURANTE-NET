function Table(obj) {
    try {
        $(obj).addClass('nowrap w-100');
        var tableOut = $(obj).DataTable({
            fixedHeader: true,
            scrollCollapse: true,
            scrollY: window.innerHeight - 250,
            scrollX: true,
            info: false,
            paginate: false,
            language: 'es-ES.json',
            //responsive: true,
            ordering: false
            //searching: false
        });

        // Search text
        $('input[type="search"]').attr('placeholder', "Buscar o filtrar");
        // Properties
        $('.dataTables_filter').parent().removeClass('col-md-6');
        $('.dataTables_filter label').addClass('input-group');
        if ($('.dataTables_length').length != 0) {
            $('.dataTables_filter').parent().addClass('col-md-8');
            $('.dataTables_filter label').addClass('input-group');

            $('.dataTables_length').parent().removeClass('col-md-6');
            $('.dataTables_length').parent().addClass('col-md-4');
            $('.dataTables_length label').addClass('input-group');
        }

        return tableOut;

    } catch (err) {
        console.log(err);
    }
}
function TableNoSearch(obj) {
    try {
        $(obj).addClass('nowrap w-100');
        var tableOut = $(obj).DataTable({
            fixedHeader: true,
            scrollCollapse: true,
            scrollY: window.innerHeight - 250,
            scrollX: true,
            info: false,
            paginate: false,
            language: 'es-ES.json',
            //responsive: true,
            searching: false,
            ordering: false
        });
        return tableOut;
    } catch (err) {
        console.log(err);
    }
}