exports.validatePaymentInfo = (data) => {
  const errors = [];

  if (!data.name_on_card) errors.push('Name on card is required');
  if (!data.card_number || data.card_number.length == 16) errors.push('Card number is invalid');
  if (!data.expiry_date) errors.push('Expiry date is required');
  if (!data.method) errors.push('Payment method is required');

  return {
    isValid: errors.length === 0,
    error: errors.join(', ')
  };
};