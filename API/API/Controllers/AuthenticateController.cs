using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using yieldtome.Interfaces;

namespace yieldtome.API.Controllers
{
    public class AuthenticateController : ApiController
    {
        /// <summary>
        /// Exchanges a Facebook Access token with a yieldto.me issued token used to access the API
        /// </summary>
        /// <param name="token">The Access token granted by Facebook from a FB.login function</param>
        /// <returns></returns>
        public async Task<IHttpActionResult> PostLogin(string token)
        {
            var tokenExpirationTimeSpan = TimeSpan.FromDays(14);
            IdentityUser user = null;
 
            Facebook.FacebookClient client = new Facebook.FacebookClient(token);
            dynamic response;
            try { response = client.Get("me"); }
            catch { return Ok(); } // If there is an OAuth exception. Don't return a token back

            user = new IdentityUser();
            user.Id = response.id.ToString();

            // Finally sign-in the user: this is the key part of the code that creates the bearer token and authenticate the user
            var identity = new ClaimsIdentity(Startup.OAuthBearerOptions.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, user.Id, null, "Facebook"));

            AuthenticationTicket ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
            var currentUtc = new Microsoft.Owin.Infrastructure.SystemClock().UtcNow;
            ticket.Properties.IssuedUtc = currentUtc;
            ticket.Properties.ExpiresUtc = currentUtc.Add(tokenExpirationTimeSpan);
            var accesstoken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);
            Request.GetOwinContext().Authentication.SignIn(identity);

            // Create the response
            JObject blob = new JObject(
                new JProperty("userName", user.Id),
                new JProperty("access_token", accesstoken),
                new JProperty("token_type", "bearer"),
                new JProperty("expires_in", tokenExpirationTimeSpan.TotalSeconds.ToString()),
                new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
                new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
            );
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(blob);
            
            // Return OK
            return Ok(blob);
        }
    }
}
