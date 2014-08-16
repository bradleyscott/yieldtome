using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace yieldtome.API.Data.Objects
{
    public partial class Attendee
    {
        public Attendee()
        {
            CreatedTime = DateTime.Now;
        }

        public int AttendeeID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int EventID { get; set; }
        public int? ProfileID { get; set; }
        [Required]
        public DateTime CreatedTime { get; set; }
        public DateTime? UpdatedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        public virtual Event Event { get; set; }
        public virtual Profile Profile { get; set; }
    }
}
