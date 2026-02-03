import './Schedule.css';

function Schedule() {
  const scheduleData = [
     {
      day: 'Day 1',
      date: 'March 06, 2026',
      events: [
        { time: '09:00 AM - 10:00 AM', title: 'Registration and Check-in' },
        { time: '10:00 AM - 12:45 PM', title: 'Opening Ceremony'},
        { time: '12:45 PM - 01:30 PM', title: 'Lunch Break'},
        { time: '01:30 PM - 02:30 PM', title: 'Committee Session 1'},
        { time: '02:30 PM - 02:45 PM', title: 'Break' },
        { time: '02:45 PM - 03:45 PM', title: 'Committee Session 2'},
        { time: '03:45 PM - 04:00 PM', title: 'High Tea'},
        { time: '04:10 PM - 04:30 PM', title: 'Diplomats den'},
      ]
    },
    {
      day: 'Day 2',
      date: 'March 07, 2026',
      events: [
        { time: '10:00 AM - 11:00 AM', title: 'Session 3'},
        { time: '11:00 AM - 11:15 AM', title: 'Breakfast'},
        { time: '11:15 PM - 12:30 PM', title: 'Session 4'},
        { time: '12:30 PM - 01:30 PM', title: 'Lunch Break' },
        { time: '01:30 PM - 02:15 PM', title: 'Session 5'},
        { time: '02:15 PM - 02:30 PM', title: 'Break'},
        { time: '02:30 PM - 03:15 PM', title: 'Session 6'},
        { time: '03:15 PM - 03:30 PM', title: 'Break'},
        { time: '03:30 PM - 04:40 PM', title: 'Session 7'},
        { time: '04:40 PM - 05:00 PM', title: 'Break'},
        { time: '05:00 PM - 07:30 PM', title: 'Socials'},
      ]
    },
    {
      day: 'Day 3',
      date: 'March 08, 2026',
      events: [
        { time: '10:00 AM - 11:15 AM', title: 'Session 8'},
        { time: '11:15 AM - 11:40 AM', title: 'Breakfast'},
        { time: '11:40 AM - 01:00 PM', title: 'Session 9'},
        { time: '01:00 PM - 02:00 PM', title: 'Lunch Break'},
        { time: '02:00 PM - 04:15PM', title: 'Closing Ceremony' }
      ]
    }
  ];

  return (
    <div className="schedule">
      <section className="page-header animate-on-load">
        <div className="container">
          <h1>Event Schedule</h1>

          <p className="head">
            Complete 3-day schedule for IARE MUN 2026
          </p>

        </div>
      </section>

      <section className="section">
        <div className="container">
          {scheduleData.map((day, index) => (
            <div key={index} className={`day-schedule animate-on-load delay-${(index + 2) * 100}`}>
              <div className="day-header">
                <h2>{day.day}</h2>
                <span className="day-date">{day.date}</span>
              </div>
              <div className="events-timeline">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="event-item">
                    <div className="event-time">{event.time}</div>
                    <div className="event-content">
                      <h3>{event.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="schedule-note animate-on-load delay-500">
            <h3>Important Notes</h3>
            <ul>
              <li>All delegates must arrive 30 minutes before the scheduled time on Day 1</li>
              <li>Formal western attire is mandatory for all committee sessions</li>
              <li>Lunch and snacks will be provided to all delegates</li>
              <li>Committee rooms will be announced during registration</li>
              <li>Please carry your delegate pass at all times</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Schedule;
