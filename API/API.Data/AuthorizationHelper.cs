using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace yieldtome.API.Data
{
    public class AuthorizationHelper
    {
        public static bool IsCallerAllowedToEdit(params int[] profileIDs)
        {
            bool hasCorrectProfileClaim = false;
            foreach (int profileID in profileIDs)
                if (IsCallerAllowedToEdit(profileID)) hasCorrectProfileClaim = true;

            return hasCorrectProfileClaim;
        }

        public static bool IsCallerAllowedToEdit(int profileID)
        {
            ClaimsPrincipal principal = (ClaimsPrincipal)Thread.CurrentPrincipal;

            if (principal.Identity.AuthenticationType == "LiveSSP") return true; // Authorize if the user authenticated in the context of this server
            bool hasCorrectProfileClaim = principal.HasClaim("ProfileID", profileID.ToString()); // Else check the claims issued
            return hasCorrectProfileClaim;
        }
    }
}
