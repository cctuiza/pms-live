using System.Web;
using System.Web.Optimization;

namespace PMS
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));


            bundles.Add(new ScriptBundle("~/ng/lib").Include(
                  "~/Scripts/localforage/localforage.min.js",
                "~/Scripts/lib/angular.min.js",
                "~/Scripts/apps/module/angular-ui-router.min.js",
                "~/Scripts/apps/module/angular-filter.js",
                "~/Scripts/apps/module/customSelect.js",
                "~/Scripts/angular-animate.min.js",
                "~/Scripts/apps/module/ui-bootstrap-tpls-0.12.1.min.js",
                "~/Scripts/apps/module/ng-context-menu.js",
                "~/Scripts/apps/directive/angular-block-ui.min.js",//start ng libs
                "~/Scripts/apps/directive/dirPagination.js",//start ng libs
                "~/Scripts/apps/module/ng-file-upload-shim.js",
                "~/Scripts/apps/module/ng-file-upload.min.js",
                "~/Scripts/apps/module/angular-ui-notification.min.js",
                "~/Scripts/apps/module/angular-localForage.js",
                "~/Scripts/apps/directive/apps-directive.js",
                "~/Scripts/apps/service/rjg-cookie.js",
                "~/Scripts/apps/config/apps-config.js",//config
                "~/Scripts/apps/jquery-function/jsfunction.js",//jquery variable
                "~/Scripts/apps/module/angular-breadcrumb.min.js"
                     ));

            bundles.Add(new ScriptBundle("~/ng/ctrl").Include(
                 "~/Scripts/apps/apps.js",
                  "~/Scripts/apps/service/services.js",
                 "~/Scripts/apps/service/http-error-service.js",
                 "~/Scripts/apps/service/GlobalHelpers.js",
                 "~/Scripts/apps/controller/ctrl-*",
                 "~/Scripts/apps/controller/rpt-*"
                ));



            bundles.Add(new ScriptBundle("~/js/lib").Include(
                 "~/Scripts/lib/underscore-min.js",
                "~/assets/FileSaver/FileSaver.min.js",//file saver
                "~/vendor/jquery/jquery-1.11.1.min.js",//jquery lib
                "~/vendor/jquery/jquery_ui/jquery-ui.min.js",//jquery ui
                "~/Scripts/lib/moment-with-locales.js",//moment js
                "~/assets/js/bootstrap/bootstrap.min.js",//bootstrap script
                "~/Scripts/lib/bootstrap3-typeahead.min.js",//bootstrap type ahead
                "~/Scripts/lib/bootstrap-datetimepicker.js",//bootastrap datetime picker
                "~/vendor/plugins/magnific/jquery.magnific-popup.min.js",//manify popup
                "~/assets/admin-tools/admin-plugins/admin-dock/dockmodal.js",//dock modal
                "~/vendor/editors/summernote/summernote.min.js",//summernote
                 "~/Scripts/lib/jquery.signalR-2.2.0.min.js",//signalR
                "~/assets/ui.top/js/easing.js",
                "~/assets/ui.top/js/jquery.ui.totop.min.js",
                "~/Scripts/lib/pace.min.js",//pace
                "~/assets/js/utility/utility.js",
                "~/assets/js/main.js",
                "~/assets/js/demo.js",
                "~/Scripts/lib/browser-properties.js",
                "~/Scripts/lib/highcharts.js",
                "~/vendor/plugins/circles/circles.js",
                "~/Scripts/lib/spin.min.js",

                 "~/Scripts/lib/fullcalendar.js"));

            bundles.Add(new ScriptBundle("~/admin/panel").Include(
            "~/assets/admin-tools/admin-plugins/admin-panels/json2.js",
            "~/assets/admin-tools/admin-plugins/admin-panels/jquery.ui.touch-punch.min.js",
            "~/assets/admin-tools/admin-plugins/admin-panels/adminpanels.js"));


            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
