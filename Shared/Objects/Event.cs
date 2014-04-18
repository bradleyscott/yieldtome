using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace yieldtome.Objects
{
    public class Event
    {
        /// <summary>
        /// Unique identifier for this Event
        /// </summary>
        public int EventID { get; set; }

        /// <summary>
        /// The name of the Event
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The Twitter hashtag of the Event
        /// </summary>
        public string Hashtag { get; set; }

        /// <summary>
        /// The date this Event starts
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// The date this Event ends
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// The Profile of the user who created the Event
        /// </summary>
        public int CreatorID { get; set; }

        /// <summary>
        /// A description of the Event
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Describes if the start of this Event is Today, Tomorrow, This month, Next month or Upcoming
        /// </summary>
        [NotMapped]
        public string DateDescription
        {
            get
            {
                if (StartDate.Date.CompareTo(DateTime.Now.Date) < 0) // If Event has already started
                    return "Today";
                else if (StartDate.Date.CompareTo(DateTime.Now.Date) == 0) // If Event is today
                    return "Today";
                else if (StartDate.Date.CompareTo(DateTime.Now.Date.AddDays(1)) == 0) // If Event is tomorrow
                    return "Tomorrow";
                else if (StartDate.Month == DateTime.Now.Month && StartDate.Year == DateTime.Now.Year) // If Event is this month
                    return "This Month";
                else if (StartDate.Month == DateTime.Now.Month + 1 && StartDate.Year == DateTime.Now.Year) // If Event is next month
                    return "Next Month";
                else
                    return "Upcoming";
            }
        }

        /// <summary>
        /// A display friendly format summarising the Start and End dates for this Event
        /// </summary>
        [NotMapped]
        public string DisplayDate
        {
            get
            {
                string displayDate = "";

                if (StartDate.DayOfYear != EndDate.DayOfYear || StartDate.Year != EndDate.Year)
                {
                    if (StartDate.Month == EndDate.Month && StartDate.Year == EndDate.Year)
                        displayDate = StartDate.ToString("%d");
                    else if (StartDate.Year == EndDate.Year)
                        displayDate = StartDate.ToString("d MMM");
                    else
                        displayDate = StartDate.ToString("d MMM yyyy");

                    displayDate += " to ";
                }
                displayDate += EndDate.ToString("d MMM yyyy");
                return displayDate;
            }
        }

    }
}