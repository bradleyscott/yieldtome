using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.Objects;
using System.ComponentModel.Composition;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Auth.OAuth2;
using System.Threading;
using Google.Apis.Plus.v1;

namespace yieldtome.API.Auth
{
    [Export("GoogleAuthenticationService", typeof(IExternalAuthenticationService))]
    public class GoogleAuthenticationService : IExternalAuthenticationService
    {
        [Import]
        IProfileService _profileService;

        public Profile Authenticate(dynamic externalToken)
        {
            Logging.LogWriter.Write("Attempting to authenticate user based on Google token");
            
            dynamic gProfile = GetGoogleProfile(externalToken);
            Profile profile = _profileService.GetProfile("Google", gProfile.Id);
            
            // Lookup email address
            string email = "";
            if(gProfile.Emails.Count > 0) { email = gProfile.Emails[0].Value; }    
            if(profile == null && email != "") { profile = GetProfileByEmail(gProfile, email); } // Use email from gProfile to match on
            
            // If User does not yet exist. Create the Profile
            if (profile == null) { profile = CreateProfile(gProfile, email); }

            Logging.LogWriter.Write(String.Format("Successfully authenticated Profile with ProfileID={0}", profile.ProfileID));
            return profile;
        }

        private Profile CreateProfile(dynamic gProfile, string email)
        {
            Logging.LogWriter.Write(String.Format("Creating new Profile for user with GoogleID: {0}", gProfile.Id));
            Profile profile = new Profile();
            profile.Name = gProfile.DisplayName;
            profile.Email = email;

            Login contact = new Login
            {
                Name = "Google",
                Value = gProfile.Id
            };
            profile.Logins.Add(contact);

            profile = _profileService.CreateProfile(profile);
            return profile;
        }

        private Profile GetProfileByEmail(dynamic gProfile, string email)
        {
            Logging.LogWriter.Write("Attempting to identify user based on email inside Google token");
            Profile profile = _profileService.GetProfiles().FirstOrDefault(x => x.Email == email);

            if (profile != null) // Update the Profile to include the Google contact details
            {
                Logging.LogWriter.Write("Successfully identifed user based on email inside Google token. Updating contact details");
                Login contact = new Login
                {
                    Name = "Google",
                    Value = gProfile.Id
                };
                profile.Logins.Add(contact);
                _profileService.UpdateProfile(profile);
            }
            return profile;
        }

        private dynamic GetGoogleProfile(dynamic externalToken)
        {
            Logging.LogWriter.Write("Attempting to authenticate user based on Google token");
            PlusService plusService = GetPlusService(externalToken);
                
            dynamic profile;
            try { profile = plusService.People.Get("me").Execute(); }
            catch (Exception ex)
            {
                Logging.LogWriter.Write(String.Format("There was a problem trying to get the Google Profile. ", ex.ToString()));
                throw ex;
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Google profile: {0}", profile.Id));
            return profile;
        }

        private PlusService GetPlusService(dynamic externalToken)
        {
            Logging.LogWriter.Write("Validating the Google access code is legitimate");

            IAuthorizationCodeFlow flow = GetFlow(externalToken);
            string clientId = externalToken.clientId;
            string code = externalToken.code;
            string redirectUri = externalToken.redirectUri;

            TokenResponse response;
            try { response = flow.ExchangeCodeForTokenAsync(clientId, code, redirectUri, CancellationToken.None).Result; }
            catch(Exception ex)
            {
                Logging.LogWriter.Write(String.Format("There was a problem trying to validate the Google access code. ", ex.ToString()));
                throw ex;
            }

            Logging.LogWriter.Write(String.Format("Successfully exchanged access code for Google Access token: {0}", response.AccessToken));
            UserCredential creds = new UserCredential(flow, "me", response);

            PlusService plusService = new PlusService(
                new Google.Apis.Services.BaseClientService.Initializer()
                {
                    HttpClientInitializer = creds
                });

            return plusService;
        }

        private static IAuthorizationCodeFlow GetFlow(dynamic externalToken)
        {
            string clientSecret = "";
            try { clientSecret = ConfigurationManager.AppSettings["GoogleAppSecret"]; }
            catch (Exception ex)
            {
                Logging.LogWriter.Write("Unable to find GoogleAppSecret in configuration");
                throw ex;
            }

            string clientId = externalToken.clientId;
            ClientSecrets secrets = new ClientSecrets
            {
                ClientId = clientId,
                ClientSecret = clientSecret
            };

            return new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = secrets,
                    Scopes = new List<string> { "profile", "email" }
                });
        }
    }
}
