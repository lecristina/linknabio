"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkBioPage } from "./LinkBioPage";
import type { ProfileWithLinks } from "@/types/linkbio";
import { Smartphone, Monitor } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkBioPreviewProps {
  profile: ProfileWithLinks;
}

export function LinkBioPreview({ profile }: LinkBioPreviewProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Preview</CardTitle>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3",
              viewMode === "mobile" && "bg-background shadow-sm"
            )}
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3",
              viewMode === "desktop" && "bg-background shadow-sm"
            )}
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div
            className={cn(
              "border rounded-2xl overflow-hidden shadow-xl transition-all duration-300",
              viewMode === "mobile"
                ? "w-[375px] h-[667px]"
                : "w-full max-w-3xl h-[600px]"
            )}
          >
            <div className="w-full h-full overflow-auto">
              <LinkBioPage profile={profile} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
