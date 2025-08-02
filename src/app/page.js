'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bricolage_Grotesque } from 'next/font/google';
import { MessageSquarePlus, Users, MessageCircle, ArrowRight, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import UpgradeButton from '@/components/UpgradeButton';

const __Bricolage_Grotesque_e97790 = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  

  // Control de visualización del popup
  useEffect(() => {
    
    // Comprobamos si el usuario ya ha cerrado el popup antes
    const popupClosed = localStorage.getItem('feedbackCommentsPopupClosed');
    
    if (!popupClosed) {
      // Mostrar popup después de 3 segundos
      const timer = setTimeout(() => {
        const popupElement = document.querySelector('.feature-popup');
        if (popupElement) {
          popupElement.classList.remove('opacity-0', 'translate-y-5');
          popupElement.classList.add('opacity-100', 'translate-y-0');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // Si ya lo cerró antes, ocultamos el popup
      const popupElement = document.querySelector('.feature-popup');
      if (popupElement) {
        popupElement.classList.add('hidden');
      }
    }
  }, []);
  
  // Estado para controlar el modal
  const [modalOpen, setModalOpen] = useState(false);
  
  // Función para cerrar el popup
  const closePopup = () => {
    const popupElement = document.querySelector('.feature-popup');
    if (popupElement) {
      // Animación de salida
      popupElement.classList.remove('opacity-100', 'translate-y-0');
      popupElement.classList.add('opacity-0', 'translate-y-5');
      
      // Ocultar después de la animación
      setTimeout(() => {
        popupElement.classList.add('hidden');
      }, 300);
      
      // Guardar preferencia en localStorage
      localStorage.setItem('feedbackCommentsPopupClosed', 'true');
    }
  };
  
  // Función para abrir el modal de demostración
  const openFeatureModal = () => {
    const modal = document.getElementById('feature-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };
  
  // Función para cerrar el modal de demostración
  const closeFeatureModal = () => {
    const modal = document.getElementById('feature-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // Mock feedback data
  const mockFeedback = [
    {
      id: 1,
      title: "Add dark mode toggle",
      description: "It would be great to have a dark mode option for better eye comfort during night use.",
      author: "Sarah M.",
      votes: 24,
      status: "in_progress",
      emoji: "🌙"
    },
    {
      id: 2,
      title: "Mobile app version",
      description: "Please consider creating a mobile app for iOS and Android. The web version is great but native would be amazing!",
      author: "Alex K.",
      votes: 18,
      status: "pending",
      emoji: "📱"
    }
  ];

  const statusConfig = {
    'pending': { label: 'Pending', color: 'bg-yellow-500' },
    'in_progress': { label: 'In Progress', color: 'bg-blue-500' },
    'completed': { label: 'Completed', color: 'bg-emerald-500' },
    'rejected': { label: 'Rejected', color: 'bg-red-500' }
  };

  useEffect(() => {
    // Permitir acceso a la landing page incluso estando logueado
    // if (!loading && user) {
    //   router.push('/dashboard');
    // }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Permitir acceso a la landing page tanto logueado como no logueado
  // if (user) {
  //   return null;
  // }

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
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="text-base sm:text-lg font-bold text-gray-900">Fidbaq</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#demo" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Demo
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </a>
          </nav>

          <button
            onClick={() => router.push(user ? '/dashboard' : '/login')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            {user ? 'Open App' : 'Login'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="overflow-hidden">
        <div className='flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-16 max-w-7xl mx-auto px-6'>
        <section className="pt-12 lg:pt-20 pb-16 lg:pb-32 flex-1">
          <div className="max-w-3xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold mb-6 border border-emerald-200">
              <Star className="w-4 h-4 mr-2" />
              Stop building features nobody wants
            </div>

            {/* Main Title - Marc Lou style: 60px, font-black, tight spacing, clickbait */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-none text-gray-900" style={{letterSpacing: '-0.4px', lineHeight: '1', fontSize: '60px'}}>
              <span className='relative z-1'>Build exactly what </span>
              <span className='relative whitespace-nowrap z-1'>
                <span className='mr-3 sm:mr-4 md:mr-5 '>your</span>
                </span>
               <span className='relative whitespace-nowrap'>
                <span className='absolute bg-emerald-500 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1'></span> 
                <span className='relative text-neutral'>users want</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed font-light">
              Stop guessing what to build. Get real user feedback and build features that actually matter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
              <button
                onClick={() => router.push(user ? '/dashboard' : '/login')}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm transition-colors duration-300 cursor-pointer shadow-2xl hover:shadow-emerald-500/25 flex items-center justify-center w-[250px] h-[54px]"
              >
                <MessageSquarePlus className="w-5 h-5 mr-3" />
                {user ? 'Open App' : 'Start collecting feedback'}
              </button>
              
              <a 
                href="https://www.producthunt.com/products/fidbaq?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-fidbaq" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=998711&theme=light&t=1753778522537" 
                  alt="Fidbaq - Turn user feedback into your product roadmap — fast & free. | Product Hunt" 
                  width={250} 
                  height={54}
                  className="hover:opacity-90 transition-opacity duration-300 cursor-pointer"
                />
              </a>
            </div>

            
          </div>
        </section>

        <section className="py-8 lg:py-16 flex-1 lg:flex-shrink-0 lg:w-96">
          <div className="max-w-md mx-auto lg:max-w-lg">
          

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                    <MessageSquarePlus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Feedback Board</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">{mockFeedback.length} posts</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {mockFeedback.map((post, index) => {
                  const status = statusConfig[post.status];
                  return (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-3 leading-relaxed text-xs sm:text-sm">{post.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              post.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              post.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {post.status === 'pending' ? '⏳' :
                               post.status === 'in_progress' ? '🚧' :
                               post.status === 'completed' ? '✅' :
                               '❌'} {status.label}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              by {post.author}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 ml-3 sm:ml-4 flex-shrink-0">
                          <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg font-bold text-white transition-colors duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/25">
                            ↑
                          </button>
                          <div className="bg-gray-100 text-gray-900 px-2 py-1 rounded-lg font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center text-xs sm:text-sm">
                            {post.votes}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={() => router.push(user ? '/dashboard' : '/login')}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm transition-colors duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/25"
                >
                  {user ? 'Open App' : 'Create your board'}
                </button>
              </div>
            </div>
            
          </div>
          
        </section>
        
        </div>

        <section className='p-8 md:p-12 space-y-16'>
          <div className='space-y-3 max-w-fit mx-auto '>
            <div className='flex items-end gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 fill-green-600" viewBox="0 0 35 30" fill="none"><path d="M22.3838 27.6777C23.5264 28.9961 25.3721 29.6992 27.4814 29.6992C31.6123 29.6992 34.249 26.9746 34.249 22.7559C34.249 18.625 31.5244 15.6367 27.6572 15.6367C26.8662 15.6367 25.9873 15.8125 25.1084 16.0762C24.5811 9.48438 27.833 4.03516 32.2275 2.36523L31.7881 0.871094C24.2295 3.77148 19.4834 11.1543 19.4834 19.8555C19.4834 22.668 20.5381 25.7441 22.3838 27.6777ZM0.499023 19.8555C0.499023 24.6895 3.22363 29.6992 8.49707 29.6992C12.54 29.6992 15.1768 26.9746 15.1768 22.7559C15.1768 18.625 12.4521 15.6367 8.67285 15.6367C7.88184 15.6367 7.00293 15.8125 6.12402 16.0762C5.59668 9.48438 8.84863 4.03516 13.2432 2.36523L12.7158 0.871094C5.24512 3.77148 0.499023 11.1543 0.499023 19.8555Z"></path></svg>
              <span className='text-sm'>Product Hunt review:</span>
            </div>
            <p className='italic'>&apos;&apos;In my opinion this platform delivers exactly what creators need&apos;&apos;</p>
            <div className='flex items-center gap-2'>
              <Image 
                src="/ph-comments/ac.avif" 
                alt="Adrian Cuesta" 
                width={35}
                height={35}
                className='rounded-full'
              />
              <span>Adrian Cuesta</span>
              <span className='rounded-full border border-green-600 text-green-600 px-1 text-sm'>Building a social app</span>
            </div>
          </div>

          {/* <div className='flex flex-wrap items-center justify-center gap-4 md:gap-8'>
            <span className='text-xs opacity-60'>Featured on</span>
            <Image 
                src="/hackernews-svgrepo-com.svg" 
                alt="Hacker News" 
                width={35}
                height={35}
              />
              <Image 
                src="/Product_Hunt-Logo.svg" 
                alt="Product Hunt" 
                width={105}
                height={100}
              />
          </div> */}
        </section>

        {/* Problem Section */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{fontSize: '48px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-6 text-gray-900">
                Stop wasting months building features nobody wants
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                78% of product features are never used. While you&apos;re coding in the dark, 
                your competitors are building exactly what users ask for.
              </p>
            </div>

            {/* Step by Step Process */}
            <div className="text-center mb-20">
              <h3 style={{fontSize: '36px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-8 text-gray-900">
                The 3-step system that guarantees product-market fit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
                    1
                  </div>
                  <h4 style={{fontSize: '20px', letterSpacing: '-0.4px', lineHeight: '1.2'}} className="font-black mb-3 text-gray-900">Collect Real Feedback</h4>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Create your board and let users easily submit ideas, bugs, and suggestions in seconds
                  </p>
                  {/* Curved Arrow */}
                  <div className="absolute top-6 -right-8 sm:-right-12 hidden lg:block">
                    <svg className="w-12 h-12 fill-emerald-400 opacity-70 -rotate-90" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path fillRule="evenodd" clipRule="evenodd" d="M72.9644 5.31431C98.8774 43.8211 83.3812 88.048 54.9567 120.735C54.4696 121.298 54.5274 122.151 55.0896 122.639C55.6518 123.126 56.5051 123.068 56.9922 122.506C86.2147 88.9044 101.84 43.3918 75.2003 3.80657C74.7866 3.18904 73.9486 3.02602 73.3287 3.44222C72.7113 3.85613 72.5484 4.69426 72.9644 5.31431Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M56.5084 121.007C56.9835 118.685 57.6119 115.777 57.6736 115.445C59.3456 106.446 59.5323 97.67 58.4433 88.5628C58.3558 87.8236 57.6824 87.2948 56.9433 87.3824C56.2042 87.4699 55.6756 88.1435 55.7631 88.8828C56.8219 97.7138 56.6432 106.225 55.0203 114.954C54.926 115.463 53.5093 121.999 53.3221 123.342C53.2427 123.893 53.3688 124.229 53.4061 124.305C53.5887 124.719 53.8782 124.911 54.1287 125.015C54.4123 125.13 54.9267 125.205 55.5376 124.926C56.1758 124.631 57.3434 123.699 57.6571 123.487C62.3995 120.309 67.4155 116.348 72.791 113.634C77.9171 111.045 83.3769 109.588 89.255 111.269C89.9704 111.475 90.7181 111.057 90.9235 110.342C91.1288 109.626 90.7117 108.878 89.9963 108.673C83.424 106.794 77.3049 108.33 71.5763 111.223C66.2328 113.922 61.2322 117.814 56.5084 121.007Z"></path>
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
                    2
                  </div>
                  <h4 style={{fontSize: '20px', letterSpacing: '-0.4px', lineHeight: '1.2'}} className="font-black mb-3 text-gray-900">Prioritize with Data</h4>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Users vote for what they want most. No more guessing - data tells you what to build first
                  </p>
                  {/* Curved Arrow */}
                  <div className="absolute top-6 -right-8 sm:-right-12 hidden lg:block">
                    <svg className="w-12 h-12 fill-emerald-400 opacity-70 -rotate-90" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path fillRule="evenodd" clipRule="evenodd" d="M72.9644 5.31431C98.8774 43.8211 83.3812 88.048 54.9567 120.735C54.4696 121.298 54.5274 122.151 55.0896 122.639C55.6518 123.126 56.5051 123.068 56.9922 122.506C86.2147 88.9044 101.84 43.3918 75.2003 3.80657C74.7866 3.18904 73.9486 3.02602 73.3287 3.44222C72.7113 3.85613 72.5484 4.69426 72.9644 5.31431Z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M56.5084 121.007C56.9835 118.685 57.6119 115.777 57.6736 115.445C59.3456 106.446 59.5323 97.67 58.4433 88.5628C58.3558 87.8236 57.6824 87.2948 56.9433 87.3824C56.2042 87.4699 55.6756 88.1435 55.7631 88.8828C56.8219 97.7138 56.6432 106.225 55.0203 114.954C54.926 115.463 53.5093 121.999 53.3221 123.342C53.2427 123.893 53.3688 124.229 53.4061 124.305C53.5887 124.719 53.8782 124.911 54.1287 125.015C54.4123 125.13 54.9267 125.205 55.5376 124.926C56.1758 124.631 57.3434 123.699 57.6571 123.487C62.3995 120.309 67.4155 116.348 72.791 113.634C77.9171 111.045 83.3769 109.588 89.255 111.269C89.9704 111.475 90.7181 111.057 90.9235 110.342C91.1288 109.626 90.7117 108.878 89.9963 108.673C83.424 106.794 77.3049 108.33 71.5763 111.223C66.2328 113.922 61.2322 117.814 56.5084 121.007Z"></path>
                      </g>
                    </svg>
                  </div>
                </div>

                <div>
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
                    3
                  </div>
                  <h4 style={{fontSize: '20px', letterSpacing: '-0.4px', lineHeight: '1.2'}} className="font-black mb-3 text-gray-900">Launch with Validation</h4>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Build with confidence knowing there&apos;s real demand for your product before you code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="px-6 py-16  bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{fontSize: '48px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-6 text-gray-900">
                See how easy it is to validate your ideas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Watch how you can set up a feedback board and start collecting user insights 
              </p>
            </div>
            
            {/* Demo Video */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <div className='max-lg:hidden absolute top-1/4 -left-4 -translate-x-full text-sm flex flex-col gap-1 items-center'>
                <p class="text-base-content-secondary">Fidbaq in under 1 minute</p>
                <Image 
                  src="/arrow-with-scribble-svgrepo-com.svg" 
                  alt="Arrow pointing to video" 
                  width={40}
                  height={40}
                />
              </div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src="https://www.youtube.com/embed/SdRNU-f1cAw"
                    title="Fidbaq Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div className='space-y-3 max-w-fit mx-auto '>
              <div className='flex items-end gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 fill-green-600" viewBox="0 0 35 30" fill="none"><path d="M22.3838 27.6777C23.5264 28.9961 25.3721 29.6992 27.4814 29.6992C31.6123 29.6992 34.249 26.9746 34.249 22.7559C34.249 18.625 31.5244 15.6367 27.6572 15.6367C26.8662 15.6367 25.9873 15.8125 25.1084 16.0762C24.5811 9.48438 27.833 4.03516 32.2275 2.36523L31.7881 0.871094C24.2295 3.77148 19.4834 11.1543 19.4834 19.8555C19.4834 22.668 20.5381 25.7441 22.3838 27.6777ZM0.499023 19.8555C0.499023 24.6895 3.22363 29.6992 8.49707 29.6992C12.54 29.6992 15.1768 26.9746 15.1768 22.7559C15.1768 18.625 12.4521 15.6367 8.67285 15.6367C7.88184 15.6367 7.00293 15.8125 6.12402 16.0762C5.59668 9.48438 8.84863 4.03516 13.2432 2.36523L12.7158 0.871094C5.24512 3.77148 0.499023 11.1543 0.499023 19.8555Z"></path></svg>
                <span className='text-sm'>Product Hunt review:</span>
              </div>
              <p className='italic'>&apos;&apos;Love how straightforward this is&apos;&apos;</p>
              <div className='flex items-center gap-2'>
                <Image 
                  src="/ph-comments/1.avif" 
                  alt="Chaitanya Agarwal" 
                  width={35}
                  height={35}
                  className='rounded-full'
                />
                <span>Chaitanya Agarwal</span>
                <span className='rounded-full border border-green-600 text-green-600 px-1 text-sm'>AI Posture Coach</span>
              </div>
            </div>

          </div>
        </section>

       

         {/* Pricing Section */}
        <section id="pricing" className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xl text-gray-600 mb-6">Pricing</p>
            <h2 style={{fontSize: '48px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-16 text-gray-900">
              Start building the right thing today
            </h2>
            

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div id="free-plan" className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-10 relative hover:border-emerald-300 transition-colors duration-300 hover:shadow-xl cursor-pointer">
                <h3 style={{fontSize: '32px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-4 text-gray-900">Free</h3>
                <div style={{fontSize: '56px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-8 text-gray-900">$0</div>
                <div className="text-base text-gray-500 mb-6 -mt-4">Perfect to validate your first ideas</div>
                <ul className="text-left space-y-4 mb-10">
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                    <span className="text-gray-700">3 feedback boards</span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mr-3 sm:mr-4 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited feedback posts</span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mr-3 sm:mr-4 flex-shrink-0" />
                    <span className="text-gray-700">User voting & comments</span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mr-3 sm:mr-4 flex-shrink-0" />
                    <span className="text-gray-700">Public board sharing</span>
                  </li>
                </ul>
                <button 
                  onClick={() => router.push(user ? '/dashboard' : '/login')}
                  className="w-full bg-gray-900 hover:bg-gray-800 hover:shadow-lg text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 cursor-pointer group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {user ? 'Open App' : 'Get Started Free'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>

              {/* Pro Plan */}
              <div id="pro-plan" className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 lg:p-10 relative shadow-2xl hover:shadow-emerald-500/25 transition-shadow duration-300 cursor-pointer border-4 border-emerald-400">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 Most Popular
                  </span>
                </div>
                <h3 style={{fontSize: '32px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-4 text-white">Pro</h3>
                <div style={{fontSize: '56px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-8 text-white">
                  $19
                </div>
                <div className="text-base text-white opacity-90 mb-6 -mt-4">Scale your feedback process like a pro</div>
                <ul className="text-left space-y-4 mb-10">
                  <li className="flex items-center text-lg">
                    <CheckCircle className="w-6 h-6 text-white mr-4 flex-shrink-0" />
                    <span className="text-white">
                      <span className='relative whitespace-nowrap'>
                        <span className='absolute bg-green-900 -left-2 -top-1 -bottom-1 -right-2 md:-left-1 md:-top-0 md:-bottom-0 md:-right-1 -rotate-1'></span> 
                        <span className='relative text-white'>Unlimited boards</span>
                      </span> 
                    </span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
                    <span className="text-white">Unlimited feedback posts</span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
                    <span className="text-white">User voting & comments</span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 flex-shrink-0" />
                    <span className="text-white">Public board sharing</span>
                  </li>
                  <li className="flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-3 sm:mr-4 flex-shrink-0 opacity-75" />
                    <span className="text-white opacity-75">Colaborative boards</span>
                    <span className="bg-white text-gray-900 px-2 rounded-full text-sm font-bold mx-2">
                    Coming soon...
                  </span>
                  </li>
                </ul>
                <UpgradeButton className="w-full bg-white text-emerald-600 hover:shadow-lg py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 cursor-pointer group">
                  <span className="flex items-center justify-center gap-2">
                    Upgrade to Pro
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </UpgradeButton>
                <div className="text-md text-white opacity-90 my-4 ">Pay once. Access forever.</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                💡 Need more than 3 boards? <span className="font-semibold text-emerald-600">Upgrade to Pro</span> for unlimited everything
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{fontSize: '48px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-6 text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Everything you need to know about Fidbaq
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="collapse collapse-plus bg-white border border-gray-200 rounded-xl">
                <input type="radio" name="faq-accordion" defaultChecked />
                <div className="collapse-title text-lg font-bold text-gray-900">Is it a subscription?</div>
                <div className="collapse-content text-gray-600">
                  <p>Nope. The Pro plan is a one-time payment. Pay once and access all features forever.</p>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="collapse collapse-plus bg-white border border-gray-200 rounded-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-bold text-gray-900">Is it compatible with my website?</div>
                <div className="collapse-content text-gray-600">
                  <p>
                    Yes! Fidbaq works with any website or app. It simply gives you a link that you can share directly or embed into your page — for example, by attaching it to a button. Compatible with React, Vue, WordPress, Shopify, and more.
                  </p>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="collapse collapse-plus bg-white border border-gray-200 rounded-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-bold text-gray-900">Do I need to code?</div>
                <div className="collapse-content text-gray-600">
                  <p>Not at all! Create boards with our visual interface. Share public links instantly or copy-paste a simple embed code. No technical skills required.</p>
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div className="collapse collapse-plus bg-white border border-gray-200 rounded-xl">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-bold text-gray-900">Does Fidbaq work on mobile?</div>
                <div className="collapse-content text-gray-600">
                  <p>Absolutely! Fidbaq is fully responsive and works perfectly on mobile devices. Your users can submit and vote on feedback from any device.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 style={{fontSize: '48px', letterSpacing: '-0.4px', lineHeight: '1'}} className="font-black mb-6 text-gray-900">
              Boost your app, launch, earn
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Don&apos;t waste time on complex feedback systems or designing voting interfaces from scratch. 
              Start collecting user insights in minutes, not months.
            </p>
            
            <button
              onClick={() => router.push(user ? '/dashboard' : '/login')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg px-8 py-4 transition-colors duration-300 cursor-pointer shadow-2xl hover:shadow-emerald-500/25"
            >
              {user ? 'Open App' : 'Start Building What Users Want'}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required • Setup in under 2 minutes
            </p>
          </div>
        </section>
        

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto text-center flex justify-between">
            <p className="text-sm sm:text-base text-gray-600 ">
              By{' '}
              <a 
                href="https://x.com/agus__xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                Agustín Vera
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
        
        {/* New Feature Popup - Comments */}
        <div className="feature-popup fixed bottom-6 left-6 z-50 max-w-sm opacity-0 translate-y-5 transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <div className="flex items-center gap-2">
                <span className="bg-white bg-opacity-20 p-1 rounded-md">
                  <MessageCircle className="w-4 h-4 text-gray-900" />
                </span>
                <h4 className="text-white font-semibold text-sm">New Feature!</h4>
              </div>
              <button 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                onClick={closePopup}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {/* Media container for GIF/video - replace with actual media */}
              <div className="rounded-lg w-full aspect-video mb-3 overflow-hidden cursor-pointer relative group" 
                onClick={openFeatureModal}>
                <Image
                  src="/comments_demo.gif"
                  alt="Comments feature demonstration"
                  width={500}
                  height={280}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white bg-opacity-80 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                      <path d="m15 3 6 6m0 0-6 6m6-6H3"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">Feedback Comments</h3>
              <p className="text-sm text-gray-600 mb-3">
                Now your users can comment on feedback posts, creating richer and more collaborative conversations.
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push(user ? '/dashboard' : '/login')}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 py-2 rounded-xl font-semibold text-sm transition-colors duration-300 cursor-pointer"
                >
                  {user ? 'Open App' : 'Try it now!'}
                </button>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-center text-xs text-emerald-700">
                <Star className="w-3 h-3 mr-1 fill-emerald-500 text-emerald-500" />
                <span>Available in all plans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Modal */}
        <div id="feature-modal" className="fixed inset-0 bg-black z-[100] hidden items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full mx-auto">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <h3 className="text-white font-semibold">Comments Feature Demo</h3>
              <button 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                onClick={closeFeatureModal}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-2">
              <Image
                src="/comments_demo.gif"
                alt="Comments feature demonstration"
                width={1200}
                height={675}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Floating GitHub Badge */}
        <div className="fixed bottom-6 right-6 z-50">
          <a 
            href="https://github.com/agustiinveraa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-2 py-1 rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer shadow-xl hover:shadow-2xl backdrop-blur-sm"
          >
            <span>☕</span>
            <span>Built by Agus</span>
          </a>
        </div>
      </main>
      
    </div>
  );
}
