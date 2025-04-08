class Admin::DashboardsController < ApplicationController
  before_action :check_admin

  def total_info
    total_exchange_fee = Transaction.sum(:exchange_fee)
    transactions_count = Transaction.count
    total_success_transactions = Transaction.success.size

    render json: {
      total_exchange_fee:,
      transactions_count:,
      total_success_transactions:
    }, status: :ok
  end

  def transactions
    scope = Transaction.all
    if params[:page] || params[:size]
      scope = scope.
        page(params[:page]).
        per([params[:size], 10].map(&:presence).compact.map(&:to_i).min)
    end

    render json: {
      transactions: scope,
      total_size: Transaction.count
    }, status: :ok
  end
end