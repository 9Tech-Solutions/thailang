export const MAX_HASH_CHARS = 1800;

const HASH_KEY = "s";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gzip(input: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  writer.write(input as BufferSource);
  writer.close();
  return new Uint8Array(await new Response(cs.readable).arrayBuffer());
}

async function gunzip(input: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(input as BufferSource);
  writer.close();
  return new Uint8Array(await new Response(ds.readable).arrayBuffer());
}

export function isCompressionSupported(): boolean {
  return typeof CompressionStream !== "undefined";
}

export interface EncodeResult {
  encoded: string;
  tooLong: boolean;
}

export async function encodeSource(source: string): Promise<EncodeResult> {
  if (!isCompressionSupported()) {
    return { encoded: "", tooLong: true };
  }
  const bytes = new TextEncoder().encode(source);
  const compressed = await gzip(bytes);
  const encoded = toBase64Url(compressed);
  return { encoded, tooLong: encoded.length > MAX_HASH_CHARS };
}

export async function buildShareUrl(source: string): Promise<string | null> {
  const { encoded, tooLong } = await encodeSource(source);
  if (tooLong) return null;
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "/playground";
  return `${base}#${HASH_KEY}=${encoded}`;
}

export async function decodeFromHash(
  hash: string | undefined | null,
): Promise<string | null> {
  if (!hash) return null;
  if (!isCompressionSupported()) return null;
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  const encoded = params.get(HASH_KEY);
  if (!encoded) return null;
  try {
    const bytes = fromBase64Url(encoded);
    const decompressed = await gunzip(bytes);
    return new TextDecoder().decode(decompressed);
  } catch {
    return null;
  }
}
