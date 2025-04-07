class Transaction < ApplicationRecord
  NETWORK_FEE = 0.000006
  USDT_MAX_VALUE = 30

  before_create :set_default_date_time

  validates :from_currency, comparison: { greater_than: 0, less_than_or_equal_to: USDT_MAX_VALUE }
  validates :email, email: true
  validates :recipient_address, sbtc_address: true
  validate :validate_btc_currency

  private

  def set_default_date_time
    self.date_time ||= Time.current
  end

  def validate_btc_currency
    puts 'MAX', USDT_MAX_VALUE * exchange_rate - NETWORK_FEE - exchange_fee
    if to_currency > USDT_MAX_VALUE * exchange_rate - NETWORK_FEE - exchange_fee
      puts 'HERE!!!!'
      errors.add(:to_currency, 'Too much currency')
    end
  end
end