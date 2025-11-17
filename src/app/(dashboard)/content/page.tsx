"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ensureBrowserToken } from "@/lib/ensure-token";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type GeneratorType = "blog" | "gbp_post" | "faq";

type Project = {
  id: string;
  title: string;
  type: GeneratorType;
  input: {
    businessName?: string;
    city?: string;
    service?: string;
    tone?: string;
    [key: string]: unknown;
  };
  output_md: string | null;
  created_at: string;
};

export default function ContentPage() {
  const [type, setType] = useState<GeneratorType>("blog");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [tone, setTone] = useState("Friendly and helpful");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  const generatorOptions = useMemo(
    () => [
      { value: "blog", label: "Blog" },
      { value: "gbp_post", label: "GBP Post" },
      { value: "faq", label: "FAQs" },
    ],
    []
  );

  const loadProjects = useCallback(async () => {
    try {
      const t = await ensureBrowserToken();
      console.log(
        "[Content] calling /api/projects with token len:",
        (t || "").length
      );
      const res = await fetch("/api/projects", {
        method: "GET",
        headers: t ? { Authorization: `Bearer ${t}` } : {},
      });

      const data = await res.json();
      if (res.ok) setProjects(data.projects || []);
      else alert(data.error || "Unable to load projects");
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Unable to load projects");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const t = await ensureBrowserToken();
      if (t) loadProjects();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disableGenerate =
    !businessName.trim() || !city.trim() || !service.trim() || loading;

  async function onGenerate() {
    if (disableGenerate) return;

    const t = await ensureBrowserToken();
    setLoading(true);
    setMarkdown("");

    try {
      console.log(
        "[Content] calling /api/openai/generate with token len:",
        (t || "").length
      );
      const res = await fetch("/api/openai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
        body: JSON.stringify({ type, businessName, city, service, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setMarkdown(data.markdown || "");
    } catch (e: any) {
      alert(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    if (!markdown) return;

    const t = await ensureBrowserToken();
    setSaving(true);

    try {
      const title = `${type.toUpperCase()} - ${businessName} in ${city}`;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
        body: JSON.stringify({
          title,
          type,
          input: { businessName, city, service, tone },
          output_md: markdown,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      await loadProjects();
      alert("Saved!");
    } catch (e: any) {
      alert(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function onCopy() {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown).then(
      () => alert("Copied to clipboard"),
      () => alert("Failed to copy")
    );
  }

  function onDownload() {
    if (!markdown) return;

    const safeBusinessName = businessName.replace(/\s+/g, "_");
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${type}-${safeBusinessName || "content"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function openProject(project: Project) {
    setType(project.type);
    setBusinessName(project.input.businessName ?? "");
    setCity(project.input.city ?? "");
    setService(project.input.service ?? "");
    setTone(project.input.tone ?? "Friendly and helpful");
    setMarkdown(project.output_md ?? "");
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Create Content</h1>
          <p className="text-muted-foreground">
            Generate ready-to-publish marketing content tailored to your
            business.
          </p>
        </div>

        <div className="flex gap-2">
          {generatorOptions.map((option) => (
            <Button
              key={option.value}
              variant={type === option.value ? "default" : "secondary"}
              onClick={() => setType(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 max-w-2xl">
          <Input
            placeholder="Business name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="City"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            <Input
              placeholder="Service (e.g., Italian restaurant)"
              value={service}
              onChange={(event) => setService(event.target.value)}
            />
          </div>

          <Textarea
            placeholder="Tone (e.g., Friendly and helpful)"
            value={tone}
            onChange={(event) => setTone(event.target.value)}
          />

          <div className="flex flex-wrap gap-3">
            <Button onClick={onGenerate} disabled={disableGenerate}>
              {loading ? "Generating..." : "Generate"}
            </Button>
            <Button
              variant="secondary"
              onClick={onSave}
              disabled={!markdown || saving}
            >
              {saving ? "Saving..." : "Save as Project"}
            </Button>
            <Button variant="secondary" onClick={onCopy} disabled={!markdown}>
              Copy
            </Button>
            <Button
              variant="secondary"
              onClick={onDownload}
              disabled={!markdown}
            >
              Download .md
            </Button>
          </div>
        </div>

        <div className="prose max-w-none border rounded-md p-4">
          {markdown ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">
              Your generated Markdown will appear here…
            </p>
          )}
        </div>
      </div>

      <aside className="border-l pl-4">
        <h3 className="font-medium mb-2">Your Projects</h3>
        <div className="space-y-2 max-h-[80vh] overflow-auto pr-2">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => openProject(project)}
              className="w-full text-left border rounded p-2 hover:bg-accent"
            >
              <div className="text-sm font-medium">{project.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(project.created_at).toLocaleString()}
              </div>
            </button>
          ))}

          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

