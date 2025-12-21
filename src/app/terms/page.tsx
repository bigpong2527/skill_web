import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">Terms of Use</h1>

            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Last updated: November 20, 2025
                </p>

                <section className="mb-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Welcome to skills.rest. By accessing or using our website and services, you agree to be bound by these Terms of Use.
                        Please read them carefully before using our platform.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        By accessing skills.rest, you confirm that you accept these Terms of Use and agree to comply with them.
                        If you do not agree with any part of these terms, you must not use our services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">2. Service Description</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        skills.rest is a discovery and distribution platform for Claude AI skills. We provide:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>A curated directory of Claude skills across various professional categories</li>
                        <li>Tools and resources for skill discovery, comparison, and installation</li>
                        <li>A platform for developers to share their Claude skills with the community</li>
                        <li>Documentation and guides to help users leverage Claude skills effectively</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">3. User Responsibilities</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">When using skills.rest, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>Provide accurate and complete information when submitting skills or creating an account</li>
                        <li>Use the platform and skills in compliance with all applicable laws and regulations</li>
                        <li>Respect intellectual property rights of skill authors and other users</li>
                        <li>Not upload, share, or distribute malicious code or harmful content</li>
                        <li>Not attempt to circumvent security measures or interfere with platform operations</li>
                        <li>Not use automated tools (bots, scrapers) without explicit written permission</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">4. Content and Licensing</h2>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">4.1 User-Submitted Content</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        When you submit a skill or other content to skills.rest, you grant us a non-exclusive, worldwide,
                        royalty-free license to use, display, reproduce, and distribute your content on our platform.
                        You retain all ownership rights to your original work.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">4.2 Platform Content</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        All content on skills.rest, including but not limited to text, graphics, logos, and software,
                        is the property of skills.rest or its content suppliers and is protected by international copyright laws.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">4.3 Skill Licensing</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Individual skills may be subject to their own licensing terms as specified by their authors.
                        Users must review and comply with these terms when using specific skills.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">5. Prohibited Uses</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">You may not use skills.rest for any of the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>Any unlawful purpose or to solicit unlawful activity</li>
                        <li>Distributing spam, malware, or other harmful software</li>
                        <li>Impersonating any person or entity or misrepresenting affiliation with others</li>
                        <li>Violating the privacy rights of others or collecting personal data without consent</li>
                        <li>Engaging in data mining, scraping, or similar data gathering without permission</li>
                        <li>Attempting to gain unauthorized access to any portion of the platform or related systems</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">6. Disclaimer of Warranties</h2>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-lg border border-amber-200 dark:border-amber-600/20">
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                            <strong className="text-slate-900 dark:text-slate-100">IMPORTANT:</strong> skills.rest is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                            <li>The accuracy, reliability, or completeness of skills or information on the platform</li>
                            <li>The performance, functionality, or security of individual skills</li>
                            <li>Uninterrupted or error-free service availability</li>
                            <li>The results obtained from using any skill or service</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">7. Limitation of Liability</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        To the fullest extent permitted by law, skills.rest and its operators, employees, and affiliates shall not be liable for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                        <li>Loss of profits, revenue, data, or use</li>
                        <li>Damages resulting from the use or inability to use our services or any skill</li>
                        <li>Unauthorized access to or alteration of your data</li>
                        <li>Any third-party content or conduct on the platform</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">8. Indemnification</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        You agree to indemnify, defend, and hold harmless skills.rest and its affiliates from any claims,
                        liabilities, damages, losses, and expenses (including legal fees) arising out of or related to your
                        use of the platform, violation of these Terms, or infringement of any third-party rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">9. Content moderation and Removal</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        We reserve the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>Review, moderate, or remove any content that violates these Terms</li>
                        <li>Suspend or terminate accounts that breach our policies</li>
                        <li>Modify or discontinue any feature or service at any time without notice</li>
                        <li>Refuse service to anyone for any reason at our sole discretion</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">10. Changes to Terms</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        We may update these Terms of Use from time to time. The "Last updated" date at the top of this page
                        indicates when the Terms were last revised. Continued use of the platform after changes constitutes
                        acceptance of the updated Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">11. Governing Law and Dispute Resolution</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising
                        from these Terms or your use of skills.rest shall be resolved through:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>Good faith negotiations between the parties</li>
                        <li>Mediation, if negotiations fail</li>
                        <li>Binding arbitration as a final resort</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">12. Contact Information</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        If you have questions about these Terms of Use, please contact us:
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-white/10">
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                            📧 Email: <a href="mailto:legal@skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">legal@skills.rest</a><br />
                            🌐 Website: <a href="https://skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">https://skills.rest</a>
                        </p>
                    </div>
                </section>

                <section className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-600/20">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-900 dark:text-slate-100">Note:</strong> By using skills.rest, you acknowledge that you have read,
                        understood, and agree to be bound by these Terms of Use and our Privacy Policy.
                    </p>
                </section>
            </div>
        </div>
    );
}
