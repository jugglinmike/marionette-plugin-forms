function padZeros(val) {
  val = String(val);
  while (val.length < 2) {
    val = '0' + val;
  }
  return val;
}

module.exports = {
  time: function (dateObj) {
    return [dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()]
      .map(padZeros)
      .join(':');
  },
  date: function(dateObj) {
    return [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
      .map(padZeros)
      .join('-');
  }
};
