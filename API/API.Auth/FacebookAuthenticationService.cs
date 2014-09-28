using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.Objects;
using Facebook;
using System.ComponentModel.Composition;

namespace yieldtome.API.Auth
{
    [Export("FacebookAuthenticationService", typeof(IExternalAuthenticationService))]
    public class FacebookAuthenticationService : IExternalAuthenticationService
    {
        [Import]
        IProfileService _profileService;

        public Profile Authenticate(dynamic externalToken)
        {
            Logging.LogWriter.Write("Attempting to authenticate user based on Facebook token");
            
            string accessToken = ValidateFacebookToken(externalToken);
            dynamic fbProfile = GetFacebookProfile(accessToken);

            Profile profile = _profileService.GetProfile(fbProfile.id);
            if (profile == null) // User does not yet exist. So create the Profile
            {
                Logging.LogWriter.Write(String.Format("Creating new Profile for user with FacebookID: {0}", fbProfile.id));
                profile = new Profile
                {
                    Name = fbProfile.name,
                    FacebookID = fbProfile.id
                };
                profile = _profileService.CreateProfile(profile);
            }

            Logging.LogWriter.Write(String.Format("Successfully authenticated Profile with ProfileID={0}", profile.ProfileID));
            return profile;
        }

        private dynamic GetFacebookProfile(string accessToken)
        {
            Logging.LogWriter.Write("Attempting to authenticate user based on Facebook token");
            FacebookClient client = new FacebookClient(accessToken);
            
            dynamic profile;
            try { profile = client.Get("me"); }
            catch (Exception ex)
            {
                Logging.LogWriter.Write(String.Format("There was a problem trying to get the Facebook Profile. ", ex.ToString()));
                throw ex;
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Facebook profile: {0}", profile.id));
            return profile;
        }

        private string ValidateFacebookToken(dynamic externalToken)
        {
            Logging.LogWriter.Write("Validating the Facebook access code is legitimate");

            FacebookClient client = new Facebook.FacebookClient();
            string urlTemplate = "oauth/access_token?client_id={0}&redirect_uri={1}&client_secret={2}&code={3}";

            string clientSecret = "";
            try { clientSecret = ConfigurationManager.AppSettings["FacebookAppSecret"]; }
            catch (Exception ex) 
            {
                Logging.LogWriter.Write("Unable to find FacebookAppSecret in configuration");
                throw ex;
            }

            string tokenExchangeUrl = String.Format(urlTemplate, externalToken.clientId, externalToken.redirectUri, clientSecret, externalToken.code);

            dynamic tokenExchangeResponse;
            string accessToken;

            try 
            { 
                tokenExchangeResponse = client.Get(tokenExchangeUrl); 
                accessToken = tokenExchangeResponse.access_token;
            }
            catch (Exception ex)
            {
                Logging.LogWriter.Write(String.Format("There was a problem trying to validate the Facebook access code. ", ex.ToString()));
                throw ex;
            }

            Logging.LogWriter.Write(String.Format("Successfully exchanged access code for Facebook Access token: {0}", accessToken));
            return accessToken;
        }
    }
}
