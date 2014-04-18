using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.API.Data.Objects
{
    public partial class Speaker
    {
        public Speaker()
        {
            CreatedTime = DateTime.Now;
        }

        public int SpeakerID { get; set; }
        [Required]
        public int AttendeeID { get; set; }
        [Required]
        public int SpeakersListID { get; set; }
        [Required]
        public string Position { get; set; }
        [Required]
        public int Rank { get; set; }
        [Required]
        public DateTime CreatedTime { get; set; }
        public DateTime? UpdatedTime { get; set; }
        public DateTime? SpokenTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        public virtual SpeakersList SpeakersList { get; set; }
        public virtual Attendee Attendee { get; set; }
    }
}
