import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import Layout from "../shared/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
      {/* === HERO SECTION === */}
      <section className="bg-primary text-white py-24 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-gray-100 text-sm sm:text-base">
          We'd love to hear from you! Whether it's feedback, questions, or
          partnership inquiries, we're here to help.
        </p>
      </section>

      {/* === CONTACT FORM & INFO === */}
      <section className="bg-white py-20 px-6 md:px-16 lg:px-24 text-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold text-primary mb-4">Get in Touch</h2>
            <p className="text-gray-600">
              Reach out to us anytime — we aim to respond within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary text-xl" />
                <span>123 Fashion Street, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary text-xl" />
                <span>+234 70 784 316 45</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary text-xl" />
                <span>contact@desober.com</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-full hover:scale-105 transition font-semibold mt-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default Contact;
