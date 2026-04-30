"use client";

export default function StoryContent({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  return (
    <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
      <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      <div className="p-6">
        {content ? (
          <div className="prose prose-purple dark:prose-invert max-w-none">
            {content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h2 key={i} className="text-xl font-bold mb-3 mt-4">
                    {line.slice(2)}
                  </h2>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-lg font-semibold mb-2 mt-3">
                    {line.slice(3)}
                  </h3>
                );
              }
              if (line.trim() === "") return <br key={i} />;
              return (
                <p
                  key={i}
                  className="leading-relaxed text-[#4a148c] dark:text-[#c4a8e8]"
                >
                  {line}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No content available.</p>
        )}
      </div>
    </div>
  );
}
