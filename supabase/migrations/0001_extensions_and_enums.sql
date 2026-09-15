-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
-- Provides moddatetime(), used as a generic "set updated_at = now()" trigger
-- on every table below that has an updated_at column.
create extension if not exists moddatetime schema extensions;

-- Enums
create type app_role as enum (
  'super_admin',
  'admin',
  'finance',
  'sales',
  'content_manager',
  'customer'
);

create type quote_status as enum (
  'new',
  'reviewing',
  'contacted',
  'quotation_sent',
  'negotiation',
  'approved',
  'rejected',
  'completed'
);

create type order_status as enum (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

create type payment_method as enum ('cod', 'bank_transfer');
create type payment_status as enum ('unpaid', 'paid', 'refunded');
create type content_block_status as enum ('draft', 'published');
