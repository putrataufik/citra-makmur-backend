function convertToPCS (value, unit)  {
  switch (unit) {
    case 'lusin': return value * 12;
    case 'kodi': return value * 20;
    default: return value;
  }
};

module.exports = {
  convertToPCS
};