import React, { useState } from 'react';
import Modal from './Modal';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-2xl font-bold mb-2">Eminates</h3>
                        <p className="text-gray-400 text-sm">Secure. Transparent. Reliable.</p>
                    </div>
                    <div className="flex space-x-6 mb-6 md:mb-0">
                        <button onClick={() => setIsPrivacyOpen(true)} className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</button>
                        <button onClick={() => setIsTermsOpen(true)} className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</button>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Support</a>
                    </div>
                    <div className="text-gray-500 text-sm flex flex-col items-end">
                        <div>&copy; {new Date().getFullYear()} Eminates. All rights reserved.</div>
                        <a
                            href="https://wa.me/917829751480"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 mt-2 text-gray-400 hover:text-green-400 transition-colors"
                        >
                            <span className="text-xs">Developed by Urooj Tech Solutions</span>
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Policy">
                <p className="mb-4"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
                <p className="mb-4">At Eminates, we prioritize your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our Investor App and website.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">1. Information We Collect</h4>
                <p className="mb-4">We collect personal information that you provide to us, such as your name, contact details, and financial information necessary for investment processing. We also collect device information and usage data to improve our services.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">2. How We Use Your Information</h4>
                <p className="mb-4">We use your data to facilitate secure transactions, verify your identity, provide customer support, and send important updates regarding your investments.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">3. Data Security</h4>
                <p className="mb-4">We implement industry-standard security measures, including encryption and biometric authentication, to protect your data from unauthorized access.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">4. Third-Party Sharing</h4>
                <p className="mb-4">We do not sell your personal data. We may share information with trusted financial partners only as required to execute your investment requests.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">5. Contact Us</h4>
                <p>If you have any questions about this policy, please contact our support team.</p>
            </Modal>

            {/* Terms of Service Modal */}
            <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="Terms of Service">
                <p className="mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                <p className="mb-4">Please read these Terms of Service carefully before using the Eminates Investor App.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">1. Acceptance of Terms</h4>
                <p className="mb-4">By accessing or using our app, you agree to be bound by these terms. If you do not agree, you may not use our services.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">2. Use of Service</h4>
                <p className="mb-4">You agree to use the app only for lawful purposes and in accordance with all applicable financial regulations. You are responsible for maintaining the confidentiality of your account credentials.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">3. Investment Risks</h4>
                <p className="mb-4">All investments carry risks. Eminates provides a platform for managing requests but does not guarantee returns. You should consult with a financial advisor before making investment decisions.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">4. Termination</h4>
                <p className="mb-4">We reserve the right to terminate or suspend your account if you violate these terms or engage in fraudulent activity.</p>

                <h4 className="text-lg font-bold text-premium-dark mt-6 mb-2">5. Changes to Terms</h4>
                <p>We may modify these terms at any time. Continued use of the app constitutes acceptance of the updated terms.</p>
            </Modal>
        </footer>
    );
};

export default Footer;
