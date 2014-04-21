using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace yieldtome.API.Providers
{
    public class BearerAuthenticationProvider : OAuthBearerAuthenticationProvider
    {
        public override Task ValidateIdentity(OAuthValidateIdentityContext context)
        {
            var claims = context.Ticket.Identity.Claims;
            if (claims.Count() == 0 || claims.Any(claim => claim.Issuer != "Facebook" && claim.Issuer != "LOCAL_AUTHORITY"))
                context.Rejected();
            return Task.FromResult<object>(null);
        }
    }
}