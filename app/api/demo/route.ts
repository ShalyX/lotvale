import { sampleProject } from "@/lib/sample";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const project = sampleProject();
  const headers = { "Cache-Control": "no-store" };
  if (kind === "before-import") {
    project.quotes = project.quotes.filter((q) => q.id !== "counter");
    return new Response(JSON.stringify(project, null, 2), {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Content-Disposition":
          'attachment; filename="lotvale-before-import.json"',
      },
    });
  }
  if (kind === "quote") {
    return new Response(
      project.quotes.find((q) => q.id === "counter")!.sourceText,
      {
        headers: {
          ...headers,
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="counter-supply-quote.txt"',
        },
      },
    );
  }
  return Response.json(
    { error: "Use kind=before-import or kind=quote" },
    { status: 400, headers },
  );
}
