export default function AdminPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This area is restricted to administrators. You can plug in real admin tools later.
        </p>
      </div>
      <div className="rounded-lg border bg-card/60 p-4 text-sm text-muted-foreground">
        Placeholder admin content.
      </div>
    </div>
  );
}
