using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using yieldtome.Interfaces;
using yieldtome.Objects;

namespace yieldtome.API.Controllers
{
	public class RequestController : ApiController
	{
		IRequestProcessor _processor = Extensibility.Container.GetExportedValue<IRequestProcessor>();
		IProfileService _profileService = Extensibility.Container.GetExportedValue<IProfileService>();

        /// <summary>
        /// Parses and processes a string request 
        /// </summary>
        /// <param name="request">The request to process</param>
        /// <param name="profileID">ID of the Profile that is making the request</param>
        /// <returns></returns>
		public string PostRequest(string request, int profileID)
		{
            request = WebUtility.UrlDecode(request);

			Profile profileContext;
			try { profileContext = _profileService.GetProfile(profileID); }
			catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

			string[] requestArray = request.Split(' ');
			return _processor.ProcessRequest(requestArray, profileContext, null);
		}
	}
}