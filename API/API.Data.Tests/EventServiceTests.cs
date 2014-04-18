using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using yieldtome.Objects;
using yieldtome.Interfaces;
using System.Collections.Generic;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class EventServiceTests
    {
        IEventService _service;
        List<int> _deletions = new List<int>();

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<IEventService>();
        }

        [TestMethod]
        public void GetEvents_Success()
        {
            List<Event> events = _service.GetEvents();
            Assert.IsInstanceOfType(events, typeof(List<Event>));
            CollectionAssert.AllItemsAreNotNull(events);
            CollectionAssert.AllItemsAreUnique(events);
        }

        [TestMethod]
        public void GetEvent_EventNotFound()
        {
            Event theEvent = _service.GetEvent(-1);
            Assert.IsNull(theEvent);
        }

        [TestMethod]
        public void GetEvent_Success()
        {
            Event theEvent = _service.GetEvent(1);
            Assert.IsNotNull(theEvent);
            Assert.IsInstanceOfType(theEvent, typeof(Event));
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreateEvent_MissingName()
        {
            Event newEvent = _service.CreateEvent("", DateTime.Now, DateTime.Now.AddDays(1), 1, "");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreateEvent_MissingStartDate()
        {
            Event newEvent = _service.CreateEvent("New Event", DateTime.MinValue, DateTime.Now.AddDays(-1), 1, "");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateEvent_EndDateBeforeStartDate()
        {
            Event newEvent = _service.CreateEvent("New Event", DateTime.Now, DateTime.Now.AddDays(-1), 1, "");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateEvent_InvalidCreatorID()
        {
            Event newEvent = _service.CreateEvent("New Event", DateTime.Now, DateTime.Now.AddDays(1), -1, "");
        }

        [TestMethod]
        public void CreateEvent_Success()
        {
            string name = String.Format("New Event {0}", DateTime.Now.Ticks);

            Event newEvent = _service.CreateEvent(name, DateTime.Now, DateTime.Now.AddDays(1), 1, "Description");
            Assert.IsInstanceOfType(newEvent, typeof(Event));
            Assert.AreEqual(name, newEvent.Name);
            Assert.AreEqual(DateTime.Now.Date, newEvent.StartDate.Date);
            Assert.AreEqual(DateTime.Now.Date.AddDays(1), newEvent.EndDate.Date);
            Assert.IsNotNull(newEvent.Description);

            _deletions.Add(newEvent.EventID); // Delete this event in the tear down
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateEvent_DuplicateEvent()
        {
            Event newEvent = _service.CreateEvent("Duplicate Event", DateTime.Now, DateTime.Now.AddDays(1), 1, "");
            _deletions.Add(newEvent.EventID);

            newEvent = _service.CreateEvent("Duplicate Event", DateTime.Now, DateTime.Now.AddDays(1), 1, "");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateEvent_DuplicateHashtag()
        {
            Event newEvent = _service.CreateEvent("Hopefully unique Event", DateTime.Now, DateTime.Now.AddDays(1), 1, "", "hopefullyunique");
            _deletions.Add(newEvent.EventID);

            newEvent = _service.CreateEvent("Another hopefully unique Event", DateTime.Now, DateTime.Now.AddDays(1), 1, "", "hopefullyunique");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateEvent_InvalidEventID()
        {
            Event eventToUpdate = new Event
            {
                EventID = -1,
                Name = "Event 1",
                Description = "Description",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                CreatorID = 1
            };
            _service.UpdateEvent(eventToUpdate);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void UpdateEvent_MissingName()
        {
            Event eventToUpdate = new Event
            {
                EventID = 1,
                Name = "",
                Description = "Description",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                CreatorID = 1
            };
            _service.UpdateEvent(eventToUpdate);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void UpdateEvent_InvalidStartDate()
        {
            Event eventToUpdate = new Event
            {
                EventID = 1,
                Name = "Event 1",
                Description = "Description",
                StartDate = DateTime.MinValue,
                EndDate = DateTime.Now.AddDays(1),
                CreatorID = 1
            };

            _service.UpdateEvent(eventToUpdate);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateEvent_EndDateBeforeStartDate()
        {
            Event eventToUpdate = new Event
            {
                EventID = 1,
                Name = "Event 1",
                Description = "Description",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(-1),
                CreatorID = 1
            };

            _service.UpdateEvent(eventToUpdate);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateEvent_DuplicateEvent()
        {
            Event newEvent = _service.CreateEvent("Duplicate Updated Event", DateTime.Now, DateTime.Now.AddDays(1), 1, "");
            _deletions.Add(newEvent.EventID);

            Event eventToUpdate = new Event
            {
                EventID = 1,
                Name = "Duplicate Updated Event",
                Description = "",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                CreatorID = 1
            };
            eventToUpdate = _service.UpdateEvent(eventToUpdate);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateEvent_DuplicateHashtag()
        {
            Event newEvent = _service.CreateEvent("New Event with Hashtag", DateTime.Now, DateTime.Now.AddDays(1), 1, "", "withhashtag");
            _deletions.Add(newEvent.EventID);

            Event eventToUpdate = new Event
            {
                EventID = 1,
                Name = "Updated Event with Hashtag",
                Description = "",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                Hashtag = "withhashtag",
                CreatorID = 1
            };
            eventToUpdate = _service.UpdateEvent(eventToUpdate);
        }

        [TestMethod]
        public void UpdateEvent_Success()
        {
            Event eventToUpdate = new Event
            {
                EventID = 1,
                Name = "Event 1",
                Description = "Description",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                CreatorID = 1
            };

            Event updatedEvent = _service.UpdateEvent(eventToUpdate);
            Assert.IsInstanceOfType(updatedEvent, typeof(Event));
            Assert.AreEqual(1, updatedEvent.EventID);
            Assert.AreEqual("Event 1", updatedEvent.Name);
            Assert.AreEqual("Description", updatedEvent.Description);
            Assert.AreEqual(DateTime.Now.Date, updatedEvent.StartDate.Date);
            Assert.AreEqual(DateTime.Now.Date.AddDays(1), updatedEvent.EndDate.Date);
            Assert.AreEqual(1, updatedEvent.CreatorID);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteEvent_InvalidEventID()
        {
            _service.DeleteEvent(-1);
        }

        [TestMethod]
        public void DeleteEvent_Success()
        {
            Event eventToDelete = _service.CreateEvent(String.Format("Event to delete {0}", DateTime.Now.Ticks), DateTime.Now, DateTime.Now.AddDays(1), 1, "Description");
            _service.DeleteEvent(eventToDelete.EventID);

            Event deletedEvent = null;
            try { deletedEvent = _service.GetEvent(eventToDelete.EventID); }
            catch (ArgumentException) { }

            Assert.IsNull(deletedEvent);
        }

        [TestCleanup()]
        public void Cleanup()
        {
            foreach (int i in _deletions)
                _service.DeleteEvent(i);
        }
    }
}
