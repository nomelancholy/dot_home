import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { formSchema } from "./pages/email-signup-page";
import type { Database, supabaseAdmin } from "@/supa-client";

interface ProfileInsert {
  profile_id: string;
  name: string;
  email: string;
  phone: string;
  email_consent: boolean;
  phone_consent: boolean;
  agree_terms: boolean;
  agree_privacy: boolean;
}

interface AddressInsert {
  profile_id: string;
  address_name: string;
  address: string;
  zipcode: string;
}

export const createProfile = async (
  client: SupabaseClient<Database>,
  profile: ProfileInsert
) => {
  const { data: profileData, error } = await client
    .from("profiles")
    .insert({
      profile_id: profile.profile_id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      email_consent: profile.email_consent,
      phone_consent: profile.phone_consent,
      agree_terms: profile.agree_terms,
      agree_privacy: profile.agree_privacy,
    })
    .select();
  if (error) {
    throw error;
  }
};

export const createAddress = async (
  client: SupabaseClient<Database>,
  address: AddressInsert
) => {
  const { data: addressData, error } = await client
    .from("addresses")
    .insert({
      profile_id: address.profile_id,
      address_name: address.address_name,
      address: address.address,
      zipcode: address.zipcode,
    })
    .select();
  if (error) {
    throw error;
  }
};
