using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using yieldtome.Enums;

namespace yieldtome.Objects
{
    public class Poll
    {
        /// <summary>
        /// Unique identifier for this Poll
        /// </summary>
        public int PollID { get; set; }

        /// <summary>
        /// The name of the Poll
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Indicates whether the Poll is open for Voting
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public SpeakersListAndPollStatus Status { get; set; }

        /// <summary>
        /// Indicates whether abstains are considered in the calculation of a majority
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public PollType Type { get; set; }

        /// <summary>
        /// The Profile who created this Poll
        /// </summary>
        public int CreatorID { get; set; }

        /// <summary>
        /// The number of Attendees voting For
        /// </summary>
        public int VotesFor { get; set; }

        /// <summary>
        /// The number of Attendees voting Against
        /// </summary>
        public int VotesAgainst { get; set; }

        /// <summary>
        /// The number of Attendees Abstaining
        /// </summary>
        public int VotesAbstaining { get; set; }

        /// <summary>
        /// The required number of Attendees that require to vote For for the Poll to pass
        /// </summary>
        public int MajorityRequired { get; set; }

        /// <summary>
        /// Indicates whether the Poll is passing or not
        /// </summary>
        public bool IsPassing { get; set; }
    }
}