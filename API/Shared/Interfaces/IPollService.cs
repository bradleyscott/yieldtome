using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface IPollService
    {
        List<Poll> GetPolls(int eventID);
        Poll GetPoll(int pollID);
        Poll CreatePoll(int eventID, string name, int creatorID, int majorityRequired, bool doAbstainsCount);
        Poll UpdatePoll(Poll updatedPoll);
        void DeletePoll(int pollID);

    }
}
