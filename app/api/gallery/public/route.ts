import { NextRequest } from "next/server";
import { createResponse, createErrorResponse } from "@/lib/api-helpers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const featuredStr = searchParams.get("featured");
    const featured = featuredStr ? featuredStr === "true" : undefined;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

    const supabase = await createClient();

    let query = supabase.from("gallery").select("*");

    if (typeof featured === "boolean") {
      query = query.eq("featured", featured);
    }

    if (category) {
      query = query.eq("category", category);
    }

    query = query.range(offset, offset + limit - 1);

    if (sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ data: data || [] });
  } catch (error: any) {
    return createErrorResponse(
      error.message || "Failed to fetch gallery photos",
      500,
    );
  }
}
