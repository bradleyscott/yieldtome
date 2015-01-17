using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface IChatService
    {
        DirectMessage SendMessage(int senderID, int recipientID, string message, string authHeader);
    }
}
