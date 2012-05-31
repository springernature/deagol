require 'cgi'

module Precious
  module Views
    class Layout < Mustache
      include Rack::Utils
      alias_method :h, :escape_html

      attr_reader :name, :faye_auth_token

      def escaped_name
        if @path
          CGI.escape("#{@path}/#{@name}")
        else
          CGI.escape(@name)
        end
      end

      def title
        "Home"
      end

      def current_user_name
        @current_user[:name]
      end

      def current_user_email
        @current_user[:email]
      end

      def faye_server
        FAYE_CONFIG['server']
      end

      def faye_client_id
        FAYE_CONFIG['client_id']
      end
    end
  end
end
