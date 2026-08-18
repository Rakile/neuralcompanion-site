import { SITE } from '../data/site.ts';

export function canonicalUrl(pathname: string): string {
  const normalized = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
  return new URL(normalized, SITE.origin).href;
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
