using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.Objects;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class ProfileServiceTests
    {
        IProfileService _service;

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<IProfileService>();
        }

        [TestMethod]
        public void GetProfiles_Success()
        {
            List<Profile> profiles = _service.GetProfiles();
            Assert.IsInstanceOfType(profiles, typeof(List<Profile>));
            CollectionAssert.AllItemsAreNotNull(profiles);
            CollectionAssert.AllItemsAreUnique(profiles);
        }

        [TestMethod]
        public void GetProfileByID_ProfileNotFound()
        {
            Profile profile = _service.GetProfile(-1);
            Assert.IsNull(profile);
        }

        [TestMethod]
        public void GetProfileByID_Success()
        {
            Profile profile = _service.GetProfile(1);
            Assert.IsNotNull(profile);
            Assert.IsInstanceOfType(profile, typeof(Profile));
        }

        [TestMethod]
        public void GetProfileByProvider_ProfileNotFound()
        {
            Profile profile = _service.GetProfile("Facebook", "-1");
            Assert.IsNull(profile);
        }

        [TestMethod]
        public void GetProfileByFacebook_Success()
        {
            Profile profile = _service.GetProfile("Facebook", "553740394");
            Assert.IsNotNull(profile);
            Assert.IsInstanceOfType(profile, typeof(Profile));

            Login facebookContact = profile.Logins.FirstOrDefault(x => x.Name == "Facebook");
            Assert.AreEqual("553740394", facebookContact.Value);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateProfile_MissingContactDetail()
        {
            Profile profile = new Profile
            {
                Name = "Bradley Scott",
                Email = "bradley@yieldto.me"
            };

            profile = _service.CreateProfile(profile);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateProfile_MissingName()
        {
            Profile profile = new Profile { 
                Name = "", 
                Email = "bradley@yieldto.me",
                Logins = new List<Login>()
            };
            profile.Logins.Add(new Login
            {
                Name = "Facebook",
                Value = "553740394"
            });
            
            profile = _service.CreateProfile(profile);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateProfile_MissingEmail()
        {
            Profile profile = new Profile
            {
                Name = "Bradley Scott",
                Logins = new List<Login>()
            };
            profile.Logins.Add(new Login
            {
                Name = "Facebook",
                Value = "553740394"
            });

            profile = _service.CreateProfile(profile);
        }

        [TestMethod]
        public void CreateProfile_Success()
        {
            string facebookID = DateTime.Now.Ticks.ToString();
            string name = String.Format("New Profile {0}", facebookID);

            Profile profile = new Profile
            {
                Name = name,
                Email = "newprofile@yieldto.me",
                Logins = new List<Login>()
            };
            profile.Logins.Add(new Login
            {
                Name = "Facebook",
                Value = facebookID
            });

            profile = _service.CreateProfile(profile);

            Assert.IsInstanceOfType(profile, typeof(Profile));
            Login facebookContact = profile.Logins.FirstOrDefault(x => x.Name == "Facebook");
            Assert.AreEqual(facebookID, facebookContact.Value);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateProfile_MissingName()
        {
            Profile profileToUpdate = new Profile() 
            {
                ProfileID = 1,
                Name = "" ,
                Email = "bradley@yieldto.me"
            };

            _service.UpdateProfile(profileToUpdate);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateProfile_MissingEmail()
        {
            Profile profileToUpdate = new Profile()
            {
                ProfileID = 1,
                Name = "Bradley Scott",
                Email = ""
            };

            _service.UpdateProfile(profileToUpdate);
        }

        [TestMethod]
        public void UpdateProfile_Success()
        {
            string updatedTime = DateTime.Now.Ticks.ToString();

            Profile profileToUpdate = new Profile()
            {
                ProfileID = 1,
                Name = "Bradley " + updatedTime,
                Email = updatedTime + "@yieldto.me",
                Logins = new List<Login>()
            };
            profileToUpdate.Logins.Add(new Login
            {
                Name = "Facebook",
                Value = updatedTime
            });

            profileToUpdate = _service.UpdateProfile(profileToUpdate);

            Assert.IsInstanceOfType(profileToUpdate, typeof(Profile));
            Assert.AreEqual("Bradley " + updatedTime, profileToUpdate.Name);
            Assert.AreEqual(updatedTime + "@yieldto.me", profileToUpdate.Email);
            Login facebookContact = profileToUpdate.Logins.FirstOrDefault(x => x.Name == "Facebook");
            Assert.AreEqual(updatedTime, facebookContact.Value);
        }
    }
}
