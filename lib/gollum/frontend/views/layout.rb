require 'cgi'

module Precious
  module Views
    class Layout < Mustache
      include Rack::Utils
      alias_method :h, :escape_html

      attr_reader :name, :errors, :notices

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

      def has_errors?
        @errors = @flash[:error]
        @errors
      end

      def has_notices?
        @notices = @flash[:notice]
        @notices
      end
    end
  end
end
