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
      'click ': 'submitForm'
    }
  });

  return Views;
});
