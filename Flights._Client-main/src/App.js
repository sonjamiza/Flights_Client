import React, { useState, useEffect } from 'react';
import './style.css';

const App = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5038/api/all-flights')
      .then(response => response.json())
      .then(data => setFlights(data))
      .catch(error => console.error('Error fetching flights:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gjej fluturimin e zgjedhur
    const selected = flights.find(f => f.flightNumber === selectedFlight);
    if (!selected) {
      setMessage('Please select a valid flight.');
      return;
    }

    const bookingData = {
      passengerName: passengerName,
      flightNumber: selected.flightNumber
    };

    // Dergo POST request te API
    fetch('http://localhost:5038/api/book-flight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
      .then(response => {
        if (response.ok) {
          setMessage(`✅ Flight booked for ${passengerName} on ${selected.airline} from ${selected.departureCity} to ${selected.destinationCity} at ${new Date(selected.departureDate).toLocaleString()}`);
        } else {
          throw new Error('Booking failed');
        }
      })
      .catch(error => {
        console.error('Error booking flight:', error);
        setMessage('❌ Booking failed. Please try again.');
      });

    // Reset fushat
    setPassengerName('');
    setSelectedFlight('');
  };

  return (
    <div className="container">
      <h1>Flight Booking System</h1>

      <section className="flight-list">
        <h2>Available Flights</h2>
        <ul>
          {flights.map(flight => (
            <li key={flight.flightNumber}>
              ✈ {flight.airline} | {flight.departureCity} → {flight.destinationCity} | 
              🕒 {new Date(flight.departureDate).toLocaleString()} | 💶 {flight.price} €
            </li>
          ))}
        </ul>
      </section>

      <section className="booking-form">
        <h2>Book Your Flight</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            required
          />
          <select
            value={selectedFlight}
            onChange={(e) => setSelectedFlight(e.target.value)}
            required
          >
            <option value="">Select a flight</option>
            {flights.map(flight => (
              <option key={flight.flightNumber} value={flight.flightNumber}>
                {flight.airline} | {flight.departureCity} → {flight.destinationCity} | 
                {new Date(flight.departureDate).toLocaleString()} | {flight.price} €
              </option>
            ))}
          </select>
          <button type="submit">Book Now</button>
        </form>
        {message && <p>{message}</p>}
      </section>
    </div>
  );
};

export default App;
