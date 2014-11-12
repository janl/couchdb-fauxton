// Licensed under the Apache License, Version 2.0 (the 'License'); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

define([
  'app',
  'api',
  'addons/setup/resources',
  'addons/setup/views'
],
function (app, FauxtonAPI, Setup, Views) {
  var RouteObject = FauxtonAPI.RouteObject.extend({
    layout: 'one_pane',

    routes: {
      'setup': 'setupView',
      'setup/finish': 'finishView'
    },

    selectedHeader: 'Cluster Setup',

    crumbs: [
      {'name': 'Cluster Setup', 'link': 'setup'}
    ],

    apiUrl: function() {
      return [this.setupModel.url(), this.setupModel.documentation];
    },

    initialize: function () {
      this.setupModel = new Setup.Model();
    },

    setupView: function () {
      this.setView('#dashboard-content', new Views.SetupForm({
        setupModel: this.setupModel
      }));
    },

    finishView: function () {
      this.setView('#dashboard-content', new Views.FinishForm());
    }
  });


  Setup.RouteObjects = [RouteObject];

  return Setup;
});
