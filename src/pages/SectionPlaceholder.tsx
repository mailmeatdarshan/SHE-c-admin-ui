interface SectionPlaceholderProps {
  title: string;
  description: string;
}

const SectionPlaceholder = ({
  title,
  description,
}: SectionPlaceholderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          {title} module content will render here inside the Dashboard{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">
            &lt;Outlet /&gt;
          </code>
          .
        </p>
      </div>
    </div>
  );
};

export default SectionPlaceholder;
