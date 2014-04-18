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
    public class VoteServiceTests
    {
        IVoteService _service;
        List<int> _deletions = new List<int>();

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<IVoteService>();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void GetVotes_PollNotFound()
        {
            List<Vote> votes = _service.GetVotes(-1);
        }

        [TestMethod]
        public void GetVotes_Success()
        {
            List<Vote> votes = _service.GetVotes(1);
            Assert.IsInstanceOfType(votes, typeof(List<Vote>));
            CollectionAssert.AllItemsAreNotNull(votes);
            CollectionAssert.AllItemsAreUnique(votes);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void GetVote_InvalidPollID()
        {
            Vote vote = _service.GetVote(-1, 1);
        }

        [ExpectedException(typeof(ArgumentException))]
        public void GetVote_InvalidAttendeeID()
        {
            Vote vote = _service.GetVote(1, -1);
        }

        [TestMethod]
        public void GetVote_Success()
        {
            Vote vote = _service.GetVote(1, 1);
            Assert.IsNotNull(vote);
            Assert.IsInstanceOfType(vote, typeof(Vote));
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateVote_InvalidAttendeeID()
        {
            Vote vote = _service.CreateVote(-1, 1, Enums.VoteType.For);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateVote_InvalidPollID()
        {
            Vote vote = _service.CreateVote(1, -1, Enums.VoteType.For);
        }

        [TestMethod]
        public void CreateVote_Success()
        {
            Vote vote = _service.CreateVote(1, 1, Enums.VoteType.Against);

            _deletions.Add(vote.VoteID); // Delete this in the tear down

            Assert.IsInstanceOfType(vote, typeof(Vote));
            Assert.AreEqual(1, vote.Attendee.AttendeeID);
            Assert.AreEqual(Enums.VoteType.Against, vote.VoteResult);
        }

        [ExpectedException(typeof(ArgumentException))]
        public void ClearVote_InvalidVoteID()
        {
            _service.ClearVote(-1);
        }

        [TestMethod]
        public void ClearVote_Success()
        {
            Vote voteToClear = _service.CreateVote(1, 1, Enums.VoteType.For);
            _service.ClearVote(voteToClear.VoteID);

            Vote voteRetrieved = _service.GetVote(1, 1);
            Assert.AreEqual(Enums.VoteType.Abstain, voteRetrieved.VoteResult);
        }

        [ExpectedException(typeof(ArgumentException))]
        public void ClearVotes_InvalidPollID()
        {
            _service.ClearVotes(-1);
        }

        [TestMethod]
        public void ClearVotes_Success()
        {
            _service.CreateVote(1, 1, Enums.VoteType.For);
            _service.ClearVotes(1);

            List<Vote> votes = _service.GetVotes(1);

            foreach (Vote v in votes)
                if (v.VoteResult != Enums.VoteType.Abstain) Assert.Fail();
        }

        [TestCleanup()]
        public void Cleanup()
        {
            foreach (int i in _deletions)
                _service.ClearVote(i);
        }
    }
}
