type BlockHeadingProps = {
  title: string;
  subtitle: string;
};

export function BlockHeading({ title, subtitle }: BlockHeadingProps) {
  return (
    <h2 className="inline-flex items-center gap-1 text-2xl font-semibold">
      {title}
      <span className="text-sm text-gray-600 dark:text-gray-400">
        — {subtitle}
      </span>
    </h2>
  );
}
