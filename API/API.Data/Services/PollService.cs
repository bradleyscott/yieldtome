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
    [Export(typeof(IPollService))]
    public class PollService : IPollService
    {
        [Import]
        IVoteService _voteService;

        private yieldtome.Objects.Poll CreatePollObject(Poll dbPoll)
        {
            yieldtome.Objects.Poll poll = new yieldtome.Objects.Poll()
            {
                PollID = dbPoll.PollID,
                Name = dbPoll.Name,
                MajorityRequired = dbPoll.MajorityRequired,
                Type = GetType(dbPoll.Type),
                CreatorID = dbPoll.CreatorID,
                Status = GetStatus(dbPoll.Status)
            };

            // Calculate Vote Counts
            List<yieldtome.Objects.Vote> votes = _voteService.GetVotes(poll.PollID);
            poll.VotesFor = votes.Where(x => x.VoteResult == Enums.VoteType.For).Count();
            poll.VotesAgainst = votes.Where(x => x.VoteResult == Enums.VoteType.Against).Count();
            poll.VotesAbstaining = votes.Where(x => x.VoteResult == Enums.VoteType.Abstain).Count();
            poll.IsPassing = IsPollPassing(poll);

            return poll;
        }

        private bool IsPollPassing(yieldtome.Objects.Poll poll)
        {
            bool isPassing = false;

            if (poll.VotesFor == 0) // No one has voted for
                isPassing = false;
            else if (poll.Type == PollType.ForMoreThanAgainst)
                if ((poll.VotesFor / (double)(poll.VotesFor + poll.VotesAgainst)) > (poll.MajorityRequired / 100.00))
                    isPassing = true;
                else // Number of for votes less than majority required
                    isPassing = false;
            else // PollType is ForMoreThanAgainstAndAbstain
                // Tests to see if number of For votes are greater than majority of total votes cast
                if ((poll.VotesFor / (double)(poll.VotesAbstaining + poll.VotesAgainst + poll.VotesFor) > 
                    (poll.MajorityRequired / 100.00)))
                    isPassing = true;

            return isPassing;
        }

        private SpeakersListAndPollStatus GetStatus(string statusString)
        {
            if (statusString.ToLower() == "closed")
                return SpeakersListAndPollStatus.Closed;
            else return SpeakersListAndPollStatus.Open;
        }

        private PollType GetType(string typeString)
        {
            if (typeString.ToLower() == "formorethanagainst")
                return PollType.ForMoreThanAgainst;
            else return PollType.ForMoreThanAgainstAndAbstain;
        }


        public List<yieldtome.Objects.Poll> GetPolls(int eventID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Polls for Event with EventID={0}", eventID));

            List<yieldtome.Objects.Poll> polls;
            using (var db = new Database())
            {
                Event dbEvent = db.Events.FirstOrDefault(x => x.EventID == eventID);

                if (dbEvent == null)
                {
                    string message = String.Format("No Event with EventID={0} exists", eventID);
                    throw new ArgumentException(message, "eventID");
                }

                polls = dbEvent.Polls
                                .Where(x => x.DeletedTime == null)
                                .Select(x => CreatePollObject(x)).ToList();
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved {0} Polls attending Event with EventID={1}", polls.Count, eventID));
            return polls;
        }

        public yieldtome.Objects.Poll GetPoll(int pollID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Poll with PollID={0}", pollID));

            yieldtome.Objects.Poll list;
            using (var db = new Database())
            {
                List<Poll> dbLists = db.Polls.Where(x => x.DeletedTime == null).ToList();
                Poll dbList = dbLists.FirstOrDefault(x => x.PollID == pollID);

                if (dbList == null)
                {
                    Logging.LogWriter.Write(String.Format("No Poll with PollID={0} exists", pollID));
                    return null;
                }

                list = CreatePollObject(dbList);
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Poll with PollID={0}", pollID));
            return list;
        }

        public yieldtome.Objects.Poll CreatePoll(int eventID, string name, int creatorID, int majorityRequired, bool doAbstainsCount)
        {
            Logging.LogWriter.Write("Attempting to create a new Poll");

            if (name == "") throw new ArgumentNullException("Name is required", "name");
            if (majorityRequired > 100 || majorityRequired < 0) throw new ArgumentException("MajorityRequired must be between 0 and 100", "majorityRequired");

            if (GetPolls(eventID).Select(x => x.Name).Contains(name))
                throw new ArgumentException(String.Format("A Poll named {0} already exists", name), "name");

            Poll dbPoll;
            using (var db = new Database())
            {
                Profile profile = db.Profiles.FirstOrDefault(x => x.ProfileID == creatorID);
                if (profile == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", creatorID));

                Event theEvent = db.Events.FirstOrDefault(x => x.EventID == eventID);
                if (theEvent == null) throw new ArgumentException(String.Format("No Event with EventID={0} exists", eventID));
                dbPoll = new Poll()
                {
                    Name = name,
                    Status = "Open",
                    MajorityRequired = majorityRequired,
                    EventID = eventID,
                    CreatorID = creatorID,
                    CreatedTime = DateTime.Now
                };

                if (doAbstainsCount) dbPoll.Type = PollType.ForMoreThanAgainstAndAbstain.ToString();
                else dbPoll.Type = PollType.ForMoreThanAgainst.ToString();

                db.Polls.Add(dbPoll);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Poll with ID {0}", dbPoll.PollID));
            return CreatePollObject(dbPoll);
        }

        public yieldtome.Objects.Poll UpdatePoll(yieldtome.Objects.Poll updatedPoll)
        {
            Logging.LogWriter.Write(String.Format("Attempting to update Poll with PollID={0}", updatedPoll.PollID));

            if (updatedPoll.Name == "") throw new ArgumentNullException("updatedPoll.Name", "Name is required");
            if (updatedPoll.MajorityRequired > 100 || updatedPoll.MajorityRequired < 0) throw new ArgumentException("MajorityRequired must be between 0 and 100", "majorityRequired");

            using (var db = new Database())
            {
                Poll dbPoll = db.Polls.FirstOrDefault(x => x.PollID == updatedPoll.PollID);
                if (dbPoll == null) throw new ArgumentException(String.Format("No Poll with PollID={0} exists", updatedPoll.PollID));

                List<yieldtome.Objects.Poll> otherLists = GetPolls(dbPoll.EventID).Where(x => x.PollID != dbPoll.PollID).ToList();
                if (otherLists.Select(x => x.Name).Contains(updatedPoll.Name))
                    throw new ArgumentException(String.Format("A Poll named {0} already exists", updatedPoll.Name), "name");

                dbPoll.Name = updatedPoll.Name;
                dbPoll.Status = updatedPoll.Status.ToString();
                dbPoll.MajorityRequired = updatedPoll.MajorityRequired;
                dbPoll.Type = updatedPoll.Type.ToString();
                dbPoll.UpdatedTime = DateTime.Now;

                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Updated Poll with PollID={0}", updatedPoll.PollID));
            return updatedPoll;
        }

        public void DeletePoll(int pollID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to delete Poll with PollID={0}", pollID));

            using (var db = new Database())
            {
                Poll dbList = db.Polls.FirstOrDefault(x => x.PollID == pollID);
                if (dbList == null) throw new ArgumentException(String.Format("No Poll with PollID={0} exists", pollID));

                dbList.DeletedTime = DateTime.Now;
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Deleted Poll with ID {0}", pollID));
        }
    }
}
