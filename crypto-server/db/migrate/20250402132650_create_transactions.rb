class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.datetime :date_time, null: false # дата и время транзакции
      t.string :email, null: false # адрес электронной почты
      t.string :recipient_address, null: false
      t.string :transaction_id
      t.decimal :from_currency, precision: 15, scale: 10, null: false # валюта отправления (например, USDT)
      t.decimal :to_currency, precision: 15, scale: 10, null: false # валюта получения (например, BTC)
      t.decimal :exchange_rate, precision: 15, scale: 10, null: false # курс обмена
      t.decimal :exchange_fee, precision: 15, scale: 10, null: false # комиссия
      t.string :status, null: false # статус транзакции (Success/Fail)

      t.timestamps
    end
  end
end
