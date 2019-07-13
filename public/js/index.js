$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
});

// if not logged in change button to say sign in
if (!sessionStorage.getItem("username")) {
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
else {
    $('.sidenav-trigger').text('Account')

    //Insert account view and log out btn(clears session storage)
    $('.sidenav-content').html();
}



// on click if mongo returns error
// $('#new_user_button').text('Duplicate');