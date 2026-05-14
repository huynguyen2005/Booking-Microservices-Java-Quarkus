
import axios from 'axios';

async function testBooking() {
  const token = 'YOUR_TOKEN_HERE'; // I don't have this, but I can use the browser to check
  try {
    const res = await axios.post('http://localhost:8080/api/bookings', {
      passengerId: 1,
      flightId: 101,
      seatNumber: "A2"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error Status:', err.response?.status);
    console.log('Error Data:', err.response?.data);
  }
}
