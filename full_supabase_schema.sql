-- Comprehensive Supabase Schema for Social Application

-- SECTION 1: DELETE EXISTING TABLES (OPTIONAL - USE WITH CAUTION)
-- If you want to start fresh, uncomment and run these DELETE statements.
-- This will ERASE ALL DATA in these tables.
-- DO NOT RUN IN PRODUCTION WITHOUT BACKUP.
-- Important: Drop tables in reverse order of dependencies.
-- DROP TABLE IF EXISTS public.messages CASCADE;
-- DROP TABLE IF EXISTS public.chat_participants CASCADE;
-- DROP TABLE IF EXISTS public.chats CASCADE;
-- DROP TABLE IF EXISTS public.comments CASCADE;
-- DROP TABLE IF EXISTS public.posts CASCADE;
-- DROP TABLE IF EXISTS public.relationships CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;


-- SECTION 2: CREATE TABLES
--------------------------------------------------------------------------------

-- Table: public.profiles
-- Stores additional public user data linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now()
);

-- Table: public.posts
-- Stores user posts
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  -- Foreign key constraint to profiles table
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Table: public.comments
-- Stores comments on posts
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Table: public.chats
-- Stores chat conversations metadata
CREATE TABLE IF NOT EXISTS public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  type text NOT NULL DEFAULT 'direct', -- 'direct', 'group'
  name text -- For group chats
);

-- Table: public.chat_participants
-- Join table for chats and users
CREATE TABLE IF NOT EXISTS public.chat_participants (
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (chat_id, user_id)
);


-- Table: public.messages
-- Stores messages within chats
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Table: public.relationships (Followers/Following)
CREATE TABLE IF NOT EXISTS public.relationships (
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT unique_relationship UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);


-- SECTION 3: ENABLE ROW LEVEL SECURITY (RLS)
--------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;


-- SECTION 4: CREATE RLS POLICIES
--------------------------------------------------------------------------------

-- RLS Policies for public.profiles
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for public.posts
CREATE POLICY IF NOT EXISTS "Posts are viewable by everyone."
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can create posts."
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own posts."
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own posts."
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for public.comments
CREATE POLICY IF NOT EXISTS "Comments are viewable by everyone."
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can create comments."
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own comments."
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own comments."
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for public.chats
-- Note: chat_participants must exist before these policies are created.
CREATE POLICY IF NOT EXISTS "Chat participants can view chats."
  ON public.chats FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = chats.id AND user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Chat participants can update chats."
  ON public.chats FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = chats.id AND user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Chat participants can delete chats."
  ON public.chats FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = chats.id AND user_id = auth.uid()));

-- RLS Policies for public.chat_participants
CREATE POLICY IF NOT EXISTS "Users can view their chat memberships."
  ON public.chat_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can join chats."
  ON public.chat_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can leave chats."
  ON public.chat_participants FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for public.messages
-- Note: chat_participants must exist before these policies are created.
CREATE POLICY IF NOT EXISTS "Chat participants can view messages."
  ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = messages.chat_id AND user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Chat participants can send messages."
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_id = messages.chat_id AND user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can update their own messages."
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own messages."
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- RLS Policies for public.relationships
CREATE POLICY IF NOT EXISTS "Users can view relationships."
  ON public.relationships FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can create relationships (follow others)."
  ON public.relationships FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY IF NOT EXISTS "Users can delete relationships (unfollow others)."
  ON public.relationships FOR DELETE
  USING (auth.uid() = follower_id);
