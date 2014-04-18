using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface IRequestProcessor
    {
        string ProcessRequest(string[] request, Profile profileContext, Event eventContext = null);
    }
}
