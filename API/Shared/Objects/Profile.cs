using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace yieldtome.Objects
{
    public class Profile
    {
        /// <summary>
        /// Unique identifier for this Profile
        /// </summary>
        public int ProfileID { get; set; }

        /// <summary>
        /// The name of the person this Profile belongs to
        /// </summary>
        public string Name { get; set; }
        
        /// <summary>
        /// The Facebook Profile picture Uri for this person
        /// </summary>
        public Uri ProfilePictureUri
        {
            // TODO: Make this generic according to the Auth provider
            get { return new Uri("https://graph.facebook.com/" + FacebookID + "/picture"); }
        }

        /// <summary>
        /// The Facebook profile ID for this person
        /// </summary>
        public string FacebookID { get; set; }

        /// <summary>
        /// The Uri to the Facebook Profile page for this person
        /// </summary>
        public Uri FacebookProfileUri
        {
            get { return new Uri("http://www.facebook.com/" + FacebookID); }
        }

        // TODO: Add in Google ID and Google URL 

        /// <summary>
        /// The Email address of this person
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// The mailto link to initiate an email to this person
        /// </summary>
        public Uri EmailToUri
        {
            get { return new Uri("mailto://" + Email); }
        }
        
        /// <summary>
        /// The phone number for this person
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// The Twitter alias/handle for this person
        /// </summary>
        public string Twitter { get; set; }

        /// <summary>
        /// The link to the Twitter profile page of this person
        /// </summary>
        public Uri TwitterProfileUri
        {
            get { return new Uri("http://twitter.com/" + Twitter); }
        }

        /// <summary>
        /// The LinkedIn username for this person
        /// </summary>
        public string LinkedIn { get; set; }

        /// <summary>
        /// The link to the LinkedIn Profile page of this person
        /// </summary>
        public Uri LinkedinProfileUri
        {
            get { return new Uri("http://www.linkedin.com/in/" + LinkedIn); }
        }

        /// <summary>
        /// Whether or not this User wants their Facebook profile to be viewable by other users by default
        /// </summary>
        public bool IsFacebookPublic { get; set; }

        /// <summary>
        /// Whether or not this User wants their Email address to be viewable by other users by default
        /// </summary>
        public bool IsEmailPublic { get; set; }

        /// <summary>
        /// Whether or not this User wants their Phone number to be viewable by other users by default
        /// </summary>
        public bool IsPhonePublic { get; set; }

        /// <summary>
        /// Whether or not this User wants their Twitter profile to be viewable by other users by default
        /// </summary>
        public bool IsTwitterPublic { get; set; }

        /// <summary>
        /// Whether or not this User wants their LinkedIn profile to be viewable by other users by default
        /// </summary>
        public bool IsLinkedInPublic { get; set; }
    }
}