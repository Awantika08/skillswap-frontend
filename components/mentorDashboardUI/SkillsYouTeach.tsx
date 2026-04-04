import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";

export default function SkillsYouTeach() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Skills You Teach
      </h2>

      <Card className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            React & JavaScript
          </h3>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">
            Active
          </span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          156 sessions completed
        </p>

        <div className="flex items-center gap-1 mb-6">
          <Star className="h-4 w-4 fill-rose-400 text-rose-400" />
          <Star className="h-4 w-4 fill-rose-400 text-rose-400" />
          <Star className="h-4 w-4 fill-rose-400 text-rose-400" />
          <Star className="h-4 w-4 fill-rose-400 text-rose-400" />
          <Star className="h-4 w-4 fill-rose-400 text-rose-400" />
          <span className="ml-1 text-sm font-bold text-gray-900 dark:text-white">4.9</span>
        </div>

        <Button variant="outline" className="w-full border-dashed border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </Button>
      </Card>
    </div>
  );
}
