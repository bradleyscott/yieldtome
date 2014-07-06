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
    public class VotesController : ApiController
    {
        IVoteService _service = Extensibility.Container.GetExportedValue<IVoteService>();
        
        public VotesController() { }

        public VotesController(IVoteService service)
        {
            _service = service;
        }

        /// <summary>
        /// Retrieves all the Votes for the specified Poll
        /// </summary>
        /// <param name="pollID">ID of the Vote to retrieve votes for</param>
        /// <returns></returns>
        /// <example>GET Votes/1/Votes/</example>
        public IQueryable<Vote> GetVotes(int pollID)
        {
            List<Vote> polls;
            try { polls = _service.GetVotes(pollID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return polls.AsQueryable();
        }

        /// <summary>
        /// Gets the Vote cast by the specified Attendee on the specified Poll
        /// </summary>
        /// <param name="pollID">ID of the Poll to find the Vote on</param>
        /// <param name="attendeeID">ID of the Attendee who cast the Vote</param>
        /// <returns></returns>
        /// <example>GET Polls/1/Votes?attendeeID=5</example>
        public Vote GetVote(int pollID, int attendeeID)
        {
            Vote poll;
            try { poll = _service.GetVote(pollID, attendeeID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return poll;
        }

        /// <summary>
        /// Casts a Vote on the specified Poll
        /// </summary>
        /// <param name="attendeeID">ID of the Attendee voting</param>
        /// <param name="pollID">ID of the Poll to Vote on</param>
        /// <param name="result">Indicates how the Attendee is Voting. Either 'For' or 'Against' or 'Abstain'. Default is 'Abstain'</param>
        /// <returns></returns>
        //// <example>POST Polls/1/Votes?attendeeID=5&result=For</example>
        public HttpResponseMessage PostVote(int attendeeID, int pollID, string result = "Abstain")
        {
            Enums.VoteType voteTypeEnum = Enums.VoteType.Abstain;
            if (result.ToLower() == "for") voteTypeEnum = Enums.VoteType.For;
            else if (result.ToLower() == "against") voteTypeEnum = Enums.VoteType.Against;

            Vote newList;
            try { newList = _service.CreateVote(attendeeID, pollID, voteTypeEnum); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<Vote>(HttpStatusCode.Created, newList);
            string uri = Url.Link("Votes", new { id = newList.VoteID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Deletes a Vote
        /// </summary>
        /// <param name="id">ID of the Vote to delete</param>
        /// <returns></returns>
        /// <example>DELETE Votes/5/</example>
        public IQueryable<Vote> DeleteVote(int id)
        {
            List<Vote> votes;
            try { votes = _service.ClearVote(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return votes.AsQueryable();
        }

        /// <summary>
        /// Deletes all Votes on this Poll
        /// </summary>
        /// <param name="pollID">ID of the Poll to delete all the Votes from</param>
        /// <returns></returns>
        /// <example>DELETE Polls/1/Votes/</example>
        public IQueryable<Vote> DeleteVotes(int pollID)
        {
            List<Vote> votes;
            try { votes = _service.ClearVotes(pollID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return votes.AsQueryable();
        }

    }
}
