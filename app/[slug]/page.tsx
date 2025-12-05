import { notFound } from "next/navigation";
import { LinkBioService } from "@/lib/services/LinkBioService";
import { LinkBioPage } from "@/components/linkbio/LinkBioPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const linkBioService = new LinkBioService();

  const profile = await linkBioService.getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return <LinkBioPage profile={profile} />;
}

