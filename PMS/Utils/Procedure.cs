using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;

using System.Data;
using Newtonsoft.Json;
using System.Xml;
using System.Configuration;
using static PMS.Utils.GlobalParams;

namespace PMS.Utils
{
    public class Procedure
    {


        public string GetUrlConfig(configname p)
        {
            string strResult = string.Empty;

            switch (p)
            {
                case configname.CoreApi:
                    strResult = ConfigurationManager.AppSettings["coreapi"].ToString();
                    break;
                case configname.CoreDomain:
                    strResult = ConfigurationManager.AppSettings["coredomain"].ToString();
                    break;
                case configname.PMSDomain:
                    strResult = ConfigurationManager.AppSettings["pmsdomain"].ToString();
                    break;
                case configname.HubUrl:
                    strResult = ConfigurationManager.AppSettings["huburl"].ToString();
                    break;
            }

            return strResult;
        }

        public string GenerateSissionCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            var random = new Random();
            var result = new string(
                Enumerable.Repeat(chars, 16)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
            return result;
        }

        /// <summary>
        /// GetJsonUriResult
        /// </summary>
        /// <param name="targetUri">restful uri</param>
        /// <returns>string</returns>
        public string GetJsonUriResult(string targetUri)
        {
            string jsonString = string.Empty;
            try
            {
                //string proxyUsername = @"rjgonzales";
                //string proxyPassword = @"rjl2130";
                //string proxyAddress = @"proxy.flcprivate.dns:8080";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(targetUri);
                //IWebProxy proxy = new WebProxy(proxyAddress);
              
                //proxy.Credentials = new NetworkCredential(proxyUsername, proxyPassword);
                //request.Proxy = proxy;


                request.Method = "GET";
                request.Headers["Token"] = "MTMwMzgzMDo4ODkyZDgyNS1jZTQyLTQ0OGEtOTNlOS04ZTI1MWI4YWU3ZDd0c2Fm";
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                using (StreamReader reader = new StreamReader(responseStream))
                {
                    jsonString = reader.ReadToEnd();
                    reader.Close();
                }
                return jsonString;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

 

        private string formatCode(string pano, int noOfDigit)
        {
            int i_length = pano.Length;

            int dif = noOfDigit - i_length;

            string digit = string.Empty;

            for (int i = 1; i <= dif; i++)
            {
                digit += "0";
            }

            return digit + pano;

        }

        
      
        /// <summary>
        /// 
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public virtual bool IsFileLocked(FileInfo file)
        {
            FileStream stream = null;

            try
            {
                stream = file.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
            }
            catch (IOException)
            {
                //the file is unavailable because it is:
                //still being written to
                //or being processed by another thread
                //or does not exist (has already been processed)
                return true;
            }
            finally
            {
                if (stream != null)
                    stream.Close();
            }

            //file is not locked
            return false;
        }

        public DataTable getReportData(string url)
        {
            DataTable dt = new DataTable();
            DataSet reportData = new DataSet();
            try
            {
                MemoryStream xmlStream = new MemoryStream();
                string json =GetJsonUriResult(url);
                // To convert JSON text contained in string json into an XML node
                XmlDocument doc = (XmlDocument)JsonConvert.DeserializeXmlNode(json, "root");
                doc.Save(xmlStream);

                xmlStream.Flush();//Adjust this if you want read your data 
                xmlStream.Position = 0;
                //XmlReader xmluser;
                //xmluser = XmlReader.Create(xmlStream, new XmlReaderSettings());
                reportData.ReadXml(xmlStream);
                dt = reportData.Tables["data"];

                return dt;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}