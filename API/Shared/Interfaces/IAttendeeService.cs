using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface IAttendeeService
    {
        List<Attendee> GetAttendees(int eventID);
        Attendee GetAttendee(int attendeeID);
        Attendee GetAttendee(int profileID, int eventID);
        Attendee CreateAttendee(int eventID, string name, int? profileID);
        Attendee UpdateAttendee(Attendee updatedAttendee);
        void DeleteAttendee(int attendeeID);
        void DeleteAttendees(int eventID);
    }
}
