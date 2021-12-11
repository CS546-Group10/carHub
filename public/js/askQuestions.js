var myForm=$("#question-form"),
question = $('#question_askquestion'),
errorDiv = $('#error_askQuestions');
errorDiv.hide();
myForm.submit(function(e) {
e.preventDefault();
let errors = []

console.log(question.val());

if(!question.val()){
    $("#errors").append("Question cannot be empty");
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