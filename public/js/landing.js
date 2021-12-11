
    var myForm=$("#landing-form");
    var sourceAddress = $('#source_Address'),
    errorDiv = $('#error_landing');
    errorDiv.hide();
    myForm.submit(function(e) {
    e.preventDefault();
    let errors = []

    console.log("here" ,sourceAddress.val());
    if(!sourceAddress.val()){
        $("#errors").append("Source Address cannot be empty");
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
})

errorDiv.hide();