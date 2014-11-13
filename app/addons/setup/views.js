define([
 'app',
 'api'
],
function (app, FauxtonAPI) {
  var Views = {};

  Views.SetupForm = FauxtonAPI.View.extend({

    className: 'setup-screen',

    template: 'addons/setup/templates/setup_form',

    events: {
      'submit .js-setup-form-step-one': 'submitForm',
      'keyup input': 'verifyInput'
    },

    initialize: function (options) {
      this.setupModel = options.setupModel;
      this.listenTo(this.setupModel, 'invalid', this.showError);
    },

    submitForm: function (e) {
      var username = this.$('.js-username').val(),
          password = this.$('.js-password').val(),
          bindAddress = this.$('.js-bind-address').val(),
          bindPort = this.$('.js-bind-port').val(),
          setupModel = this.setupModel,
          data,
          promise;

      e.preventDefault();

      data = {
        action: 'enable_cluster',
        username: username,
        password: password,
        bind_address: bindAddress
      };

      if (bindPort) {
        data.port = bindPort;
      }

      promise = FauxtonAPI.session.login(username, password);
      promise.always(function () {
        setupModel
          .save(data)
          .success(function () {
            $('.js-message').text('Success! Repeat this step on your other nodes!');
            app.utils.localStorageSet('setup:username', username);
            app.utils.localStorageSet('setup:password', password);
            FauxtonAPI.navigate('#/setup/finish');
          });
      });
    },

    verifyInput: function () {
      var name = this.$('.js-username').val(),
          password = this.$('.js-password').val(),
          toggleEnabled;

      toggleEnabled = name.length && password.length;

      this.$('.js-submit-setup').toggleClass('disabled', !toggleEnabled);
    },

    showError: function (model, error) {
      this.$('.js-message').text(error);
    }
  });

  Views.FinishForm = FauxtonAPI.View.extend({
    className: 'setup-screen',

    template: 'addons/setup/templates/finish_form',

    events: {
      'submit .js-setup-form-finish': 'submitForm',
      'click .js-submit-node': 'submitNode'
    },

    initialize: function () {
      this.nodeCount = 0;
    },

    submitNode: function () {
      var $messageBox = this.$('.js-message'),
          $currentScope = this.$('.js-node-' + this.nodeCount),
          host = $currentScope.find('.js-input-hostname').val(),
          port = $currentScope.find('.js-input-port').val(),
          username = app.utils.localStorageGet('setup:username'),
          password = app.utils.localStorageGet('setup:password');

        console.log(JSON.stringify({
          action: 'add_node',
          username: username,
          password: password,
          host: host,
          port: port
        }));

      $.ajax({
        type: 'POST',
        url: '/_cluster_setup',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          action: 'add_node',
          username: username,
          password: password,
          host: host,
          port: port
        })
      })
      .success(function (res) {
        $messageBox.text('Successful added the node! Do you want to add another node?');
      })
      .fail(function () {
        $messageBox.text('There was an error. Please check your setup and try again.');
      });

    },

    submitForm: function (e) {
      var name = this.$('.js-username').val(),
          password = this.$('.js-password').val(),
          bindAddress = this.$('.js-bind-address').val(),
          bindPort = this.$('.js-bind-port').val(),
          data;

      e.preventDefault();

    }

  });

  return Views;
});
