import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, BellRing, PieChart, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-primary-500/30 selection:text-primary-900 dark:selection:text-primary-100 overflow-hidden">
      
      {/* Decorative Blurple Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none hidden dark:block" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Logo className="scale-105" />
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600 dark:text-gray-300">
          <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
          <a href="#demo" className="hover:text-primary-500 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-500 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm hover:shadow-md"
          >
            Start for free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 ring-1 ring-primary-500/20 dark:ring-primary-400/30"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            SubFlow 2.0 is live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]"
          >
            Financial control, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">
              simplified.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light"
          >
            Stop paying for services you forgot about. Track your subscriptions, get payment alerts, and manage your recurring expenses in one beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Get started now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-full text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all backdrop-blur-sm"
            >
              Sign in to dashboard
            </Link>
          </motion.div>
        </div>

        {/* Abstract UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-transparent z-10 pointer-events-none h-full translate-y-1/2" />
          <div className="relative rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden ring-1 ring-white/20 dark:ring-white/10">
            {/* Mock Header */}
            <div className="h-12 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center px-4 gap-2 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            {/* Mock Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl" />
                <div className="space-y-3 pt-4">
                   <div className="h-16 w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm" />
                   <div className="h-16 w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm" />
                   <div className="h-16 w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm opacity-50" />
                </div>
              </div>
              <div className="col-span-1 space-y-4">
                <div className="h-48 w-full bg-gradient-to-br from-primary-500/10 to-indigo-500/10 rounded-2xl border border-primary-500/20" />
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900 relative z-10 border-t border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-balance">
              Everything you need to master your subscriptions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-primary-500" />}
              title="Centralized Tracking"
              description="See all your active, paused, and cancelled subscriptions in one unified dashboard."
            />
            <FeatureCard 
              icon={<BellRing className="w-6 h-6 text-indigo-500" />}
              title="Smart Reminders"
              description="Get notified before your card is charged so you never pay for an unwanted renewal."
            />
            <FeatureCard 
              icon={<PieChart className="w-6 h-6 text-blue-500" />}
              title="Expense Analytics"
              description="Visualize your monthly and yearly spending habits categorized directly for you."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
              title="Secure Data"
              description="Enterprise-grade security powered by Supabase keeping your personal financial data encrypted."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo showText={false} className="w-6 h-6" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">SubFlow</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SubFlow Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-4 ring-1 ring-gray-200 dark:ring-gray-700">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
