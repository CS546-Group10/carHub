var myForm=$("#answer-form"),
question = $('#question_answerquestion'),
answer = $('#answer_answerquestion'),
errorDiv = $('#error_answerQuestions');
errorDiv.hide();
myForm.submit(function(e) {
e.preventDefault();
let errors = []

console.log(question.val());
console.log(answer.val());
if(!question.val()){
    $("#errors").append("Question cannot be empty");
}
if(!answer.val()){
    $("#errors").append("Answer cannot be empty");
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