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
            return new yieldtome.Objects.Profile()
            {
                ProfileID = dbProfile.ProfileID,
                Name = dbProfile.Name,
                FacebookID = dbProfile.FacebookID,
                Email = dbProfile.Email,
                Phone = dbProfile.Phone,
                Twitter = dbProfile.Twitter,
                LinkedIn = dbProfile.LinkedIn,
                IsFacebookPublic = dbProfile.IsFacebookPublic,
                IsEmailPublic = dbProfile.IsEmailPublic,
                IsPhonePublic = dbProfile.IsPhonePublic,
                IsTwitterPublic = dbProfile.IsTwitterPublic,
                IsLinkedInPublic = dbProfile.IsLinkedInPublic
            };
        }

        public List<yieldtome.Objects.Profile> GetProfiles()
        {
            Logging.LogWriter.Write("Attempting to retrieve Profiles");

            List<Profile> dbProfiles;
            using (var db = new Database())
            {
                dbProfiles = db.Profiles.ToList();
            }

            List<yieldtome.Objects.Profile> profiles = dbProfiles.Select(x => CreateProfileObject(x)).ToList();
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

        public yieldtome.Objects.Profile GetProfile(string facebookID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Profile with FacebookID={0}", facebookID));

            yieldtome.Objects.Profile profile;
            using (var db = new Database())
            {
                Profile dbProfile = db.Profiles.FirstOrDefault(x => x.FacebookID == facebookID);

                if (dbProfile == null)
                {
                    Logging.LogWriter.Write(String.Format("No Profile with FacebookID={0} exists", facebookID));
                    return null;
                }

                profile = CreateProfileObject(dbProfile);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Profile with FacebookID={0}", facebookID));
            return profile;
        }

        public yieldtome.Objects.Profile CreateProfile(yieldtome.Objects.Profile newProfile)
        {
            Logging.LogWriter.Write("Attempting to create a new Profile");

            if (newProfile.FacebookID == "") throw new ArgumentNullException("FacebookID is required");
            if (newProfile.Name == "") throw new ArgumentNullException("Name is required");

            Profile dbProfile;
            using (var db = new Database())
            {
                if (db.Profiles.FirstOrDefault(x => x.FacebookID == newProfile.FacebookID) != null)
                {
                    string message = "A Profile with this FacebookID already exists";
                    Logging.LogWriter.Write(message);
                    throw new ArgumentException(message, "facebookID");
                }

                dbProfile = new Profile
                {
                    FacebookID = newProfile.FacebookID,
                    Name = newProfile.Name,
                    Email = newProfile.Email,
                    Phone = newProfile.Phone,
                    Twitter = newProfile.Twitter,
                    LinkedIn = newProfile.LinkedIn,
                    IsFacebookPublic = newProfile.IsFacebookPublic,
                    IsEmailPublic = newProfile.IsEmailPublic,
                    IsPhonePublic = newProfile.IsPhonePublic,
                    IsTwitterPublic = newProfile.IsTwitterPublic,
                    IsLinkedInPublic = newProfile.IsLinkedInPublic,
                    CreatedTime = DateTime.Now
                };

                dbProfile = db.Profiles.Add(dbProfile);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Profile with ID {0}", dbProfile.ProfileID));
            return CreateProfileObject(dbProfile);
        }


        public yieldtome.Objects.Profile UpdateProfile(yieldtome.Objects.Profile updatedProfile)
        {
            Logging.LogWriter.Write(String.Format("Attempting to update Profile with ProfileID={0}", updatedProfile.ProfileID));

            if (updatedProfile.Name == "") throw new ArgumentNullException("updatedProfile.Name", "Name is required");

            using (var db = new Database())
            {
                Profile dbProfile = db.Profiles.FirstOrDefault(x => x.ProfileID == updatedProfile.ProfileID);
                if (dbProfile == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", updatedProfile.ProfileID));

                dbProfile.Name = updatedProfile.Name;
                dbProfile.Email = updatedProfile.Email;
                dbProfile.Phone = updatedProfile.Phone;
                dbProfile.Twitter = updatedProfile.Twitter;
                dbProfile.LinkedIn = updatedProfile.LinkedIn;
                dbProfile.IsFacebookPublic = updatedProfile.IsFacebookPublic;
                dbProfile.IsEmailPublic = updatedProfile.IsEmailPublic;
                dbProfile.IsPhonePublic = updatedProfile.IsPhonePublic;
                dbProfile.IsTwitterPublic = updatedProfile.IsTwitterPublic;
                dbProfile.IsLinkedInPublic = updatedProfile.IsLinkedInPublic;
                dbProfile.UpdatedTime = DateTime.Now;

                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Updated Profile with ID {0}", updatedProfile.ProfileID));
            return updatedProfile;
        }
    }
}
