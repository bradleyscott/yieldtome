using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;
using yieldtome.Enums;

namespace yieldtome.Interfaces
{
    public interface ISpeakersService
    {
        List<Speaker> GetSpeakers(int speakersListID);
        Speaker GetSpeaker(int speakerID);
        Speaker AddSpeaker(int speakersListID, int attendeeID, SpeakerPosition position);
        List<Speaker> RemoveSpeaker(int speakerID);
        List<Speaker> ReorderSpeakers(int speakersListID, List<Speaker> speakers);
        List<Speaker> SpeakerHasSpoken(int speakerID);
        List<Speaker> ClearSpeakers(int speakersListID);
    }
}
