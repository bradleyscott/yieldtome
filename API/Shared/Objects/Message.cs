using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace yieldtome.Objects
{
    public class Message
    {
        public int MessageID { get; set; }
        public string Content { get; set; }
        public bool isMessageRead { get; set; }
        public DateTime CreatedTime { get; set; }
        public Attendee Sender { get; set; }
        public List<Attendee> Recipients { get; set; }
    }
}