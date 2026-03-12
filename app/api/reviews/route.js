import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const db = getServiceClient();
  let query = db.from('reviews').select('*').order('created_at', { ascending: false });
  if (platform) query = query.eq('platform', platform);
  const { data, error } = await query.limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const db = getServiceClient();
  const { data, error } = await db.from('reviews').insert({
    user_id: userId,
    platform: body.platform,
    rating: body.rating,
    title: body.title,
    body: body.body,
    pros: body.pros,
    cons: body.cons,
    hourly_pay: body.hourly_pay,
    hours_per_week: body.hours_per_week,
    role_type: body.role_type,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
