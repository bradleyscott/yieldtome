using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.Objects;
using Tweetinvi;

namespace yieldtome.API.Auth
{
    [Export("TwitterAuthenticationService", typeof(IExternalAuthenticationService))]
    public class TwitterAuthenticationService : IExternalAuthenticationService
    {
        [Import]
        IProfileService _profileService;

        public Profile Authenticate(dynamic externalToken)
        {
            Logging.LogWriter.Write("Attempting to authenticate user based on Twitter access tokens");

            Tweetinvi.Core.Interfaces.oAuth.IOAuthCredentials creds = externalToken;
            Tweetinvi.Core.Interfaces.ILoggedUser user = Tweetinvi.User.GetLoggedUser(creds);

            Profile profile = _profileService.GetProfile("Twitter", user.Id.ToString());

            if (profile == null) // User does not yet exist. So create the Profile
            {
                Logging.LogWriter.Write(String.Format("Creating new Profile for user with TwitterID: {0}", user.Id.ToString()));
                profile = new Profile();
                profile.Name = user.Name;

                Login contact = new Login
                {
                    Name = "Twitter",
                    Value = user.Id.ToString()
                };
                profile.Logins.Add(contact);

                profile = _profileService.CreateProfile(profile);
            }

            Logging.LogWriter.Write(String.Format("Successfully authenticated Profile with ProfileID={0}", profile.ProfileID));
            return profile;
        }
    }
}
