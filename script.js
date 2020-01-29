$(document).ready(function () {
    ajaxCustomersList();
    setuplistener();
});

function setuplistener(){
    //List of Customers > delete button
    $('#customers-list').on("click", '.event-delete', function (e) {
        var index = e.target.id.split("-").pop();
        ajaxDeleteCustomer(index);
        $(this).parent().parent().remove();
    });
    //List of Customers > edit button
    $('#customers-list').on("click", '.event-edit', function (e) {
        $('html,body').animate({
            scrollTop: $("#customers-management").offset().top
        }, 'slow');
        var index = e.target.id.split("-").pop();
        ajaxEditCustomer(index);
    });
    //Customer Management > reset button
    $('.management-btn-wrapper').on("click", '.event-reset', function (e) {
        $('#customers-management').find('input.form-control').val('');
        $('#customers-management > div').attr("id", "");
    });
    //Customer Management > add button 
    $('.management-btn-wrapper').on("click", '.event-add', function (e) {
        if(!($('#customers-management').find('input.form-control').val().length === 0 )) {
            $('#customers-management > div').attr("id", "");
            var firstname = $('#customers-management').find('input.inpt-firstname').val();
            var lastname = $('#customers-management').find('input.inpt-lastname').val();
            var email = $('#customers-management').find('input.inpt-email').val();
            var phone = $('#customers-management').find('input.inpt-phone').val();
            ajaxSaveCustomer(firstname,lastname,email,phone);
        } else {
            var message = 'Need to write customer info!';
            var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
            $('.customers-management-error-alert').append(errorAlertString);
            messageTimer();
            clearMessageTimer();
        }
    });
    //Customer Management > update button
    $('.management-btn-wrapper').on("click", '.event-update', function (e) {
        if(!($('#customers-management').find('input.form-control').val().length === 0 )) {
            var firstname = $('#customers-management').find('input.inpt-firstname').val();
            var lastname = $('#customers-management').find('input.inpt-lastname').val();
            var email = $('#customers-management').find('input.inpt-email').val();
            var phone = $('#customers-management').find('input.inpt-phone').val();
            var index = $('#customers-management > div').attr('id').split("-").pop();
            ajaxUpdateCustomer(index, firstname, lastname, email, phone);
        } else {
            var message = 'Need to write customer info!';
            var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
            $('.customers-management-error-alert').append(errorAlertString);
            messageTimer();
            clearMessageTimer();
        }
    });
}

//get list with all the ccustomers
var listCustomers = function (response) {
    var customerData = response;
    customerData.forEach(function (item) {
        var htmlString = '<tr id="customer-'+item.id+'"><td>'
            + item.firstName
            + '</td><td>'
            + item.lastName
            + '</td><td>'
            + item.email
            + '</td><td>'
            + item.phone
            + '</td><td>'
            + '<button class="table-link event-edit" id="event-edit-'+item.id+'">Edit</button>'
            + '</td><td>'
            + '<button class="table-link event-delete" id="event-delete-'+item.id+'">Delete</button>'
            + '</td></tr>';

        var row = $("#customers-list tbody").append(htmlString);
        //row.attr("id", "customer-" + item.id);
        row.attr("class", "customer-data");
    });
}

//get an existent customer 
var editCustomer = function(response){
    var row = $('#customers-management');
    row.find('.inpt-firstname').val(response.firstName);
    row.find('.inpt-lastname').val(response.lastName);
    row.find('.inpt-email').val(response.email);
    row.find('.inpt-phone').val(response.phone);
    row.children().attr("id", "customer-management-" + response.id);
}

//smooth animation for slideUp alert messages
var messageTimer = function () {
    setInterval(function(){
        $('.customers-messages > div > .alert').slideUp("slow", function() {
            $(this).remove();
        });
    }, 2000);
};
var clearMessageTimer = function () {
    clearInterval(messageTimer);
};

