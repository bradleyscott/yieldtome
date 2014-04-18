using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace yieldtome.Objects
{
    public class Attendee
    {
        /// <summary>
        /// Unique idenifier for an Attendee
        /// </summary>
        public int AttendeeID { get; set; }

        /// <summary>
        /// Who this Attendee is representing
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The Profile of the person who is the Attendee
        /// </summary>
        public Profile Profile { get; set; }
    }
}