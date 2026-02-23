"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SkillCard from "@/components/SkillCard";
import { Search, X } from "lucide-react";

const DUMMY_SKILLS = [
  {
    id: "1",
    title: "Web Development with React",
    description:
      "Learn modern React, hooks, and state management for building interactive web applications.",
    mentorName: "Sarah Chen",
    mentorInitials: "SC",
    mentorColor: "blue",
    level: "Intermediate" as const,
    category: "Technology",
  },
  {
    id: "2",
    title: "Digital Illustration Basics",
    description:
      "Master digital art fundamentals using Procreate and Adobe Creative Suite.",
    mentorName: "Marcus Williams",
    mentorInitials: "MW",
    mentorColor: "purple",
    level: "Beginner" as const,
    category: "Art & Design",
  },
  {
    id: "3",
    title: "Business English for Professionals",
    description:
      "Improve your business English skills for meetings, presentations, and professional communication.",
    mentorName: "Emma Thompson",
    mentorInitials: "ET",
    mentorColor: "green",
    level: "Intermediate" as const,
    category: "Language",
  },
  {
    id: "4",
    title: "Python Data Science",
    description:
      "Build a strong foundation in Python for data analysis, visualization, and machine learning.",
    mentorName: "Alex Kumar",
    mentorInitials: "AK",
    mentorColor: "indigo",
    level: "Advanced" as const,
    category: "Technology",
  },
  {
    id: "5",
    title: "Yoga & Mindfulness",
    description:
      "Discover yoga poses, breathing techniques, and meditation practices for better health.",
    mentorName: "Lisa Rodriguez",
    mentorInitials: "LR",
    mentorColor: "pink",
    level: "Beginner" as const,
    category: "Health & Wellness",
  },
  {
    id: "6",
    title: "Guitar for Beginners",
    description:
      "Learn to play guitar from scratch with chord progressions and music fundamentals.",
    mentorName: "James Cooper",
    mentorInitials: "JC",
    mentorColor: "amber",
    level: "Beginner" as const,
    category: "Music",
  },
  {
    id: "7",
    title: "UX/UI Design Principles",
    description:
      "Learn design thinking, user research, and interface design best practices.",
    mentorName: "Nina Patel",
    mentorInitials: "NP",
    mentorColor: "teal",
    level: "Intermediate" as const,
    category: "Art & Design",
  },
  {
    id: "8",
    title: "Advanced JavaScript",
    description:
      "Deep dive into JavaScript async patterns, closures, prototypes, and advanced concepts.",
    mentorName: "Tom Sullivan",
    mentorInitials: "TS",
    mentorColor: "blue",
    level: "Advanced" as const,
    category: "Technology",
  },
  {
    id: "9",
    title: "Spanish Conversation",
    description:
      "Practice conversational Spanish through dialogues, role-plays, and real-world scenarios.",
    mentorName: "Carlos Moreno",
    mentorInitials: "CM",
    mentorColor: "rose",
    level: "Intermediate" as const,
    category: "Language",
  },
];

const CATEGORIES = [
  "All",
  "Technology",
  "Art & Design",
  "Language",
  "Health & Wellness",
  "Music",
];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredSkills = useMemo(() => {
    return DUMMY_SKILLS.filter((skill) => {
      const matchesSearch =
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.mentorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || skill.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "All" || skill.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Browse Skills
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover new skills and connect with expert mentors
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search skills, mentors..."
              className="pl-10 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Level
            </h3>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery ||
        selectedCategory !== "All" ||
        selectedLevel !== "All" ? (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredSkills.length}{" "}
              {filteredSkills.length === 1 ? "skill" : "skills"} found
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear filters
            </Button>
          </div>
        ) : null}

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No skills found matching your criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
            >
              Clear filters and browse all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
