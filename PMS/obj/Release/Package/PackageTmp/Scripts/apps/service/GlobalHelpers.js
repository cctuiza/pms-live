(function (window, angular, undefined) {
    'use strict';
app.service('GlobalHelper', ['Notification', '$filter', 'blockUI',
    function (Notification, $filter,blockUI) {

        var GlobalHelper = this;


        // Notification success
        GlobalHelper.Success = function (text) {
            Notification.success({
                message: text,
                positionX: 'center'
            });
        }
        //Notification Error
        GlobalHelper.Error = function (text) {
            Notification.error({
                message: text,
                positionX: 'center'
            });
        }
        //Notification Info
        GlobalHelper.Info = function (text) {
            Notification.info({
                message: text,
                positionX: 'center'
            });
        }
        //Start spinner
        GlobalHelper.StartSpin = function () {
            blockUI.start();
            // spinner.spin(spinnerTarget)
        }
        //Stop spinner
        GlobalHelper.StopSpin = function () {
            blockUI.stop();

            //  GlobalHelper.StopSpin();
        }
        //Add Zero in front of number used for 01,02 .... 09
        GlobalHelper.AddZero = function (date) {
            if (date < 10) {
                return "0" + date;
            }
            else {
                return date;
            }
        }

        //Convert date to yyyy/MM/dd
        GlobalHelper.convertDate = function (givenDate) {
            return $filter('date')(givenDate, "MM/dd/yyyy");
        }

        GlobalHelper.combineDateTime = function (givenDate, time) {
            var cdate = new Date(givenDate);
            var year = cdate.getFullYear();
            var month = cdate.getMonth() + 1;
            var day = cdate.getDate();
            var datestring = '' + year + '-' + month + '-' + day;
            var combined = new Date(datestring + ' ' + time);

            return  moment(combined).format("YYYY-MM-DD HH:mm:ss");;

        }

        GlobalHelper.daysInMonth = function (iYear, iMonth) {
            var date = new Date(iYear, iMonth, 0).getDate();
            return date;

        }

        return GlobalHelper;

        }]);

})(window, window.angular);