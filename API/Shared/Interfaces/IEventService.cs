using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface IEventService
    {
        List<Event> GetEvents();
        Event GetEvent(int eventID);
        Event CreateEvent(string name, DateTime startDate, DateTime endDate, int creatorID, string description = null, string hashtag = null);
        Event UpdateEvent(Event updatedEvent);
        void DeleteEvent(int eventID);
    }
}
