using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.API.Data.Objects
{
    public class Login
    {
        public int LoginID { get; set; }
        [Required]public string Name { get; set; }
        [Required]public string Value { get; set; }
        [Required]public int ProfileID { get; set; }
        [Required]public DateTime CreatedTime { get; set; }
        public DateTime? UpdatedTime { get; set; }

        public virtual Profile Profile { get; set; }
    }
}
