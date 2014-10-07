using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using yieldtome.Interfaces;
using yieldtome.Objects;

namespace yieldtome.API.Controllers
{
    [Secure]
    public class ProfilesController : ApiController
    {
        IProfileService _service = Extensibility.Container.GetExportedValue<IProfileService>();

        public ProfilesController() { }

        public ProfilesController(IProfileService service)
        {
            _service = service;
        }

        /// <summary>
        /// Returns all Profiles containing only Publicly shared information
        /// </summary>
        /// <returns>All Profiles</returns>
        /// <example>GET Profiles</example>
        public List<Profile> GetProfiles()
        {
            return _service.GetProfiles();
        }

        /// <summary>
        /// Returns the Profile with the specified ID containing only Publicly shared information
        /// </summary>
        /// <param name="id">The ID of the Profile to return</param>
        /// <returns>A Profile</returns>
        /// <example>GET Profiles/1/</example>
        public Profile GetProfile(int id)
        {
            Profile profile;
            try { profile = _service.GetProfile(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return profile;
        }

        /// <summary>
        /// Returns the Profile with the specified providerID from an external identity provider containing only Publicly shared information
        /// </summary>
        /// <param name="id">The FacebookID of the Profile to return</param>
        /// <returns>A Profile</returns>
        /// <example>GET Profiles?provider=Facebook&providerID=1</example>
        public Profile GetProfile(string provider, string providerID)
        {
            Profile profile;
            try { profile = _service.GetProfile(provider, providerID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return profile;
        }

        /// <summary>
        /// Returns a Profile with a specified ID containing information visible to a provided viewer Profile ID
        /// </summary>
        /// <param name="id">The ID of the Profile to retrieve information about</param>
        /// <param name="viewerID">The ID of the Profile viewing</param>
        /// <returns>A Profile</returns>
        /// <example>GET Profiles/1?viewerID=5</example>
        public Profile GetProfile(int id, int viewerID)
        {
            throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, new NotImplementedException().Message));
        }

        /// <summary>
        /// Creates a Profile with the supplied information
        /// </summary>
        /// <param name="profile">The Profile object to be created</param>
        /// <returns>The new Profile</returns>
        public HttpResponseMessage PostProfile(Profile newProfile)
        {
            try
            {
                newProfile = _service.CreateProfile(newProfile);
            }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<Profile>(HttpStatusCode.Created, newProfile);
            string uri = Url.Link("DefaultApi", new { profileID = newProfile.ProfileID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Updates Profile information
        /// </summary>
        /// <param name="profileToUpdate">The Profile to update</param>
        /// <returns>The updated Profile</returns>
        /// <example>PUT Events</example>
        public Profile PutProfile(Profile profileToUpdate)
        {
            try { profileToUpdate = _service.UpdateProfile(profileToUpdate); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            return profileToUpdate;
        }
    }
}
