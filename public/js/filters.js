var sourceAddress = $('#filter-city'),
    formFilter = $('#filter-form'),
    brandName = $('#filter-brand'),
    capacity = $('#filter-cap'),
    low_rate = $('#filter-rate-low'),
    high_rate = $('#filter-rate-high'),
    zip = $('#filter-Zip'),
    fromDate = $('#filter-fromDate'),
    toDate = $('#filter-toDate'),
    errorDiv = $('#error-filer');
errorDiv.hide();
formFilter.submit(function(e) {
    e.preventDefault();
    let errors = []
    if (sourceAddress.val() != '' && sourceAddress.val().trim().length == 0) {
        errors.push('Enter a Valid City');
    }
    if (brandName.val() != '' && brandName.val().trim().length == 0) {
        errors.push(`brand name cannot be empty!`);
    }
    if (capacity.val() != '' || parseInt(capacity.val()) <= 0) {
        errors.push(`Invalid capacity!`);
    }
    if (low_rate.val() != '' && parseInt(low_rate.val()) <= 0) {
        errors.push(`Invalid low rate!`);
    }
    if (high_rate.val() != '' && parseInt(high_rate.val()) < parseInt(low_rate.val())) {
        errors.push(`Invalid high rate!`);
    }
    if (low_rate.val() != '' && !low_rate.val() || high_rate.val() != '' && !high_rate.val()) {
        errors.push(`Have to provide both High and Low Rates!`)
    }
    if (zip.val() != '' && zip.val().trim().length == 0) {
        errors.push('Enter a Valid City');
    }
    if (zip.val() != '' && zip.val().length < 5) {
        errors.push('give a valid zip!');
    }

    if (fromDate.val() != '' && toDate.val() != '') {
        var startdata_array = fromDate.val().split('-');
        var enddate_array = toDate.val().split('-');
        var startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]) - 1, parseInt(startdata_array[2]))).getTime()
        var enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]) - 1, parseInt(enddate_array[2]))).getTime()
        var currDate = (new Date()).getTime();
        if (enddate < startdate) {
            errors.push(`End date cannot be less than start date!`)
        }
        if (startdate < currDate && currDate - startdate > 86400000) {
            errors.push(`start date cannot be less than current date!`);
        }
    } else if (fromDate.val() != '' || toDate.val() != '') {
        errors.push(`Provide Both start and end dates`)
    }

    if (errors.length > 0) {
        errorDiv.show();
        $.each(errors, function(i, value) {
            errorDiv.append(`<p>${value}</p>`)
        })
    } else {
        errorDiv.hide();
        this.submit();
    }


});