/**
 * @ created by: Ronel Gonzales
 * (c) 2014-2015
 * email: ronelgonzales5@gmail.com
 * get cookie from asp.net server post to angular client get
 */
(function (window, angular, undefined) {
    'use strict';
    var app = angular.module('rjg.cookie', ['ng']);

  app.factory('$AspCookie', function () {

      function getCookiebyValue(cname, findvalue) {
          var ca = cname.split('&');
          for (var i = 0; i < ca.length; i++) {
              var val = ca[i].split('=');
              if (val.length == 4) {
                  if (val[0] == findvalue) {
                      return val[1] + "==";
                  }
              } else if (val.length == 3) {
                  if (val[0] == findvalue) {
                      return val[1]+"=";
                  }
              } else {
                  if (val[0] == findvalue) {
                      return val[1];
                  }
              }
             
          }
      }

      return {
          get: function (cname, key) {
              var name = cname + "=";
              var ca = document.cookie.split(';');
              for (var i = 0; i < ca.length; i++) {
                  var c = ca[i];
                  while (c.charAt(0) == ' ') c = c.substring(1);
                  if (c.indexOf(name) == 0) return getCookiebyValue(c.substring(name.length, c.length), key);
              }
              return "";
          }
      }
  });


  app.factory('$GetJson', function ($http) {
      return {
          get: function (url) {
              $http.get(url).success(function (data, status, headers, config) {
                  return data;

              }).error(function (data, status, headers, config) {
                  return "Error";
              });
          }
      }
  });

  app.factory('preloader', function () {
      return {
          show: function (ishow) {
              console.log(ishow)
              return ishow;
          }
      }
  });

  


})(window, window.angular);