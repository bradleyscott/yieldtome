using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Objects;

namespace yieldtome.Interfaces
{
    public interface IProfileService
    {
        List<Profile> GetProfiles();
        Profile GetProfile(int profileID);
        Profile GetProfile(string provider, string providerID);
        Profile CreateProfile(Profile newProfile);
        Profile UpdateProfile(Profile updatedProfile);
    }
}
