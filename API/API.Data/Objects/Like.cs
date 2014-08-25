using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace yieldtome.API.Data.Objects
{
    public partial class Like
    {
        public Like()
        {
            CreatedTime = DateTime.Now;
        }

        public int LikeID { get; set; }
        [Required]public int LikerID { get; set; }
        [Required]public int LikedID { get; set; }
        [Required]public DateTime CreatedTime { get; set; }
        public DateTime? DeletedTime { get; set; }

        [ForeignKey("LikerID")]
        public virtual Profile Liker { get; set; }
        [ForeignKey("LikedID")]
        public virtual Profile Liked { get; set; }
    }
}
