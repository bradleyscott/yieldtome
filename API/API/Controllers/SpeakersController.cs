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
    [Secure]
    public class SpeakersController : ApiController
    {
        ISpeakersService _service = Extensibility.Container.GetExportedValue<ISpeakersService>();
        
        public SpeakersController() { }

        public SpeakersController(ISpeakersService service)
        {
            _service = service;
        }

        /// <summary>
        /// Returns all Speakers associated with the supplied SpeakersList
        /// </summary>
        /// <param name="speakersListID">ID of this Speakers list to retrieve Speakers for</param>
        /// <returns>A list of Speakers</returns>
        /// <example>GET SpeakersLists/1/Speakers</example>
        public IQueryable<Speaker> GetSpeakers(int speakersListID)
        {
            List<Speaker> speakers;
            try { speakers = _service.GetSpeakers(speakersListID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return speakers.AsQueryable();
        }

        /// <summary>
        /// Returns the Speaker with the specified ID
        /// </summary>
        /// <param name="id">ID of the Speaker to retrieve</param>
        /// <returns>A Speaker</returns>
        /// <example>GET Speakers/5/</example>
        public Speaker GetSpeaker(int id)
        {
            Speaker speaker;
            try { speaker = _service.GetSpeaker(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return speaker;
        }

        /// <summary>
        /// Adds a speaker to the SpeakersList
        /// </summary>
        /// <param name="speakersListID">ID of the Speakers List to add the Speaker to</param>
        /// <param name="attendeeID">ID of the Attendee to add to the Speakers list</param>
        /// <param name="position">Indicates whether the speaker is speaking 'For' or 'Against'. Optional. Default is 'None'</param>
        /// <returns>The new Speaker</returns>
        /// <example>POST SpeakersLists/1/Speakers?attendeeID=5&amp;position=For</example>
        public HttpResponseMessage PostSpeaker(int speakersListID, int attendeeID, string position = "None")
        {
            Enums.SpeakerPosition positionEnum = Enums.SpeakerPosition.None;
            if (position.ToLower() == "for") positionEnum = Enums.SpeakerPosition.For;
            else if(position.ToLower() == "against") positionEnum = Enums.SpeakerPosition.Against;

            Speaker newSpeaker;
            try { newSpeaker = _service.AddSpeaker(speakersListID, attendeeID, positionEnum); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<Speaker>(HttpStatusCode.Created, newSpeaker);
            string uri = Url.Link("DefaultApi", new { id = newSpeaker.SpeakerID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Marks the Speaker as having spoken
        /// </summary>
        /// <param name="id">The ID of the Speaker that has spoken</param>
        /// <returns>The updated Speakers list</returns>
        /// <example>PUT Speakers/5</example>
        public IQueryable<Speaker> PutSpeakerHasSpoken(int id)
        {
            List<Speaker> speakersList;
            try { speakersList = _service.SpeakerHasSpoken(id); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return speakersList.AsQueryable();
        }

        /// <summary>
        /// Re-orders the Speakers List
        /// </summary>
        /// <param name="speakersListID">ID of the Speakers list to re-order</param>
        /// <param name="updatedSpeakersList">Updated Speakers list object</param>
        /// <returns>The updated Speakers</returns>
        public IQueryable<Speaker> PutSpeakerHasSpoken(int speakersListID, List<Speaker> updatedSpeakersList)
        {
            List<Speaker> speakersList;
            try { speakersList = _service.ReorderSpeakers(speakersListID, updatedSpeakersList); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return speakersList.AsQueryable();
        }

        /// <summary>
        /// Removes a Speaker
        /// </summary>
        /// <param name="id">ID of the Speaker to remove</param>
        /// <returns>The updated Speakers list</returns>
        /// <example>DELETE Speakers/5/</example>
        public IQueryable<Speaker> DeleteSpeaker(int id)
        {
            List<Speaker> speakersList;
            try { speakersList = _service.RemoveSpeaker(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return speakersList.AsQueryable();
        }

        /// <summary>
        /// Clear all Speakers on this SpeakersList
        /// </summary>
        /// <param name="speakersListID">ID of the Speakers list to clear all the Speakers from</param>
        /// <returns>The updated Speakers list</returns>
        /// <example>DELETE SpeakersLists/1/Speakers/</example>
        public IQueryable<Speaker> DeleteSpeakers(int speakersListID)
        {
            List<Speaker> speakersList;
            try { speakersList = _service.ClearSpeakers(speakersListID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return speakersList.AsQueryable();
        }
    }
}
