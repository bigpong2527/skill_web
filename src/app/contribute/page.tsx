import React from 'react';

export default function ContributePage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">Contribute a Skill</h1>

            <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Join our growing community of developers and share your Claude Skills with thousands of users worldwide.
                    At skills.rest, we believe in the power of open collaboration and knowledge sharing.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Why Contribute?</h2>
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 text-xl">✓</span>
                            <span><strong className="text-slate-900 dark:text-slate-100">Amplify Your Impact:</strong> Share your expertise with a global audience of AI developers and enthusiasts</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 text-xl">✓</span>
                            <span><strong className="text-slate-900 dark:text-slate-100">Build Your Reputation:</strong> Gain recognition as a contributor to the Claude ecosystem</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 text-xl">✓</span>
                            <span><strong className="text-slate-900 dark:text-slate-100">Quality Assurance:</strong> All skills are reviewed by experienced developers for quality and security</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 text-xl">✓</span>
                            <span><strong className="text-slate-900 dark:text-slate-100">Free Forever:</strong> No fees, no hidden costs—just pure knowledge sharing</span>
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Submission Guidelines</h2>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">1. Skill Requirements</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Your skill submission must include:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li>Clear, descriptive name (3-50 characters)</li>
                        <li>Concise tagline highlighting the main benefit</li>
                        <li>Comprehensive description with usage examples</li>
                        <li>Valid installation instructions for popular terminals</li>
                        <li>Accurate category classification from our 10 professional categories</li>
                        <li>Complexity rating (Beginner, Intermediate, Advanced)</li>
                        <li>List of dependencies (if any)</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">2. Quality Standards</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">All submissions are evaluated against these criteria:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong className="text-slate-900 dark:text-slate-100">Functionality:</strong> Skill must work as described without errors</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Security:</strong> No malicious code, data collection, or privacy violations</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Originality:</strong> Must provide unique value (not duplicate existing skills)</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Documentation:</strong> Clear instructions with examples and edge cases covered</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Best Practices:</strong> Follows Claude API guidelines and performance recommendations</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">3. Review Process</h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg mb-6 border border-slate-200 dark:border-white/10">
                        <ol className="space-y-3 text-slate-600 dark:text-slate-400">
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600 dark:text-blue-400">Step 1:</span>
                                <span>Submit your skill via GitHub or our submission form</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600 dark:text-blue-400">Step 2:</span>
                                <span>Automated security scan (typically completes within 5 minutes)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600 dark:text-blue-400">Step 3:</span>
                                <span>Manual review by our team of experienced developers (1-3 business days)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600 dark:text-blue-400">Step 4:</span>
                                <span>Feedback provided if changes are needed</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-blue-600 dark:text-blue-400">Step 5:</span>
                                <span>Publication on skills.rest once approved</span>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Submit</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Choose your preferred submission method:</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-600/20">
                            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">GitHub (Recommended)</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-3">Fork our repository and submit a pull request:</p>
                            <code className="block bg-slate-900 dark:bg-[#0d1117] text-slate-300 p-3 rounded text-sm">
                                github.com/skills-rest/submissions
                            </code>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-lg border border-emerald-200 dark:border-emerald-600/20">
                            <h3 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Email Submission</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-3">Send your skill package to:</p>
                            <code className="block bg-slate-900 dark:bg-[#0d1117] text-slate-300 p-3 rounded text-sm">
                                contribute@skills.rest
                            </code>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>

                    <div className="space-y-4">
                        <details className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <summary className="font-semibold cursor-pointer text-slate-900 dark:text-slate-100">Can I submit multiple skills?</summary>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">Yes! We encourage contributors to share as many quality skills as they create. Each skill is reviewed independently.</p>
                        </details>

                        <details className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <summary className="font-semibold cursor-pointer text-slate-900 dark:text-slate-100">What if my skill is rejected?</summary>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">We provide detailed feedback on why a skill wasn't accepted and suggestions for improvement. You can resubmit after addressing the issues.</p>
                        </details>

                        <details className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <summary className="font-semibold cursor-pointer text-slate-900 dark:text-slate-100">Can I update my skill after publication?</summary>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">Absolutely! Submit an update request through the same channels. Updates go through a streamlined review process.</p>
                        </details>

                        <details className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                            <summary className="font-semibold cursor-pointer text-slate-900 dark:text-slate-100">Is there attribution for contributors?</summary>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">Yes! Every skill page displays the author's name and links to their profile or website if provided.</p>
                        </details>
                    </div>
                </section>

                <section className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/10 dark:to-emerald-900/10 p-8 rounded-lg border border-blue-200 dark:border-blue-600/20 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Need Help?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Our contributor community is here to support you. Join our Discord server or reach out directly:
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium">
                        📧 Email: <a href="mailto:support@skills.rest" className="text-blue-600 dark:text-blue-400 hover:underline">support@skills.rest</a><br />
                        💬 Discord: <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Join our community</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
