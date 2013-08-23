function Forms(client) {
  this.client = client;
}

/**
 * Fill out one or more input elements (regardless of visibility)
 * @param {Element} elem The input element to change (when setting a single
 *                        value) or the parent node (when setting multiple
 *                        values).
 * @param {object} value The value to set (when setting a single value) or a
 *                       hash of form element names to corresponding values
 *                       (when setting multiple values)
 */
Forms.prototype.fill = function(elem, values) {
  setValue.call(this, elem, value);
};

function setValue(elem, value) {
  elem.scriptWith(function(elem) {
    elem.value = value;
  });
}

module.exports = function(client, options) {
  return new Forms(client);
};
