import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    console.log('Attempting to submit form to Formspree...', formData);

    try {

      // Formspree URL can be moved to environment variable for flexibility
      const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/xwvvkrbp';

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Formspree submission successful:', data);
        setStatus({
          type: 'success',
          message: "Thank you for contacting us! We'll get back to you soon."
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        console.error('Formspree submission failed:', data);
        if (data.errors) {
          const errorMsg = data.errors.map(err => `${err.field || 'General'}: ${err.message}`).join(', ');
          throw new Error(`Validation Error - ${errorMsg}`);
        }
        throw new Error(data.error || 'Oops! There was a problem submitting your form');
      }
    } catch (err) {
      console.error('Network or Request Error:', err);
      let userFriendlyMessage = err.message;

      if (err.message === 'Failed to fetch') {
        userFriendlyMessage = 'Network Error: Request was blocked or URL is invalid. Please check your internet connection or disable ad-blockers for this site.';
      }

      setStatus({
        type: 'error',
        message: userFriendlyMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="head">Get in touch with the IARE MUN team</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-main-grid">
              <div className="contact-form-container">
                <h2>Send Us a Message</h2>
                {status.message && (
                  <div className={`message ${status.type}`}>
                    {status.message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              <div className="contact-map-container">
                <div className="contact-form-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h2>Our Location</h2>
                  <div className="map-frame" style={{ flex: 1, minHeight: '400px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--yale-blue)' }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3803.059126552245!2d78.41515037516982!3d17.599926983323957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8ecfe1af26dd%3A0x65666fa3c4a256d2!2sInstitute%20of%20Aeronautical%20Engineering!5e0!3m2!1sen!2sin!4v1761156512865!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="IARE College Location Map"
                    >
                    </iframe>
                  </div>
                </div>
              </div>
            </div>


            <div className="contact-info-separator"></div>

            <div className="contact-info-box">
              <div className="contact-info">
                <h2>Get In Touch</h2>
                <p className="contact-description">
                  Have questions about IARE MUN 2026? We&apos;re here to help! Reach out to us
                  through any of the following channels or fill out the contact form.
                </p>

                <div className="info-items">
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <h3>Address</h3>
                      <p>Institute of Aeronautical Engineering</p>
                      <p>Dundigal, Hyderabad - 500043</p>
                      <p>Telangana, India</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">📧</div>
                    <div className="info-content">
                      <h3>Email</h3>
                      <p>iaremun2026@gmail.com</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">📞</div>
                    <div className="info-content">
                      <h3>Phone</h3>
                      <p>Abhinav - 9515167797</p>
                      <p>Bhavya - 9391599798</p>
                      <p>Vainavi - 7793977106</p>
                    </div>
                  </div>

                  {/*<div className="info-item">
                    <div className="info-icon">🕒</div>
                    <div className="info-content">
                      <h3>Office Hours</h3>
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
