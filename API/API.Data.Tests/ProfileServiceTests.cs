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
        public void GetProfileByFacebook_ProfileNotFound()
        {
            Profile profile = _service.GetProfile("-1");
            Assert.IsNull(profile);
        }

        [TestMethod]
        public void GetProfileByFacebook_Success()
        {
            Profile profile = _service.GetProfile("553740394");
            Assert.IsNotNull(profile);
            Assert.IsInstanceOfType(profile, typeof(Profile));
            Assert.AreEqual("553740394", profile.FacebookID);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreateProfile_MissingFacebookID()
        {
            Profile profile = new Profile
            {
                FacebookID = "",
                Name = "Bradley Scott",
                Email = "bradley@yieldto.me",
                Phone = "555 125-3459",
                Twitter = "tweettome",
                LinkedIn = "linktome",
                IsFacebookPublic = true,
                IsEmailPublic = true,
                IsPhonePublic = false,
                IsTwitterPublic = false,
                IsLinkedInPublic = true
            };

            profile = _service.CreateProfile(profile);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreateProfile_MissingName()
        {
            Profile profile = new Profile { 
                FacebookID = "553740394",
                Name = "", 
                Email = "bradley@yieldto.me",
                Phone = "555 125-3459",
                Twitter = "tweettome",
                LinkedIn = "linktome",
                IsFacebookPublic = true,
                IsEmailPublic = true,
                IsPhonePublic = false, 
                IsTwitterPublic = false,
                IsLinkedInPublic = true
            };
            
            profile = _service.CreateProfile(profile);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateProfile_DuplicateFacebookID()
        {
            Profile profile = new Profile
            {
                FacebookID = "553740394",
                Name = "Bradley Scott",
                Email = "bradley@yieldto.me",
                Phone = "555 125-3459",
                Twitter = "tweettome",
                LinkedIn = "linktome",
                IsFacebookPublic = true,
                IsEmailPublic = true,
                IsPhonePublic = false,
                IsTwitterPublic = false,
                IsLinkedInPublic = true
            };

            profile = _service.CreateProfile(profile);
        }

        [TestMethod]
        public void CreateProfile_Success()
        {
            string facebookID = DateTime.Now.Ticks.ToString();
            string name = String.Format("New Profile {0}", facebookID);

            Profile profile = new Profile
            {
                FacebookID = facebookID,
                Name = name,
                Email = "bradley@yieldto.me",
                Phone = "555 125-3459",
                Twitter = "tweettome",
                LinkedIn = "linktome",
                IsFacebookPublic = true,
                IsEmailPublic = true,
                IsPhonePublic = false,
                IsTwitterPublic = false,
                IsLinkedInPublic = true
            };

            profile = _service.CreateProfile(profile);

            Assert.IsInstanceOfType(profile, typeof(Profile));
            Assert.AreEqual(facebookID, profile.FacebookID);
            Assert.AreEqual(name, profile.Name);
            Assert.AreEqual("bradley@yieldto.me", profile.Email);
            Assert.AreEqual("555 125-3459", profile.Phone);
            Assert.AreEqual("tweettome", profile.Twitter);
            Assert.AreEqual("linktome", profile.LinkedIn);
            Assert.IsTrue(profile.IsFacebookPublic);
            Assert.IsTrue(profile.IsEmailPublic);
            Assert.IsFalse(profile.IsPhonePublic);
            Assert.IsFalse(profile.IsTwitterPublic);
            Assert.IsTrue(profile.IsLinkedInPublic);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void UpdateProfile_MissingName()
        {
            Profile profileToUpdate = new Profile() 
            {
                ProfileID = 1,
                Name = "" 
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
                Phone = updatedTime,
                Twitter = "tweettome" + updatedTime,
                LinkedIn = "linktome" + updatedTime,
                IsFacebookPublic = false,
                IsEmailPublic = false,
                IsPhonePublic = false,
                IsTwitterPublic = false,
                IsLinkedInPublic = true
            };

            profileToUpdate = _service.UpdateProfile(profileToUpdate);

            Assert.IsInstanceOfType(profileToUpdate, typeof(Profile));
            Assert.AreEqual("Bradley " + updatedTime, profileToUpdate.Name);
            Assert.AreEqual(updatedTime + "@yieldto.me", profileToUpdate.Email);
            Assert.AreEqual(updatedTime, profileToUpdate.Phone);
            Assert.AreEqual("tweettome" + updatedTime, profileToUpdate.Twitter);
            Assert.AreEqual("linktome" + updatedTime, profileToUpdate.LinkedIn);
            Assert.IsFalse(profileToUpdate.IsFacebookPublic);
            Assert.IsFalse(profileToUpdate.IsEmailPublic);
            Assert.IsFalse(profileToUpdate.IsPhonePublic);
            Assert.IsFalse(profileToUpdate.IsTwitterPublic);
            Assert.IsTrue(profileToUpdate.IsLinkedInPublic);
        }
    }
}
