import React from 'react';

export const runtime = 'edge';
export const revalidate = 604800;

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">Privacy Policy</h1>

            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Last updated: November 20, 2025
                </p>

                <section className="mb-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        At skills.rest, we are committed to protecting your privacy and ensuring transparency about how we collect,
                        use, and safeguard your information. This Privacy Policy explains our data practices in detail.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">1. Information We Collect</h2>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">1.1 Information You Provide</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">When you use skills.rest, you may provide:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
                        <li><strong className="text-slate-900 dark:text-slate-100">Account Information:</strong> Name, email address, username when creating an account</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Skill Submissions:</strong> Content, descriptions, code, and metadata when contributing skills</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Communications:</strong> Messages, feedback, and support requests you send to us</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">1.2 Automatically Collected Information</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">We automatically collect certain information when you visit our website:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
                        <li><strong className="text-slate-900 dark:text-slate-100">Usage Data:</strong> Pages viewed, skills browsed, search queries, interaction patterns</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Device Information:</strong> Browser type, operating system, device identifiers</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Log Data:</strong> IP address, access times, referring URLs</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Cookies:</strong> Session data, preferences, analytics information (see Section 4)</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">1.3 Third-Party Information</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        If you authenticate through third-party services (e.g., GitHub, Google), we may receive basic profile
                        information as permitted by those services and your privacy settings.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">2. How We Use Your Information</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">We use collected information for the following purposes:</p>

                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">✓ Service Delivery</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Providing access to our skill directory, enabling skill submissions, and facilitating user interactions
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">✓ Personalization</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Customizing your experience, recommending relevant skills, and remembering your preferences
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">✓ Analytics and Improvement</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Understanding usage patterns, measuring performance, and improving our platform
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">✓ Security and Fraud Prevention</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Protecting our platform, detecting malicious activity, and preventing abuse
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">✓ Communications</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Sending service updates, responding to inquiries, and providing customer support
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">3. Information Sharing and Disclosure</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        We do not sell your personal information. We may share information in the following limited circumstances:
                    </p>

                    <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-400">
                        <li>
                            <strong className="text-slate-900 dark:text-slate-100">Public Content:</strong> Skills you contribute and
                            associated metadata (author name, description) are publicly visible by design
                        </li>
                        <li>
                            <strong className="text-slate-900 dark:text-slate-100">Service Providers:</strong> Third-party vendors who
                            assist with hosting, analytics, and platform operations (bound by confidentiality agreements)
                        </li>
                        <li>
                            <strong className="text-slate-900 dark:text-slate-100">Legal Requirements:</strong> When required by law,
                            court order, or government request
                        </li>
                        <li>
                            <strong className="text-slate-900 dark:text-slate-100">Business Transfers:</strong> In connection with a
                            merger, acquisition, or sale of assets (users will be notified)
                        </li>
                        <li>
                            <strong className="text-slate-900 dark:text-slate-100">With Consent:</strong> Any other sharing will be
                            done only with your explicit consent
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">4. Cookies and Tracking Technologies</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        We use cookies and similar technologies to enhance your experience. Our cookies include:
                    </p>

                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border-collapse border border-slate-200 dark:border-white/10">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800/50">
                                    <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">Cookie Type</th>
                                    <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">Purpose</th>
                                    <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 dark:text-slate-300">
                                <tr>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Essential</td>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Authentication, security, basic functionality</td>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Session/1 year</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Analytics</td>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Usage patterns, performance metrics</td>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">2 years</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Preferences</td>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">Theme, language, display settings</td>
                                    <td className="border border-slate-200 dark:border-white/10 px-4 py-2">1 year</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400">
                        You can control cookies through your browser settings. Note that disabling certain cookies may limit platform functionality.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">5. Third-Party Services</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">We use the following third-party services:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong className="text-slate-900 dark:text-slate-100">Cloudflare:</strong> CDN, security, and hosting (Privacy Policy: cloudflare.com/privacypolicy)</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Analytics Services:</strong> Anonymous usage statistics and performance monitoring</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">GitHub:</strong> Optional authentication and skill repository integration</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">6. Data Security</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        We implement industry-standard security measures to protect your information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>HTTPS encryption for all data transmission</li>
                        <li>Secure database storage with access controls</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Automated security scanning for submitted skills</li>
                        <li>Employee training on data protection practices</li>
                    </ul>
                    <p className="text-slate-600 dark:text-slate-400 mt-3">
                        However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">7. Data Retention</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        We retain your information for as long as necessary to provide our services and comply with legal obligations.
                        Specifically:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-3">
                        <li>Account data: Until account deletion (plus 30 days for recovery)</li>
                        <li>Published skills: Indefinitely unless you request removal</li>
                        <li>Analytics data: Aggregated and anonymized after 26 months</li>
                        <li>Log data: 90 days for security purposes</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">8. Your Rights (GDPR & CCPA Compliance)</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Depending on your location, you may have the following rights regarding your personal information:
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Access</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Request a copy of your personal data</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Correction</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Update or correct inaccurate information</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Deletion</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Request deletion of your personal data</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Portability</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Export your data in a portable format</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Opt-Out</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Decline certain data processing activities</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Objection</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Object to processing for specific purposes</p>
                        </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mt-4">
                        To exercise these rights, contact us at <a href="mailto:privacy@skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@skills.rest</a>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">9. Children's Privacy</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        skills.rest is not intended for users under the age of 13. We do not knowingly collect personal information
                        from children. If we become aware that a child under 13 has provided us with personal information, we will
                        take steps to delete such information promptly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">10. International Data Transfers</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Your information may be transferred to and processed in countries other than your country of residence.
                        These countries may have different data protection laws. We ensure appropriate safeguards are in place to
                        protect your information in accordance with this Privacy Policy.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">11. Changes to This Policy</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
                        We will notify you of significant changes via email or prominent notice on our website. The "Last updated"
                        date at the top indicates when the policy was last revised.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">12. Contact Us</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-white/10">
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                            📧 Privacy Team: <a href="mailto:privacy@skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@skills.rest</a><br />
                            📧 General Support: <a href="mailto:support@skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">support@skills.rest</a><br />
                            🌐 Website: <a href="https://skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">https://skills.rest</a>
                        </p>
                    </div>
                </section>

                <section className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-lg border border-emerald-200 dark:border-emerald-600/20">
                    <h3 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Our Privacy Commitment</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        We believe privacy is a fundamental right. We are committed to being transparent about our data practices,
                        giving you control over your information, and continuously improving our privacy protections. Your trust is
                        essential to our mission of building the best Agent skills discovery platform.
                    </p>
                </section>
            </div>
        </div>
    );
}
