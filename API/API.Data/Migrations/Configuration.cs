using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using yieldtome.API.Data.Objects;

namespace yieldtome.API.Data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<yieldtome.API.Data.Database>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(yieldtome.API.Data.Database context)
        {
            context.Profiles.AddOrUpdate(
              p => p.ProfileID,
              new Profile
              {
                  ProfileID = 1,
                  Name = "Bradley Scott",
                  Email = "bradley@yieldto.me",
                  Phone = "555 125-3459",
                  Twitter = "tweetme",
                  IsEmailPublic = true,
                  IsPhonePublic = false,
                  IsTwitterPublic = false,
                  CreatedTime = DateTime.Now,
                  UpdatedTime = DateTime.Now
              }
            );

            context.Profiles.AddOrUpdate(
              p => p.ProfileID,
              new Profile
              {
                  ProfileID = 2,
                  Name = "Patricia Amfdbdgbbaaj Warmanstein",
                  Email = "fjhzrrr_warmanstein_1375231430@tfbnw.net",
                  CreatedTime = DateTime.Now,
                  UpdatedTime = DateTime.Now
              }
            );

            context.Logins.AddOrUpdate(
                c => c.LoginID,
                new Login
                {
                    LoginID = 1,
                    Name = "Facebook",
                    Value = "553740394",
                    ProfileID = 1,
                    CreatedTime = DateTime.Now
                },
                new Login
                {
                    LoginID = 5,
                    Name = "Facebook",
                    Value = "100006424722110",
                    ProfileID = 2,
                    CreatedTime = DateTime.Now
                });

            context.Events.AddOrUpdate(
                e => e.EventID,
                new Event
                {
                    EventID = 1,
                    Name = "New Event",
                    Hashtag = "newevent",
                    StartDate = DateTime.Now.AddDays(-2),
                    EndDate = DateTime.Now.AddMonths(6),
                    CreatorID = 1,
                    Description = "Description",
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.Events.AddOrUpdate(
                e => e.EventID,
                new Event
                {
                    EventID = 2,
                    Name = "Another New Event",
                    Hashtag = "anotherevent",
                    StartDate = DateTime.Now.AddDays(-2),
                    EndDate = DateTime.Now.AddMonths(6),
                    CreatorID = 1,
                    Description = "Description",
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.Attendees.AddOrUpdate(
                a => new { a.AttendeeID },
                new Attendee
                {
                    AttendeeID = 1,
                    Name = "Starting Attendee",
                    EventID = 1,
                    ProfileID = 1,
                    CreatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.SpeakersLists.AddOrUpdate(
                s => new { s.SpeakersListID },
                new SpeakersList
                {
                    SpeakersListID = 1,
                    Name = "Starting Speakers list",
                    CreatorID = 1,
                    EventID = 1,
                    Status = "Open",
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.SpeakersLists.AddOrUpdate(
                s => new { s.SpeakersListID },
                new SpeakersList
                {
                    SpeakersListID = 2,
                    Name = "Another Speakers list",
                    CreatorID = 1,
                    EventID = 1,
                    Status = "Open",
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.Speakers.AddOrUpdate(
                s => new { s.SpeakerID },
                new Speaker
                {
                    SpeakerID = 1,
                    Position = "For",
                    Rank = 1,
                    SpeakersListID = 1,
                    AttendeeID = 1,
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    SpokenTime = null,
                    DeletedTime = null
                });

            context.Speakers.AddOrUpdate(
                s => new { s.SpeakerID },
                new Speaker
                {
                    SpeakerID = 2,
                    Position = "Against",
                    Rank = 2,
                    SpeakersListID = 1,
                    AttendeeID = 1,
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    SpokenTime = null,
                    DeletedTime = null
                });

            context.Polls.AddOrUpdate(
                p => new { p.PollID },
                new Poll
                {
                    PollID = 1,
                    Name = "Starting Poll",
                    CreatorID = 1,
                    EventID = 1,
                    Status = "Open",
                    Type = "ForMoreThanAgainst",
                    MajorityRequired = 50,
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.Polls.AddOrUpdate(
                p => new { p.PollID },
                new Poll
                {
                    PollID = 2,
                    Name = "Another Poll",
                    CreatorID = 1,
                    EventID = 1,
                    Status = "Open",
                    Type = "ForMoreThanAgainst",
                    MajorityRequired = 50,
                    CreatedTime = DateTime.Now,
                    UpdatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.Votes.AddOrUpdate(
                v => new { v.VoteID },
                new Vote
                {
                    VoteID = 1,
                    AttendeeID = 1,
                    PollID = 1,
                    VoteResult = "For",
                    CreatedTime = DateTime.Now,
                    DeletedTime = null
                });

            context.Likes.AddOrUpdate(
                l => new { l.LikeID },
                new Like
                {
                    LikeID = 1,
                    LikerID = 1,
                    LikedID = 2,
                    CreatedTime = DateTime.Now
                });
        }
    }
}
