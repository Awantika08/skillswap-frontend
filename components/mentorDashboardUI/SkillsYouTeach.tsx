import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen } from "lucide-react";
import { PopularSkill } from "@/types/mentorDashboard";
import Link from "next/link";

interface SkillsYouTeachProps {
  skills?: PopularSkill[];
}

export default function SkillsYouTeach({ skills }: SkillsYouTeachProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Skills You Teach
        </h2>
        <Card className="p-8 text-center border-dashed border-2 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/20">
          <BookOpen className="h-8 w-8 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 mb-4">You haven't added any skills yet.</p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/mentor/profile">Add Skills</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Popular Skills
        </h2>
        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary" asChild>
          <Link href="/mentor/profile">View all</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <Card key={skill.SkillID} className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 hover:border-primary/50 transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {skill.Name}
              </h3>
              {skill.IsAvailable ? (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">
                  Active
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full dark:bg-gray-800 dark:text-gray-400">
                  Inactive
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">{skill.sessionCount}</span> sessions completed
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Users className="h-3.5 w-3.5" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">{skill.uniqueLearners}</span> unique learners
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
