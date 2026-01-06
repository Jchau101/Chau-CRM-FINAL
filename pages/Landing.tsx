import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronDown,
  Zap, 
  Shield, 
  BarChart3,
  Users,
  TrendingUp,
  Layers,
  Play,
  Star,
  ArrowUpRight
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Visual Pipeline",
      description: "Drag-and-drop kanban boards that make pipeline management intuitive and fast.",
      gradient: "from-neutral-900 to-neutral-700"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Smart Lead Scoring",
      description: "AI-powered insights that help you focus on the leads most likely to convert.",
      gradient: "from-neutral-800 to-neutral-600"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Real-time Analytics",
      description: "Live dashboards with metrics that update as your team closes deals.",
      gradient: "from-neutral-900 to-neutral-700"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Workflow Automation",
      description: "Automate repetitive tasks and let your team focus on relationships.",
      gradient: "from-neutral-800 to-neutral-600"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and SOC 2 compliance keep your data safe.",
      gradient: "from-neutral-900 to-neutral-700"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Seamless Integrations",
      description: "Connect with 100+ tools your team already uses and loves.",
      gradient: "from-neutral-800 to-neutral-600"
    }
  ];

  const testimonials = [
    {
      quote: "Chau transformed how we manage our sales pipeline. The interface is beautiful and actually makes work enjoyable.",
      author: "Sarah Chen",
      role: "VP Sales, TechCorp",
      avatar: "SC"
    },
    {
      quote: "Finally, a CRM that doesn't feel like it was built in 2005. Clean, fast, and incredibly intuitive.",
      author: "Marcus Johnson",
      role: "Founder, StartupXYZ",
      avatar: "MJ"
    },
    {
      quote: "We increased our close rate by 34% in the first quarter. The analytics alone are worth it.",
      author: "Emily Rodriguez",
      role: "Sales Director, GrowthCo",
      avatar: "ER"
    }
  ];

  const faqs = [
    {
      q: "How quickly can I get started?",
      a: "You can be up and running in under 5 minutes. Our onboarding wizard guides you through setup, and you can import existing data with a single click."
    },
    {
      q: "Is there a free trial?",
      a: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      q: "Can I import data from other CRMs?",
      a: "Absolutely. We support direct imports from Salesforce, HubSpot, Pipedrive, and any CSV file. Our team can help with complex migrations."
    },
    {
      q: "What kind of support do you offer?",
      a: "All plans include email support with 24-hour response times. Pro and Enterprise plans get priority support with dedicated account managers."
    },
    {
      q: "Is my data secure?",
      a: "Your data is encrypted at rest and in transit using AES-256. We're SOC 2 Type II certified and undergo regular security audits."
    }
  ];

  const logos = ["Stripe", "Notion", "Linear", "Vercel", "Figma", "Slack"];

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #000 0%, transparent 70%)',
            left: `${mousePosition.x * 0.02 - 200}px`,
            top: `${mousePosition.y * 0.02 - 200}px`,
            transition: 'left 0.3s ease-out, top 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #000 0%, transparent 70%)',
            right: `${-mousePosition.x * 0.01}px`,
            bottom: `${-mousePosition.y * 0.01}px`,
            transition: 'right 0.5s ease-out, bottom 0.5s ease-out'
          }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(0,0,0,0.03)]' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">Chau</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200">Features</a>
              <a href="#testimonials" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200">Customers</a>
              <a href="#faq" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auth')}
                className="hidden sm:block text-sm text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="group relative px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200/50 shadow-sm"
                style={{ transitionDelay: '100ms' }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-neutral-600">Now with AI-powered insights</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-neutral-900 leading-[1.1]">
                <span className="block" style={{ transitionDelay: '200ms' }}>The CRM that</span>
                <span className="block font-medium" style={{ transitionDelay: '300ms' }}>works like you do</span>
              </h1>

              {/* Subheadline */}
              <p 
                className="text-lg md:text-xl text-neutral-500 max-w-lg leading-relaxed"
                style={{ transitionDelay: '400ms' }}
              >
                Beautiful, intuitive, and powerful. Manage your entire sales pipeline with a tool designed for modern teams.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4" style={{ transitionDelay: '500ms' }}>
                <button
                  onClick={() => navigate('/auth')}
                  className="group relative px-8 py-4 rounded-full bg-black text-white text-base font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start for free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button
                  onClick={() => {}}
                  className="group flex items-center gap-3 px-6 py-4 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  <span className="text-sm font-medium">Watch demo</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4" style={{ transitionDelay: '600ms' }}>
                <div className="flex -space-x-2">
                  {['bg-neutral-900', 'bg-neutral-700', 'bg-neutral-500', 'bg-neutral-400'].map((bg, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center`}>
                      <span className="text-white text-xs font-medium">{['S', 'M', 'E', 'A'][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-neutral-900 font-medium">2,000+</span>
                  <span className="text-neutral-500"> teams trust Chau</span>
                </div>
              </div>
            </div>

            {/* Right: Product Mockup */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              {/* Main Dashboard Card */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-neutral-200/50 via-neutral-100/50 to-neutral-200/50 rounded-3xl blur-2xl opacity-60" />
                
                {/* Dashboard Container */}
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-neutral-900/10 border border-neutral-200/50 overflow-hidden">
                  {/* Window Controls */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                    <div className="flex-1 mx-4">
                      <div className="w-48 h-5 bg-neutral-100 rounded-md mx-auto" />
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6 bg-gradient-to-br from-neutral-50 to-white">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Total Revenue', value: '$124,500', change: '+12%' },
                        { label: 'Active Leads', value: '847', change: '+8%' },
                        { label: 'Conversion', value: '24.8%', change: '+3%' }
                      ].map((stat, i) => (
                        <div 
                          key={i} 
                          className="bg-white rounded-xl p-4 border border-neutral-100 shadow-sm animate-fade-in-up"
                          style={{ animationDelay: `${800 + i * 100}ms` }}
                        >
                          <div className="text-xs text-neutral-400 mb-1">{stat.label}</div>
                          <div className="text-xl font-semibold text-neutral-900">{stat.value}</div>
                          <div className="text-xs text-emerald-500 font-medium">{stat.change}</div>
                        </div>
                      ))}
                    </div>

                    {/* Pipeline Preview */}
                    <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm">
                      <div className="text-sm font-medium text-neutral-900 mb-3">Pipeline Overview</div>
                      <div className="space-y-3">
                        {[
                          { stage: 'Contacter', count: 24, width: '90%', color: 'bg-neutral-900' },
                          { stage: 'Qualified', count: 18, width: '70%', color: 'bg-neutral-700' },
                          { stage: 'Negotiation', count: 12, width: '50%', color: 'bg-neutral-500' },
                          { stage: 'Closed', count: 8, width: '35%', color: 'bg-neutral-400' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-20 text-xs text-neutral-500">{item.stage}</div>
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.color} rounded-full animate-expand-width`}
                                style={{ 
                                  width: item.width,
                                  animationDelay: `${1000 + i * 150}ms`
                                }}
                              />
                            </div>
                            <div className="w-8 text-xs text-neutral-400 text-right">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1 */}
                <div 
                  className="absolute -right-6 top-20 bg-white rounded-xl shadow-xl shadow-neutral-900/10 border border-neutral-100 p-4 w-48 animate-float"
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs font-medium text-neutral-600">New Deal</div>
                  </div>
                  <div className="text-lg font-semibold text-neutral-900">$12,400</div>
                  <div className="text-xs text-neutral-400">Acme Corp</div>
                </div>

                {/* Floating Card 2 */}
                <div 
                  className="absolute -left-4 bottom-24 bg-white rounded-xl shadow-xl shadow-neutral-900/10 border border-neutral-100 p-4 w-44 animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs font-medium text-neutral-600">Lead Score</div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-neutral-900">94</span>
                    <span className="text-xs text-neutral-400">/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <section className="py-16 px-6 lg:px-8 border-y border-neutral-100 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-neutral-400 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
          <div className="flex items-center justify-center gap-12 md:gap-20 flex-wrap opacity-40">
            {logos.map((logo, i) => (
              <div 
                key={i} 
                className="text-xl font-semibold text-neutral-900 hover:opacity-70 transition-opacity cursor-default"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-20">
            <div className="text-xs text-neutral-400 uppercase tracking-widest mb-4">Features</div>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-6 leading-tight">
              Everything you need to close more deals
            </h2>
            <p className="text-lg text-neutral-500">
              Powerful features that help your team work smarter, not harder.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-xl hover:border-neutral-200 transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-black transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    <span>Learn more</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Continuous Horizontal Strip */}
      <section id="testimonials" className="py-32 px-0 bg-neutral-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs text-neutral-500 uppercase tracking-widest mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              Loved by teams everywhere
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              A quiet, continuous stream of what customers say about Chau.
            </p>
          </div>

          {/* Scrolling Strip */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-900 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-900 to-transparent pointer-events-none" />

            <div className="w-full flex gap-6 marquee-track will-change-transform">
              {/* Two copies of the row for seamless looping */}
              {[0, 1].map((rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-6 min-w-full marquee-row"
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={`${rowIndex}-${index}`}
                      className="group relative w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)] hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                        ))}
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed mb-6">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xs font-medium text-white">
                          {testimonial.avatar}
                        </div>
                        <div className="text-xs">
                          <div className="text-white font-medium">{testimonial.author}</div>
                          <div className="text-white/50">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-neutral-400 uppercase tracking-widest mb-4">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900">
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-neutral-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-neutral-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-48' : 'max-h-0'}`}>
                  <div className="px-8 pb-6 text-neutral-500 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-neutral-900 p-12 md:p-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '30px 30px'
                }}
              />
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
                Ready to transform your<br />sales process?
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                Join thousands of teams who've already made the switch to Chau.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="group px-8 py-4 rounded-full bg-white text-neutral-900 text-base font-medium hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Get started free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="px-8 py-4 text-white/70 hover:text-white text-base font-medium transition-colors">
                  Talk to sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">Chau</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-neutral-500">
              <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Contact</a>
            </div>
            <div className="text-sm text-neutral-400">
              © 2024 Chau. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expand-width {
          from {
            width: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .animate-expand-width {
          animation: expand-width 1s ease-out both;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        /* Testimonials marquee */
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          animation: marquee 40s linear infinite;
        }

        @media (max-width: 768px) {
          .marquee-track {
            animation-duration: 55s;
          }
        }
      `}</style>
    </div>
  );
};
