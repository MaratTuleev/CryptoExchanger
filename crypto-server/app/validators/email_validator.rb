# http://asciicasts.com/episodes/211-validations-in-rails-3
class EmailValidator < ActiveModel::EachValidator
  EMAIL_REGEXP = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

  def validate_each(object, attribute, value)
    if value.present? && !(value =~ EMAIL_REGEXP)
        object.errors.add(attribute, "Некорректный e-mail")
    end
  end
end
