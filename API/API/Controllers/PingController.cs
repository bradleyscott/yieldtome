using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;


namespace yieldtome.API.Controllers
{
	public class PingController : ApiController
	{
		/// <summary>
		/// Returns an HTTP response OK
		/// </summary>
		/// <returns></returns>
        [ActionName("NoAuth")]
        public HttpResponseMessage GetNoAuth()
		{
			return Request.CreateResponse(HttpStatusCode.OK);
		}

        /// <summary>
        /// Returns an HTTP response OK if Authorization Bearer token is valid, otherwise returns Unauthorized
        /// </summary>
        /// <returns></returns>
        [Secure]
        [ActionName("CheckAuth")]
        public HttpResponseMessage GetCheckAuth()
        {
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}