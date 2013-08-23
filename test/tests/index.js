suite('Marionette Forms plugin', function() {
  var client = createClient();
  marionette.plugin('forms', require('../..'));

  test('#fill', function() {
    assert.ok(typeof client.forms.fill === 'function');
  });
});
