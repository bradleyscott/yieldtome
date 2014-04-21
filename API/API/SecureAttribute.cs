using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Http;

namespace yieldtome.API
{
    public class SecureAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            bool isAuthEnabled = false;
            try { isAuthEnabled = bool.Parse(ConfigurationManager.AppSettings["IsAuthEnabled"]); }
            catch { return false; }

            if (isAuthEnabled == false) { return true; }
            else { return base.IsAuthorized(actionContext); } // Auth is enabled
        }

    }
}