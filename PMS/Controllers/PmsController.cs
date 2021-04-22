using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PMS.Utils;
using Newtonsoft.Json.Linq;
using PMS.Models;
using Newtonsoft.Json;
using System.Net;
using System.IO;
using PMS.ActionFilters;

namespace PMS.Controllers
{
    [OutputCacheAttribute(VaryByParam = "*", Duration = 0, NoStore = true)]
    public class PmsController : Controller
    {
        Procedure procedure = new Procedure();
        // GET: Pms
        public ActionResult Index()
        {
            
            return View();
        }
        public ActionResult Cdp()
        {

            return View();
        }
        public ActionResult GoalAction()
        {

            return View();
        }
        public ActionResult CDPMaintenance()
        {

            return View();
        }


        #region "PMS Access"

        [ActionName("pms-access-view")]
        public ActionResult PmsAccess()
        {
            
            ViewBag.typeHeadSource = new HtmlString(JsonConvert.SerializeObject(EmpName()));
            return View();
          
        }

        [ActionName("force-close-paf")]
        public ActionResult ForceClosePaf()
        {
            ViewBag.typeHeadSource = new HtmlString(JsonConvert.SerializeObject(EmpName()));
            return View();
        }

        [ActionName("open-close-paf")]
        public ActionResult OpenClosePaf()
        {

           ViewBag.typeHeadSource = new HtmlString(JsonConvert.SerializeObject(EmpName()));
            return View();

        }

        [ActionName("delete-open-paf")]
        public ActionResult DeleteOpenPaf()
        {

            ViewBag.typeHeadSource = new HtmlString(JsonConvert.SerializeObject(EmpName()));
            return View();

        }

        [ActionName("pms-access-setup")]
        public ActionResult PmsAccessSetup()
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
                request.Headers["Token"] = "MTMwMzgzMDplMTc0OGVlNC1kMjk1LTRjMWYtOGFhMC01ZjgzYWFlNzYwZTJ0c2Fm";
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
        #endregion

        #region "Paf Creation/Modify"

        [ActionName("kpi-indicator")]
        public ActionResult KPIIndicator()
        {
            return View();
        }

        //JYDON
        public ActionResult CyclePeriod()
        {
            return View();
        }

        public ActionResult ImprovementPlan()
        {
            return View();
        }

        public ActionResult AddImprovementPlan()
        {
            return View();
        }
        //END JYDON
        public ActionResult AddPotentialAssessment()
        {
            return View();
        }

        public ActionResult PAListPotentialAssesment()
        {
            return View();
        }

        public ActionResult PotentialAssesmentEntry()
        {
            return View();
        }

        [ActionName("paf-list")]
        public ActionResult PafList()
        {
            return View();
        }

        [ActionName("view-close-paf")]
        public ActionResult ViewClosePaf()
        {
            return View();
        }

        [ActionName("paf-view-closed-setup")]
        public ActionResult PafViewClosedSetup()
        {
            return View();
        }


        [ActionName("override-paf-list")]
        public ActionResult OverridePafList()
        {
            return View();
        }

        [ActionName("paf-override")]
        public ActionResult PafOverride()
        {
            return View();
        }

        [ActionName("paf-setup")]
        public ActionResult PafSetup()
        {
            return View();
        }
        #endregion

        #region "Sub KPI"

        public ActionResult PAFListSubKPI()
        {
            return View();
        }

        [ActionName("kpi-assignment")]
        public ActionResult KPIAssignment()
        {
            return View();
        }
        #endregion

        #region "Rate Entry"

        public ActionResult PAFListRecordPerformance()
        {
            return View();
        }


        [ActionName("employee-rate-entry")]
        public ActionResult EmployeeRateEntry()
        {
            return View();
        }

        [ActionName("acknowledge-employee")]
        public ActionResult AcknowledgeEmployee(string userid, string employeeID, string pano)
        {

            Procedure procedure = new Procedure();

            var ackURI = new Uri(procedure.GetUrlConfig(GlobalParams.configname.CoreApi)  + "pms/post-AcknowledgeEmployee/?p=" + pano + "," + userid);
            string jsonResult = procedure.GetJsonUriResult(ackURI.ToString());
            JObject jResult = JObject.Parse(jsonResult);
            JObject jData = JObject.Parse(jResult["data"].ToString());

            bool hasError = bool.Parse(jResult["hasError"].ToString());
            string errorMessage = jData["errorMessage"].ToString();
            bool isFinal = bool.Parse(jData["isFinal"].ToString());
            string resultMsg = jData["resultMsg"].ToString();

            ViewBag.message = resultMsg;
            return View();  

            //if (isFinal)
            //{
            //    return RedirectToAction("paf-final-rate-entry", new { pano = pano, empid = employeeID, userid = userid });
            //}
            //else
            //{
            //    ViewBag.message = resultMsg;
            //    return View();  
            //}
                  
        }

