(function($) {
  var DefaultOptions = {
    client_id:  'gollum',
    token:      undefined,
    user:       undefined,
    email:      undefined,
    page:       undefined,
    target_id:  'warnings',
    interval:   1000
  };
  var ActiveOptions = {};

  $.NotifyPresence = function( IncomingOptions ) {
    ActiveOptions = $.extend( DefaultOptions, IncomingOptions );

    var FayeClient    = faye_client_with_auth(ActiveOptions.client_id, ActiveOptions.token);
    var OthersEditing = {};

    function notify_others_of_editing() {
      FayeClient.publish(
        '/'+ ActiveOptions.client_id +'/editing_notifications',
        {
          user:  ActiveOptions.user,
          email: ActiveOptions.email,
          page:  ActiveOptions.page
        }
      );

      setTimeout(function() { notify_others_of_editing() }, ActiveOptions.interval);
    }

    function clear_old_warning_messages() {
      for (var user_key in OthersEditing) {
        if (OthersEditing.hasOwnProperty(user_key)) {
          var now = (new Date()).getTime();

          if ((now - OthersEditing[user_key]) > (ActiveOptions.interval * 2)) {
            $('#'+ ActiveOptions.target_id +' p.'+user_key).remove();
          }
        }
      }

      setTimeout(function() { clear_old_warning_messages() }, ActiveOptions.interval);
    }

    FayeClient.subscribe(
      '/'+ ActiveOptions.client_id +'/editing_notifications',
      function(message) {
        if (message.page === ActiveOptions.page && message.user !== ActiveOptions.user) {
          var warning_key = message.user.toLowerCase().replace(/[^a-z]/g, '');
          var warning_msg = '<p class="'+warning_key+'"><strong>WARNING:</strong> '+message.user+' (<a href="mailto:'+message.email+'">'+message.email+'</a>) is also editing this page.</p>';

          OthersEditing[warning_key] = (new Date()).getTime();

          if (! $('#'+ ActiveOptions.target_id +' p.' + warning_key).length ) {
            $('#'+ ActiveOptions.target_id).append(warning_msg);
          }
        }
      }
    )

    setTimeout(function() {
      notify_others_of_editing();
      clear_old_warning_messages();
    }, ActiveOptions.interval);
  };
})(jQuery);
