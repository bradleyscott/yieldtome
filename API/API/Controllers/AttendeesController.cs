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
    public class AttendeesController : ApiController
    {
        IAttendeeService _service = Extensibility.Container.GetExportedValue<IAttendeeService>();

        public AttendeesController() { }

        public AttendeesController(IAttendeeService service)
        {
            _service = service;
        }

        /// <summary>
        /// Returns all Attendees attending the supplied Event
        /// </summary>
        /// <param name="eventID">Event you want to retrieve Attendees for</param>
        /// <returns>A list of Attendees</returns>
        /// <example>GET Events/5/Attendees</example>
        public IQueryable<Attendee> GetAttendees(int eventID)
        {
            List<Attendee> attendees;
            try { attendees = _service.GetAttendees(eventID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return attendees.AsQueryable();
        }

        /// <summary>
        /// Returns the Attendee with the specified ID
        /// </summary>
        /// <param name="id">ID of the Attendee to return</param>
        /// <returns>An Attendee</returns>
        /// <example>GET Attendees/1/</example>
        public Attendee GetAttendee(int id)
        {
            Attendee attendee;
            try { attendee = _service.GetAttendee(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return attendee;
        }

        /// <summary>
        /// Returns the Attendee record associated with a Profile if they are attending the Event
        /// </summary>
        /// <param name="profileID">ID of the Profile to find the Attendee record for</param>
        /// <param name="eventID">ID of the Event the Profile might be attending</param>
        /// <returns></returns>
        public Attendee GetAttendee(int profileID, int eventID)
        {
            Attendee attendee;
            try { attendee = _service.GetAttendee(profileID, eventID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return attendee;
        }

        /// <summary>
        /// Adds a new Attendee to the supplied Event
        /// </summary>
        /// <param name="eventID">ID of the Event to add the Attendee to</param>
        /// <param name="profileID">ID of the Profile to attach to this Attendee</param>
        /// <param name="name">Name that describes who the Attendee is representing</param>
        /// <returns>The new Attendee</returns>
        /// <example>POST Events/5/Attendees?name=Australia</example>
        public HttpResponseMessage PostAttendee(int eventID, string name, int profileID)
        {
            Attendee newAttendee;
            try { newAttendee = _service.CreateAttendee(eventID, name, profileID); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<Attendee>(HttpStatusCode.Created, newAttendee);
            string uri = Url.Link("Events", new { eventID = newAttendee.AttendeeID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Deletes an Attendee
        /// </summary>
        /// <param name="id">ID of the Attendee to delete</param>
        /// <returns>A confirmation of deletion</returns>
        /// <example>DELETE Attendees/1/</example>
        public HttpResponseMessage DeleteAttendee(int id)
        {
            try { _service.DeleteAttendee(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// Deletes all Attendees associated with this Event
        /// </summary>
        /// <param name="eventID">ID of the Event to delete all Attendees for</param>
        /// <returns>A confirmation of deletion</returns>
        /// <example>DELETE Events/5/Attendees</example>
        public HttpResponseMessage DeleteAttendees(int eventID)
        {
            try { _service.DeleteAttendees(eventID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}