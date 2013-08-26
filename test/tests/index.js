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
        var date = new Date();
        date.setHours(1);
        date.setMinutes(2);
        date.setSeconds(3);
        client.forms.fill(this.time, date, function() {
          this.time.getAttribute('value', function(err, val) {
            assert.equal(val, '01:02:03');
            done();
          });
        }.bind(this));
      });
      test('date', function(done) {
        var date = new Date();
        date.setYear(1997);
        date.setMonth(0);
        date.setDate(2);
        client.forms.fill(this.date, date, function() {
          this.date.getAttribute('value', function(err, val) {
            assert.equal(val, '1997-01-02');
            done();
          });
        }.bind(this));
      });
    });

    process.env.SYNC && suite('synchronous API', function() {
      suite('single element', function() {
        test('text', function() {
          client.forms.fill(this.text1, 'Some text');
          assert.equal(this.text1.getAttribute('value'), 'Some text');
        });
        test('time', function() {
          var date = new Date();
          date.setHours(1);
          date.setMinutes(2);
          date.setSeconds(3);
          client.forms.fill(this.time, date);
          assert.equal(this.time.getAttribute('value'), '01:02:03');
        });
        test('date', function() {
          var date = new Date();
          date.setYear(1997);
          date.setMonth(0);
          date.setDate(2);
          client.forms.fill(this.date, date);
          assert.equal(this.date.getAttribute('value'), '1997-01-02');
        });
      });

      test('multiple elements', function() {
        var date = new Date();
        date.setYear(1997);
        date.setMonth(0);
        date.setDate(2);
        date.setHours(3);
        date.setMinutes(4);
        date.setSeconds(5);

        client.forms.fill(this.form, {
          'my-text-1': 'Some text',
          'my-text-2': 'Some more text',
          'my-time': date,
          'my-date': date
        });
        assert.equal(this.text1.getAttribute('value'), 'Some text');
        assert.equal(this.text2.getAttribute('value'), 'Some more text');
        assert.equal(this.time.getAttribute('value'), '03:04:05');
        assert.equal(this.date.getAttribute('value'), '1997-01-02');
      });
    });

    test('multiple elements', function() {
      var date = new Date();
      date.setYear(1997);
      date.setMonth(0);
      date.setDate(2);
      date.setHours(3);
      date.setMinutes(4);
      date.setSeconds(5);

      client.forms.fill(this.form, {
        'my-text-1': 'Some text',
        'my-text-2': 'Some more text',
        'my-time': date,
        'my-date': date
      }, function() {
        async.parallel([
          this.text1.getAttribute.bind(this.text1, 'value'),
          this.text2.getAttribute.bind(this.text2, 'value'),
          this.time.getAttribute.bind(this.time, 'value'),
          this.date.getAttribute.bind(this.date, 'value')
        ], function(err, results) {
          assert.equal(results[0], 'Some text');
          assert.equal(results[1], 'Some more text');
          assert.equal(results[2], '03:04:05');
          assert.equal(results[3], '1997-01-02');
        });
      }.bind(this));
    });
  });
});
