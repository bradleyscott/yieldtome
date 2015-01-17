using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using yieldtome.Interfaces;
using yieldtome.Objects;

namespace yieldtome.API.Chat
{
    [Export(typeof(IChatService))]
    public class ChatService : IChatService
    {
        public DirectMessage SendMessage(int senderID, int recipientID, string message, string authHeader)
        {
            // Check required variables
            if(senderID == 0 || recipientID == 0 || message == "" || authHeader == "") {
                string error = "Can not send DirectMessage. senderID, recipientID, message and authHeader are required in order to send a message";
                Logging.LogWriter.Write(error);
                throw new ArgumentNullException(error);
            };

            // Construct the message object to Post
            DirectMessage newMessage = new DirectMessage
            {
                senderID = senderID,
                recipientID = recipientID,
                message = message
            };

            // Setup HttpClient
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(ConfigurationManager.AppSettings["ChatServiceUri"]);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            // Send Message 
            Logging.LogWriter.Write(String.Format("Attempting to send DirectMessage between {0} and {1}", senderID, recipientID));
            try 
            {
                HttpResponseMessage response = client.PostAsJsonAsync("DirectMessages", newMessage).Result;
                if (response.IsSuccessStatusCode) { newMessage = response.Content.ReadAsAsync<DirectMessage>().Result; }
                else throw new Exception(String.Format("Problem with POST: {0} {1}", response.StatusCode, response.ReasonPhrase));
            }
            catch (Exception ex)
            {
                Logging.LogWriter.Write("There was a problem when trying to send DirectMessage. " + ex.ToString());
                throw ex;
            }

            Logging.LogWriter.Write(String.Format("Successfully sent DirectMessage {0}", newMessage.id));
            return newMessage;
        }
    }
}
