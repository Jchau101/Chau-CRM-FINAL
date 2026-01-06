# SQL Setup Instructions

## Step-by-Step Guide

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

### Step 2: Copy the SQL File
1. Open the file: `supabase_complete_setup.sql`
2. Select ALL the text (Cmd+A or Ctrl+A)
3. Copy it (Cmd+C or Ctrl+C)

### Step 3: Paste and Run
1. Paste the entire SQL into the Supabase SQL Editor
2. Click "Run" button (or press Cmd+Enter / Ctrl+Enter)
3. Wait for it to complete

### Step 4: Verify Success
You should see a message: "CRM setup complete! All tables, policies, and triggers are ready."

## What This Sets Up

✅ Leads table (with delete functionality)
✅ Tasks table
✅ Saved Lists table
✅ All relationships between tables
✅ Security policies (users can only see their own data)
✅ Dashboard data support
✅ Delete leads functionality

## Important Notes

- **ONLY RUN THIS ONCE** - This creates all tables from scratch
- If you get errors about tables already existing, that's okay - the script uses `CREATE TABLE IF NOT EXISTS`
- After running this, your CRM will be fully functional

## Troubleshooting

If you see errors:
1. Make sure you copied the ENTIRE file
2. Try running it again (it's safe to run multiple times)
3. Check that you're in the correct Supabase project

