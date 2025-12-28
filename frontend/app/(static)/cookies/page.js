import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CookiePolicy() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
                        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                        <div className="prose prose-lg text-gray-600 max-w-none space-y-8">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
                                <p>
                                    As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the site's functionality.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
                                <p>
                                    We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">3. The Cookies We Set</h2>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>
                                        <strong>Account related cookies:</strong> If you create an account with us, then we will use cookies for the management of the signup process and general administration.
                                    </li>
                                    <li>
                                        <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
                                    </li>
                                    <li>
                                        <strong>Orders processing related cookies:</strong> This site offers e-commerce or payment facilities and some cookies are essential to ensure that your order is remembered between pages so that we can process it properly.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Third Party Cookies</h2>
                                <p>
                                    In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>
                                        <strong>Analytics:</strong> This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">5. More Information</h2>
                                <p>
                                    Hopefully, that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
                                </p>
                                <p className="mt-4">
                                    However, if you are still looking for more information, you can contact us through one of our preferred contact methods:
                                </p>
                                <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <p className="font-bold text-gray-900">Appleians</p>
                                    <p>Email: info@appleians.com</p>
                                    <p>Phone: 01842-430000</p>
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
