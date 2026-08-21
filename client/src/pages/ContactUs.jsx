import React, { useState } from 'react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="font-heading text-light fw-bold">CONTACT KISKINTHA MENS WEAR</h2>
          <p className="text-muted">We are here to assist you with order inquiries, sizing guidance, and bulk orders.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="kmw-card p-4 border-secondary h-100">
              <h4 className="font-heading text-gold mb-4 fw-bold">STORE INFORMATION</h4>

              <div className="d-flex align-items-start gap-3 mb-4">
                <i className="bi bi-geo-alt-fill text-gold fs-3"></i>
                <div>
                  <h6 className="text-light font-heading mb-1">Flagship Store Location</h6>
                  <p className="text-muted small mb-0">Main Bazaar Road, Near Metro Station, Chennai, Tamil Nadu - 600001</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <i className="bi bi-telephone-fill text-gold fs-3"></i>
                <div>
                  <h6 className="text-light font-heading mb-1">Helpline Phone</h6>
                  <p className="text-muted small mb-0">+91 98765 43210 (Mon-Sat, 9am - 8pm)</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <i className="bi bi-envelope-fill text-gold fs-3"></i>
                <div>
                  <h6 className="text-light font-heading mb-1">Customer Support Email</h6>
                  <p className="text-muted small mb-0">support@kiskintha.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <i className="bi bi-truck text-gold fs-3"></i>
                <div>
                  <h6 className="text-light font-heading mb-1">Cash on Delivery Support</h6>
                  <p className="text-muted small mb-0">Order tracking & COD query response within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="kmw-card p-4 border-secondary">
              <h4 className="font-heading text-gold mb-3 fw-bold">SEND US A MESSAGE</h4>

              {submitted ? (
                <div className="alert alert-success p-4 text-center">
                  <i className="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
                  <h5>Thank you for contacting Kiskintha Mens Wear!</h5>
                  <p className="mb-0">Our executive will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Your Name *</label>
                      <input type="text" className="form-control form-control-dark" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" className="form-control form-control-dark" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control form-control-dark" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input type="text" className="form-control form-control-dark" placeholder="Order Inquiry, Sizing, Linen Fabrics..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message *</label>
                      <textarea rows="4" className="form-control form-control-dark" required></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gold btn-lg w-100 mt-4">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
