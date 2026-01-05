
import React from 'react';
import { PipelineStage, Lead } from './types';
import { 
  LayoutDashboard, 
  Trello, 
  Users, 
  CreditCard, 
  Settings,
  Target,
  TrendingUp,
  DollarSign,
  Briefcase
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { name: 'Pipeline', icon: <Trello size={20} />, path: '/pipeline' },
  { name: 'Leads', icon: <Users size={20} />, path: '/leads' },
  { name: 'Billing', icon: <CreditCard size={20} />, path: '/billing' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

export const STAGES = [
  PipelineStage.PROSPECTING,
  PipelineStage.CONTACTED,
  PipelineStage.PROPOSAL,
  PipelineStage.NEGOTIATION,
  PipelineStage.WON,
  PipelineStage.LOST,
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'Nexus Tech',
    email: 'sarah@nexustech.io',
    value: 12500,
    stage: PipelineStage.PROSPECTING,
    notes: 'Inquiry from LinkedIn. Interested in enterprise plan.',
    createdAt: '2024-01-01',
    aiScore: 85
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    company: 'Global Logistics',
    email: 'm.thorne@gl.com',
    value: 45000,
    stage: PipelineStage.NEGOTIATION,
    notes: 'Requested customized reporting modules.',
    createdAt: '2023-12-15',
    aiScore: 92
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    company: 'Solstice Design',
    email: 'elena@solstice.studio',
    value: 8000,
    stage: PipelineStage.WON,
    notes: 'Closed on first call. 3-year contract signed.',
    createdAt: '2024-01-03',
    aiScore: 98
  },
  {
    id: '4',
    name: 'David Kim',
    company: 'Arbor Finance',
    email: 'dk@arbor.fi',
    value: 22000,
    stage: PipelineStage.PROPOSAL,
    notes: 'Sent proposal v2 yesterday.',
    createdAt: '2023-12-28',
    aiScore: 74
  },
  {
    id: '5',
    name: 'Julia Vance',
    company: 'CloudStream',
    email: 'jvance@cloudstream.co',
    value: 15000,
    stage: PipelineStage.CONTACTED,
    notes: 'Waiting for call back on Thursday.',
    createdAt: '2024-01-02',
    aiScore: 68
  }
];

export const DASHBOARD_CARDS = [
  { title: 'Prospects', value: '24', icon: <Target />, trend: '+12%' },
  { title: 'Pipeline Value', value: '$142.5k', icon: <DollarSign />, trend: '+8%' },
  { title: 'Won', value: '18', icon: <Briefcase />, trend: '+5%' },
  { title: 'Velocity', value: '24.2%', icon: <TrendingUp />, trend: '+2%' },
];
