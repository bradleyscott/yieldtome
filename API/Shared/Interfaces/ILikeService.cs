using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.Interfaces
{
    public interface ILikeService
    {
        bool DoesLikeExist(int likerID, int likedID); 
        bool IsLikeRequited(int attendeeID1, int attendeeID2);
        bool CreateLike(int likerID, int likedID, string authHeader);
        void DeleteLike(int likeID);
    }
}
