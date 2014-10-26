using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using yieldtome.Objects;
using yieldtome.API;
using System.ComponentModel.Composition;
using yieldtome.Interfaces;

namespace yieldtome.API.Controllers
{
    [Secure]
    public class EventsController : ApiController
    {
        [Import]
        IEventService _service = Extensibility.Container.GetExportedValue<IEventService>();

        /// <summary>
        /// Returns all Events
        /// </summary>
        /// <returns>A list of Events</returns>
        /// <example>GET Events</example>
        public IQueryable<Event> GetEvents()
        {
            return _service.GetEvents().AsQueryable();
        }

        /// <summary>
        /// Returns the Event with the specified ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns>An Event</returns>
        /// <example>GET Events/5</example>
        public Event GetEvent(int id)
        {
            Event theEvent;
            try { theEvent = _service.GetEvent(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }

            return theEvent;
        }

        /// <summary>
        /// Create a new Event
        /// </summary>
        /// <param name="name">The name of the Event</param>
        /// <param name="startDate">The first day of the Event</param>
        /// <param name="endDate">The last day of the Event</param>
        /// <param name="creatorID">The ID of the Profile which created this Event</param>
        /// <param name="description">More information about the Event. Optional.</param>
        /// <returns>The new Event</returns>
        /// <example>POST Events</example>
        public HttpResponseMessage PostEvent(string name, DateTime startDate, DateTime endDate, int creatorID, string description = null)
        {
            Event newEvent;
            try { newEvent = _service.CreateEvent(name, startDate, endDate, creatorID, description); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<Event>(HttpStatusCode.Created, newEvent);
            string uri = Url.Link("DefaultApi", new { eventID = newEvent.EventID });
            response.Headers.Location = new Uri(uri);

            return response;
        }

        /// <summary>
        /// Updates Event information
        /// </summary>
        /// <param name="Event">The Event to update</param>
        /// <returns>The updated Event</returns>
        /// <example>PUT Events</example>
        public Event PutEvent(Event eventToUpdate)
        {
            try { eventToUpdate = _service.UpdateEvent(eventToUpdate); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return eventToUpdate;
        }

        /// <summary>
        /// Deletes an Event
        /// </summary>
        /// <param name="id">The ID of the Event to delete</param>
        /// <returns>A confirmation of deletion</returns>
        /// <example>DELETE Events/5</example>
        public HttpResponseMessage DeleteEvent(int id)
        {
            try { _service.DeleteEvent(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}