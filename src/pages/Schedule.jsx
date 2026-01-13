import './Schedule.css';

function Schedule() {
  const scheduleData = [
    {
      day: 'Day 1',
      date: 'March 15, 2024',
      events: [
        { time: '09:00 AM - 10:00 AM', title: 'Registration and Check-in', location: 'Main Lobby' },
        { time: '10:00 AM - 11:00 AM', title: 'Opening Ceremony', location: 'Auditorium' },
        { time: '11:00 AM - 11:30 AM', title: 'Tea Break', location: 'Cafeteria' },
        { time: '11:30 AM - 01:30 PM', title: 'Committee Session 1', location: 'Committee Rooms' },
        { time: '01:30 PM - 02:30 PM', title: 'Lunch Break', location: 'Dining Hall' },
        { time: '02:30 PM - 05:00 PM', title: 'Committee Session 2', location: 'Committee Rooms' },
        { time: '05:00 PM - 05:30 PM', title: 'Evening Snacks', location: 'Cafeteria' },
      ]
    },
    {
      day: 'Day 2',
      date: 'March 16, 2024',
      events: [
        { time: '09:00 AM - 09:30 AM', title: 'Morning Assembly', location: 'Main Hall' },
        { time: '09:30 AM - 12:00 PM', title: 'Committee Session 3', location: 'Committee Rooms' },
        { time: '12:00 PM - 12:30 PM', title: 'Tea Break', location: 'Cafeteria' },
        { time: '12:30 PM - 02:00 PM', title: 'Committee Session 4', location: 'Committee Rooms' },
        { time: '02:00 PM - 03:00 PM', title: 'Lunch Break', location: 'Dining Hall' },
        { time: '03:00 PM - 05:30 PM', title: 'Committee Session 5', location: 'Committee Rooms' },
        { time: '05:30 PM - 06:00 PM', title: 'Evening Snacks', location: 'Cafeteria' },
        { time: '07:00 PM - 09:00 PM', title: 'Social Evening', location: 'Auditorium' },
      ]
    },
    {
      day: 'Day 3',
      date: 'March 17, 2024',
      events: [
        { time: '09:00 AM - 09:30 AM', title: 'Morning Assembly', location: 'Main Hall' },
        { time: '09:30 AM - 12:00 PM', title: 'Committee Session 6', location: 'Committee Rooms' },
        { time: '12:00 PM - 12:30 PM', title: 'Tea Break', location: 'Cafeteria' },
        { time: '12:30 PM - 02:00 PM', title: 'Final Committee Session', location: 'Committee Rooms' },
        { time: '02:00 PM - 03:00 PM', title: 'Lunch Break', location: 'Dining Hall' },
        { time: '03:00 PM - 04:00 PM', title: 'Resolution Voting', location: 'Committee Rooms' },
        { time: '04:30 PM - 06:00 PM', title: 'Closing Ceremony & Awards', location: 'Auditorium' },
        { time: '06:00 PM', title: 'Conference Concludes', location: '' },
      ]
    }
  ];

  return (
    <div className="schedule">
      <section className="page-header">
        <div className="container">
          <h1>Event Schedule</h1>
          <p>Complete 3-day schedule for IARE MUN 2024</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {scheduleData.map((day, index) => (
            <div key={index} className="day-schedule">
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
                      {event.location && <p className="event-location">📍 {event.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="schedule-note">
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
