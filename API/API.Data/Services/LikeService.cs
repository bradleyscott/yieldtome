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

            Logging.LogWriter.Write(String.Format("Profile with ProfileID={0} has not liked Profile with ProfileID={1}", likerID, likedID));
            return false;
        }

        public bool IsLikeRequited(int profileID1, int profileID2)
        {
            Logging.LogWriter.Write(String.Format("Attempting to determine if Profiles with IDs {0} and {1} have requited likes", profileID1, profileID2));

            Like dbLike1, dbLike2;
            using (var db = new Database())
            {
                dbLike1 = db.Likes.FirstOrDefault(x => x.LikerID == profileID1 && x.LikedID == profileID2 && x.DeletedTime == null);
                dbLike2 = db.Likes.FirstOrDefault(x => x.LikerID == profileID2 && x.LikedID == profileID1 && x.DeletedTime == null);
            }

            if (dbLike1 != null && dbLike2 != null)
            {
                Logging.LogWriter.Write(String.Format("Profiles with IDs {0} and {1} have requited likes", profileID1, profileID2));
                return true;
            }

            Logging.LogWriter.Write(String.Format("Profiles with IDs {0} and {1} do not have requited likes", profileID1, profileID2));
            return false;
        }

        public bool CreateLike(int likerID, int likedID)
        {
            Logging.LogWriter.Write("Attempting to create a new Like");

            if(DoesLikeExist(likerID, likedID))
            {
                Logging.LogWriter.Write(String.Format("Profile with ProfileID={0} already likes Profile with ProfileID={1}", likerID, likedID));
                return IsLikeRequited(likerID, likedID);
            }

            Like dbLike;
            using (var db = new Database())
            {
                Profile dbLiker = db.Profiles.FirstOrDefault(x => x.ProfileID == likerID);
                if (dbLiker == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", likerID));

                Profile dbLiked = db.Profiles.FirstOrDefault(x => x.ProfileID == likedID);
                if (dbLiked == null) throw new ArgumentException(String.Format("No Profile with ProfileID={0} exists", likedID));

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
            return IsLikeRequited(likerID, likedID);        
        }

        public void DeleteLike(int likeID)
        {
            Logging.LogWriter.Write(String.Format("Attempting to delete Like with LikeID={0}", likeID));

            using (var db = new Database())
            {
                Like dbLike = db.Likes.FirstOrDefault(x => x.LikeID == likeID);
                if (dbLike == null) throw new ArgumentException(String.Format("No Like with LikeID={0} exists", likeID));

                dbLike.DeletedTime = DateTime.Now;
                db.SaveChanges();
            }

            Logging.LogWriter.Write(String.Format("Deleted Like with ID {0}", likeID));
        }
    }
}