//CUSTOMERS LIST AJAX
var successAjaxCustomersList = function (response) {
    listCustomers(response);
}
var errorAjaxCustomersList = function (request, status, error) {
    var message = 'Something went wrong with the upload of the list!';
    var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
    $('.customers-list-error-alert').append(errorAlertString);
    messageTimer();
    clearMessageTimer();
}
var ajaxCustomersList = function(){
    $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/javabank5/api/customer',
    async: true,
    success: successAjaxCustomersList,
    error: errorAjaxCustomersList
})};


//DELETE CUSTOMER AJAX
var successAjaxDeleteCustomer = function (response) {
    var message = 'Customer was deleted with success!';
    var successAlertString = '<div class="alert alert-success" role="alert">' 
                            + message 
                            + '</div>';
    $('.customers-list-success-alert').append(successAlertString);
    messageTimer();
    clearMessageTimer();
}
var errorAjaxDeleteCustomer = function (request, status, error) {
    var message = 'Can\'t delete the customer!';
    var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
    $('.customers-list-error-alert').append(errorAlertString);
    messageTimer();
    clearMessageTimer();
}
var ajaxDeleteCustomer = function (id) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/javabank5/api/customer/' + id,
        async: true,
        success: successAjaxDeleteCustomer,
        error: errorAjaxDeleteCustomer
    })
};

//SAVE NEW CUSTOMER AJAX
var successAjaxSaveCustomer = function (response) {
    var message = 'New customer added with success!';
    var successAlertString = '<div class="alert alert-success" role="alert">' 
                            + message 
                            + '</div>';
    $('.customers-management-success-alert').append(successAlertString);
    messageTimer();
    clearMessageTimer();
    $('#customers-list .customer-data').children().remove();
    ajaxCustomersList();
}
var errorAjaxSaveCustomer = function (request, status, error) {
    var message = 'Can\'t add a new customer!';
    var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
    $('.customers-management-error-alert').append(errorAlertString);
    messageTimer();
    clearMessageTimer();
}
var ajaxSaveCustomer = function(firstname,lastname,email,phone) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/javabank5/api/customer/',
        async: true,
        data: JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            email: email,
            phone: phone
        }),
        contentType: 'application/json',
        success: successAjaxSaveCustomer,
        error: errorAjaxSaveCustomer
    })
};

//GET EXISTENT CUSTOMER AJAX (edit click)
var successAjaxEditCustomer = function (response) {
    editCustomer(response);
}
var errorAjaxEditCustomer = function (request, status, error) {
    var message = 'Can\'t edit this customer!';
    var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
    $('.customers-management-error-alert').append(errorAlertString);
    messageTimer();
    clearMessageTimer();
}
var ajaxEditCustomer = function(id) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/javabank5/api/customer/' + id,
        async: true,
        success: successAjaxEditCustomer,
        error: errorAjaxEditCustomer
    })
};

//UPDATE CUSTOMER AJAX
var successAjaxUpdateCustomer = function (response) {
    var message = 'Customer info updated with success!';
    var successAlertString = '<div class="alert alert-success" role="alert">' 
                            + message 
                            + '</div>';

    $('.customers-management-success-alert').append(successAlertString);
    messageTimer();
    clearMessageTimer();
    $('#customers-list .customer-data').children().remove();
    ajaxCustomersList();
}
var errorAjaxUpdateCustomer = function (request, status, error) {
    var message = 'Can\'t update this customer!';
    var errorAlertString = '<div class="alert alert-danger" role="alert">' 
                            + message 
                            + '</div>';
    
    $('.customers-management-error-alert').append(errorAlertString);
    messageTimer();
    clearMessageTimer();
}
var ajaxUpdateCustomer = function(id, firstname, lastname, email, phone) {
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/javabank5/api/customer/' + id,
        async: true,
        data: JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            email: email,
            phone: phone
        }),
        contentType: 'application/json',
        success: successAjaxUpdateCustomer,
        error: errorAjaxUpdateCustomer
    })
};











