(function (window, angular, undefined) {
    'use strict';

    var app = angular.module('apps');
    app.controller('ctrl.chat', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', '$sce',
                                 function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter,$sce) {


                                     $scope.onlineList = [];
                                     $scope.getchatMsg = [];
                                     $scope.tempmsgHolder = [];
                                     $scope.msgHolder = [];

                                     $scope.contact = true;
                                     $scope.inbox = false;

                                     $scope.userId = $AspCookie.get('_214', 'empId');
                                     $scope.setcontactId;
                                     $scope.setcontactName;

                                     $scope.trustAsHtml = $sce.trustAsHtml;
                              

                                     $scope.onGetOnline = function (p) {
                                         var imsgCount=0;
                                         $scope.onlineList = [];
                                         $scope.onlineList = p;
                                         $("#totalMsgCount").css("display", "");
                                 
                                         for (var i = 0; i <= $scope.onlineList.length - 1; i++) {
                                         
                                                 imsgCount += $scope.onlineList[i].msgCount;

                                                 $rootScope.totalMsgCount = imsgCount
                                                 $rootScope.chatcounterclass = 'animated bounceInDown';
                                         }

                                         $scope.$apply();
                                     }

                                     $scope.onShowInbox = function (p1,p2) {
                                         $scope.contact = false;
                                         $scope.inbox = true;
                                         $scope.getchatMsg = [];
                                     
                                         $scope.setcontactId = p1;
                                         $scope.setcontactName = p2;

                                         $rootScope.onViewFriendMsg($scope.userId, p1,p2);
                                   
                                     }
                                 
                                     //sent msg to spicific client
                                     $scope.onSubmitChat = function () {
                                         try{

                                             var currentDate = new Date();
                                             $rootScope.onSendChatMsg($scope.userId, $scope.setcontactId, $scope.chatmsg);                                     
                                             $scope.onGetMsg($AspCookie.get('_214', 'userid'),$scope.setcontactId, $scope.chatmsg, currentDate, 'bubble bubble--alt')

                                             $scope.chatmsg = '';
                                         
                                         }
                                         catch (e) {
                                             alert(e);
                                         }

                                     }

                                     $scope.onGetMsg = function (p1,p2,p3,p4,p5) {
                                         var strmsg = '';
                                         var imsgCount = 0;
                                         if (p1 == $scope.setcontactId || p1 == $scope.userId) {
                                             if (p5 == 'bubble') {
                                                 strmsg = '<img src="http://apps.fastgroup.biz/201pic/48px/' + p1 + '.jpg" width="32" height="32" />&nbsp;<strong>' + $scope.setcontactName + '</strong><br/>' + p3;
                                             } else {
                                                 strmsg = p3;
                                             }
                                             $scope.getchatMsg.push({ 'fromId': p1, 'toId': p2, 'strMsg': strmsg, 'createDte': p4, 'iconClass': p5 });
                                             $scope.$apply();

                                             $("#inbox").scrollTop($("#inbox")[0].scrollHeight);
                                         } else {
                                             for (var i = 0; i <= $scope.onlineList.length - 1; i++) {
                                                 if ($scope.onlineList[i].userId == p1) {
                                                     imsgCount = $scope.onlineList[i].msgCount;
                                                     imsgCount += 1;
                                                     $scope.onlineList[i].msgCount = imsgCount;
                                                     $rootScope.totalMsgCount += 1;
                                                     $rootScope.chatcounterclass = 'animated bounceInDown';
                                                 }
                                             }
                                             $scope.$apply();
                                         }
                                     }

                                     $scope.onMsgSetList = function (p) {
                                         $scope.getchatMsg = p;

                                         $scope.$apply();

                                         $("#inbox").scrollTop($("#inbox")[0].scrollHeight);
                                     }


                                 }]);
})(window, window.angular);