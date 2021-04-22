/**
 * @ created by: Ronel Gonzales
 * (c) 2014-2015
 * email: ronelgonzales5@gmail.com
 * costom services
 */
(function (window, angular, undefined) {
    'use strict';
    var app = angular.module('apps');



    app.factory('$getTempData',['$localForage', function ($localForage) {

        function getData(p) {
            $localForage.getItem(p).then(function (data) {
                return data;
            });
        }

        return {
            get: function (p) {
                return getData(p);
            }
        }
    }]);

})(window, window.angular);
