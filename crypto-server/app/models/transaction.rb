class Transaction < ApplicationRecord
  USDT_MAX_VALUE = 30

  before_create :set_default_date_time

  validates :from_currency, comparison: { greater_than: 0, less_than_or_equal_to: USDT_MAX_VALUE }
  validates :email, email: true
  validates :recipient_address, sbtc_address: true

  scope :success, -> { where(status: "Success") }

  private

  def set_default_date_time
    self.date_time ||= Time.current
  end
end