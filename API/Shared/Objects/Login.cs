using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.Objects
{
    public class Login
    {
        /// <summary>
        /// What type of Login information this is (e.g. Facebook)
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The ID from that Login provider
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// The hyper-link that allows the user profile
        /// </summary>
        public Uri Link
        {
            get
            {
                // I feel a bit dirty writing this. I just couldn't think of a better way. At least it's not in the persistence layer
                if (Name == "Facebook") return new Uri("https://www.facebook.com/" + Value);
                else if (Name == "LinkedIn") return new Uri("https://www.linkedin.com/profile/view?id=" + Value);
                else if (Name == "Google") return new Uri("https://plus.google.com/" + Value);
                else return null;
            }
        }
    }
}
