-- ============================================
-- COMPLETE CRM SETUP - Run This ONE File
-- Copy and paste ALL of this into Supabase SQL Editor
-- This sets up everything needed for the CRM
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 1: Create leads table
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  company text,
  email text,
  value numeric(12,2) DEFAULT 0,
  stage text NOT NULL DEFAULT 'CONTACTER',
  notes text,
  ai_score int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false
);

-- Add stage column if it doesn't exist (in case table already existed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads' 
    AND column_name = 'stage'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN stage text NOT NULL DEFAULT 'CONTACTER';
  END IF;
END $$;

-- Add is_deleted column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads' 
    AND column_name = 'is_deleted'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Drop existing CHECK constraint if it exists
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_stage_check;

-- Add CHECK constraint for valid stages (only if stage column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads' 
    AND column_name = 'stage'
  ) THEN
    ALTER TABLE public.leads 
      ADD CONSTRAINT leads_stage_check 
      CHECK (stage IN ('CONTACTER', 'QUALIFIED', 'NEGOTIATION', 'CLOSED'));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "User owns their leads" ON public.leads;

-- Create RLS policy for leads
CREATE POLICY "User owns their leads"
ON public.leads
FOR ALL
USING (auth.uid() = user_id AND is_deleted = false)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PART 2: Create tasks table
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date,
  priority text NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "User owns their tasks" ON public.tasks;

-- Create RLS policy for tasks
CREATE POLICY "User owns their tasks"
ON public.tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PART 3: Create task_leads junction table
-- ============================================
-- Drop table if it exists with wrong structure, then recreate
DROP TABLE IF EXISTS public.task_leads CASCADE;

CREATE TABLE public.task_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(task_id, lead_id)
);

-- Enable Row Level Security for task_leads
ALTER TABLE public.task_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for task_leads
CREATE POLICY "User owns their task-lead links"
ON public.task_leads
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_leads.task_id AND t.user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_leads.task_id AND t.user_id = auth.uid())
);

-- ============================================
-- PART 4: Create saved_lists table
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_lists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security for saved_lists
ALTER TABLE public.saved_lists ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "User owns their saved lists" ON public.saved_lists;

-- Create RLS policy for saved_lists
CREATE POLICY "User owns their saved lists"
ON public.saved_lists
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PART 5: Create saved_list_leads junction table
-- ============================================
-- Drop table if it exists with wrong structure, then recreate
DROP TABLE IF EXISTS public.saved_list_leads CASCADE;

CREATE TABLE public.saved_list_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  saved_list_id uuid NOT NULL REFERENCES public.saved_lists(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(saved_list_id, lead_id)
);

-- Enable Row Level Security for saved_list_leads
ALTER TABLE public.saved_list_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for saved_list_leads
CREATE POLICY "User owns their saved list-lead links"
ON public.saved_list_leads
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.saved_lists sl 
    WHERE sl.id = saved_list_leads.saved_list_id 
    AND sl.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.saved_lists sl 
    WHERE sl.id = saved_list_leads.saved_list_id 
    AND sl.user_id = auth.uid()
  )
);

-- ============================================
-- PART 6: Create profiles table (if needed for user info)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- ============================================
-- PART 7: Create function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_on_leads ON public.leads;
CREATE TRIGGER set_updated_at_on_leads
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_on_tasks ON public.tasks;
CREATE TRIGGER set_updated_at_on_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_on_saved_lists ON public.saved_lists;
CREATE TRIGGER set_updated_at_on_saved_lists
  BEFORE UPDATE ON public.saved_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- DONE! Everything is set up
-- ============================================
SELECT 'CRM setup complete! All tables, policies, and triggers are ready.' AS status;

