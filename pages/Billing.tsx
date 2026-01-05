
import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Check, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For individuals and tiny teams.',
    features: ['50 leads', 'Standard pipeline', 'Export', 'Community help'],
    cta: 'Current Plan',
    active: true
  },
  {
    name: 'Professional',
    price: '$30',
    description: 'Best for growing startups.',
    features: ['Unlimited leads', 'AI Lead Scoring', 'Automation', 'API access', 'Priority help'],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$95',
    description: 'Advanced features for scaling.',
    features: ['Advanced analytics', 'SSO/SAML', 'Account manager', 'SLA support'],
    cta: 'Contact Sales'
  }
];

export const Billing: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
       <header className="max-w-2xl border-b border-gray-100 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Subscription</h1>
        <p className="text-sm text-gray-500 mt-2">Manage your plan and billing history. All prices in USD.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => (
          <GlassCard key={i} className={`flex flex-col border-gray-200 relative ${plan.popular ? 'border-black' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-2 left-4 bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
                Recommended
              </div>
            )}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-xs font-medium">/ month</span>
              </div>
              <p className="text-gray-500 text-xs mt-4 leading-relaxed">{plan.description}</p>
            </div>

            <ul className="flex-1 space-y-4 mb-10">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <Check size={14} className="text-black" />
                  {f}
                </li>
              ))}
            </ul>

            <button className={`w-full py-2.5 rounded-attio text-xs font-bold uppercase tracking-widest transition-all ${
              plan.popular 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-white border border-gray-200 text-black hover:bg-gray-50'
            }`}>
              {plan.cta}
            </button>
          </GlassCard>
        ))}
      </div>

      <div className="p-6 border border-gray-200 bg-gray-50/50 rounded-attio flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-black">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Need a custom plan?</h4>
            <p className="text-xs text-gray-500">For teams larger than 50, we offer custom volume discounts.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 rounded-attio bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
          Talk to sales
        </button>
      </div>
    </div>
  );
};
