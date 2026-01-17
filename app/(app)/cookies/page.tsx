"use client"

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import { HomeFooter } from "../../components/Footer";

export default function CookiesPolicy() {
    return (
        <main className="w-screen min-h-screen bg-black flex flex-col">
            <div className="w-full max-w-[1280px] mx-auto mt-6 px-4 sm:px-6">
                <Navbar />
            </div>
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 flex-grow">
                <div className="max-w-4xl mx-auto mt-12">
                    <h1 className="text-2xl font-semibold mb-8">Cookies Policy</h1>
                    <section className="mb-8">
                        <h2 className="text-xl font-medium mb-4">1. Introduction</h2>
                        <p>
                            This Cookies Policy explains how Lunark AI ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website and use our services. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-medium mb-4">2. What are cookies?</h2>
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                            <br /><br />
                            Cookies set by the website owner (in this case, Lunark AI) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-medium mb-4">3. Why do we use cookies?</h2>
                        <p>
                            We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-medium mb-4">4. Types of cookies we use</h2>
                        <p>
                            <strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.
                            <br /><br />
                            <strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
                            <br /><br />
                            <strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-medium mb-4">5. How can you control cookies?</h2>
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                            <br /><br />
                            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
                        </p>
                    </section>
                    <section className="mb-20">
                        <h2 className="text-xl font-medium mb-4">6. Updates to this policy</h2>
                        <p>
                            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                            <br /><br />
                            The date at the top of this Cookie Policy indicates when it was last updated.
                        </p>
                    </section>
                </div>
            </div>
            <HomeFooter />
        </main>
    );
}
