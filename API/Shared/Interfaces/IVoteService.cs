using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;
using yieldtome.Enums;

namespace yieldtome.Interfaces
{
    public interface IVoteService
    {
        List<Vote> GetVotes(int pollID);
        Vote GetVote(int pollID, int attendeeID);
        Vote CreateVote(int attendeeID, int pollID, VoteType voteResult);
        List<Vote> ClearVote(int voteID);
        List<Vote> ClearVotes(int pollID);
    }
}
