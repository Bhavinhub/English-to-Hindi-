"use client";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { GlassInput, GlassTabs } from "@/components/glass";
import { Container, PageHeader, EmptyState } from "@/components/common/ui";
import { CourseCard } from "@/components/landing/Sections";
import { courses } from "@/data/courses";
import { getLesson } from "@/data/lessons";

type F = "all" | "beginner" | "elementary" | "intermediate";

export function CourseLibrary() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<F>("all");
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return courses.filter((c) => {
      if (level !== "all" && c.level !== level && c.level !== "all") return false;
      if (!n) return true;
      const hay = [c.title, c.titleHi, c.summary, ...c.outcomes, ...c.lessonIds.map((id) => `${getLesson(id)?.title} ${getLesson(id)?.titleHi}`)].join(" ").toLowerCase();
      return hay.includes(n);
    });
  }, [q, level]);

  return (
    <Container>
      <PageHeader eyebrow="Course library" title="Courses" hi="सभी कोर्स">
        Six modules, each with complete lessons, Hindi explanations, dialogues and practice.
      </PageHeader>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="relative md:max-w-sm md:flex-1">
          <Search className="pointer-events-none absolute left-4 top-[2.85rem] z-10 h-4 w-4 text-ink-mute" aria-hidden />
          <GlassInput id="course-search" label="Search courses and lessons" placeholder="e.g. interview, ordering food, past tense" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" type="search" />
        </div>
        <GlassTabs
          label="Filter by level"
          idPrefix="lvl"
          value={level}
          onChange={setLevel}
          tabs={[{ id: "all", label: "All" }, { id: "beginner", label: "Beginner" }, { id: "elementary", label: "Elementary" }, { id: "intermediate", label: "Intermediate" }]}
        />
      </div>
      <p className="sr-only" role="status">{list.length} courses shown</p>
      <div id={`lvl-panel-${level}`} role="tabpanel" aria-labelledby={`lvl-tab-${level}`}>
      {list.length === 0 ? (
        <EmptyState icon={<SearchX className="h-6 w-6" aria-hidden />} title="No courses match your search">
          Try a different word, or clear the level filter.
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.slug}><CourseCard slug={c.slug} /></li>
          ))}
        </ul>
      )}
      </div>
    </Container>
  );
}
