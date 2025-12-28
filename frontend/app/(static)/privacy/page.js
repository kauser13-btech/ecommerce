import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                        <div className="prose prose-lg text-gray-600 max-w-none space-y-8">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                                <p>
                                    Welcome to Appleians ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                                <p>
                                    We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li><strong>Personal Information Provided by You:</strong> We collect names; phone numbers; email addresses; mailing addresses; billing addresses; and other similar information.</li>
                                    <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by our payment processor.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                                <p>
                                    We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>To facilitate account creation and logon process.</li>
                                    <li>To send you marketing and promotional communications.</li>
                                    <li>To fulfill and manage your orders.</li>
                                    <li>To post testimonials.</li>
                                    <li>To request feedback.</li>
                                    <li>To protect our Services.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Sharing Your Information</h2>
                                <p>
                                    We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                                    <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                                    <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
                                <p>
                                    If you have questions or comments about this policy, you may email us at info@appleians.com or contact us by post at:
                                </p>
                                <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <p className="font-bold text-gray-900">Appleians</p>
                                    <p>Level 6, Block D, Bashundhara City Shopping Mall</p>
                                    <p>Panthapath, Dhaka, Bangladesh</p>
                                    <p className="mt-2">Phone: 01842-430000</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
