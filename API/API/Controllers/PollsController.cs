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
    public class PollsController : ApiController
    {
        IPollService _service = Extensibility.Container.GetExportedValue<IPollService>();

        public PollsController() { }

        public PollsController(IPollService service)
        {
            _service = service;
        }

        /// <summary>
        /// Returns all Polls associated with the supplied Event
        /// </summary>
        /// <param name="eventID">The ID of the Event to retrieve the Polls for</param>
        /// <returns></returns>
        /// <example>GET Events/5/Polls</example>
        public IQueryable<Poll> GetPolls(int eventID)
        {
            List<Poll> polls;
            try { polls = _service.GetPolls(eventID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return polls.AsQueryable();
        }

        /// <summary>
        /// Returns the Poll with the specified ID
        /// </summary>
        /// <param name="id">The ID of the Poll to return</param>
        /// <returns></returns>
        /// <example>GET Polls/1/</example>
        public Poll GetPoll(int id)
        {
            Poll poll;
            try { poll = _service.GetPoll(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return poll;
        }

        /// <summary>
        /// Creates a new Poll
        /// </summary>
        /// <param name="eventID">The ID of the Event the Poll relates to</param>
        /// <param name="name">The name of the Poll</param>
        /// <param name="creatorID">The ID of the Profile who is creating this Poll</param>
        /// <param name="majorityRequired">The percentage majority required for the Poll to be passed. Optional. Default is 50.</param>
        /// <param name="doAbstainsCount">Whether or not abstains count as 'No' for the purpose of a majority. Optional. Default is false.</param>
        /// <returns></returns>
        /// <example>POST Events/5/Polls?name=President vote&amp;creatorID=1&amp;majorityRequired=50&amp;doAbstainsCount=false</example>
        public HttpResponseMessage PostPoll(int eventID, string name, int creatorID, int majorityRequired = 50, bool doAbstainsCount = false)
        {
            Poll newList;
            try { newList = _service.CreatePoll(eventID, name, creatorID, majorityRequired, doAbstainsCount); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<Poll>(HttpStatusCode.Created, newList);
            string uri = Url.Link("DefaultApi", new { id = newList.PollID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Updates a Poll
        /// </summary>
        /// <param name="pollToUpdate"></param>
        /// <returns></returns>
        /// <example>PUT Polls</example>
        public Poll PutPoll(Poll pollToUpdate)
        {
            try { pollToUpdate = _service.UpdatePoll(pollToUpdate); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return pollToUpdate;
        }

        /// <summary>
        /// Deletes a Poll
        /// </summary>
        /// <param name="id">The ID of the Poll to delete</param>
        /// <returns></returns>
        /// <example>DELETE Polls/1/</example>
        public HttpResponseMessage DeletePoll(int id)
        {
            try { _service.DeletePoll(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

    }
}
