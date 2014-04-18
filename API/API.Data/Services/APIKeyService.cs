using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;

namespace yieldtome.API.Data.Services
{
    [Export(typeof(IAPIKeyService))]
    public class APIKeyService : IAPIKeyService
    {
        public bool Validate(string apiKey)
        {
            Logging.LogWriter.Write(String.Format("Attempting to validate API Key '{0}'", apiKey));

            // TODO: Use an API key repository. Currently accepts any valid Guid
            try { Guid.Parse(apiKey); }
            catch
            {
                Logging.LogWriter.Write(String.Format("API Key '{0}' is not valid", apiKey));
                return false;
            }

            Logging.LogWriter.Write(String.Format("API Key '{0}' is valid", apiKey));
            return true;
        }
    }
}
