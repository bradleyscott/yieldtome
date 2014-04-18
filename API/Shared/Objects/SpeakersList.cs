using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using yieldtome.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace yieldtome.Objects
{
    public class SpeakersList
    {
        /// <summary>
        /// Unique identifier for this Speakers List
        /// </summary>
        public int SpeakersListID { get; set; }

        /// <summary>
        /// Name of the Speakers List
        /// </summary>
        public string Name { get; set; }     

        /// <summary>
        /// Indicates whether the Speakers List is open to receive new Speakers
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public SpeakersListAndPollStatus Status { get; set; }

        /// <summary>
        /// The Profile who created this Poll
        /// </summary>
        public int CreatorID { get; set; }

        /// <summary>
        /// The Speaker due to speak next
        /// </summary>
        public Speaker NextSpeaker { get; set; }

        /// <summary>
        /// The number of Speakers on this Speakers List
        /// </summary>
        public int NumberOfSpeakers { get; set; }
    }
}