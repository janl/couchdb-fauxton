define([
 'app',
 'api'
],
function (app, FauxtonAPI) {
  var Views = {};

  Views.SetupForm = FauxtonAPI.View.extend({
    className: '',

    tagName: 'div',

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
      var name = this.$('.js-username').val(),
          password = this.$('.js-password').val(),
          bindAddress = this.$('.js-bind-address').val(),
          bindPort = this.$('.js-bind-port').val();

      e.preventDefault();

      this.setupModel.save({
        admin: {
          user: name,
          password: password
        },
        bind_address: bindAddress,
        port: bindPort
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
      this.$('.js-error').text(error);
    }
  });

  return Views;
});
