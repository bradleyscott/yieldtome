using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.Objects;
using yieldtome.Enums;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class SpeakersListServiceTests
    {
        ISpeakersListService _service;
        List<int> _deletions = new List<int>();

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<ISpeakersListService>();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void GetSpeakersLists_EventNotFound()
        {
            List<SpeakersList> lists = _service.GetSpeakersLists(-1);
        }

        [TestMethod]
        public void GetSpeakersLists_Success()
        {
            List<SpeakersList> lists = _service.GetSpeakersLists(1);
            Assert.IsInstanceOfType(lists, typeof(List<SpeakersList>));
            CollectionAssert.AllItemsAreNotNull(lists);
            CollectionAssert.AllItemsAreUnique(lists);
        }

        [TestMethod]
        public void GetSpeakersList_ListNotFound()
        {
            SpeakersList list = _service.GetSpeakersList(-1);
            Assert.IsNull(list);
        }

        [TestMethod]
        public void GetSpeakersList_Success()
        {
            SpeakersList list = _service.GetSpeakersList(1);
            Assert.IsNotNull(list);
            Assert.IsInstanceOfType(list, typeof(SpeakersList));
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateSpeakersList_InvalidEventID()
        {
            SpeakersList list = _service.CreateSpeakersList(-1, "New Speakers list", 1);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreateSpeakersList_MissingName()
        {
            SpeakersList list = _service.CreateSpeakersList(1, "", 1);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateSpeakersList_InvalidProfileID()
        {
            SpeakersList list = _service.CreateSpeakersList(1, "New Speakers list", -1);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateSpeakersList_NameNotUnique()
        {
            SpeakersList list1 = _service.CreateSpeakersList(1, "Duplicate Speakers list", 1);

            _deletions.Add(list1.SpeakersListID); // Delete this in the tear down
            SpeakersList list2 = _service.CreateSpeakersList(1, "Duplicate Speakers list", 1);
        }

        [TestMethod]
        public void CreateSpeakersList_Success()
        {
            SpeakersList list = _service.CreateSpeakersList(1, "New Speakers list", 1);

            _deletions.Add(list.SpeakersListID); // Delete this in the tear down

            Assert.IsInstanceOfType(list, typeof(SpeakersList));
            Assert.AreEqual(SpeakersListAndPollStatus.Open, list.Status);
            Assert.AreEqual("New Speakers list", list.Name);
            Assert.AreEqual(1, list.CreatorID);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateSpeakersList_InvalidSpeakersList()
        {
            SpeakersList list = new SpeakersList
            {
                SpeakersListID = -1,
            };

            _service.UpdateSpeakersList(list);
        }        
        
        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void UpdateSpeakersList_MissingName()
        {
            SpeakersList list = new SpeakersList
            {
                SpeakersListID = 1,
                Name = ""
            };

            _service.UpdateSpeakersList(list);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateSpeakersList_NameNotUnique()
        {
            SpeakersList list1 = _service.CreateSpeakersList(1, "Speakers list to update1", 1);
            _deletions.Add(list1.SpeakersListID); // Delete this in the tear down

            SpeakersList list2 = _service.CreateSpeakersList(1, "Speakers list to update2", 1);
            _deletions.Add(list2.SpeakersListID); // Delete this in the tear down

            list2.Name = "Speakers list to update1";
            SpeakersList updatedList2 = _service.UpdateSpeakersList(list2);
        }

        [TestMethod]
        public void UpdateSpeakersList_Success()
        {
            string updatedTime = DateTime.Now.Ticks.ToString();

            SpeakersList list = new SpeakersList
            {
                SpeakersListID = 1,
                Name = "Updated Speakers List " + updatedTime,
                Status = SpeakersListAndPollStatus.Closed
            };

            list = _service.UpdateSpeakersList(list);

            Assert.IsInstanceOfType(list, typeof(SpeakersList));
            Assert.AreEqual("Updated Speakers List " + updatedTime, list.Name);
            Assert.AreEqual(SpeakersListAndPollStatus.Closed, list.Status);
            Assert.AreEqual(1, list.SpeakersListID);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteSpeakersList_InvalidSpeakrsListID()
        {
            _service.DeleteSpeakersList(-1);
        }

        [TestMethod]
        public void DeleteSpeakersList_Success()
        {
            SpeakersList listToDelete = _service.CreateSpeakersList(1, String.Format("Speakers List to delete {0}", DateTime.Now.Ticks), 1);
            _service.DeleteSpeakersList(listToDelete.SpeakersListID);

            SpeakersList deletedList = null;
            try { deletedList = _service.GetSpeakersList(listToDelete.SpeakersListID); }
            catch (ArgumentException) { }

            Assert.IsNull(deletedList);
        }

        [TestCleanup()]
        public void Cleanup()
        {
            foreach (int i in _deletions)
                _service.DeleteSpeakersList(i);
        }
    }
}
