-- FUSION Complete Database Schema
-- PostgreSQL Migration Script
-- Generated for MFTBC FUSION Project

-- Drop existing tables if they exist
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS discussion_replies CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS blog_attachments CASCADE;
DROP TABLE IF EXISTS blog_images CASCADE;
DROP TABLE IF EXISTS blog_tags CASCADE;
DROP TABLE IF EXISTS blog_places CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS social_feeds CASCADE;
DROP TABLE IF EXISTS navigation_tabs CASCADE;
DROP TABLE IF EXISTS quick_access CASCADE;
DROP TABLE IF EXISTS corporate_announcements CASCADE;
DROP TABLE IF EXISTS subspaces CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    department VARCHAR(100),
    job_title VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'Category',
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    link_icon_url TEXT,
    is_published BOOLEAN DEFAULT true,
    parent_category INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_category_type CHECK (type IN ('Category', 'Link'))
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_parent ON categories(parent_category);
CREATE INDEX idx_categories_published ON categories(is_published);

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tags Table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_slug ON tags(slug);

-- Places Table
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_places_type ON places(type);
CREATE INDEX idx_places_name ON places(name);

-- Subspaces Table
CREATE TABLE subspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content_html TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subspaces_published ON subspaces(is_published);

CREATE TRIGGER update_subspaces_updated_at BEFORE UPDATE ON subspaces
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blogs Table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    content_html TEXT,
    publish_to VARCHAR(50) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    space_id INTEGER REFERENCES subspaces(id) ON DELETE SET NULL,
    place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
    restricted_comments BOOLEAN DEFAULT false,
    is_place_blog BOOLEAN DEFAULT false,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'published',
    published_at TIMESTAMP DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_publish_to CHECK (publish_to IN ('News', 'HR', 'IT'))
);

CREATE INDEX idx_blogs_publish_to ON blogs(publish_to);
CREATE INDEX idx_blogs_category ON blogs(category_id);
CREATE INDEX idx_blogs_space ON blogs(space_id);
CREATE INDEX idx_blogs_place ON blogs(place_id);
CREATE INDEX idx_blogs_author ON blogs(author_id);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog Tags Junction Table
CREATE TABLE blog_tags (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blog_id, tag_id)
);

CREATE INDEX idx_blog_tags_blog ON blog_tags(blog_id);
CREATE INDEX idx_blog_tags_tag ON blog_tags(tag_id);

-- Blog Places Junction Table
CREATE TABLE blog_places (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blog_id, place_id)
);

CREATE INDEX idx_blog_places_blog ON blog_places(blog_id);
CREATE INDEX idx_blog_places_place ON blog_places(place_id);

