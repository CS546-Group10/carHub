(function($) {
    var searchPageForm = $('#searchPage'),
        errorDiv = $('#errorDivSearchPage'),
        inputSearch = $('#where')
    errorDiv.hide();
    $('#searchPage').submit(function(e) {
        e.preventDefault();
        var errors = []
        if (inputSearch.val().length == 0 || inputSearch.val().trim().length == 0) {

            errors.push('Enter a Valid City');
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

})(window.jQuery);