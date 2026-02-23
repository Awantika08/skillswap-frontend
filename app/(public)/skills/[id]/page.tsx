"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MentorAvatar from "@/components/MentorAvatar";
import SkillCard from "@/components/SkillCard";
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react";

const SKILLS_DATA: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "Web Development with React",
    description:
      "Learn modern React, hooks, and state management for building interactive web applications.",
    fullDescription:
      "This comprehensive course covers everything you need to know about React development. From basic component creation to advanced state management patterns, you'll gain hands-on experience building real-world applications. We'll explore React hooks, context API, and best practices for building scalable applications.",
    mentorName: "Sarah Chen",
    mentorInitials: "SC",
    mentorColor: "blue",
    level: "Intermediate" as const,
    category: "Technology",
    whatYouLearn: [
      "React component architecture and lifecycle",
      "Hooks and functional components",
      "State management with Redux or Context API",
      "API integration and data fetching",
      "Testing and debugging React applications",
      "Performance optimization techniques",
    ],
    prerequisites: [
      "Basic JavaScript knowledge (variables, functions, arrays)",
      "Familiarity with HTML and CSS",
      "Node.js and npm installed on your computer",
    ],
    sessions: "8 sessions of 2 hours each",
    availability: "Flexible scheduling, 2-3 sessions per week",
    rating: 4.8,
    reviews: 124,
  },
  "2": {
    id: "2",
    title: "Digital Illustration Basics",
    description:
      "Master digital art fundamentals using Procreate and Adobe Creative Suite.",
    fullDescription:
      "Learn the fundamentals of digital illustration from beginner to intermediate level. This course covers drawing techniques, color theory, and digital tools including Procreate and Photoshop.",
    mentorName: "Marcus Williams",
    mentorInitials: "MW",
    mentorColor: "purple",
    level: "Beginner" as const,
    category: "Art & Design",
    whatYouLearn: [
      "Digital drawing fundamentals",
      "Procreate and Adobe tools",
      "Color theory and palettes",
      "Character design basics",
      "Digital painting techniques",
      "Portfolio building",
    ],
    prerequisites: [
      "A drawing tablet (iPad with Procreate or graphics tablet)",
      "Basic drawing experience helpful but not required",
      "Creative motivation and time to practice",
    ],
    sessions: "10 sessions of 1.5 hours each",
    availability: "Weekends, flexible timing",
    rating: 4.9,
    reviews: 89,
  },
  "3": {
    id: "3",
    title: "Business English for Professionals",
    description:
      "Improve your business English skills for meetings, presentations, and professional communication.",
    fullDescription:
      "Master English communication in business contexts. Perfect for professionals looking to improve their confidence in meetings, presentations, and written communication.",
    mentorName: "Emma Thompson",
    mentorInitials: "ET",
    mentorColor: "green",
    level: "Intermediate" as const,
    category: "Language",
    whatYouLearn: [
      "Business vocabulary and idioms",
      "Meeting participation and leadership",
      "Presentation skills and public speaking",
      "Email writing and professional correspondence",
      "Negotiation techniques",
      "Cross-cultural communication",
    ],
    prerequisites: [
      "Intermediate English level (B1/B2)",
      "Interest in professional development",
      "Ability to commit to regular practice",
    ],
    sessions: "12 sessions of 1 hour each",
    availability: "Evenings (flexible), 2-3 times per week",
    rating: 4.7,
    reviews: 156,
  },
};

const RELATED_SKILLS = [
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
];

export default function SkillDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const skill = SKILLS_DATA[id];

  if (!skill) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Skill not found
          </h1>
          <Link href="/skills">
            <Button>Back to Skills</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/skills"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/90 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </Link>

        {/* Main Content */}
        <div className="mb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {skill.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {skill.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{skill.category}</Badge>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    {skill.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Mentor Info */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <MentorAvatar
                  initials={skill.mentorInitials}
                  color={skill.mentorColor}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {skill.mentorName}
                  </h3>
                  <p className="text-muted-foreground">Mentor</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">
                      ⭐ {skill.rating} ({skill.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base">
                  Request Session with {skill.mentorName}
                </Button>
              </Link>
            </Card>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* What You'll Learn */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                {skill.whatYouLearn.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Session Info */}
            <div>
              <Card className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Duration</h4>
                  </div>
                  <p className="text-muted-foreground">{skill.sessions}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">
                      Availability
                    </h4>
                  </div>
                  <p className="text-muted-foreground">{skill.availability}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Prerequisites
            </h2>
            <Card className="p-6">
              <ul className="space-y-3">
                {skill.prerequisites.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-foreground text-sm">•</span>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Full Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About This Course
            </h2>
            <p className="text-foreground leading-relaxed">
              {skill.fullDescription}
            </p>
          </div>
        </div>

        {/* Related Skills */}
        <div className="border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Related Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RELATED_SKILLS.map((relatedSkill) => (
              <SkillCard key={relatedSkill.id} {...relatedSkill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
