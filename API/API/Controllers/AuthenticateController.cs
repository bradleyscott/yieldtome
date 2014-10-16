using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using yieldtome.Objects;
using yieldtome.Interfaces;
using System.Net;
using System.Web;
using Tweetinvi;
using System.Runtime.Caching;

namespace yieldtome.API.Controllers
{
    public class AuthenticateController : ApiController
    {
        /// <summary>
        /// Exchanges a Facebook Access token with a yieldto.me issued token used to access the API
        /// </summary>
        /// <param name="code">The Access code granted by Facebook</param>
        /// <returns></returns>
        [ActionName("Facebook")]
        public JObject PostFacebook(dynamic code)
        {
            IExternalAuthenticationService fbAuthService = Extensibility.Container.GetExportedValue<IExternalAuthenticationService>("FacebookAuthenticationService");
            Profile profile = fbAuthService.Authenticate(code);
            JObject accessToken = CreateAccessTokenAndSignIn(profile);

            return accessToken;
        }

        /// <summary>
        /// Exchanges a Google Access token with a yieldto.me issued token used to access the API
        /// </summary>
        /// <param name="code">The Access code granted by Google</param>
        /// <returns></returns>
        [ActionName("Google")]
        public JObject PostGoogle(dynamic code)
        {
            IExternalAuthenticationService gAuthService = Extensibility.Container.GetExportedValue<IExternalAuthenticationService>("GoogleAuthenticationService");
            Profile profile = gAuthService.Authenticate(code);
            JObject accessToken = CreateAccessTokenAndSignIn(profile);

            return accessToken;
        }

        /// <summary>
        /// Exchanges a LinkedIn Access token with a yieldto.me issued token used to access the API
        /// </summary>
        /// <param name="code">The Access code granted by LinkedIn</param>
        /// <returns></returns>
        [ActionName("LinkedIn")]
        public JObject PostLinkedIn(dynamic code)
        {
            throw new NotImplementedException();
        }

        private JObject CreateAccessTokenAndSignIn(Profile profile)
        {
            var tokenExpiration = TimeSpan.FromDays(1);

            // Create Identity and Sign in
            ClaimsIdentity identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.Name, profile.Name));
            identity.AddClaim(new Claim("ProfileID", profile.ProfileID.ToString()));
            
            Request.GetOwinContext().Authentication.SignIn(identity);

            // Create Access token
            var props = new AuthenticationProperties()
            {
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration),
            };

            var ticket = new AuthenticationTicket(identity, props);
            var accessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);

            // Create JObject token to be granted
            JObject tokenResponse = new JObject(
                                        new JProperty("userName", profile.ProfileID.ToString()),
                                        new JProperty("access_token", accessToken),
                                        new JProperty("token_type", "bearer"),
                                        new JProperty("expires_in", tokenExpiration.TotalSeconds.ToString()),
                                        new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
                                        new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
            );

            return tokenResponse;
        }
    }
}