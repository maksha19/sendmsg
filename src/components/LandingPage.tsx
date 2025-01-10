import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import Slider from "react-slick";
import { useUser } from '../context/userState';
import axios from "axios";
import { ACCESS_URL } from '../components/util';

const testimonials = [
    {
        comment:
            "Our business has never been more connected to its customers. This platform has been a game-changer, enabling us to reach a wider audience and build trust faster than we ever thought possible.",
        name: "Jane Smith",
        position: "CEO of GrowCo",
    },
    {
        comment:
            "This platform has revolutionized the way we communicate with our customers. It’s simple to use, incredibly efficient, and has helped us establish trust and credibility in our market.",
        name: "John Doe",
        position: "Marketing Head at BizScale",
    },
    {
        comment:
            "We’ve grown our customer base significantly in just a few months. The tools are intuitive, and the support team is fantastic. Highly recommended for any business looking to scale!",
        name: "Emily Brown",
        position: "Founder of StartSmart",
    },
    {
        comment:
            "The automation features alone have saved us countless hours every week. Pair that with the excellent communication tools, and you have a winning combination. Our customers love it too!",
        name: "Michael Johnson",
        position: "Operations Manager at QuickServe",
    },
];

const TestimonialSection = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    return (
        <section className="py-12 px-6 bg-gray-50">
            <h2 className="text-3xl font-bold text-center font-poppins mb-6">
                What Our Clients Say
            </h2>
            <div className="max-w-3xl mx-auto">
                <Slider {...settings}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="text-center px-4">
                            <blockquote className="text-xl italic text-gray-700 font-light">
                                "{testimonial.comment}"
                            </blockquote>
                            <p className="mt-4 font-semibold text-gray-800">
                                — {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-600">{testimonial.position}</p>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

const LandingPage = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [passwordError, setPasswordError] = useState("")
    const { setUser } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
        setIsSignup(false);
    };

    const handleSignupClick = () => {
        setIsSignup(true);
    };

    const handleCloseModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleFormSubmit = async (e: React.FormEvent, action: string) => {
        e.preventDefault();
        // Handle form submission logic here
        if (action === "LOGIN") {
            try {
                const url = `${ACCESS_URL}/dev/login`
                const response = await axios.post(url, { userId: email, password, action: "LOGIN" });
                console.log('Success:', response.data);
                setUser({ name, email });
                setIsLoginModalOpen(false);
            } catch (error) {
                console.error('Error:', error);
            }
            return
        }

        if (password !== passwordConfirm) {
            setPasswordError(`Passwords doesn't match`);
            return;
        } else {
            setPasswordError('');
        }

        try {
            const url = `${ACCESS_URL}/dev/login`
            const response = await axios.post(url, { userId: email, password, action: "SINGUP" });
            console.log('Success:', response.data);
            setUser({ name, email });
            setIsLoginModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
        }
        // setUser({ name: 'John Doe', email: 'john@example.com' });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-16 px-6">
                <h1 className="text-3xl md:text-5xl font-bold font-poppins mt-5 md:mt-48">
                    Connect with Your Customers. Grow Your Business.
                </h1>
                <p className="mt-4 text-lg md:text-xl font-light">
                    Our platform is a one-stop solution to help you engage with your
                    customers effectively. We empower businesses to expand their reach,
                    build long-lasting relationships, and grow at an unprecedented rate.
                    Take the first step toward scaling your business today.
                </p>
                <button className="mt-6 px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-gray-200" onClick={handleLoginClick}>
                    Get Started Now
                </button>
            </section>

            {/* About Section */}
            <section className="py-12 px-6">
                <h2 className="text-3xl font-bold text-center font-poppins mb-8">
                    Why Choose Us?
                </h2>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    <div className="p-6  bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-800 text-center">
                            Connect with Your Customers
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Build meaningful interactions through personalized communication.
                            Ensure your customers feel valued, leading to strong loyalty and
                            trust in your business.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-800 text-center">
                            Maximize Business Growth
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Expand your reach and tap into new markets. Our platform ensures
                            your message reaches the right people at the right time.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-800 text-center">
                            Save Time, Gain Efficiency
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Automate tasks, reduce manual efforts, and focus on delivering
                            value to your customers while growing your business.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gray-100 py-12 px-6">
                <h2 className="text-3xl font-bold text-center font-poppins mb-8">
                    Unlock the Key to Success
                </h2>
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="md:col-start-2 p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-blue-800 text-center">Wide Reach</h3>
                        <p className="mt-2 text-gray-600">
                            Connect with a diverse and expansive audience, breaking barriers
                            and expanding your business’s potential.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-lg ">
                        <h3 className="text-xl font-semibold text-blue-800 text-center">
                            Faster Engagement
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Stay ahead with instant communication tools, ensuring your
                            customers receive the attention they deserve.
                        </p>
                    </div>
                </div>
            </section>

            <TestimonialSection />
            {/* Closing Section */}
            <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 text-center">
                <h2 className="text-4xl font-bold font-poppins">
                    Start Connecting with Your Customers Today!
                </h2>
                <p className="mt-4 text-lg md:text-xl font-light">
                    Join thousands of businesses that trust us to grow and succeed. Take
                    the leap today and experience the power of connecting with your
                    customers like never before.
                </p>
                <div className="mt-6 space-x-4">
                    <button className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-gray-200">
                        Sign Up Now
                    </button>
                    <button className="px-8 py-4 text-lg font-semibold bg-blue-700 rounded-lg hover:bg-blue-600">
                        Learn More
                    </button>
                </div>
            </section>

            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-md w-full">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Conditional Rendering for Sign Up or Login */}
                        {isSignup ? (
                            <form onSubmit={(e) => handleFormSubmit(e, "SINGUP")} className="space-y-6">
                                <h2 className="text-4xl font-bold text-center text-blue-600">Create an Account</h2>
                                <p className="text-center text-gray-600">Join us today and start connecting!</p>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        id='name'
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="email"
                                        id='email'
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="password"
                                        id='password'
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        id='passwordConfirm'
                                        placeholder="Confirm Password"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {passwordError && (
                                        <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="terms" className="w-4 h-4 focus:ring-blue-500" required />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        I agree to the <span className="text-blue-500 underline">terms and conditions</span>.
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                                >
                                    Sign Up
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLoginClick}
                                    className="w-full text-blue-600 hover:underline"
                                >
                                    Already have an account? Log in
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={(e) => handleFormSubmit(e, "LOGIN")} className="space-y-6">
                                <h2 className="text-4xl font-bold text-center text-blue-600">Welcome Back!</h2>
                                <p className="text-center text-gray-600">Log in to continue exploring.</p>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        id='email'
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                                >
                                    Log In
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSignupClick}
                                    className="w-full text-blue-600 hover:underline"
                                >
                                    Don't have an account? Sign up
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export default LandingPage;