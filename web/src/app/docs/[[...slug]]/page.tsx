import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocPage, listAllDocPaths } from "@/shared/lib/docs-source";
import { DocsView } from "@/views/docs/DocsView";

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams(): Promise<
  Array<{ slug?: string[] }>
> {
  const paths = await listAllDocPaths();
  return paths.map(({ slug }) =>
    slug.length ? { slug } : { slug: undefined },
  );
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getDocPage(slug);
  if (!page) return { title: "Docs · Thailang" };
  return {
    title: `${page.title} · Thailang docs`,
    description: page.subtitle ?? undefined,
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = await getDocPage(slug);
  if (!page) notFound();
  return <DocsView page={page} />;
}
