$('document').ready(function () {
  const api = 'http://' + window.location.hostname;
  let gameState;
  $('.modal > .modal-dialog > .modal-content > .modal-body > .form-check > input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      gameState = true;
    } else {
      gameState = false;
    }
  });

  $('.modal > .modal-dialog > .modal-content > .modal-footer > button').click(function () {
    $.ajax({
        url: api + ':5001/api/game_state',
        type: "POST",
        data: JSON.stringify({
          'gameState': Object.keys(game_state)
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: "OK"
    });
  });
});