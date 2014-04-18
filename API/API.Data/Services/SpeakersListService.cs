using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.API.Data.Objects;
using yieldtome.Enums;
using yieldtome.Interfaces;

namespace yieldtome.API.Data.Services
{
    [Export(typeof(ISpeakersListService))]
    public class SpeakersListService : ISpeakersListService
    {
        [Import]
        ISpeakersService _speakersService;

        private yieldtome.Objects.SpeakersList CreateSpeakersListObject(SpeakersList dbList)
        {
            yieldtome.Objects.SpeakersList list = new yieldtome.Objects.SpeakersList()
            {
                SpeakersListID = dbList.SpeakersListID,
                Name = dbList.Name,
                CreatorID = dbList.CreatorID,
                Status = GetStatus(dbList.Status),
            };

            List<yieldtome.Objects.Speaker> speakers = _speakersService.GetSpeakers(dbList.SpeakersListID);
            list.NumberOfSpeakers = speakers.Count;
            if(list.NumberOfSpeakers != 0) list.NextSpeaker = speakers[0];

            return list;
        }

        private SpeakersListAndPollStatus GetStatus(string statusString)
        {
            if (statusString.ToLower() == "closed")
                return SpeakersListAndPollStatus.Closed;
            else return SpeakersListAndPollStatus.Open;
        }

        public List<yieldtome.Objects.SpeakersList> GetSpeakersLists(int eventID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve SpeakersLists for Event with EventID={0}", eventID));

            List<yieldtome.Objects.SpeakersList> lists;
            using (var db = new Database())
            {
                Event dbEvent = db.Events.FirstOrDefault(x => x.EventID == eventID);

                if (dbEvent == null)
                {
                    string message = String.Format("No Event with EventID={0} exists", eventID);
                    throw new ArgumentException(message, "eventID");
                }

                lists = dbEvent.SpeakersLists
                                .Where(x => x.DeletedTime == null)
                                .Select(x => CreateSpeakersListObject(x)).ToList();
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved {0} SpeakersLists attending Event with EventID={1}", lists.Count, eventID));
            return lists;
        }

        public yieldtome.Objects.SpeakersList GetSpeakersList(int speakersListID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Speakers List with SpeakersListID={0}", speakersListID));

            yieldtome.Objects.SpeakersList list;
            using (var db = new Database())
            {
                List<SpeakersList> dbLists = db.SpeakersLists.Where(x => x.DeletedTime == null).ToList();
                SpeakersList dbList = dbLists.FirstOrDefault(x => x.SpeakersListID == speakersListID);

                if (dbList == null)
                {
                    Logging.LogWriter.Write(String.Format("No SpeakersList with SpeakersListID={0} exists", speakersListID));
                    return null;
                }

                list = CreateSpeakersListObject(dbList);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved SpeakersList with SpeakersListID={0}", speakersListID));
            return list;
        }

        public yieldtome.Objects.SpeakersList CreateSpeakersList(int eventID, string name, int creatorID)
        {
            Logging.LogWriter.Write("Attempting to create a new Speakers List");

            if (name == "") throw new ArgumentNullException("Name is required", "name");
            if (GetSpeakersLists(eventID).Select(x => x.Name).Contains(name)) 
                throw new ArgumentException(String.Format("A SpeakersList named {0} already exists", name), "name");

            SpeakersList dbList;
            using (var db = new Database())
            {
                Profile profile = db.Profiles.FirstOrDefault(x => x.ProfileID == creatorID);
                    if (profile == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", creatorID));

                Event theEvent = db.Events.FirstOrDefault(x => x.EventID == eventID);
                if (theEvent == null) throw new ArgumentException(String.Format("No Event with EventID={0} exists", eventID));
                dbList = new SpeakersList()
                {
                    Name = name,
                    Status = "Open",
                    EventID = eventID,
                    CreatorID = creatorID,
                    CreatedTime = DateTime.Now
                };

                db.SpeakersLists.Add(dbList);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Speakers List with ID {0}", dbList.SpeakersListID));
            return CreateSpeakersListObject(dbList);
        }

        public yieldtome.Objects.SpeakersList UpdateSpeakersList(yieldtome.Objects.SpeakersList updatedSpeakersList)
        {
            Logging.LogWriter.Write(String.Format("Attempting to update SpeakersList with SpeakersListID={0}", updatedSpeakersList.SpeakersListID));

            if (updatedSpeakersList.Name == "") throw new ArgumentNullException("updatedSpeakersList.Name", "Name is required");

            using (var db = new Database())
            {
                SpeakersList dbSpeakersList = db.SpeakersLists.FirstOrDefault(x => x.SpeakersListID == updatedSpeakersList.SpeakersListID);
                if (dbSpeakersList == null) throw new ArgumentException(String.Format("No Speakers List with SpeakersListID={0} exists", updatedSpeakersList.SpeakersListID));

                List<yieldtome.Objects.SpeakersList> otherLists = GetSpeakersLists(dbSpeakersList.EventID).Where(x => x.SpeakersListID != dbSpeakersList.SpeakersListID).ToList();
                if(otherLists.Select(x => x.Name).Contains(updatedSpeakersList.Name))
                    throw new ArgumentException(String.Format("A SpeakersList named {0} already exists", updatedSpeakersList.Name), "name");

                dbSpeakersList.Name = updatedSpeakersList.Name;
                dbSpeakersList.Status = updatedSpeakersList.Status.ToString();
                dbSpeakersList.UpdatedTime = DateTime.Now;

                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Updated Speakers List with SpeakersListID={0}", updatedSpeakersList.SpeakersListID));
            return updatedSpeakersList;
        }

        public void DeleteSpeakersList(int speakersListID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to delete Speakers List with SpeakersListID={0}", speakersListID));

            using (var db = new Database())
            {
                SpeakersList dbList = db.SpeakersLists.FirstOrDefault(x => x.SpeakersListID == speakersListID);
                if (dbList == null) throw new ArgumentException(String.Format("No Speakers List with SpeakersListID={0} exists", speakersListID));

                dbList.DeletedTime = DateTime.Now;
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Deleted Speakers List with ID {0}", speakersListID));
        }
    }
}
