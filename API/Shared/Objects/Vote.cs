using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using yieldtome.Enums;

namespace yieldtome.Objects
{
    public class Vote
    {
        /// <summary>
        /// Unique identifier for this Vote
        /// </summary>
        public int VoteID { get; set; }

        /// <summary>
        /// Whether or not the Vote was cast For, Against, or an Abstention
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public VoteType VoteResult { get; set; }

        /// <summary>
        /// The Attendee who cast this Vote
        /// </summary>
        public Attendee Attendee { get; set; }
    }
}