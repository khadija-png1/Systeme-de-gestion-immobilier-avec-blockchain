const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rqbxxkmvctdlwlyvebwy.supabase.co/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYnh4a212Y3RkbHdseXZlYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzM4NTMsImV4cCI6MjA5NDM0OTg1M30.uJrYC4kucDqXcxcUHdm_lV_02gua-vcPA74lI90PuNg";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;