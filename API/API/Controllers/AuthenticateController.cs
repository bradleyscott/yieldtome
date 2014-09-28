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

namespace yieldtome.API.Controllers
{

    public class AuthenticateController : ApiController
    {
        /// <summary>
        /// Exchanges a Facebook Access token with a yieldto.me issued token used to access the API
        /// </summary>
        /// <param name="token">The Access token granted by Facebook from a FB.login function</param>
        /// <returns></returns>
        public async Task<IHttpActionResult> PostLogin(dynamic code)
        {
            IExternalAuthenticationService fbAuthService = Extensibility.Container.GetExportedValue<IExternalAuthenticationService>("FacebookAuthenticationService");
            Profile profile = fbAuthService.Authenticate(code);
            JObject accessToken = CreateAccessTokenAndSignIn(profile);

            return Ok(accessToken);
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