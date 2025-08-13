-- RPC to upsert user and profile with elevated privileges
-- Run this in Supabase SQL editor or include in migrations

CREATE OR REPLACE FUNCTION public.upsert_user_and_profile(
  p_id uuid,
  p_email text,
  p_full_name text,
  p_phone text DEFAULT NULL,
  p_role text DEFAULT 'admin',
  p_org uuid DEFAULT NULL,
  p_avatar text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure users row exists/updated
  INSERT INTO public.users (id, email, full_name, phone, role, organisation_id, is_active, avatar_url)
  VALUES (p_id, p_email, p_full_name, p_phone, COALESCE(p_role, 'admin'), p_org, true, p_avatar)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    organisation_id = COALESCE(EXCLUDED.organisation_id, public.users.organisation_id),
    is_active = true,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);

  -- Derive first/last name from full name
  PERFORM 1;
  -- Insert or update profiles
  INSERT INTO public.profiles (id, email, nom, prenom, role, statut)
  VALUES (
    p_id,
    p_email,
    split_part(COALESCE(p_full_name, ''), ' ', 1),
    NULLIF(regexp_replace(COALESCE(p_full_name, ''), '^\S+\s*', ''), ''),
    COALESCE(p_role, 'admin'),
    'actif'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    statut = 'actif';
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_user_and_profile(uuid, text, text, text, text, uuid, text) TO authenticated;