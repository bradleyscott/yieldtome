﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using yieldtome.Interfaces;
using yieldtome.Objects;
using System.ComponentModel.Composition;

namespace yieldtome.API.Controllers
{
    [Secure]
    public class LikesController : ApiController
    {
        ILikeService _service = Extensibility.Container.GetExportedValue<ILikeService>();

        public LikesController() { }

        public LikesController(ILikeService service)
        {
            _service = service;
        }

        /// <summary>
        /// Indicates whether or not the Liker Attendee likes the Liked Attendee
        /// </summary>
        /// <param name="likerID">The AttendeeID of the Attendee liking</param>
        /// <param name="likedID">The AttendeeID of the Attendee being liked</param>
        /// <returns></returns>
        [HttpGet]
        public bool DoesLikeExist(int likerID, int likedID)
        {
            bool doesLikeExist;
            try { doesLikeExist = _service.DoesLikeExist(likerID, likedID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            return doesLikeExist;
        }
        
        /// <summary>
        /// Indicates whether or not 2 Attendees have requited Likes
        /// </summary>
        /// <param name="likerID">The first AttendeeID</param>
        /// <param name="likedID">The second AttendeeID</param>
        /// <returns></returns>
        [HttpPut]
        public bool IsLikeRequited(int likerID, int likedID)
        {
            bool isRequited;
            try { isRequited = _service.IsLikeRequited(likerID, likedID); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }

            return isRequited;
        }

        /// <summary>
        /// Creates a Like between the Liker and the Liked and determines if this is requited
        /// </summary>
        /// <param name="likerID">The AttendeeID of the Attendee liking</param>
        /// <param name="likedID">The AttendeeID of the Attendee being liked</param>
        /// <returns></returns>
        public bool PostLike(int likerID, int likedID)
        {
            bool isRequited;
            try { isRequited = _service.CreateLike(likerID, likedID, Request.Headers.Authorization.ToString()); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return isRequited;
        }
        
        /// <summary>
        /// Deletes the specified Like
        /// </summary>
        /// <param name="id">ID of the Like to delete</param>
        /// <returns></returns>
        public HttpResponseMessage DeleteLike(int id)
        {
            try { _service.DeleteLike(id); }
            catch (ArgumentException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message)); }
            catch (UnauthorizedAccessException ex) { throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex.Message)); }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}
