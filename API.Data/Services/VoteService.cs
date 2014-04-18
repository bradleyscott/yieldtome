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
    [Export(typeof(IVoteService))]
    public class VoteService : IVoteService
    {
        [Import]
        IAttendeeService _attendeeService;

        private yieldtome.Objects.Vote CreateVoteObject(Vote dbVote)
        {
            yieldtome.Objects.Vote vote = new yieldtome.Objects.Vote()
            {
                VoteID = dbVote.VoteID,
                Attendee = _attendeeService.GetAttendee(dbVote.AttendeeID),
                VoteResult = GetVoteResult(dbVote.VoteResult)
            };

            return vote;
        }

        private VoteType GetVoteResult(string voteString)
        {
            if (voteString.ToLower() == "for")
                return VoteType.For;
            else if (voteString.ToLower() == "against")
                return VoteType.Against;
            else return VoteType.Abstain;
        }

        public List<yieldtome.Objects.Vote> GetVotes(int pollID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Votes for Poll with PollID={0}", pollID));

            List<yieldtome.Objects.Vote> votes = new List<yieldtome.Objects.Vote>();
            using (var db = new Database())
            {
                Poll dbPoll = db.Polls.FirstOrDefault(x => x.PollID == pollID);

                if (dbPoll == null)
                {
                    string message = String.Format("No Poll with PollID={0} exists", pollID);
                    throw new ArgumentException(message, "pollID");
                }

                // Get all the Attendees attending this Event
                List<yieldtome.Objects.Attendee> attendees = _attendeeService.GetAttendees(dbPoll.EventID);

                // Get all the Votes cast on this Poll
                List<Vote> dbVotes = db.Votes
                                .Where(x => x.DeletedTime == null && x.PollID == pollID).ToList();

                // For each Attendee, retrieve their vote if any and add it to the votes list
                foreach(yieldtome.Objects.Attendee a in attendees)
                {
                    Vote dbVote = dbVotes.FirstOrDefault(x => x.AttendeeID == a.AttendeeID);
                    if (dbVote == null)
                        votes.Add(new yieldtome.Objects.Vote { Attendee = a, VoteResult = VoteType.Abstain });
                    else votes.Add(CreateVoteObject(dbVote));
                }
            }

            Logging.LogWriter.Write(String.Format("Successfully retrieved Votes cast on Poll with PollID={0}", pollID));
            return votes;
        }

        public yieldtome.Objects.Vote GetVote(int pollID, int attendeeID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to retrieve Vote that AttendeeID={0} cast on Poll with PollID={1}", attendeeID, pollID));

            yieldtome.Objects.Vote vote = GetVotes(pollID).FirstOrDefault(x => x.Attendee.AttendeeID == attendeeID);
            if(vote == null)
            {
                Logging.LogWriter.Write(String.Format("No Vote for Attendee with AttendeeID={0} exists", attendeeID));
                return null;
            }

            Logging.LogWriter.Write(String.Format("Successfully retrived Vote that AttendeeID={0} cast on Poll with PollID={1}", attendeeID, pollID));
            return vote;
        }

        public yieldtome.Objects.Vote CreateVote(int attendeeID, int pollID, Enums.VoteType voteResult)
        {
            Logging.LogWriter.Write(String.Format("Attempting to cast vote for Attendee with AttendeeID={0} on Poll with PollID={1}", attendeeID, pollID));

            yieldtome.Objects.Attendee attendee = _attendeeService.GetAttendee(attendeeID); // Check existence of Attendee
            if (attendee == null) throw new ArgumentException(String.Format("No Attendee with AttendeeID={0} exists", attendeeID), "attendeeID");

            Vote dbVote;
            using (var db = new Database())
            {
                // Check existence of Poll
                Poll dbPoll = db.Polls.FirstOrDefault(x => x.PollID == pollID);
                if (dbPoll == null)
                {
                    string message = String.Format("No Poll with PollID={0} exists", pollID);
                    throw new ArgumentException(message, "pollID");
                }

                // Delete old votes
                List<Vote> dbVotes = db.Votes.Where(x => x.AttendeeID == attendeeID 
                                                    && x.PollID == pollID
                                                    && x.DeletedTime == null).ToList();
                foreach(Vote v in dbVotes)
                    v.DeletedTime = DateTime.Now;

                // Create new Vote
                dbVote = new Vote()
                {
                    AttendeeID = attendeeID,
                    PollID = pollID,
                    VoteResult = voteResult.ToString(),
                    CreatedTime = DateTime.Now
                };

                db.Votes.Add(dbVote);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Vote with ID {0}", dbVote.VoteID));
            return CreateVoteObject(dbVote);
        }

        public List<yieldtome.Objects.Vote> ClearVote(int voteID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to delete Vote with VoteID={0}", voteID));

            int pollID;
            using (var db = new Database())
            {
                Vote dbVote = db.Votes.FirstOrDefault(x => x.VoteID == voteID);
                if (dbVote == null) throw new ArgumentException(String.Format("No Vote with VoteID={0} exists", voteID));

                dbVote.DeletedTime = DateTime.Now;
                db.SaveChanges();

                pollID = dbVote.PollID;
            }

            Logging.LogWriter.Write(String.Format("Deleted Vote with ID {0}", voteID));
            return GetVotes(pollID);
        }

        public List<yieldtome.Objects.Vote> ClearVotes(int pollID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to remove all Votes from Poll with PollID={0}", pollID));

            using (var db = new Database())
            {

                // Check existence of Poll
                Poll dbPoll = db.Polls.FirstOrDefault(x => x.PollID == pollID);
                if (dbPoll == null)
                {
                    string message = String.Format("No Poll with PollID={0} exists", pollID);
                    throw new ArgumentException(message, "pollID");
                }

                foreach (Vote v in dbPoll.Votes.Where(x => x.PollID == pollID && x.DeletedTime == null))
                    v.DeletedTime = DateTime.Now;
                db.SaveChanges();
            }
            Logging.LogWriter.Write(String.Format("Removed all Votes from Poll with PollID={0}", pollID));
            return GetVotes(pollID);
        }
    }
}
