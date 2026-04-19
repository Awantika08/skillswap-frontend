import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Tag, Users, Layers, Zap } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";
import { cn } from "@/lib/utils";

interface SkillsOverviewProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function SkillsOverview({ stats, isLoading }: SkillsOverviewProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-white/20 dark:border-gray-800/20 rounded-[2rem] p-6 space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
      </Card>
    );
  }

  const totalSkills = parseInt(stats?.skills.total_skills || "0");
  const availableSkills = parseInt(stats?.skills.available_skills || "0");
  const categories = parseInt(stats?.skills.total_categories || "0");
  const mentorsWithSkills = parseInt(stats?.skills.mentors_with_skills || "0");
  const totalMentors = parseInt(stats?.users.total_mentors || "0");
  
  const skillsUtilization = totalMentors > 0 ? (mentorsWithSkills / totalMentors) * 100 : 0;

  return (
    <Card className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border-white/20 dark:border-gray-800/20 shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-white/10">
      <CardHeader className="pb-4 border-b border-white/10 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-gray-500">
          <div className="h-6 w-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Zap className="h-3.5 w-3.5" />
          </div>
          Knowledge Ecosystem
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl group transition-all hover:bg-purple-500/20">
            <div className="flex items-center gap-2 text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2">
              <Layers className="h-3 w-3" />
              Total Skills
            </div>
            <p className="text-2xl font-black text-purple-700 dark:text-purple-300">{totalSkills}</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl group transition-all hover:bg-cyan-500/20">
            <div className="flex items-center gap-2 text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
              <Tag className="h-3 w-3" />
              Categories
            </div>
            <p className="text-2xl font-black text-cyan-700 dark:text-cyan-300">{categories}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">Active Skills</span>
            </div>
            <span className="text-xs font-black text-gray-900 dark:text-white">{availableSkills}</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">Mentor Adoption</span>
            </div>
            <span className="text-xs font-black text-gray-900 dark:text-white">{mentorsWithSkills} / {totalMentors}</span>
          </div>

          <div className="pt-2">
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] rounded-full transition-all duration-1000" 
                style={{ width: `${skillsUtilization}%` }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/30 dark:bg-gray-800/30 rounded-xl border border-white/20">
               <Users className="w-3 h-3 text-primary" />
               <p className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase">
                 {skillsUtilization.toFixed(0)}% Talent Saturation
               </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}