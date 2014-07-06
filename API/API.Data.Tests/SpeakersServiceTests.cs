using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using yieldtome.Interfaces;
using yieldtome.Objects;
using System.Collections.Generic;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class SpeakersServiceTests
    {
        ISpeakersService _service;

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<ISpeakersService>();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void GetSpeakers_SpeakersListNotFound()
        {
            List<Speaker> speakers = _service.GetSpeakers(-1);
        }

        [TestMethod]
        public void GetSpeakers_Success()
        {
            List<Speaker> speakers = _service.GetSpeakers(1);
            Assert.IsInstanceOfType(speakers, typeof(List<Speaker>));
            CollectionAssert.AllItemsAreNotNull(speakers);
            CollectionAssert.AllItemsAreUnique(speakers);
        }

        [TestMethod]
        public void GetSpeaker_SpeakerNotFound()
        {
            Speaker speaker = _service.GetSpeaker(-1);
            Assert.IsNull(speaker);
        }

        [TestMethod]
        public void GetSpeaker_Success()
        {
            Speaker speaker = _service.GetSpeaker(1);
            Assert.IsNotNull(speaker);
            Assert.IsInstanceOfType(speaker, typeof(Speaker));
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void AddSpeaker_InvalidSpeakersList()
        {
            Speaker newSpeaker = _service.AddSpeaker(-1, 1, Enums.SpeakerPosition.For);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void AddSpeaker_InvalidAttendee()
        {
            Speaker newSpeaker = _service.AddSpeaker(1, -1, Enums.SpeakerPosition.For);
        }

        [TestMethod]
        public void AddSpeaker_Success()
        {
            Speaker newSpeaker = _service.AddSpeaker(2, 1, Enums.SpeakerPosition.For);

            Assert.IsInstanceOfType(newSpeaker, typeof(Speaker));
            Assert.AreEqual(1, newSpeaker.Attendee.AttendeeID);
            Assert.AreEqual(Enums.SpeakerPosition.For, newSpeaker.Position);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void RemoveSpeaker_SpeakerNotFound()
        {
            List<Speaker> list = _service.RemoveSpeaker(-1);
        }

        [TestMethod]
        public void RemoveSpeaker_Success()
        {
            Speaker speakerToDelete = _service.AddSpeaker(1, 1, Enums.SpeakerPosition.For);
            int numberOfSpeakers = _service.GetSpeakers(1).Count;

            _service.RemoveSpeaker(speakerToDelete.SpeakerID);

            Speaker deletedSpeaker = null;
            try { deletedSpeaker = _service.GetSpeaker(speakerToDelete.SpeakerID); }
            catch (ArgumentException) { }

            Assert.IsNull(deletedSpeaker);
            Assert.AreEqual(numberOfSpeakers - 1, _service.GetSpeakers(1).Count);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void ReorderSpeakers_InvalidSpeakersList()
        {
            List<Speaker> speakers = _service.GetSpeakers(1);
            _service.ReorderSpeakers(-1, speakers);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void ReorderSpeakers_NoSpeakers()
        {
            _service.ReorderSpeakers(1, null);
        }

        [TestMethod]
        public void ReorderSpeakers_NoChanges()
        {
            List<Speaker> oldSpeakers = _service.GetSpeakers(1);
            List<Speaker> newSpeakers = _service.ReorderSpeakers(1, oldSpeakers);

            Assert.AreEqual(oldSpeakers.Count, newSpeakers.Count);
            for (int i = 0; i < oldSpeakers.Count; i++)
                Assert.AreEqual(oldSpeakers[i].SpeakerID, newSpeakers[i].SpeakerID);
        }

        [TestMethod]
        public void ReorderSpeakers_Success()
        {
            List<Speaker> oldSpeakers = _service.GetSpeakers(1);

            List<Speaker> reorderedSpeakers = new List<Speaker>();
            for (int i = oldSpeakers.Count - 1; i >= 0; i--)
                reorderedSpeakers.Add(oldSpeakers[i]);

            List<Speaker> updatedSpeakers = _service.ReorderSpeakers(1, reorderedSpeakers);
            
            Assert.AreEqual(oldSpeakers.Count, updatedSpeakers.Count);
            for (int i = 0; i < oldSpeakers.Count; i++)
                Assert.AreEqual(oldSpeakers[i].SpeakerID, updatedSpeakers[oldSpeakers.Count - 1 - i].SpeakerID);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void SpeakerHasSpoken_InvalidSpeaker()
        {
            List<Speaker> list = _service.SpeakerHasSpoken(-1);
        }

        [TestMethod]
        public void SpeakerHasSpoken_Success()
        {
            Speaker newSpeaker = _service.AddSpeaker(2, 1, Enums.SpeakerPosition.For);
            int numberOfSpeakers = _service.GetSpeakers(2).Count;
            
            List<Speaker> newList = _service.SpeakerHasSpoken(newSpeaker.SpeakerID);

            Speaker spokenSpeaker = null;
            try { spokenSpeaker = _service.GetSpeaker(newSpeaker.SpeakerID); }
            catch (ArgumentException) { }

            Assert.IsNull(spokenSpeaker);
            Assert.AreEqual(numberOfSpeakers - 1, newList.Count);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void ClearSpeakers_InvalidSpeakersList()
        {
            List<Speaker> list = _service.SpeakerHasSpoken(-1);
        }

        [TestMethod]
        public void ClearSpeakers_Success()
        {
            List<Speaker> list = _service.ClearSpeakers(2);
            Assert.AreEqual(0, list.Count);
        }

    }
}
