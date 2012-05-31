require 'cgi'

module Precious
  module Views
    class Layout < Mustache
      include Rack::Utils
      alias_method :h, :escape_html

      attr_reader :name

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

      def current_user_github_email
        email = @current_user[:github_email]
        if email && email != 'false'
          email
        else
          false
        end
      end
    end
  end
end
