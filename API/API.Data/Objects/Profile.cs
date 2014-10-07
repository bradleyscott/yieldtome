using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace yieldtome.API.Data.Objects
{
    public partial class Profile
    {
        public Profile()
        {
            CreatedTime = DateTime.Now;
            Events = new List<Event>();
            Attendees = new List<Attendee>();
            SpeakersLists = new List<SpeakersList>();
            Logins = new List<Login>();
        }

        public int ProfileID { get; set; }
        [Required]public string Name { get; set; }
        [Required]public string Email { get; set;  }
        public string Phone { get; set; }
        public string Twitter { get; set; }
        public bool IsEmailPublic { get; set; }
        public bool IsPhonePublic { get; set; }
        public bool IsTwitterPublic { get; set; }
        [Required]public DateTime CreatedTime { get; set; }
        public DateTime? UpdatedTime { get; set; }

        public virtual List<Event> Events { get; set; }
        public virtual List<Attendee> Attendees { get; set; }
        public virtual List<SpeakersList> SpeakersLists { get; set; }
        public virtual List<Login> Logins { get; set; }
    }
}
