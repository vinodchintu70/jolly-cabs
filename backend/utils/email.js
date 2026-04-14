const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBookingConfirmation = async (email, booking, bike, user) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['kalibro971@gmail.com'],
      subject: `Booking Confirmed - ${booking.bookingId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;text-align:center;">
            <h1 style="margin:0;font-size:28px;">🏍️ Jolly Cabs</h1>
            <p style="margin:5px 0 0;opacity:0.9;">Booking Confirmed!</p>
          </div>
          <div style="padding:30px;">
            <p>Hi <strong>${user.name}</strong>, your booking is confirmed!</p>
            <p><strong>User Email:</strong> ${email}</p>
            <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;">
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Bike:</strong> ${bike.name}</p>
              <p><strong>Start Date:</strong> ${new Date(booking.startDate).toDateString()}</p>
              <p><strong>End Date:</strong> ${new Date(booking.endDate).toDateString()}</p>
              <p><strong>Time:</strong> ${booking.startTime}</p>
              <p><strong>Pickup:</strong> ${booking.pickupLocation}</p>
              <p><strong>Drop:</strong> ${booking.dropLocation}</p>
              <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
            </div>
            <p style="color:#94a3b8;">Thank you for choosing Jolly Cabs. Ride safe! 🏍️</p>
          </div>
        </div>
      `,
    });
    console.log('Email sent successfully to kalibro971@gmail.com!');
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendBookingConfirmation };
