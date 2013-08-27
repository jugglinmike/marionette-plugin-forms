function padZeros(val) {
  val = String(val);
  while (val.length < 2) {
    val = '0' + val;
  }
  return val;
}

module.exports = {
  // As per [the "time" input element's
  // specification](http://dev.w3.org/html5/markup/input.time.html), this value
  // is formatted according to [RFC
  // 3339](http://tools.ietf.org/html/rfc3339#section-5.6).
  time: function (dateObj) {
    return [dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()]
      .map(padZeros)
      .join(':');
  },
  // As per [the "date" input element's
  // specification](http://dev.w3.org/html5/markup/input.date.html), this value
  // is formatted according to [RFC
  // 3339](http://tools.ietf.org/html/rfc3339#section-5.6).
  date: function(dateObj) {
    return [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
      .map(padZeros)
      .join('-');
  }
};
