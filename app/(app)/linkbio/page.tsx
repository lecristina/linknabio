"use client";

import { useEffect, useState } from "react";
import { LinkBioEditor } from "@/components/linkbio/LinkBioEditor";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import type { ProfileWithLinks } from "@/types/linkbio";
import { Loader2 } from "lucide-react";

export default function LinkBioPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileWithLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (authLoading) return;

      try {
        const response = await fetch("/api/linkbio/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <LinkBioEditor initialProfile={profile} />;
}
