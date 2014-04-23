yieldto.me
==========

What is it?
-----------
 
Helps delegates and organisers of Model UNs manage the boring details of the conference debate from their phone, tablet, or computer. Everyone spends less time on the Rules of Procedure and more time on the debate.
 
 
What can it do?
---------------
 
1. **Speakers lists**
    
 Create Speakers Lists. Have delegates add themselves to speak on them from their phone, tablet or computer. Shuffle the order and make sure you never lose track
 
2. **Voting**

 Create a Poll and ask delegates to cast their Vote. See the Votes come in in real time and see whether or not the Vote has passed or failed
 
3. **Note passing**

 Message other delegates in real-time without needing to exchange your phone, email, or IM details
 
4. **Profiles**

 Create your own yieldto.me Profile- choose who you want to share your contact details with. Or, stay behind your delegate persona. Keep in touch with everyone after the conference too
 
What is the architecture?
--------------------------
 
 There are 2 major components for this solution:
 1. **ASP.Net MVC Web API**

 A RESTful API that allows the persistence of each of the key business objects. Persistence is via a SQL Server database.
 
 2. **Single Page Web Application**

 The SPA uses Angular.js and Bootstrap. It is designed for Tablets in mind first, but is responsive in that the same page layouts will also work with most modern mobile devices

 3. **Prosody XMPP server**

 Is used by the RESTful API to enables the note-passing functionality 


Key principles
--------------

Automated test coverage is important in this project.