using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using yieldtome.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace yieldtome.Objects
{
    public class Speaker
    {
        /// <summary>
        /// Unique identifier for this Speaker
        /// </summary>
        public int SpeakerID { get; set; }

        /// <summary>
        /// Indicates whether this Speaker wishes to speak For, Against or Neutral on the topic
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public SpeakerPosition Position { get; set; }

        /// <summary>
        /// The Attendee who is seeking to speak
        /// </summary>
        public Attendee Attendee { get; set; }
    }
}