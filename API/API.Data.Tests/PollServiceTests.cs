using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using yieldtome.Interfaces;
using yieldtome.Objects;
using System.Collections.Generic;
using yieldtome.Enums;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class PollServiceTests
    {
        IPollService _service;
        List<int> _deletions = new List<int>();

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<IPollService>();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void GetPolls_EventNotFound()
        {
            List<Poll> polls = _service.GetPolls(-1);
        }

        [TestMethod]
        public void GetPolls_Success()
        {
            List<Poll> polls = _service.GetPolls(1);
            Assert.IsInstanceOfType(polls, typeof(List<Poll>));
            CollectionAssert.AllItemsAreNotNull(polls);
            CollectionAssert.AllItemsAreUnique(polls);
        }

        [TestMethod]
        public void GetPoll_PollNotFound()
        {
            Poll poll = _service.GetPoll(-1);
            Assert.IsNull(poll);
        }

        [TestMethod]
        public void GetPoll_Success()
        {
            Poll poll = _service.GetPoll(1);
            Assert.IsNotNull(poll);
            Assert.IsInstanceOfType(poll, typeof(Poll));
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreatePoll_InvalidEventID()
        {
            Poll poll = _service.CreatePoll(-1, "New Poll", 1, 50, false);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreatePoll_MissingName()
        {
            Poll poll = _service.CreatePoll(1, "", 1, 50, false);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreatePoll_InvalidProfileID()
        {
            Poll poll = _service.CreatePoll(1, "New Poll", -1, 50, false);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreatePoll_InvalidMajorityRequired()
        {
            Poll poll = _service.CreatePoll(1, "New Poll", 1, -1, false);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreatePoll_NameNotUnique()
        {
            Poll list1 = _service.CreatePoll(1, "Duplicate Poll", 1, 50, false);

            _deletions.Add(list1.PollID); // Delete this in the tear down
            Poll list2 = _service.CreatePoll(1, "Duplicate Poll", 1, 50, false);
        }

        [TestMethod]
        public void CreatePoll_Success()
        {
            Poll poll = _service.CreatePoll(1, "New Poll", 1, 75, true);

            _deletions.Add(poll.PollID); // Delete this in the tear down

            Assert.IsInstanceOfType(poll, typeof(Poll));
            Assert.AreEqual("New Poll", poll.Name);
            Assert.AreEqual(SpeakersListAndPollStatus.Open, poll.Status);
            Assert.AreEqual(1, poll.CreatorID);
            Assert.AreEqual(75, poll.MajorityRequired);
            Assert.AreEqual(PollType.ForMoreThanAgainstAndAbstain, poll.Type);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdatePoll_InvalidPoll()
        {
            Poll poll = new Poll
            {
                PollID = -1
            };

            _service.UpdatePoll(poll);
        } 

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void UpdatePoll_MissingName()
        {
            Poll poll = new Poll
            {
                PollID = 1,
                Name = ""
            };

            _service.UpdatePoll(poll);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdatePoll_InvalidMajority()
        {
            Poll poll = new Poll
            {
                PollID = 1,
                Name = "Updated Poll",
                MajorityRequired = -1
            };

            _service.UpdatePoll(poll);
        }

        [TestMethod]
        public void UpdatePoll_Success()
        {
            string updatedTime = DateTime.Now.Ticks.ToString();

            Poll poll = new Poll
            {
                PollID = 1,
                Name = "Updated Poll " + updatedTime,
                MajorityRequired = 1,
                Status = SpeakersListAndPollStatus.Closed,
                Type = PollType.ForMoreThanAgainst
            };

            poll = _service.UpdatePoll(poll);

            Assert.IsInstanceOfType(poll, typeof(Poll));
            Assert.AreEqual("Updated Poll " + updatedTime, poll.Name);
            Assert.AreEqual(SpeakersListAndPollStatus.Closed, poll.Status);
            Assert.AreEqual(1, poll.MajorityRequired);
            Assert.AreEqual(PollType.ForMoreThanAgainst, poll.Type);
            Assert.AreEqual(1, poll.PollID);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdatePoll_NameNotUnique()
        {
            Poll poll1 = _service.CreatePoll(1, "Poll to update1", 1, 50, false);
            _deletions.Add(poll1.PollID); // Delete this in the tear down

            Poll poll2 = _service.CreatePoll(1, "Poll to update2", 1, 50, false);
            _deletions.Add(poll2.PollID); // Delete this in the tear down

            poll2.Name = "Poll to update1";
            Poll updatedPoll2 = _service.UpdatePoll(poll2);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeletePoll_InvalidSpeakrsListID()
        {
            _service.DeletePoll(-1);
        }

        [TestMethod]
        public void DeletePoll_Success()
        {
            Poll pollToDelete = _service.CreatePoll(1, String.Format("Poll to delete {0}", DateTime.Now.Ticks), 1, 50, false);
            _service.DeletePoll(pollToDelete.PollID);

            Poll deletedList = null;
            try { deletedList = _service.GetPoll(pollToDelete.PollID); }
            catch (ArgumentException) { }

            Assert.IsNull(deletedList);
        }

        [TestCleanup()]
        public void Cleanup()
        {
            foreach (int i in _deletions)
                _service.DeletePoll(i);
        }
    }
}
