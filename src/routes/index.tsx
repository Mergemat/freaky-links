import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{ freakyUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createLink = useMutation(api.links.createLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCopied(false);
    setIsLoading(true);

    try {
      // Add https:// if no protocol specified
      let processedUrl = url.trim();
      if (
        !(
          processedUrl.startsWith("http://") ||
          processedUrl.startsWith("https://")
        )
      ) {
        processedUrl = `https://${processedUrl}`;
      }

      const response = await createLink({ url: processedUrl });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.freakyUrl) {
      await navigator.clipboard.writeText(result.freakyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-4 text-center">
          <img
            alt="Freaky cat"
            className="mx-auto h-32 w-32 rounded-full"
            height={128}
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnpiY3oyYXhrMW9tbThiem5jbTBkMW12YzhpaTdwZWR2MXBuMHBmbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SGrH94u2qJwqhu3Ouu/giphy.gif"
            width={128}
          />
          <h1 className="font-bold text-4xl tracking-tight">FreakyLinks</h1>
          <p className="text-muted-foreground">
            The URL shortener that makes your links look freaky
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paste your innocent link</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                type="text"
                value={url}
              />
              <Button
                className="w-full"
                disabled={isLoading || !url.trim()}
                type="submit"
              >
                {isLoading ? "Making it freaky..." : "Make it freaky"}
              </Button>
            </form>

            {error && <p className="mt-4 text-destructive text-sm">{error}</p>}

            {result && (
              <div className="mt-6 space-y-3">
                <p className="text-muted-foreground text-sm">
                  Your suspiciously shortened URL:
                </p>
                <div className="flex gap-2">
                  <Input
                    className="font-mono text-sm"
                    readOnly
                    type="text"
                    value={result.freakyUrl}
                  />
                  <Button onClick={handleCopy} type="button" variant="outline">
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
