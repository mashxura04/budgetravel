import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wgrbhxdzovctthwofqtt.supabase.co";
const supabaseKey = "sb_publishable_EbpS2qo1iGl0DaARIvlOBQ_fYsE7qAN";

export const supabase = createClient(supabaseUrl, supabaseKey);