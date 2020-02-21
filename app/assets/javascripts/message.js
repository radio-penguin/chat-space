$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html = 
        `<div class="message-list__box" data-message-id="${message.id}">
          <div class="message-list__box__info">
            <div class="message-list__box__info__talker">
              ${message.user_name}
            </div>
            <div class="message-list__box__info__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message-list__box__text">
            <p>
              ${message.content}
            </p>
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html = 
        `<div class="message-list__box" data-message-id="${message.id}">
          <div class="message-list__box__info">
            <div class="message-list__box__info__talker">
              ${message.user_name}
            </div>
            <div class="message-list__box__info__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message-list__box__text">
            <p>
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }
  
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');

    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.message-list').append(html);
      $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      $('form')[0].reset();
      $('.submit-btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
  });
  });
  
  var reloadMessages = function () {
    last_message_id = $('.message-list__box:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
          messages.forEach(function (message) {
            insertHTML = buildHTML(message);
            $('.message-list').append(insertHTML);
            $('.message-list').animate({scrollTop: $('.message-list')[0].scrollHeight}, 'fast');
          });
      }
    })
    .fail(function () {
      alert('自動更新に失敗しました');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});