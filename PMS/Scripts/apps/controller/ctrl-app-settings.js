app.controller("app.settings", ['$stateParams', '$state', '$http', '$rootScope', '$sce', 'Notification', 'HttpErrorService', 'GlobalHelper',
    function ($stateParams, $state, $http, $rootScope, $sce, Notification, HttpErrorService, GlobalHelper) {

        var self = this;

        self.onInit = function () {
            self.ongetAppSetting();
        };

        self.ongetAppSetting = function () {
            try {
                $http.get(coreapi + 'application/get-app-settings/2').success(function (response, status, headers, config) {
                    self.appSetting = response;
                }).error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });
            } catch (err) {
                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
            }
        };

        self.onSave = function () {
            try {
                $http.put(coreapi + 'application/update-app-settings', self.appSetting).success(function (response, status, headers, config) {
                    self.appSetting = response;
                }).error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });
            } catch (err) {
                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
            }
        };


    }]);