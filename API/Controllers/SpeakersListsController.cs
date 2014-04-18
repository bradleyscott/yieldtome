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
    [APIKeyAuthentication]
    public class SpeakersListsController : ApiController
    {
        [Import]
        ISpeakersListService _service = Extensibility.Container.GetExportedValue<ISpeakersListService>();

        /// <summary>
        /// Returns all Speakers Lists for the specified Event
        /// </summary>
        /// <param name="eventID">ID of the Event to retrieve Speakers Lists for</param>
        /// <returns>A list of Speakers Lists</returns>
        /// <example>GET Events/5/SpeakersLists</example>
        public IQueryable<SpeakersList> GetSpeakersLists(int eventID)
        {
            List<SpeakersList> lists;
            try { lists = _service.GetSpeakersLists(eventID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return lists.AsQueryable();
        }

        /// <summary>
        /// Returns the Speakers List with the specified ID
        /// </summary>
        /// <param name="id">ID of the Speakers list to return</param>
        /// <returns>A Speakers List</returns>
        /// <example>GET SpeakersLists/1/</example>
        public SpeakersList GetSpeakersList(int id)
        {
            SpeakersList list;
            try { list = _service.GetSpeakersList(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return list;
        }

        /// <summary>
        /// Creates a new Speakers List
        /// </summary>
        /// <param name="eventID">ID of the Event to add the Speakers list to</param>
        /// <param name="name">Name of the Speakers list</param>
        /// <param name="creatorID">ID of the Profile who created the Event</param>
        /// <returns>The new Speakers List</returns>
        ///// <example>POST Events/5/SpeakersLists?name=President vote&creatorID=1</example>
        public HttpResponseMessage PostSpeakersList(int eventID, string name, int creatorID)
        {
            SpeakersList newList;
            try { newList = _service.CreateSpeakersList(eventID, name, creatorID); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<SpeakersList>(HttpStatusCode.Created, newList);
            string uri = Url.Link("SpeakersLists", new { id = newList.SpeakersListID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Updates Speakers List information
        /// </summary>
        /// <param name="listToUpdate">The Speakers List to update</param>
        /// <returns>The updated Speakers List</returns>
        /// <example>PUT SpeakersLists</example>
        public SpeakersList PutSpeakersList(SpeakersList listToUpdate)
        {
            try { listToUpdate = _service.UpdateSpeakersList(listToUpdate); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            return listToUpdate;
        }

        /// <summary>
        /// Deletes a SpeakersList
        /// </summary>
        /// <param name="speakersListID">ID of the Speakers list to delete</param>
        /// <returns>A confirmation of deletion</returns>.
        /// <example>DELETE SpeakersLists/1/</example>
        public HttpResponseMessage DeleteSpeakersList(int speakersListID)
        {
            try { _service.DeleteSpeakersList(speakersListID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

    }
}