-- Blog Images Table
CREATE TABLE blog_images (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blog_images_blog ON blog_images(blog_id);

-- Blog Attachments Table
CREATE TABLE blog_attachments (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blog_attachments_blog ON blog_attachments(blog_id);

-- Corporate Announcements Table
CREATE TABLE corporate_announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    content_html TEXT,
    image_url TEXT,
    priority VARCHAR(50) DEFAULT 'normal',
    is_published BOOLEAN DEFAULT true,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

CREATE INDEX idx_announcements_published ON corporate_announcements(is_published);
CREATE INDEX idx_announcements_priority ON corporate_announcements(priority);
CREATE INDEX idx_announcements_published_at ON corporate_announcements(published_at);

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON corporate_announcements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Quick Access Table
CREATE TABLE quick_access (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    icon_url TEXT,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quick_access_category ON quick_access(category);
CREATE INDEX idx_quick_access_active ON quick_access(is_active);
CREATE INDEX idx_quick_access_order ON quick_access(display_order);

CREATE TRIGGER update_quick_access_updated_at BEFORE UPDATE ON quick_access
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Navigation Tabs Table
CREATE TABLE navigation_tabs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_navigation_tabs_active ON navigation_tabs(is_active);
CREATE INDEX idx_navigation_tabs_order ON navigation_tabs(display_order);

CREATE TRIGGER update_navigation_tabs_updated_at BEFORE UPDATE ON navigation_tabs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_public ON documents(is_public);

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Social Feeds Table
CREATE TABLE social_feeds (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    content_html TEXT,
    image_url TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    parent_id INTEGER REFERENCES social_feeds(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_social_feeds_author ON social_feeds(author_id);
CREATE INDEX idx_social_feeds_parent ON social_feeds(parent_id);
CREATE INDEX idx_social_feeds_pinned ON social_feeds(is_pinned);
CREATE INDEX idx_social_feeds_created ON social_feeds(created_at);

CREATE TRIGGER update_social_feeds_updated_at BEFORE UPDATE ON social_feeds
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_html TEXT,
    location VARCHAR(500),
    place_id INTEGER REFERENCES places(id) ON DELETE SET NULL,
    event_type VARCHAR(100),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    is_all_day BOOLEAN DEFAULT false,
    organizer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    image_url TEXT,
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT false,
    registration_deadline TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_event_status CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled'))
);

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_events_place ON events(place_id);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Event Attendees Table
CREATE TABLE event_attendees (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    UNIQUE(event_id, user_id),
    CONSTRAINT chk_attendee_status CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlist'))
);

CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);

-- Discussions Table
CREATE TABLE discussions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_discussions_category ON discussions(category_id);
CREATE INDEX idx_discussions_author ON discussions(author_id);
CREATE INDEX idx_discussions_pinned ON discussions(is_pinned);
CREATE INDEX idx_discussions_created ON discussions(created_at);

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Discussion Replies Table
CREATE TABLE discussion_replies (
    id SERIAL PRIMARY KEY,
    discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    parent_reply_id INTEGER REFERENCES discussion_replies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_html TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    like_count INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_discussion_replies_discussion ON discussion_replies(discussion_id);
CREATE INDEX idx_discussion_replies_parent ON discussion_replies(parent_reply_id);
CREATE INDEX idx_discussion_replies_author ON discussion_replies(author_id);

CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON discussion_replies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Polls Table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT false,
    allow_multiple_choices BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_polls_author ON polls(author_id);
CREATE INDEX idx_polls_category ON polls(category_id);
CREATE INDEX idx_polls_active ON polls(is_active);
CREATE INDEX idx_polls_end_date ON polls(end_date);

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Poll Options Table
CREATE TABLE poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(500) NOT NULL,
    display_order INTEGER DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);

-- Poll Votes Table
CREATE TABLE poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(poll_id, option_id, user_id)
);

CREATE INDEX idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX idx_poll_votes_option ON poll_votes(option_id);
CREATE INDEX idx_poll_votes_user ON poll_votes(user_id);

-- Insert default data
INSERT INTO users (email, password_hash, first_name, last_name, display_name, role) VALUES
('admin@fusion.com', '$2b$10$placeholder', 'Admin', 'User', 'Admin User', 'admin'),
('user@fusion.com', '$2b$10$placeholder', 'Regular', 'User', 'Regular User', 'user');

INSERT INTO categories (type, name, description, is_published) VALUES
('Category', 'News', 'Company news and updates', true),
('Category', 'HR', 'Human Resources information', true),
('Category', 'IT', 'Information Technology resources', true),
('Category', 'General', 'General announcements', true);

INSERT INTO tags (name, slug) VALUES
('announcement', 'announcement'),
('update', 'update'),
('urgent', 'urgent'),
('information', 'information');

------------------------------------------------------------------
-- BLOG LIKES TABLE (safe patch)
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS blog_likes (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (blog_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_likes_blog ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user ON blog_likes(user_id);

------------------------------------------------------------------
-- BLOG COMMENTS TABLE (safe patch)
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS blog_comments (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user ON blog_comments(user_id);

------------------------------------------------------------------
-- TRIGGER FOR blog_comments.updated_at (SAFE)
------------------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_comments_updated_at'
    ) THEN
        DROP TRIGGER update_blog_comments_updated_at ON blog_comments;
    END IF;
END$$;

CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON blog_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
