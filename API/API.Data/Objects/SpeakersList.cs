using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace yieldtome.API.Data.Objects
{
    public partial class SpeakersList
    {
        public SpeakersList()
        {
            CreatedTime = DateTime.Now;
            Speakers = new List<Speaker>();
        }

        public int SpeakersListID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public int EventID { get; set; }
        [Required]
        public int CreatorID { get; set; }
        [Required]
        public DateTime CreatedTime { get; set; }
        public DateTime? UpdatedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        public virtual Event Event { get; set; }
        [ForeignKey("CreatorID")]
        public virtual Profile Creator { get; set; }

        public virtual List<Speaker> Speakers { get; set; }
    }
}
