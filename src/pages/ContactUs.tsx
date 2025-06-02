
import React, { useState } from "react";
const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://your-backend-endpoint.com/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setFormData({ name: "", email: "", message: "" });
                showModal("Message sent successfully!");
            } else {
                showModal("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            showModal("An error occurred. Please try again later.");
        }
    };

    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const showModal = (message: string) => {
        setModalMessage(message);
    };

    const closeModal = () => {
        setModalMessage(null);
    };

    const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
            }}>
                <p style={{ fontSize: "1.2rem", color: "#333", marginBottom: "20px" }}>{message}</p>
                <button
                    onClick={onClose}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );

    return (
<>
  <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Contact Us</h1>
      <p className="text-center text-gray-600 mb-6">
        We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, reach out to us anytime.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
  {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
</>

    );
}
export default ContactUs;