var myForm=$("#updateProfile-form"),
age= $("#age"),
phoneNumber= $("#phoneNumber"),
houseNumber= $("#houseNumber"),
street= $("#street"),
city= $("#city"),
state= $("#state"),
zip= $("#zip"),
errorDiv = $('#error_upload_profile');
errorDiv.hide();
myForm.submit(function(e) {
e.preventDefault();
let errors = []

console.log(question.val());

$("#errors").hide();
$("#errors").empty();

console.log(age.val());
console.log(phoneNumber.val());
console.log(houseNumber.val());
console.log(street.val());
console.log(city.val());
console.log(state.val());
console.log(zip.val());


//Required Fields
if(!age.val()){
    $("#errors").append("<p>Age is required</p>");
}
if(!phoneNumber.val()){
    $("#errors").append("<p>Phone Number is required!</p>");
}
if(!houseNumber.val()){
    $("#errors").append("<p>House Number is required</p>");
}
if(!street.val()){
    $("#errors").append("<p>Street is required</p>");
}
if(!city.val()){
    $("#errors").append("<p>City is required</p>");
}
if(!state.val()){
    $("#errors").append("<p>State is required</p>");
}
if(!zip.val()){
    $("#errors").append("<p>Zip is required</p>");
}

if(parseInt(age.val()) < 18){
    $("#errors").append("<p>You're below 18, sorry!</p>");
}

if(phoneNumber.val().length < 10){
    $("#errors").append("Invalid phone number!");
}else if(!/^\d+$/.test(phoneNumber.val())){
    $("#errors").append("Invalid phone number!");
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