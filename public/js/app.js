$(document).ready(function () {
    $('.sidenav').sidenav();
    
});

// if not logged in change button to say sign in
if (!sessionStorage.getItem("username")) {
    logIn();
}
else {
    loggedIn();
}









$(document).on("click", "#new_user_btn", function () {

    $.ajax({
        method: "POST",
        url: "/users/new",
        data: {
            username: $("#new_username").val(),
            phone: $("#new_phone_number").val(),
            userimg: $("#profile_img").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            
            closeSideNav()

            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("phone", data.phone);
            sessionStorage.setItem("imgLink", data.imgLink);

            loggedIn();
        });
});

$(document).on("click", "#login_btn", function () {
    let username = $("#username").val();
    let phone = $("#telephone").val();
    $.ajax({
        method: "GET",
        url: "/users/"+username+'&'+phone
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);

            closeSideNav()

            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("phone", data.phone);
            sessionStorage.setItem("imgLink", data.imgLink);

            loggedIn()
        });
});




// logs user out
$(document).on("click", "#logout_btn", function () {
    

    sessionStorage.clear();
    $('.profile-img').empty();
    $('.display-username').empty()
    logIn()
});



function logIn() {
    //$('.sidenav-content').empty();
    $('.sidenav-trigger').text('Sign in')

    //Insert sign in options and functions
    $('.sidenav-content').html('<li class="center-align"> ' +
        '<div class="input-field col s6"> <input id="username" type="text" class="validate">' +
        ' <label for="username">Username</label> </div> </li> ' +
        '<li class="center-align"> ' +
        '<div class="input-field col s6"> <input id="telephone" type="text" class="validate">' +
        ' <label for="telephone">Phone Number</label> </div> </li> ' +
        '<a id="login_btn" class="waves-effect waves-teal btn-flat">Login</a> ' +
        '<br><div class="divider"></div>' +
        '<li clas="center-align"> ' +
        '<div class="input-field col s6"> <input id="new_username" type="text" class="validate">' +
        ' <label for="new_username">New Username</label> </div> </li> ' +
        '<li class="center-align"> ' +
        '<div class="input-field col s6"> <input id="new_phone_number" type="text" class="validate">' +
        ' <label for="new_phone_number">New Phone Number</label> </div> </li> ' +
        '<li> <div class="input-field col s6"> <input id="profile_img" type="text" class="validate"> <label for="profile_img">Image URL</label> </div> </li>' +
        '<a id="new_user_btn" class="waves-effect waves-teal btn-flat">Submit</a> ')
}

function loggedIn() {
    $('.sidenav-trigger').text('Account')
    $('<img>', { class: "circle", src: sessionStorage.getItem("imgLink") }).appendTo('.profile-img');
    $('.display-username').text(sessionStorage.getItem("username"))
    //Insert account view and log out btn(clears session storage)
    $('.sidenav-content').html('<a id="logout_btn" class="waves-effect waves-teal btn-flat">Logout</a>');
}

function closeSideNav(){
    var elem = document.querySelector('.sidenav');
    var instance = M.Sidenav.getInstance(elem);
    instance.close();
}