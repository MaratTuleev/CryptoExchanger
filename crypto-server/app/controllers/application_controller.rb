class ApplicationController < ActionController::Base
  def check_admin
    return if cookies['admin-cookie'] == 'true'

    render json: {status: 'unauthorized', message: 'Bad credentials'}, status: 401
  end
end
