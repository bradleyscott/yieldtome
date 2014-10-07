using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using yieldtome.API.Data.Objects;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace yieldtome.API.Data
{
    public class Database: DbContext
    {
        public Database() : base("Name=Database") { }

        public DbSet<Profile> Profiles { get; set;}
        public DbSet<Login> Logins { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Attendee> Attendees { get; set; }
        public DbSet<SpeakersList> SpeakersLists { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Like> Likes { get; set; }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();   
        }
    }
}