        [ActionName("paf-final-rate-entry")]
        public ActionResult PafFinalRateEntry(string hascode)
        {

            ViewBag.hascode = hascode;
            return View();
        }
        [ActionName("save-behavioral")]
        public JsonResult SaveBehavioral(List<AcknowledgeModel> rateData, string pano, string empid, string userid)
        {
            try
            {
                using (HRISDBEntities dbcontext = new HRISDBEntities())
                {

                    
                    foreach (var row in rateData)
                    {
                        int paCtrlNo = int.Parse(row.PA_CTRL_NO);
                        decimal hit_miss = decimal.Parse(row.HIT_MISS);

                        if (!string.IsNullOrEmpty(row.PA_CTRL_NO))
                        {
                            var q = from aa in dbcontext.hrisPMSAppraisalDTLs
                                    where aa.PA_CTRL_NO == paCtrlNo
                                    select aa;

                            q.First().HIT_MISS = hit_miss;
                            dbcontext.SaveChanges();
                        }
                    }


                    this.AcknowledgeEnd(pano, empid, userid);


                }


                return Json(new { hasError = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { hasError = true, errMsg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public void AcknowledgeEnd(string pano, string empid, string userid)
        {

            HRISDBEntities dbcontext = new HRISDBEntities();
            COREDBEntities dbcon = new COREDBEntities();


            string emailto = string.Empty;
            string emailemp = string.Empty;
            string bodylayout = string.Empty;
            string employeeid = string.Empty;
            string joblevel = string.Empty;

            int supcount = 0;

            var q_empdetails = from aa in dbcontext.V_hrisEMPLOYEE
                               where aa.EMPL_ID == empid && aa.TYPE != "SEP"
                               select aa;

            if (!string.IsNullOrEmpty(empid))
            {
                joblevel = q_empdetails.First().JobLevelGroup;
            }

            if (userid == q_empdetails.First().ImmediateID)
            {
                supcount = 1;
            }
            else
            {
                supcount = 0;
            }

            if (supcount != 0)
            {
                //kong ang nag acknowledge kay ang immediate head
                var some = dbcon.pms_subkpi.Where(x => x.pano == pano).ToList();
                some.ForEach(a => a.isackhead = true);
                dbcon.SaveChanges();

            }
            else
            {
                //kong ang nag acknowledge kay ang subordenates
                var some = dbcon.pms_subkpi.Where(x => x.pano == pano).ToList();
                some.ForEach(a => a.isacksub = true);
                dbcon.SaveChanges();


            }



            int countsub = (from aa in dbcon.pms_subkpi where aa.pano == pano && aa.isacksub == false select aa).ToList().Count;
            int countsup = (from aa in dbcon.pms_subkpi where aa.pano == pano && aa.isackhead == false select aa).ToList().Count;

            //append to iefasttrack apprisal
            if (countsub == 0 && countsup == 0)
            {
                if (joblevel != "MANAGER")
                {

                    /*----------------------post hit or missed in iefastrak-------------------------*/
                    var q_kpidetails = from aa in dbcontext.hrisPMSAppraisalDTLs
                                       where aa.PANO == pano && aa.TYPE == "KRA"
                                       select aa;

                    var q_kpimaster = dbcontext.hrisPMSAppraisalMSTs.First(aa => aa.PANO == pano);

                    q_kpimaster.ACKNOWLEDGEBYSUP = userid;
                    q_kpimaster.ACKNOWLEDGEDATESUP = DateTime.Now;
                    q_kpimaster.STATUS = "C";
                    dbcontext.SaveChanges();

                    foreach (var row in q_kpidetails)
                    {
                        int i_hitmiss = 0;
                        try
                        {
                            i_hitmiss = GetKPIResult(row.PA_CTRL_NO.ToString(), joblevel);
                        }
                        catch (Exception ex)
                        {
                            //null
                        }
                        row.HIT_MISS = (decimal)i_hitmiss;
                       
                    }
                    dbcontext.SaveChanges();

                    /*----------------------------end post----------------------------------------*/

                }
                else
                {

                    var q_kpidetails = from aa in dbcontext.hrisPMSAppraisalDTLs
                                       where aa.PANO == pano
                                       select aa;

                    var q_kpimaster = dbcontext.hrisPMSAppraisalMSTs.First(aa => aa.PANO == pano);
                    q_kpimaster.ACKNOWLEDGEBYSUP = userid;
                    q_kpimaster.ACKNOWLEDGEDATESUP = DateTime.Now;
                    q_kpimaster.STATUS = "C";
                    dbcon.SaveChanges();

                    foreach (var row in q_kpidetails)
                    {
                        int i_hitmiss = GetKPIResult(row.PA_CTRL_NO.ToString(), joblevel);

                        row.HIT_MISS = (decimal)i_hitmiss;

                    }
                    dbcon.SaveChanges();
                }

            }



            var q_immediate = from aa in dbcontext.V_hrisEMPLOYEE
                              where aa.EMPL_ID == empid
                              select aa;

            //emailemp = q_immediate.First().ImmediateEmail;
            //emailto = q_immediate.First().EMAILADD;
            //procedure.SentMail("PMS", "<a href='http://aquila.fastgroup.biz/cr_report/employee-kpi-report.aspx?pano=" + pano + ">View Report</a>", emailto);
            //procedure.SentMail("PMS", "<a href='http://aquila.fastgroup.biz/cr_report/employee-kpi-report.aspx?pano=" + pano + ">View Report</a>", emailemp);

        }
        public int GetKPIResult(string kpicode, string joblevel)
        {
            COREDBEntities dbcon = new COREDBEntities();
            HRISDBEntities dbcontext = new HRISDBEntities();

            int countsub = 0;
            double subresult = 0;
            double target = 0;
            int i_res = 0;
            decimal dKpicode=decimal.Parse(kpicode);

            var q_subkpidetails = from aa in dbcon.pms_subkpi 
                                  where aa.PA_CTRL_NO == kpicode.ToString()
                                  select aa;

            
            if (joblevel != "MANAGER")
            {


                target = double.Parse((from aa in dbcon.pms_mainkpi  where aa.KPIcode == dKpicode select aa).First().KPITarget.ToString());

                countsub = q_subkpidetails.Count();

                foreach (var row in q_subkpidetails)
                {
                    double i_countrate = (from aa in dbcon.pms_subkpiperformancerate
                                          where aa.SUB_KPICODE == row.SUBKPICODE
                                          select aa).ToList().Count;

                    double i_counthit = (from aa in dbcon.pms_subkpiperformancerate
                                         where aa.SUB_KPICODE == row.SUBKPICODE && aa.RESULT_VALUE == 1
                                         select aa).ToList().Count;

                    double i_result = (i_counthit / i_countrate) * 100;

                    subresult += i_result;
                }

                double resultvalue = subresult / countsub;

                if (resultvalue >= target)
                {
                    i_res = 1;
                }
                else
                {
                    i_res = 0;
                }
            }
            else
            {

                //target = double.Parse((from aa in dbcon.hrisPMSPafDetails where aa.KPI_MASTER_ID == kpicode select aa).First().KPI_TARGET.ToString());
                target = double.Parse((from aa in dbcon.pms_mainkpi where aa.KPIcode == dKpicode select aa).First().KPITarget.ToString());

                countsub = q_subkpidetails.Count();
                foreach (var row in q_subkpidetails)
                {
                    double i_countrate = (from aa in dbcon.pms_subkpiperformancerate
                                          where aa.SUB_KPICODE == row.SUBKPICODE
                                          select aa).ToList().Count;

                    double i_counthit = (from aa in dbcon.pms_subkpiperformancerate
                                         where aa.SUB_KPICODE == row.SUBKPICODE && aa.RESULT_VALUE == 1
                                         select aa).ToList().Count;

                    double i_result = (i_counthit / i_countrate) * 100;

                    subresult += i_result;
                }

                double resultvalue = subresult / countsub;

                if (resultvalue >= target)
                {
                    i_res = 1;
                }
                else
                {
                    i_res = 0;
                }

                if (resultvalue.ToString() != "NaN")
                {
                    //var q_apprisaldtl = dbcontext.hrisPMSAppraisalDTLs.First(aa => aa.PA_CTRL_NO.ToString() == kpicode);
                    //q_apprisaldtl.KPI_RES = decimal.Parse(resultvalue.ToString());
                    //dbcon.SubmitChanges();
                }
            }



            return i_res;
        }
        public ActionResult ThankYou(string id)
        {

            ViewBag.pano = id;
            return View();
        }
        [ActionName("disapproved-employee")]
        public ActionResult DisapproveEmployee(string userid, string employeeID, string pano)
        {
            ViewBag.userid = userid;
            ViewBag.employeeID = employeeID;
            ViewBag.pano = pano;

            return View();
        }

        [ActionName("paf-list-closing")]
        public ActionResult PafListClosing()
        {
            return View();
        }

        [ActionName("paf-closing-setup")]
        public ActionResult PafClosingSetup()
        {
            return View();
        }
        #endregion


        #region "PMS Report"

       

        [ActionName("performance-rating-report")]
        public ActionResult PerformanceRatingReport()
        {
            return View();
        }

        [ActionName("performance-rating-preview")]
        public ActionResult PerformanceRatingPreview()
        {
            return View();
        }

        public ActionResult PotentialAssessmentReport()
        {
            return View();
        }



        #endregion
    }
}

public class AcknowledgeModel
{
    public string PA_CTRL_NO { get; set; }
    public string HIT_MISS { get; set; }
}