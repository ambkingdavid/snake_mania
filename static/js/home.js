$('document').ready(function () {
  const api = 'http://' + window.location.hostname;
  let username = "player" + Date.now();
  let email = "default@default.com"
  password = Date.now().toString()
  let gameState = false

  $('.play').click(function () {
    console.log('clicked button')
    $.ajax({
      url: api + ':5000/api/v1/users',
      type: "POST",
      data: JSON.stringify({
          username: username,
          email: email,
          password: password
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (response) {
        const user_id = response.id;
        window.location.href = api + ':5001/user/' + user_id
      }
    });
  });
  

  $('.login-form').submit(function(event) {
    event.preventDefault(); 
    username = $('#username_log').val();
    password = $('#password_log').val();

    $.ajax({
      url: api + ':5000/api/v1/users/get_user',
      type: "POST",
      data: JSON.stringify({
          username: username,
          password: password
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(response) {
        const user = response;
        window.location.href = api + ':5001/user/' + user.id
      }
    });
  
  });



  $('.signup-form').submit(function(event) {
    event.preventDefault(); 
    username = $('#username').val();
    email = $('#email').val()
    password = $('#password').val();

    $.ajax({
      url: api + ':5000/api/v1/users',
      type: "POST",
      data: JSON.stringify({
          username: username,
          email: email,
          password: password
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: "ok"
    });
  
  });
});