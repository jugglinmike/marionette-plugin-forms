suite('Marionette Forms plugin', function() {
  var fork = require('child_process').fork;
  var emptyPort = require('empty-port');
  var async = require('async');

  var client = createClient();
  var serverAddr, serverProcess;

  marionette.plugin('forms', require('../..'));

  suiteSetup(function(done) {
    emptyPort({ startPort: 3000 }, function(err, port) {
      serverProcess = fork(__dirname + '/../server.js', [], {
        env: { PORT: port }
      });
      serverAddr = 'http://localhost:' + port;
      done(err);
    });
  });

  suiteTeardown(function() {
    serverProcess.kill();
  });

  setup(function(done) {
    client.goUrl(serverAddr, function(err) {
      async.parallel([
        client.findElement.bind(client, '#form-a'),
        client.findElement.bind(client, '[name="my-text-1"]'),
        client.findElement.bind(client, '[name="my-text-2"]'),
        client.findElement.bind(client, '[name="my-time"]'),
        client.findElement.bind(client, '[name="my-date"]')
      ], function(err, results) {
        this.form = results[0];
        this.text1 = results[1];
        this.text2 = results[2];
        this.time = results[3];
        this.date = results[4];
        done();
      }.bind(this));
    }.bind(this));
  });

  suite('#fill', function() {

    suite('single element', function() {
      test('text', function(done) {
        client.forms.fill(this.text1, 'Some text', function() {
          this.text1.getAttribute('value', function(err, val) {
            assert.equal(val, 'Some text');
            done();
          });
        }.bind(this));
      });
      test('time', function(done) {
        var now = new Date();
        now.setHours(1);
        now.setMinutes(2);
        now.setSeconds(3);
        client.forms.fill(this.time, now, function() {
          this.time.getAttribute('value', function(err, val) {
            assert.equal(val, '01:02:03');
            done();
          });
        }.bind(this));
      });
      test('date', function(done) {
        var now = new Date();
        now.setYear(1997);
        now.setMonth(0);
        now.setDate(2);
        client.forms.fill(this.date, now, function() {
          this.date.getAttribute('value', function(err, val) {
            assert.equal(val, '1997-01-02');
            done();
          });
        }.bind(this));
      });
    });

    test.skip('multiple elements', function() {
      //assert.ok(typeof client.forms.fill === 'function');
      client.forms.fill(this.form, {
        'my-text-1': 'Some text',
        'my-text-2': 'Some more text'
      });
      assert.equal(
        client.findElement('#form-a [name="my-text-1"]').getAttribute('value'),
        'Some text'
      );
    });
  });
});
