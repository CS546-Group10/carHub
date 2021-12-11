(function($){
    var myForm=$("#signup-form");
    myForm.submit(function(event){
        event.preventDefault();
        const email = $("#email").val();
        const password = $("#password").val();
        const firstName=$("#firstName").val();
        const lastName=$("#lastName").val();
        const age= $("#age").val();
        const phoneNumber= $("#phoneNumber").val();
        const houseNumber= $("#houseNumber").val();
        const street= $("#street").val();
        const city= $("#city").val();
        const state= $("#state").val();
        const zip= $("#zip").val();

        console.log(email);
        console.log(password);
        console.log(firstName);
        console.log(lastName);
        console.log(age);
        console.log(phoneNumber);
        console.log(houseNumber);
        console.log(street);
        console.log(city);
        console.log(state);
        console.log(zip);

        $("#errors").hide();
        $("#errors").empty();

        if(email){
            $("#errors").append("<p>Cannot Update Username</p>");
        }
        if(password){
            $("#errors").append("<p>Cannot Update Password</p>");
        }
        if(firstName){
            $("#errors").append("<p>Cannot Update Firstname</p>");
            throw `Cannot Update Firstname`;
        }
        if(lastName){
            $("#errors").append("<p>Cannot Update Lastname</p>");
        }


        //Required Fields
        if(!age){
            $("#errors").append("<p>Age is required</p>");
        }
        if(!phoneNumber){
            $("#errors").append("<p>Phone Number is required!</p>");
        }
        if(!houseNumber){
            $("#errors").append("<p>House Number is required</p>");
        }
        if(!street){
            $("#errors").append("<p>Street is required</p>");
        }
        if(!city){
            $("#errors").append("<p>City is required</p>");
        }
        if(!state){
            $("#errors").append("<p>State is required</p>");
        }
        if(!zip){
            $("#errors").append("<p>Zip is required</p>");
        }
       
        if(parseInt(age) < 18){
            $("#errors").append("<p>You're below 18, sorry!</p>");
        }

        console.log(phoneNumber);
        if(phoneNumber.length < 10){
            $("#errors").append("<p>Invalid phone number!</p>");
        }else if(!/^\d+$/.test(phoneNumber)){
            $("#errors").append("<p>Invalid phone number!</p>");
        }
        
        if( $('#errors').is(':empty') ) {
            myForm[0].submit();
        }
        else{
            $("#errors").show();
        }
    })
    })(window.jQuery);