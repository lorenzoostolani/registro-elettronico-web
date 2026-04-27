import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/core/api/apiConfig';

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path);
}

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const target = `${API_CONFIG.remoteBaseUrl}/${pathSegments.join('/')}`;
  const method = req.method;
  const body = method !== 'GET' ? await req.arrayBuffer() : undefined;

  const upstreamResponse = await fetch(target, {
    method,
    headers: {
      [API_CONFIG.headers.apiKey]: API_CONFIG.apiKey,
      [API_CONFIG.headers.token]: req.headers.get(API_CONFIG.headers.token) ?? '',
      'Content-Type': 'application/json',
      'User-Agent': API_CONFIG.userAgent,
    },
    body,
  });

  const responseBody = await upstreamResponse.arrayBuffer();
  return new Response(responseBody, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': upstreamResponse.headers.get('Content-Type') ?? 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}