type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionIntro({ eyebrow, title, description, align = "left" }: SectionIntroProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <div className={`eyebrow ${centered ? "mx-auto" : ""}`}>{eyebrow}</div> : null}
      <h2 className="section-title mt-4 text-foreground">{title}</h2>
      {description ? <p className={`section-copy mt-4 ${centered ? "mx-auto" : ""}`}>{description}</p> : null}
    </div>
  );
}
