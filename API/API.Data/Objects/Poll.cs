using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.API.Data.Objects
{
    public partial class Poll
    {
        public Poll()
        {
            CreatedTime = DateTime.Now;
            Votes = new List<Vote>();
        }

        public int PollID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public int MajorityRequired { get; set; }
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

        public virtual List<Vote> Votes { get; set; }

    }
}
