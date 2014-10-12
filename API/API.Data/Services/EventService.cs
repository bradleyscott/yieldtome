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
    [Export(typeof(IEventService))]
    public class EventService : IEventService
    {
        private yieldtome.Objects.Event CreateEventObject(Event dbEvent)
        {
            yieldtome.Objects.Event theEvent = new yieldtome.Objects.Event()
            {
                EventID = dbEvent.EventID,
                Name = dbEvent.Name,
                StartDate = dbEvent.StartDate,
                EndDate = dbEvent.EndDate,
                Description = dbEvent.Description,
                CreatorID = dbEvent.Creator.ProfileID
            };
            if(dbEvent.Hashtag != null) theEvent.Hashtag = dbEvent.Hashtag.Replace("#", "").ToLower(); // Strip out the # char
            return theEvent;
        }

        public List<yieldtome.Objects.Event> GetEvents()
        {
            Logging.LogWriter.Write("Attempting to retrieve Events");

            List<yieldtome.Objects.Event> events;
            using (var db = new Database())
            {
                DateTime earliestDate = DateTime.Now.AddDays(-2);
                List<Event> dbEvents = db.Events.Where(x => x.DeletedTime == null && (x.EndDate.CompareTo(earliestDate) > 0)).ToList(); // Filters out deleted and Events that ended more than 2 days ago
                events = dbEvents.Select(x => CreateEventObject(x)).ToList();
            }

            events = events.OrderBy(x => x.StartDate).ToList();
            Logging.LogWriter.Write(String.Format("Retrieved {0} Events", events.Count));
            return events;
        }

        public yieldtome.Objects.Event GetEvent(int eventID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Event with EventID={0}", eventID));

            yieldtome.Objects.Event thisEvent;
            using (var db = new Database())
            {
                List<Event> dbEvents = db.Events.Where(x => x.DeletedTime == null).ToList();
                Event dbEvent = dbEvents.FirstOrDefault(x => x.EventID == eventID); 
                
                if (dbEvent == null)
                {
                    Logging.LogWriter.Write(String.Format("No Event with EventID={0} exists", eventID));
                    return null;
                }

                thisEvent = CreateEventObject(dbEvent);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Event with EventID={0}", eventID));
            return thisEvent;
        }

        public yieldtome.Objects.Event CreateEvent(string name, DateTime startDate, DateTime endDate, int creatorID, string description = null, string hashtag = null)
        {
            Logging.LogWriter.Write("Attempting to create a new Event");

            if (name == "") throw new ArgumentNullException("name", "Name is required");
            else if (startDate.CompareTo(DateTime.MinValue) == 0) throw new ArgumentNullException("startDate", "StartDate is required");
            else if (startDate.CompareTo(endDate) > 0) throw new ArgumentException("StartDate must be before EndDate", "startDate");

            Event newEvent;
            using (var db = new Database())
            {
                Profile creator = db.Profiles.FirstOrDefault(x => x.ProfileID == creatorID);
                if (creator == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", creatorID), "profileID");

                newEvent = new Event()
                {
                    Name = name,
                    StartDate = startDate,
                    EndDate = endDate,
                    Creator = creator,
                    Description = description,
                    CreatedTime = DateTime.Now
                };
                if (hashtag != null) newEvent.Hashtag = hashtag.Replace("#", "").ToLower();

                if (IsEventDuplicate(newEvent) == true)
                {
                    string message = "An Event with this Name, StartDate and EndDate already exists";
                    Logging.LogWriter.Write(message);
                    throw new ArgumentException(message);
                }
                if (IsHashTagDuplicate(newEvent) == true)
                {
                    string message = String.Format("The Event Hashtag '{0}' is already in use", newEvent.Hashtag);
                    Logging.LogWriter.Write(message);
                    throw new ArgumentException(message);
                }

                db.Events.Add(newEvent);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Event with ID {0}", newEvent.EventID));
            return CreateEventObject(newEvent);
        }

        public bool IsHashTagDuplicate(Event theEvent)
        {
            Logging.LogWriter.Write(String.Format("Checking if Hashtag {0} is duplicate", theEvent.Hashtag));

            List<Event> matchingEvents = new List<Event>();

            using (var db = new Database())
            {
                matchingEvents = db.Events.ToList();

                if (theEvent.EventID != 0)
                    matchingEvents = db.Events.Where(x => x.EventID != theEvent.EventID).ToList(); // Filter out this Event
                matchingEvents = matchingEvents.Where(x => x.DeletedTime == null && x.EndDate.CompareTo(DateTime.Now) > 0).ToList(); // Get Events that haven't finished
                matchingEvents = matchingEvents.Where(x => x.Hashtag != null && x.Hashtag != "" && x.Hashtag == theEvent.Hashtag).ToList(); // Events that haven't finished with this Hashtag
            }

            if (matchingEvents == null || matchingEvents.Count == 0)
            {
                Logging.LogWriter.Write(String.Format("Hashtag '{0}' is NOT a duplicate", theEvent.Hashtag));
                return false;
            }
            else
            {
                Logging.LogWriter.Write(String.Format("Hashtag '{0}' is a duplicate", theEvent.Hashtag));
                return true;
            }
        }

        public bool IsEventDuplicate(Event theEvent)
        {
            Logging.LogWriter.Write("Checking if Event is duplicate");

            List<Event> matchingEvents = new List<Event>();

            using (var db = new Database())
            {
                matchingEvents = db.Events.Where(x => x.DeletedTime == null).ToList(); // Remove deleted Events

                if (theEvent.EventID != 0)
                    matchingEvents = db.Events.Where(x => x.EventID != theEvent.EventID).ToList(); // Filter out this Event

                matchingEvents = matchingEvents.Where(x => x.Name == theEvent.Name && x.StartDate.Date == theEvent.StartDate.Date &&
                                                        x.EndDate.Date == theEvent.EndDate.Date).ToList();
            }

            if (matchingEvents == null || matchingEvents.Count == 0)
            {
                Logging.LogWriter.Write("Event is not duplicate");
                return false;
            }
            else
            {
                Logging.LogWriter.Write("Event is duplicate");
                return true;
            }
        }

        public yieldtome.Objects.Event UpdateEvent(yieldtome.Objects.Event updatedEvent)
        {
            Logging.LogWriter.Write(String.Format("Attempting to update Event with EventID={0}", updatedEvent.EventID));

            if (updatedEvent.Name == "") throw new ArgumentNullException("Name is required");
            else if (updatedEvent.StartDate.CompareTo(DateTime.MinValue) == 0) throw new ArgumentNullException("StartDate is required");
            else if (updatedEvent.StartDate.CompareTo(updatedEvent.EndDate) > 0) throw new ArgumentException("StartDate must be before EndDate");

            using (var db = new Database())
            {
                Event dbEvent = db.Events.FirstOrDefault(x => x.EventID == updatedEvent.EventID);
                if (dbEvent == null) throw new ArgumentException(String.Format("No Event with EventID={0} exists", updatedEvent.EventID));

                dbEvent.Name = updatedEvent.Name;
                dbEvent.StartDate = updatedEvent.StartDate;
                dbEvent.EndDate = updatedEvent.EndDate;
                dbEvent.Description = updatedEvent.Description;
                if(updatedEvent.Hashtag != null) dbEvent.Hashtag = updatedEvent.Hashtag.Replace("#", "").ToLower();
                dbEvent.UpdatedTime = DateTime.Now;

                if (IsEventDuplicate(dbEvent) == true)
                {
                    string message = "An Event with this Name, StartDate and EndDate already exists";
                    Logging.LogWriter.Write(message);
                    throw new ArgumentException(message);
                }
                if(IsHashTagDuplicate(dbEvent) == true)
                {
                    string message = String.Format("The Event Hashtag '{0}' is already in use", dbEvent.Hashtag);
                    Logging.LogWriter.Write(message);
                    throw new ArgumentException(message);
                }

                db.SaveChanges();
                updatedEvent = CreateEventObject(dbEvent);
            }

            Logging.LogWriter.Write(String.Format("Updated Event with ID {0}", updatedEvent.EventID));
            return updatedEvent;
        }

        public void DeleteEvent(int eventID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to delete Event with EventID={0}", eventID));

            using (var db = new Database())
            {
                Event dbEvent = db.Events.FirstOrDefault(x => x.EventID == eventID);
                if (dbEvent == null) throw new ArgumentException(String.Format("No Event with EventID={0} exists", eventID));

                dbEvent.DeletedTime = DateTime.Now;
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Deleted Event with ID {0}", eventID));
        }
    }
}
