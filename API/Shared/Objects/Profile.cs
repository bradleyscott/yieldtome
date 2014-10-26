using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace yieldtome.Objects
{
    public class Profile
    {
        public Profile()
        {
            Logins = new List<Login>();
        }

        /// <summary>
        /// Unique identifier for this Profile
        /// </summary>
        public int ProfileID { get; set; }

        /// <summary>
        /// The name of the person this Profile belongs to
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// The Uri to the default Profile page for this person
        /// </summary>
        public Uri DefaultContactUri
        {
            get 
            {
                Login defaultLogin = Logins.FirstOrDefault(x => x.Name == "Facebook");
                if (defaultLogin != null) return defaultLogin.Link;

                defaultLogin = Logins.FirstOrDefault(x => x.Name == "Google");
                if (defaultLogin != null) return defaultLogin.Link;

                defaultLogin = Logins.FirstOrDefault(x => x.Name == "LinkedIn");
                if (defaultLogin != null) return defaultLogin.Link;

                return null;
            }
        }
        
        /// <summary>
        /// The default Profile picture Uri for this person
        /// </summary>
        public Uri ProfilePictureUri
        {
            get 
            {
                Login defaultLogin = Logins.FirstOrDefault(x => x.Name == "Facebook");
                if (defaultLogin != null) return new Uri("https://graph.facebook.com/" + defaultLogin.Value + "/picture?width=200&height=200");
                if (Email != "") return new Uri("https://sigil.cupcake.io/" + Email);
                return new Uri("https://sigil.cupcake.io/" + ProfileID);
            }
        }

        /// <summary>
        /// The list of Login details for this user
        /// </summary>
        public List<Login> Logins { get; set; }

        /// <summary>
        /// Email address of this user
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Whether other users should be able to see this Email address
        /// </summary>
        public bool IsEmailPublic { get; set; }

        /// <summary>
        /// Phone number of this user
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// Whether other users should be able to see this Phone number
        /// </summary>
        public bool IsPhonePublic { get; set; }

        /// <summary>
        /// Twitter alias of this user
        /// </summary>
        public string Twitter { get; set; }

        /// <summary>
        /// Whether users should be able to see the Twitter alias
        /// </summary>
        public bool IsTwitterPublic { get; set; }


    }
}