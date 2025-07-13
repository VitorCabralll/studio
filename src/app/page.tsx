
'use client';

import React from 'react';
import { LandingHeader } from '@/components/landing/landing-header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { ContactSection } from '@/components/landing/contact-section';
import { Footer } from '@/components/landing/footer';
import { 
  LazyFeaturesSection, 
  LazyPricingSection,
  lazyUtils 
} from '@/components/lazy-loader';

export default function HomePage() {
  // Preload componentes da landing page
  React.useEffect(() => {
    lazyUtils.preloadForRoute('/');
  }, []);

  return (
    <>
      <LandingHeader />
      <main className="min-h-screen pt-16">
        <HeroSection />
        <LazyFeaturesSection />
        <HowItWorksSection />
        <LazyPricingSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
