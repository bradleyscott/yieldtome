using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface ISpeakersListService
    {
        List<SpeakersList> GetSpeakersLists(int eventID);
        SpeakersList GetSpeakersList(int speakersListID);
        SpeakersList CreateSpeakersList(int eventID, string name, int creatorID);
        SpeakersList UpdateSpeakersList(SpeakersList updatedSpeakersList);
        void DeleteSpeakersList(int speakersListID);
    }
}
