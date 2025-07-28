'use client';

import { Bricolage_Grotesque } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const __Bricolage_Grotesque_e97790 = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: July 28, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Fidbaq ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Fidbaq is a feedback management platform that allows users to collect, organize, and prioritize user feedback for their products.
              The service includes feedback boards, voting systems, and analytics tools.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Service, you may be required to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Updating your information to keep it current</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Upload, post, or transmit any content that is unlawful, harmful, or inappropriate</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use the Service for any commercial purpose without our consent</li>
              <li>Spam, harass, or abuse other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of any content you submit to the Service. By submitting content, you grant us a worldwide,
              non-exclusive license to use, display, and distribute your content in connection with the Service.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Fidbaq and its licensors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service,
              to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability,
              under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied,
              including but not limited to implied warranties of merchantability and fitness for a particular purpose.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In no event shall Fidbaq be liable for any indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new
              Terms of Service on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed">
              Email: support@fidbaq.com<br />
              Website: <a href="https://agustinvera.xyz" className="text-emerald-600 hover:text-emerald-700">https://agustinvera.xyz</a>
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
                href="https://agustinvera.xyz" 
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
