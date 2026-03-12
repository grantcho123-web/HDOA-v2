import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(request) {
  const body = await request.json();
  const db = getServiceClient();
  await db.from('affiliate_clicks').insert({
    platform: body.platform,
    role_id: body.role_id,
    user_id: body.user_id || null,
  });
  return NextResponse.json({ ok: true });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  const db = getServiceClient();
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await db.from('affiliate_clicks').select('platform').gte('clicked_at', since);
  const stats = {};
  (data || []).forEach(d => { stats[d.platform] = (stats[d.platform] || 0) + 1; });
  return NextResponse.json({
    total: data?.length || 0,
    by_platform: Object.entries(stats).sort((a, b) => b[1] - a[1]).map(([platform, clicks]) => ({ platform, clicks })),
  });
}
