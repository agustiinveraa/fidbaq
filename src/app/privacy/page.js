'use client';

import { Bricolage_Grotesque } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const __Bricolage_Grotesque_e97790 = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

export default function Privacy() {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${__Bricolage_Grotesque_e97790.className}`}>
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image 
              src="/logo.svg" 
              alt="Fidbaq Logo" 
              width={40}
              height={40}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <span className="text-base sm:text-lg font-bold text-gray-900">Fidbaq</span>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 transform-gpu shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: July 28, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Fidbaq. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Identity Data:</strong> Name, username, email address</li>
              <li><strong>Contact Data:</strong> Email address and other contact information</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
              <li><strong>Content Data:</strong> Feedback posts, comments, and other content you create</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your personal data for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>To provide and maintain our service</li>
              <li>To create and manage your account</li>
              <li>To process and display your feedback and content</li>
              <li>To communicate with you about our services</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We process your personal data based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Consent:</strong> When you have given clear consent for us to process your data</li>
              <li><strong>Contract:</strong> When processing is necessary for the performance of a contract</li>
              <li><strong>Legitimate interests:</strong> When we have a legitimate interest in processing your data</li>
              <li><strong>Legal obligation:</strong> When we need to comply with a legal requirement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal data. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>With service providers who help us operate our business</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
              the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We will only retain your personal data for as long as necessary to fulfill the purposes for which it was collected,
              including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under data protection laws, you have rights including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Access:</strong> Request copies of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information.
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Transfers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information may be transferred to and maintained on computers located outside of your state, province,
              country, or other governmental jurisdiction where data protection laws may differ.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information
              from children under 13. If you become aware that a child has provided us with personal information,
              please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className="text-gray-700 leading-relaxed">
              Email: agustinvera.developer@gmail.com<br />
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
        <footer className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto text-center flex justify-between">
            <p className="text-sm sm:text-base text-gray-600 ">
              By{' '}
              <a 
                href="https://github.com/agustiinveraa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                @agustiinveraa
              </a>
            </p>
            <div className="flex justify-center items-center gap-4 text-xs sm:text-sm text-gray-500">
              <button
                onClick={() => router.push('/terms')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => router.push('/privacy')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </footer>

      {/* Floating GitHub Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://github.com/agustiinveraa" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-2 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 active:scale-95 transform-gpu shadow-xl hover:shadow-2xl backdrop-blur-sm"
        >
          <span>☕</span>
          <span>Built by Agus</span>
        </a>
      </div>
    </div>
  );
}
