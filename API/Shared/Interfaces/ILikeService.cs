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
        bool IsLikeRequited(int profileID1, int profileID2);
        bool CreateLike(int likerID, int likedID);
        void DeleteLike(int likeID);
    }
}
