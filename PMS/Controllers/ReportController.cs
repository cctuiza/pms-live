using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PMS.Utils;
namespace PMS.Controllers
{
    [OutputCacheAttribute(VaryByParam = "*", Duration = 0, NoStore = true)]
    public class ReportController : Controller
    {
        Procedure procedure = new Procedure();

        // GET: Report
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CdpReport()
        {
            return View();
        }
        public ActionResult PmsUtilization()
        {
            return View();
        }

        [ActionName("current-standing")]
        public ActionResult CurrentStanding()
        {
            return View();
        }

        [ActionName("monthly-progressive-report")]
        public ActionResult MontlyProgressiveReport()
        {
            return View();
        }

        [ActionName("monthly-progressive-preview")]
        public ActionResult MontlyProgressivePreview()
        {
            return View();
        }

        [ActionName("employee-paf-report")]
        public ActionResult EmployeePafReport()
        {
            return View();
        }

        [ActionName("paf-results")]
        public ActionResult PAFResult()
        {
         
            ViewBag.typeHeadSource = new HtmlString(JsonConvert.SerializeObject(EmpName()));
            return View();
        }

        public ActionResult Analytics()
        {
            return View();
        }

        public ActionResult ImprovementPlan()
        {
            return View();
        }


        public List<String> EmpName()
        {


            List<string> empName = new List<string>();

            if (Session["typeHead"] != null)
            {
                empName = (List<string>)Session["typeHead"];
                return empName;
            }
            else
            {
                //HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://localhost:20015/api/account/get-all-employee/?page=1&size=20000");
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(procedure.GetUrlConfig(GlobalParams.configname.CoreApi)  + "account/get-all-employee/?page=1&size=20000");
                request.Method = "GET";
                request.Headers["Token"] = "MTMwMzgzMDo4ODkyZDgyNS1jZTQyLTQ0OGEtOTNlOS04ZTI1MWI4YWU3ZDd0c2Fm";
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();
                JObject jResult = null;
                string jsonString = string.Empty;

                using (StreamReader reader = new StreamReader(responseStream))
                {
                    jsonString = reader.ReadToEnd();
                    reader.Close();
                }

                jResult = JObject.Parse(jsonString);
                string empAccount = jResult["empAccount"].ToString();
                foreach (var row in JRaw.Parse(empAccount))
                {
                    string empname = row["EmpName"].ToString().Replace("'", "");
                    empName.Add(row["EmpID"].ToString());
                    empName.Add(empname);
                    empName.Add(row["EmpEmail"].ToString());
                }

                Session["typeHead"] = empName;
            }
            return empName;
        }

        [ActionName("employee-standing-report")]
        public ActionResult Employeestanding()
        {
            return View();
        }
    }
}