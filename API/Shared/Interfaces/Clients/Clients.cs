using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome.Interfaces.Clients
{
    public interface IProfileServiceClient : IProfileService { }
    public interface IEventServiceClient : IEventService { }
    public interface IAttendeeServiceClient : IAttendeeService { }
    public interface IPollServiceClient : IPollService { }
    public interface ISpeakersListServiceClient : ISpeakersListService { }
    public interface ISpeakersServiceClient : ISpeakersService { }
    public interface IVoteServiceClient : IVoteService { }

    public interface IRequestProcessorClient
    {
        string ProcessRequest(string request, int profileID);
    }
}
