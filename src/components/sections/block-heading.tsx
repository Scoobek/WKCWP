type BlockHeadingProps = {
  title: string;
  subtitle: string;
};

export function BlockHeading({ title, subtitle }: BlockHeadingProps) {
  return (
    <h2 className="inline-flex items-center gap-1 text-2xl font-semibold">
      {title}
      <span className="text-muted-foreground text-sm">— {subtitle}</span>
    </h2>
  );
}
