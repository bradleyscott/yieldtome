using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.Http.Filters;
using yieldtome.Interfaces;

namespace yieldtome.API
{        
    public class APIKeyAuthenticationAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Authenticates the current request
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            bool isAuthEnabled = false;
            try { isAuthEnabled = bool.Parse(ConfigurationManager.AppSettings["IsAuthEnabled"]); }
            catch { 
                actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                base.OnActionExecuting(actionContext);
            }

            if (isAuthEnabled == false)
            {
                GenericIdentity identity = new GenericIdentity("Anonymous");
                GenericPrincipal principal = new GenericPrincipal(identity, null);
                HttpContext.Current.User = principal;
            }
            else // Auth is enabled
            {
                if (actionContext.Request.Headers.Contains("ApiKey") == false)
                    actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                else
                {
                    string apiKey = actionContext.Request.Headers.First(x => x.Key == "ApiKey").Value.First();
                    IPrincipal principal = ValidateApiKey(apiKey);
                    if (principal != null)
                        HttpContext.Current.User = principal;
                    else
                        actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                }            
            }

            base.OnActionExecuting(actionContext);
        }

        private static IPrincipal ValidateApiKey(string apiKey)
        {
            if (apiKey == "") return null;

            bool isAuthenticated;
            try { isAuthenticated = Extensibility.Container.GetExportedValue<IAPIKeyService>().Validate(apiKey); }
            catch { return null; } // Return no principal if exception is thrown

            if (isAuthenticated)
            {
                // TODO: Introduce permissions structure to restrict what users can do with the Api
                IPrincipal principal = new GenericPrincipal(new GenericIdentity(apiKey), null);
                return principal;
            }
            else return null;

        }
    }
}