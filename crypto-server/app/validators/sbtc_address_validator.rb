class SbtcAddressValidator < ActiveModel::EachValidator
  P2PKH_REGEX = /\A1[a-zA-Z0-9]{25,34}\z/
  P2SH_REGEX = /\A3[a-zA-Z0-9]{25,34}\z/
  P2WPKH_REGEX = /\Abc1[a-zA-Z0-9]{39,59}\z/

  def validate_each(object, attribute, value)
    if value.present? && !valid_sbtc_address?(value)
      object.errors.add(attribute, "Некорректный sBTC адрес")
    end
  end

  private

  def valid_sbtc_address?(address)
    P2PKH_REGEX.match?(address) || P2SH_REGEX.match?(address) || P2WPKH_REGEX.match?(address)
  end
end