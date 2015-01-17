using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.Objects
{
    public class DirectMessage
    {
        /// <summary>
        /// The unique identifier for this message
        /// </summary>
        public string id { get; set; }

        /// <summary>
        /// The AttendeeID of the person who sent the message
        /// </summary>
        public int senderID { get; set; }

        /// <summary>
        /// The AttendeeID of the person who received the message
        /// </summary>
        public int recipientID { get; set; }

        /// <summary>
        /// The content of the message
        /// </summary>
        public string message { get; set; }

        /// <summary>
        /// The time the message was created
        /// </summary>
        public string createdAt { get; set; }

        /// <summary>
        /// The time of the last edit to this message
        /// </summary>
        public string updatedAt { get; set; }
    }
}
