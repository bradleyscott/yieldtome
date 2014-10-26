using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.API.Data.Objects;

namespace yieldtome.API.Data.Services
{
    [Export(typeof(IProfileService))]
    public class ProfileService : IProfileService
    {
        private yieldtome.Objects.Profile CreateProfileObject(Profile dbProfile)
        {
            yieldtome.Objects.Profile profile = new yieldtome.Objects.Profile()
            {
                ProfileID = dbProfile.ProfileID,
                Name = dbProfile.Name,
                Email = dbProfile.Email,
                Phone = dbProfile.Phone,
                IsEmailPublic = dbProfile.IsEmailPublic,
                IsPhonePublic = dbProfile.IsPhonePublic, 
                IsTwitterPublic = dbProfile.IsTwitterPublic
            };
            if (dbProfile.Twitter != null) { profile.Twitter = dbProfile.Twitter.Replace("@", "").ToLower(); } // Strip out the @ char

            foreach(Login detail in dbProfile.Logins)
            {
                profile.Logins.Add(new yieldtome.Objects.Login
                {
                    Name = detail.Name,
                    Value = detail.Value
                });
            }

            return profile;
        }

        public List<yieldtome.Objects.Profile> GetProfiles()
        {
            Logging.LogWriter.Write("Attempting to retrieve Profiles");

            List<Profile> dbProfiles;
            List<yieldtome.Objects.Profile> profiles;

            using (var db = new Database())
            {
                dbProfiles = db.Profiles.ToList();
                profiles = dbProfiles.Select(x => CreateProfileObject(x)).ToList();
            }

            Logging.LogWriter.Write(String.Format("Retrieved {0} Profiles", profiles.Count));
            return profiles;
        }

        public yieldtome.Objects.Profile GetProfile(int profileID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Profile with ProfileID={0}", profileID));

            yieldtome.Objects.Profile profile;
            using (var db = new Database())
            {
                Profile dbProfile = db.Profiles.FirstOrDefault(x => x.ProfileID == profileID);

                if (dbProfile == null)
                {
                    Logging.LogWriter.Write(String.Format("No Profile with ProfileID={0} exists", profileID));
                    return null;
                }

                profile = CreateProfileObject(dbProfile);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Profile with ProfileID={0}", profileID));
            return profile;
        }

        public yieldtome.Objects.Profile GetProfile(string provider, string providerID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Profile with ID={0} from {1}", providerID, provider));

            yieldtome.Objects.Profile profile;
            using (var db = new Database())
            {
                Login dbContact = db.Logins.FirstOrDefault(x => x.Name == provider && x.Value == providerID);
                if (dbContact == null)
                {
                    Logging.LogWriter.Write(String.Format("No Profile with ID={0} from {1} exists", providerID, provider));
                    return null;
                }

                Profile dbProfile = db.Profiles.FirstOrDefault(x => x.ProfileID == dbContact.ProfileID);
                profile = CreateProfileObject(dbProfile);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Profile with ID={0} from {1}", providerID, provider));
            return profile;
        }

        public yieldtome.Objects.Profile CreateProfile(yieldtome.Objects.Profile newProfile)
        {
            Logging.LogWriter.Write("Attempting to create a new Profile");

            if (newProfile.Name == null || newProfile.Name == "") throw new ArgumentException("Name is required");
            if (newProfile.Email == null || newProfile.Email == "") throw new ArgumentException("Email is required");
            if (newProfile.Logins.Count == 0) throw new ArgumentException("At least 1 ContactDetail is required");

            Profile dbProfile;
            using (var db = new Database())
            {
                dbProfile = new Profile
                {
                    Name = newProfile.Name,
                    Email = newProfile.Email,
                    IsEmailPublic = newProfile.IsEmailPublic,
                    Phone = newProfile.Phone, 
                    IsPhonePublic = newProfile.IsPhonePublic,
                    IsTwitterPublic = newProfile.IsTwitterPublic,
                    CreatedTime = DateTime.Now
                };
                if (newProfile.Twitter != null) dbProfile.Twitter = newProfile.Twitter.Replace("@", "").ToLower(); // Strip out the @ character

                dbProfile = db.Profiles.Add(dbProfile);

                foreach(yieldtome.Objects.Login contact in newProfile.Logins)
                {
                    db.Logins.Add(new Login
                    {
                        Name = contact.Name,
                        Value = contact.Value,
                        ProfileID = dbProfile.ProfileID,
                        CreatedTime = DateTime.Now
                    });
                }

                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Profile with ID {0}", dbProfile.ProfileID));
            return CreateProfileObject(dbProfile);
        }


        public yieldtome.Objects.Profile UpdateProfile(yieldtome.Objects.Profile updatedProfile)
        {
            Logging.LogWriter.Write(String.Format("Attempting to update Profile with ProfileID={0}", updatedProfile.ProfileID));

            if (updatedProfile.Name == "") throw new ArgumentException("updatedProfile.Name", "Name is required");
            if (updatedProfile.Email == "") throw new ArgumentException("Email is required");

            using (var db = new Database())
            {
                Profile dbProfile = db.Profiles.FirstOrDefault(x => x.ProfileID == updatedProfile.ProfileID);
                if (dbProfile == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", updatedProfile.ProfileID));

                if (AuthorizationHelper.IsCallerAllowedToEdit(dbProfile.ProfileID) == false)
                {
                    string message = "This user is not authorized to update this Profile";
                    Logging.LogWriter.Write(message);
                    throw new UnauthorizedAccessException(message);
                }

                dbProfile.Name = updatedProfile.Name;
                dbProfile.Email = updatedProfile.Email;
                dbProfile.IsEmailPublic = updatedProfile.IsEmailPublic;
                dbProfile.Phone = updatedProfile.Phone;
                dbProfile.IsPhonePublic = updatedProfile.IsPhonePublic;
                if (updatedProfile.Twitter != null) dbProfile.Twitter = updatedProfile.Twitter.Replace("@", "").ToLower(); // Strip out the @ character
                dbProfile.IsTwitterPublic = updatedProfile.IsTwitterPublic;
                dbProfile.UpdatedTime = DateTime.Now;

                foreach (yieldtome.Objects.Login login in updatedProfile.Logins)
                {
                    Login dbLogin = db.Logins.FirstOrDefault(x => x.Name == login.Name);
                    if(dbLogin != null) {
                        dbLogin.Value = login.Value;
                        dbLogin.UpdatedTime = DateTime.Now;
                    }
                    else
                    {
                        db.Logins.Add(new Login
                        {
                            Name = login.Name,
                            Value = login.Value,
                            ProfileID = updatedProfile.ProfileID,
                            CreatedTime = DateTime.Now
                        });
                    }
                }

                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Updated Profile with ID {0}", updatedProfile.ProfileID));
            return updatedProfile;
        }
    }
}
