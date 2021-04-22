using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using PMS.Models;
using PMS.Utils;
using System.Net;
using System.IO;
using Newtonsoft.Json.Linq;
using PMS.ActionFilters;

namespace PMS.Controllers
{
    [OutputCacheAttribute(VaryByParam = "*", Duration = 0, NoStore = true)]
    public class AccountController : Controller
    {
        Procedure procedure = new Procedure();

        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login()
        {


            return View();
        }

        public ActionResult TestLogin()
        {
            return View();
        }

        public JsonResult setCookie(string userid, string email, string fullname, string fname, string userHascode,string empId,string token)
        {
            try
            {
                HttpCookie cookie = new HttpCookie("_214");
                cookie["userHascode"] = userHascode;
                cookie["empId"] = empId;
                cookie["fname"] = fname;
                cookie["userid"] = userid;
                cookie["email"] = email;
                cookie["fullname"] = fullname;
                cookie["sitecode"] = string.Empty;//set empty value
                cookie["sissionId"] = procedure.GenerateSissionCode();
                cookie["token"] = token;
                Response.Cookies.Add(cookie);

                return Json(new { hasError = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { hasError = true, errorMessage = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }
        
        public ActionResult Connect(string id,string token)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(procedure.GetUrlConfig(GlobalParams.configname.CoreApi) + "account/FastloginHascode/?hascode=" + id + "&appname=PMS");
            request.Method = "GET";
            request.Headers["Token"] = token;
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
            string userid = jResult["userId"].ToString();
            string emplId = jResult["emplId"].ToString();
            string username = jResult["username"].ToString();
            string fullname = jResult["firstname"].ToString() + ' ' + jResult["lastname"].ToString();
            string fname = jResult["firstname"].ToString();

            setCookie(userid, username, fullname, fname,id, emplId, token);

            return RedirectToAction("Index", "Apps", new { id = id });
        }



        public ActionResult Logout()
        {
            Session.RemoveAll();
            HttpCookie cookie = new HttpCookie("_214");
            cookie.Expires = DateTime.Now.AddDays(-1);
            Response.Cookies.Add(cookie);

            return RedirectToAction("Login");
        }
    }
}
