using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.API.Data.Objects;
using yieldtome.Enums;

namespace yieldtome.API.Data.Services
{
    [Export(typeof(ISpeakersService))]
    public class SpeakersService : ISpeakersService
    {
        [Import]
        IAttendeeService _attendeeService;

        private yieldtome.Objects.Speaker CreateSpeakerObject(Speaker dbSpeaker)
        {
            yieldtome.Objects.Speaker speaker = new yieldtome.Objects.Speaker()
            {
                SpeakerID = dbSpeaker.SpeakerID,
                Position = GetPosition(dbSpeaker.Position),
                Attendee = _attendeeService.GetAttendee(dbSpeaker.AttendeeID),
            };

            return speaker;
        }

        private SpeakerPosition GetPosition(string positionString)
        {
            if (positionString.ToLower() == "for")
                return SpeakerPosition.For;
            else if (positionString.ToLower() == "against")
                return SpeakerPosition.Against;
            else return SpeakerPosition.None;
        }

        public List<yieldtome.Objects.Speaker> GetSpeakers(int speakersListID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Speakers for Speakers List with SpeakersListID={0}", speakersListID));

            List<yieldtome.Objects.Speaker> speakers;
            using (var db = new Database())
            {
                SpeakersList dbList = db.SpeakersLists.FirstOrDefault(x => x.SpeakersListID == speakersListID);

                if (dbList == null)
                {
                    string message = String.Format("No Speakers List with SpeakersListID={0} exists", speakersListID);
                    throw new ArgumentException(message, "speakersListID");
                }

                speakers = dbList.Speakers
                                .Where(x => x.DeletedTime == null && x.SpokenTime == null)
                                .OrderBy(x => x.Rank)
                                .Select(x => CreateSpeakerObject(x))
                                .ToList();
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved {0} Speakers on Speakers List with SpeakersListID={1}", speakers.Count, speakersListID));
            return speakers;
        }

        public yieldtome.Objects.Speaker GetSpeaker(int speakerID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Speaker with SpeakerID={0}", speakerID));

            yieldtome.Objects.Speaker speaker;
            using (var db = new Database())
            {
                Speaker dbSpeaker = db.Speakers.Where(x => x.DeletedTime == null && x.SpokenTime == null).FirstOrDefault(x => x.SpeakerID == speakerID);

                if (dbSpeaker == null)
                {
                    Logging.LogWriter.Write(String.Format("No Speaker with SpeakerID={0} exists", speakerID));
                    return null;
                }

                speaker = CreateSpeakerObject(dbSpeaker);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Speaker with SpeakerID={0}", speakerID));
            return speaker;
        }

        public yieldtome.Objects.Speaker AddSpeaker(int speakersListID, int attendeeID, Enums.SpeakerPosition position)
        {
            Logging.LogWriter.Write(String.Format("Attempting to add Attendee with AttendeeID={0} to Speakers List with SpeakersListID={1} speaking {2}", attendeeID, speakersListID, position.ToString()));

            Speaker dbSpeaker;
            using (var db = new Database())
            {
                SpeakersList dbList = db.SpeakersLists.FirstOrDefault(x => x.SpeakersListID == speakersListID);
                if (dbList == null) throw new ArgumentException(String.Format("No SpeakersList with SpeakersListID={0} exists", speakersListID));

                int highestRank = 0;
                List<Speaker> activeSpeakers = dbList.Speakers.Where(x => x.DeletedTime == null & x.SpokenTime == null).ToList();
                if(activeSpeakers.Count != 0) highestRank = activeSpeakers.Max(x => x.Rank);

                yieldtome.Objects.Attendee attendee = _attendeeService.GetAttendee(attendeeID);
                if (attendee == null) throw new ArgumentException(String.Format("No Attendee with AttendeeID={0} exists", attendeeID), "attendeeID");

                dbSpeaker = new Speaker()
                {
                    SpeakersListID = speakersListID,
                    AttendeeID = attendee.AttendeeID,
                    Position = position.ToString(),
                    Rank = highestRank + 1,
                    CreatedTime = DateTime.Now,
                };

                db.Speakers.Add(dbSpeaker);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Speaker with SpeakerID={0}", dbSpeaker.SpeakerID));
            return CreateSpeakerObject(dbSpeaker);
        }

        public List<yieldtome.Objects.Speaker> RemoveSpeaker(int speakerID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to remove Speaker with SpeakerID={0}", speakerID));

            List<yieldtome.Objects.Speaker> list;
            using (var db = new Database())
            {
                Speaker dbSpeaker = db.Speakers.FirstOrDefault(x => x.SpeakerID == speakerID);
                if (dbSpeaker == null) throw new ArgumentException(String.Format("No Speaker with SpeakerID={0} exists", speakerID));

                dbSpeaker.DeletedTime = DateTime.Now;
                db.SaveChanges();

                list = GetSpeakers(dbSpeaker.SpeakersListID);
            }

            Logging.LogWriter.Write(String.Format("Removed Speaker with SpeakerID={0}", speakerID));
            return list;
        }

        public List<yieldtome.Objects.Speaker> ReorderSpeakers(int speakersListID, List<yieldtome.Objects.Speaker> speakers)
        {
            Logging.LogWriter.Write("Attempting to reorder Speakers");
            if (speakers == null || speakers.Count == 0) throw new ArgumentNullException("No Speakers to re-order");

            using (var db = new Database())
            {
                int rank = 1;
                foreach (yieldtome.Objects.Speaker s in speakers)
                {
                    Speaker dbSpeaker = db.Speakers.FirstOrDefault(x => x.SpeakerID == s.SpeakerID);
                    if (dbSpeaker == null) throw new ArgumentException(String.Format("No Speaker with SpeakerID={0} exists", s.SpeakerID));
                    if (dbSpeaker.SpeakersListID != speakersListID) throw new ArgumentException(String.Format("Speaker with SpeakerID={0} does not exist in Speakers List with SpeakersListID={1}", s.SpeakerID, speakersListID));
                    
                    dbSpeaker.Rank = rank;
                    dbSpeaker.UpdatedTime = DateTime.Now;

                    rank++;
                }
                db.SaveChanges();
            }

            Logging.LogWriter.Write("Speakers list successfully reordered");
            return GetSpeakers(speakersListID);
        }

        public List<yieldtome.Objects.Speaker> SpeakerHasSpoken(int speakerID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to mark Speaker with SpeakerID={0} as having spoken", speakerID));

            List<yieldtome.Objects.Speaker> list;
            using (var db = new Database())
            {
                Speaker dbSpeaker = db.Speakers.FirstOrDefault(x => x.SpeakerID == speakerID);
                if (dbSpeaker == null) throw new ArgumentException(String.Format("No Speaker with SpeakerID={0} exists", speakerID));

                dbSpeaker.SpokenTime = DateTime.Now;
                db.SaveChanges();

                list = GetSpeakers(dbSpeaker.SpeakersListID);
            }

            Logging.LogWriter.Write(String.Format("Marked Speaker with SpeakerID={0} as having spoken", speakerID));
            return list;
        }

        public List<yieldtome.Objects.Speaker> ClearSpeakers(int speakersListID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to remove all Speakers from Speaking List with SpeakersListID={0}", speakersListID));

            List<yieldtome.Objects.Speaker> speakers = GetSpeakers(speakersListID);

            foreach (yieldtome.Objects.Speaker s in speakers)
                RemoveSpeaker(s.SpeakerID);

            Logging.LogWriter.Write(String.Format("Removed all Speakers from Speaking List with SpeakersListID={0}", speakersListID));
            return GetSpeakers(speakersListID);
        }
    }
}
