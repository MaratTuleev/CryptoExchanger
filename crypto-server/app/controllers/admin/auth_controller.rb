class Admin::AuthController < ApplicationController
  # Этот метод будет проверять авторизацию перед доступом к ресурсам
  before_action :authenticate_admin

  # Метод для успешной авторизации
  def login
    render json: { message: "Login successful" }, status: :ok
  end

  private

  # Проверка Basic Auth
  def authenticate_admin
    authenticate_or_request_with_http_basic do |username, password|
      user = AdminUser.find_by(username: username)
      user&.authenticate(password)
    end
  end
end