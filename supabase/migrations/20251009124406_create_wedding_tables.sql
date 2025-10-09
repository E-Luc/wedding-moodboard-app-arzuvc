/*
  # Création des tables pour My Wedding Planist
  
  ## Tables créées
  
  ### 1. guests (Invités)
  - `id` (uuid, clé primaire)
  - `user_id` (uuid, référence à auth.users)
  - `name` (text) - Nom de l'invité
  - `email` (text) - Email de l'invité
  - `phone` (text) - Téléphone
  - `status` (text) - pending, confirmed, declined
  - `plus_one` (boolean) - A un +1
  - `plus_one_name` (text) - Nom du +1
  - `group` (text) - Groupe (famille, amis, etc.)
  - `dietary_restrictions` (text) - Restrictions alimentaires
  - `notes` (text) - Notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. budget_items (Budget)
  - `id` (uuid, clé primaire)
  - `user_id` (uuid, référence à auth.users)
  - `category` (text) - Catégorie de dépense
  - `budgeted` (numeric) - Montant budgété
  - `spent` (numeric) - Montant dépensé
  - `icon` (text) - Icône
  - `color` (text) - Couleur
  - `description` (text) - Description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. budget_expenses (Dépenses)
  - `id` (uuid, clé primaire)
  - `budget_item_id` (uuid, référence à budget_items)
  - `amount` (numeric) - Montant
  - `description` (text) - Description
  - `date` (date) - Date de la dépense
  - `vendor` (text) - Prestataire
  - `created_at` (timestamptz)
  
  ### 4. timeline_items (Timeline)
  - `id` (uuid, clé primaire)
  - `user_id` (uuid, référence à auth.users)
  - `title` (text) - Titre de la tâche
  - `description` (text) - Description
  - `date` (text) - Date
  - `time` (text) - Heure
  - `completed` (boolean) - Complété
  - `category` (text) - planning, booking, preparation, ceremony
  - `icon` (text) - Icône
  - `priority` (text) - low, medium, high
  - `assigned_to` (text) - Assigné à
  - `notes` (text) - Notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. vendors (Prestataires)
  - `id` (uuid, clé primaire)
  - `user_id` (uuid, référence à auth.users)
  - `name` (text) - Nom du prestataire
  - `category` (text) - photographer, caterer, florist, musician, venue, decorator, other
  - `phone` (text) - Téléphone
  - `email` (text) - Email
  - `website` (text) - Site web
  - `price` (numeric) - Prix
  - `status` (text) - contacted, booked, declined, pending
  - `notes` (text) - Notes
  - `rating` (integer) - Note de 1 à 5
  - `address` (text) - Adresse
  - `contact_person` (text) - Personne de contact
  - `contract_signed` (boolean) - Contrat signé
  - `deposit_paid` (boolean) - Acompte payé
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 6. inspiration_items (Inspirations)
  - `id` (uuid, clé primaire)
  - `user_id` (uuid, référence à auth.users)
  - `title` (text) - Titre
  - `description` (text) - Description
  - `image_url` (text) - URL de l'image
  - `category` (text) - dress, flowers, venue, decoration, cake, hairstyle, other
  - `tags` (text[]) - Tags
  - `is_favorite` (boolean) - Favori
  - `source` (text) - Source
  - `notes` (text) - Notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Sécurité
  
  - RLS activé sur toutes les tables
  - Politiques permettant aux utilisateurs d'accéder uniquement à leurs données
*/

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  plus_one boolean DEFAULT false,
  plus_one_name text,
  "group" text,
  dietary_restrictions text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guests"
  ON guests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guests"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guests"
  ON guests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own guests"
  ON guests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Budget items table
CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  budgeted numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  icon text DEFAULT 'wallet',
  color text DEFAULT '#F4C2C2',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget items"
  ON budget_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget items"
  ON budget_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget items"
  ON budget_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget items"
  ON budget_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Budget expenses table
CREATE TABLE IF NOT EXISTS budget_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_item_id uuid REFERENCES budget_items(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  vendor text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE budget_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget expenses"
  ON budget_expenses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM budget_items
      WHERE budget_items.id = budget_expenses.budget_item_id
      AND budget_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own budget expenses"
  ON budget_expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM budget_items
      WHERE budget_items.id = budget_expenses.budget_item_id
      AND budget_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own budget expenses"
  ON budget_expenses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM budget_items
      WHERE budget_items.id = budget_expenses.budget_item_id
      AND budget_items.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM budget_items
      WHERE budget_items.id = budget_expenses.budget_item_id
      AND budget_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own budget expenses"
  ON budget_expenses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM budget_items
      WHERE budget_items.id = budget_expenses.budget_item_id
      AND budget_items.user_id = auth.uid()
    )
  );

-- Timeline items table
CREATE TABLE IF NOT EXISTS timeline_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  completed boolean DEFAULT false,
  category text NOT NULL CHECK (category IN ('planning', 'booking', 'preparation', 'ceremony')),
  icon text DEFAULT 'checkmark-circle',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timeline items"
  ON timeline_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timeline items"
  ON timeline_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own timeline items"
  ON timeline_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own timeline items"
  ON timeline_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('photographer', 'caterer', 'florist', 'musician', 'venue', 'decorator', 'other')),
  phone text NOT NULL,
  email text NOT NULL,
  website text,
  price numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('contacted', 'booked', 'declined', 'pending')),
  notes text,
  rating integer DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  address text,
  contact_person text,
  contract_signed boolean DEFAULT false,
  deposit_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vendors"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vendors"
  ON vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vendors"
  ON vendors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Inspiration items table
CREATE TABLE IF NOT EXISTS inspiration_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('dress', 'flowers', 'venue', 'decoration', 'cake', 'hairstyle', 'other')),
  tags text[] DEFAULT '{}',
  is_favorite boolean DEFAULT false,
  source text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inspiration_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inspiration items"
  ON inspiration_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inspiration items"
  ON inspiration_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inspiration items"
  ON inspiration_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inspiration items"
  ON inspiration_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_guests_user_id ON guests(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_user_id ON budget_items(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_expenses_budget_item_id ON budget_expenses(budget_item_id);
CREATE INDEX IF NOT EXISTS idx_timeline_items_user_id ON timeline_items(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_items_user_id ON inspiration_items(user_id);
