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

            // Attempt to get the Profile
            Profile profile = _profileService.GetProfile("Facebook", fbProfile.id);
            string email = "";
            if (fbProfile.GetType().GetProperty("email") != null) { email = fbProfile.email; }
            if (profile == null && email != "") { profile = GetProfileByEmail(fbProfile, email); }
            
            // If User does not yet exist, create the Profile
            if (profile == null) { profile = CreateProfile(fbProfile, email); }

            Logging.LogWriter.Write(String.Format("Successfully authenticated Profile with ProfileID={0}", profile.ProfileID));
            return profile;
        }

        private Profile GetProfileByEmail(dynamic fbProfile, string email)
        {
            Logging.LogWriter.Write("Attempting to identify user based on email inside Facebook token");
            Profile profile = _profileService.GetProfiles().FirstOrDefault(x => x.Email == email);

            if (profile != null) // Update the Profile to include the FB contact details
            {
                Logging.LogWriter.Write("Successfully identifed user based on email inside Facebook token. Updating contact details");
                Login contact = new Login
                {
                    Name = "Facebook",
                    Value = fbProfile.id
                };
                profile.Logins.Add(contact);
                _profileService.UpdateProfile(profile);
            }
            return profile;
        }

        private Profile CreateProfile(dynamic fbProfile, string email)
        {
            Logging.LogWriter.Write(String.Format("Creating new Profile for user with FacebookID: {0}", fbProfile.id));
            Profile profile = new Profile();
            profile.Name = fbProfile.name;
            profile.Email = email;

            Login contact = new Login
            {
                Name = "Facebook",
                Value = fbProfile.id
            };
            profile.Logins.Add(contact);

            profile = _profileService.CreateProfile(profile);
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
