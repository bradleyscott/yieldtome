using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace yieldtome.API.Data.Objects
{
    public partial class Event
    {
        public Event()
        {
            CreatedTime = DateTime.Now;
            Attendees = new List<Attendee>();
            SpeakersLists = new List<SpeakersList>();
        }

        public int EventID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        public string Description { get; set; }
        public string Hashtag { get; set; }
        [Required]
        public int CreatorID { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime? UpdatedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        [ForeignKey("CreatorID")]
        public virtual Profile Creator { get; set; }
        public virtual List<Attendee> Attendees { get; set; }
        public virtual List<SpeakersList> SpeakersLists { get; set; }
        public virtual List<Poll> Polls { get; set; }

    }
}
