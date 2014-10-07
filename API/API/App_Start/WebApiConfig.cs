using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace yieldtome.API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {       
            config.Routes.MapHttpRoute(
                name: "AuthenticateApi",
                routeTemplate: "Authenticate/{action}",
                defaults: new { Controller = "Authenticate" }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "EventAttendeesApi",
                routeTemplate: "Events/{eventID}/Attendees/{id}",
                defaults: new { Controller = "Attendees", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "EventSpeakersListsApi",
                routeTemplate: "Events/{eventID}/SpeakersLists/{id}",
                defaults: new { Controller = "SpeakersLists", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "SpeakersListSpeakersApi",
                routeTemplate: "SpeakersLists/{speakersListID}/Speakers/{id}",
                defaults: new { Controller = "Speakers", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "EventPollsApi",
                routeTemplate: "Events/{eventID}/Polls/{id}",
                defaults: new { Controller = "Polls", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "PollVotesApi",
                routeTemplate: "Polls/{pollID}/Votes/{id}",
                defaults: new { Controller = "Votes", id = RouteParameter.Optional }
            );

            // Uncomment the following line of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
            // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
            // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
            config.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            config.EnableSystemDiagnosticsTracing();

        }
    }
}
