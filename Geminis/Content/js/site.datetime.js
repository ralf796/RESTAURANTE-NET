//DateTime
function DatePicker(obj, options = null) {
    var air = new AirDatepicker(obj, options);
    return air;
}
function DatePickerMonth(obj) {
    var air = new AirDatepicker(obj, {
        view: 'months',
        minView: 'months',
        dateFormat: 'MMMM yyyy'
    });
    return air;
}
function DatePickerYear(obj) {
    var air = new AirDatepicker(obj, {
        view: 'years',
        minView: 'years',
        dateFormat: 'yyyy'
    });
    return air;
}
function DatePickerRange(obj, onchange = null) {
    let air;
    if (onchange == null) {
        air = new AirDatepicker(obj, {
            range: true,
            multipleDatesSeparator: '  -  '
        });
    } else {
        air = new AirDatepicker(obj, {
            range: true,
            multipleDatesSeparator: '  -  ',
            onSelect: onchange
        });
    }
    return air;
}
function DateFormat(date) {
    try {
        let d = date;
        let month = (d.getMonth() + 1).toString().padStart(2, '0');
        let day = d.getDate().toString().padStart(2, '0');
        let year = d.getFullYear();
        return [year, month, day].join('-');
    } catch (err) {
        return '';
    }
}

function DateFormatView(date) {
    try {
        let d = date;
        let month = (d.getMonth() + 1).toString().padStart(2, '0');
        let day = d.getDate().toString().padStart(2, '0');
        let year = d.getFullYear();
        return [day, month, year].join('/');
    } catch (err) {
        return '';
    }
}
function YearNow() {
    let d = new Date;
    return d.getFullYear();
}
function MonthNow() {
    let d = new Date;
    return (d.getMonth() + 1).toString().padStart(2, '0');
}
function DayNow() {
    let d = new Date;
    return d.getDate().toString().padStart(2, '0');
}
function DateNow() {
    try {
        let d = new Date;
        let month = (d.getMonth() + 1).toString().padStart(2, '0');
        let day = d.getDate().toString().padStart(2, '0');
        let year = d.getFullYear();
        return [day, month, year].join('/');
    } catch (err) {
        return '';
    }
}