using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.Interfaces
{
    public interface IAPIKeyService
    {
        bool Validate(string apiKey);
    }
}
