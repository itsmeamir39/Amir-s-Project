export default async function PatronSubPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const path = `/patron/${slug.join("/")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Patron</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        TODO: Port the Library Hub page for <span className="font-medium">{path}</span>.
      </p>
    </div>
  );
}

