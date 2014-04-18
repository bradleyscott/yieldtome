using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.API.Data.Objects
{
    public partial class Vote
    {
        public int VoteID { get; set; }
        [Required]
        public int PollID { get; set; }
        [Required]
        public int AttendeeID { get; set; }
        [Required]
        public string VoteResult { get; set; }
        [Required]
        public DateTime CreatedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        public virtual Poll Poll { get; set; }
        public virtual Attendee Attendee { get; set; }
    }
}
