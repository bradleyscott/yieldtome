using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.API.Data.Objects;
using System.ComponentModel.Composition;

namespace yieldtome.API.Data.Services
{
    [Export(typeof(ILikeService))]
    public class LikeService : ILikeService
    {
        [Import]
        IAttendeeService _attendeeService;

        [Import]
        IChatService _chatService;

        public bool DoesLikeExist(int likerID, int likedID)
        {
            Logging.LogWriter.Write("Attempting to retrieve Like");

            Like dbLike;
            using (var db = new Database())
            {
                dbLike = db.Likes.FirstOrDefault(x => x.LikerID == likerID && x.LikedID == likedID && x.DeletedTime == null);
            }

            if (dbLike != null)
            {
                Logging.LogWriter.Write(String.Format("Retrieved Like with LikeID={0}", dbLike.LikeID));
                return true;
            }

            Logging.LogWriter.Write(String.Format("Attendee with AttendeeID={0} has not liked Attendee with AttendeeID={1}", likerID, likedID));
            return false;
        }

        public bool IsLikeRequited(int attendeeID1, int attendeeID2)
        {
            Logging.LogWriter.Write(String.Format("Attempting to determine if Attendees with IDs {0} and {1} have requited likes", attendeeID1, attendeeID2));

            Like dbLike1, dbLike2;
            using (var db = new Database())
            {
                dbLike1 = db.Likes.FirstOrDefault(x => x.LikerID == attendeeID1 && x.LikedID == attendeeID2 && x.DeletedTime == null);
                dbLike2 = db.Likes.FirstOrDefault(x => x.LikerID == attendeeID2 && x.LikedID == attendeeID1 && x.DeletedTime == null);
            }

            if (dbLike1 != null && dbLike2 != null)
            {
                Logging.LogWriter.Write(String.Format("Attendees with IDs {0} and {1} have requited likes", attendeeID1, attendeeID2));
                return true;
            }

            Logging.LogWriter.Write(String.Format("Attendees with IDs {0} and {1} do not have requited likes", attendeeID1, attendeeID2));
            return false;
        }

        public bool CreateLike(int likerID, int likedID, string authHeader)
        {
            Logging.LogWriter.Write("Attempting to create a new Like");

            yieldtome.Objects.Attendee liker = _attendeeService.GetAttendee(likerID);
            if (liker == null)
            {
                string message = String.Format("No Attendee with AttendeeID={0} exists", likerID);
                Logging.LogWriter.Write(message);
                throw new ArgumentException(message);
            }

            if (liker.Profile == null || AuthorizationHelper.IsCallerAllowedToEdit(liker.Profile.ProfileID) == false)
            {
                string message = String.Format("This user is not authorized to create a Like on behalf of AttendeeID={0}", likerID);
                Logging.LogWriter.Write(message);
                throw new UnauthorizedAccessException(message);
            }

            if(DoesLikeExist(likerID, likedID))
            {
                Logging.LogWriter.Write(String.Format("Attendee with AttendeeID={0} already likes Attendee with AttendeeID={1}", likerID, likedID));
                return IsLikeRequited(likerID, likedID);
            }

            Like dbLike;
            using (var db = new Database())
            {
                Attendee dbLiked = db.Attendees.FirstOrDefault(x => x.AttendeeID == likedID);
                if (dbLiked == null) throw new ArgumentException(String.Format("No Attendee with AttendeeID={0} exists", likedID));

                dbLike = new Like
                {
                    LikerID = likerID, 
                    LikedID = likedID,
                    CreatedTime = DateTime.Now
                };

                dbLike = db.Likes.Add(dbLike);
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Created a new Like with ID {0}", dbLike.LikeID));
            bool isLikeRequited = IsLikeRequited(likerID, likedID);  
      
            if(isLikeRequited) // Send Chat messages letting each of the Attendees know they like each other
            {
                _chatService.SendMessage(likerID, likedID, "yieldto.me has figured out we both like each other ;)", authHeader);
                _chatService.SendMessage(likedID, likerID, "yieldto.me has figured out we both like each other ;)", authHeader);
            }
            return isLikeRequited;
        }

        public void DeleteLike(int likeID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to delete Like with LikeID={0}", likeID));

            using (var db = new Database())
            {
                Like dbLike = db.Likes.FirstOrDefault(x => x.LikeID == likeID);
                if (dbLike == null) throw new ArgumentException(String.Format("No Like with LikeID={0} exists", likeID));

                yieldtome.Objects.Attendee liker = _attendeeService.GetAttendee(dbLike.LikerID);
                if (liker == null || liker.Profile == null || AuthorizationHelper.IsCallerAllowedToEdit(liker.Profile.ProfileID) == false)
                {
                    string message = String.Format("This user is not authorized to delete a Like belonging of AttendeeID={0}", dbLike.LikerID);
                    Logging.LogWriter.Write(message);
                    throw new UnauthorizedAccessException(message);
                }

                dbLike.DeletedTime = DateTime.Now;
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Deleted Like with ID {0}", likeID));
        }
    }
}
