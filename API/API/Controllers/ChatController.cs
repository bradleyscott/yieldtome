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
    public class ChatController : ApiController
    {
        [Import]
        IChatService _service = Extensibility.Container.GetExportedValue<IChatService>();
        
        /// <summary>
        /// Sends a new Message between two delegates
        /// </summary>
        /// <param name="senderID">The AttendeeID of the person sending the message</param>
        /// <param name="recipientID">The AttendeeID of the person receiving the message</param>
        /// <param name="message">The content of the message to send</param>
        /// <returns>The new message</returns>
        /// <example>POST DirectMessages?senderID=1&recipientID=5&message=Hello</example>
        public HttpResponseMessage PostMessage(int senderID, int recipientID, string message)
        {
            if(Request.Headers.Authorization == null) {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "No Authorization header is present on the request"));
            }
            string authHeader = Request.Headers.Authorization.ToString();

            DirectMessage newMessage;
            try { newMessage = _service.SendMessage(senderID, recipientID, message, authHeader); }
            catch (ArgumentNullException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            // Return Uri pointing to new object
            HttpResponseMessage response = Request.CreateResponse<DirectMessage>(HttpStatusCode.Created, newMessage);
            return response;
        }
    }
}