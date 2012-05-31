(function($) {
  var DefaultOptions = {
    client_id:          'gollum',
    token:              undefined,
    current_user:       undefined,
    current_user_email: undefined,
    current_path:       window.location.pathname,
    target_id:          'warnings',
    interval:           1000
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
          user:  ActiveOptions.current_user,
          email: ActiveOptions.current_user_email,
          path:  ActiveOptions.current_path
        }
      );

      setTimeout(notify_others_of_editing, ActiveOptions.interval);
    }

    function clear_old_warning_messages() {
      for (var user_key in OthersEditing) {
        if (OthersEditing.hasOwnProperty(user_key)) {
          var now            = (new Date()).getTime();
          var time_last_seen = OthersEditing[user_key];

          if ((now - time_last_seen) > (ActiveOptions.interval * 2)) {
            $('#'+ ActiveOptions.target_id +' p.'+user_key).remove();
          }
        }
      }

      setTimeout(clear_old_warning_messages, ActiveOptions.interval);
    }

    FayeClient.subscribe(
      '/'+ ActiveOptions.client_id +'/editing_notifications',
      function(message) {
        if (message.path === ActiveOptions.current_path && message.user !== ActiveOptions.current_user) {
          var user_key = message.user.toLowerCase().replace(/[^a-z]/g, '');
          var warning_msg = '<p class="'+user_key+'"><strong>WARNING:</strong> '+message.user+' (<a href="mailto:'+message.email+'">'+message.email+'</a>) is also editing this page.</p>';

          OthersEditing[user_key] = (new Date()).getTime();

          if (! $('#'+ ActiveOptions.target_id +' p.' + user_key).length ) {
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
