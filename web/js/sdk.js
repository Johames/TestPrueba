$(function () {

    var app_id = '139589379706086';
    var scopes = 'email, user_friends, public_profile';

    var btn_login = '<a href="#" id="login" class="btn btn-primary">Iniciar sesión</a>';

    var div_session = "<div id='facebook-session'>" +
            "<strong></strong>" +
            "<text1></text1>" +
            "<text2></text2>" +
            "<text3></text3>" +
            "<text4></text4>" +
            "<text5></text5>" +
            "<text21></text21>" +
            "<img>" +
            "<a href='#' id='logout' class='btn btn-danger'>Cerrar sesión</a>" +
            "<a href='#' id='invitar' class='btn btn-primary'>Invitar Amigos</a><br><br>" +
            "<a href='javascript:enviar()' id='enviar' class='btn btn-primary'>Enviar</a>" +
            "</div>";

    window.fbAsyncInit = function () {

        FB.init({
            appId: app_id,
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });


        FB.getLoginStatus(function (response) {
            statusChangeCallback(response, function () {
            });
        });
    };

    var statusChangeCallback = function (response, callback) {
        console.log(response);

        if (response.status === 'connected') {
            getFacebookData();
        } else {
            callback(false);
        }
    }

    var checkLoginState = function (callback) {
        FB.getLoginStatus(function (response) {
            callback(response);
        });
    }

    var getFacebookData = function () {
            FB.api('/me', function (response) {
            $('#login').after(div_session);
            $('#login').remove();
            $('#facebook-session strong').text("Bienvenido: " + response.name);
            $('#facebook-session text1').text("Id: " + response.id);
            $('#facebook-session text2').text("Email: " + response.email);
            $('#facebook-session text3').text("Nombres: " + response.first_name);
            $('#facebook-session text4').text("Apellidos: " + response.last_name);
            $('#facebook-session text5').text("Edad: " + response.age_range);
            $('#facebook-session img').attr('src', 'http://graph.facebook.com/' + response.id + '/picture?type=large');
        })
    }

    var facebookLogin = function () {
        checkLoginState(function (data) {
            if (data.status !== 'connected') {
                FB.login(function (response) {
                    if (response.status === 'connected')
                        getFacebookData();
                }, {scope: scopes});
            }
        })
    }

    var facebookLogout = function () {
        checkLoginState(function (data) {
            if (data.status === 'connected') {
                FB.logout(function (response) {
                    $('#facebook-session').before(btn_login);
                    $('#facebook-session').remove();
                })
            }
        })

    }

    var enviar = function() {
        document.formulario1.submit()
    }

    var renderMFS = function () {
        FB.api('/user_friends', function (response) {
            var container = document.getElementById('mfs');
            var mfsForm = document.createElement('form');
            mfsForm.id = 'mfsForm';

            // Iterate through the array of friends object and create a checkbox for each one.
            for (var i = 0; i < Math.min(response.data.length, 10); i++) {
                var friendItem = document.createElement('div');
                friendItem.id = 'friend_' + response.data[i].id;
                friendItem.innerHTML = '<input type="checkbox" name="friends" value="'
                        + response.data[i].id
                        + '" />' + response.data[i].name;
                mfsForm.appendChild(friendItem);
            }
            container.appendChild(mfsForm);

            // Create a button to send the Request(s)
            var sendButton = document.createElement('input');
            sendButton.type = 'button';
            sendButton.value = 'Send Request';
            sendButton.onclick = sendRequest;
            mfsForm.appendChild(sendButton);
        });
    }

    function sendRequest() {
        // Get the list of selected friends
        var sendUIDs = '';
        var mfsForm = document.getElementById('mfsForm');
        for (var i = 0; i < mfsForm.friends.length; i++) {
            if (mfsForm.friends[i].checked) {
                sendUIDs += mfsForm.friends[i].value + ',';
            }
        }

        // Use FB.ui to send the Request(s)
        FB.ui({method: 'apprequests',
            to: sendUIDs,
            title: 'My Great Invite',
            message: 'Check out this Awesome App!',
        }, callback);
    }

    $(document).on('click', '#login', function (e) {
        e.preventDefault();

        facebookLogin();
    })

    $(document).on('click', '#logout', function (e) {
        e.preventDefault();

        if (confirm("¿Está seguro?"))
            facebookLogout();
        else
            return false;
    })

    $(document).on('click', '#invitar', function (e) {
        e.preventDefault();

        renderMFS();
    })
    
    $(document).on('click', '#enviar', function (e) {
        e.preventDefault();

        enviar();
    })

})