"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  BookOpen,
  Zap,
  Star,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Globe,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const stats = [
    { value: "5,000+", label: "Active Learners" },
    { value: "2,000+", label: "Expert Mentors" },
    { value: "500+", label: "Skills Available" },
    { value: "10k+", label: "Sessions Done" },
  ];

  const categories = [
    { icon: "💻", name: "Technology", count: "1.2k+ Mentors" },
    { icon: "🎨", name: "Creative Arts", count: "800+ Mentors" },
    { icon: "📊", name: "Business", count: "600+ Mentors" },
    { icon: "🗣️", name: "Languages", count: "400+ Mentors" },
    { icon: "🎵", name: "Music", count: "300+ Mentors" },
    { icon: "⚽", name: "Fitness", count: "250+ Mentors" },
  ];

  return (
    <div className="flex flex-col bg-background selection:bg-primary/20 transition-colors duration-500">
      {/* Masterclass Hero 3.0 */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-48 lg:pb-36 overflow-hidden bg-background">
        {/* Deep Depth Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px] animate-pulse duration-[12s]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse duration-[10s] delay-700" />
          <div className="absolute top-[30%] right-[10%] w-px h-[400px] bg-gradient-to-b from-transparent via-primary/30 to-transparent rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              SkillSwap
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] text-foreground animate-in fade-in slide-in-from-bottom-3 duration-1000">
              Master <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-400">Everything</span> <br />
              <span className="italic font-normal font-serif">1-on-1.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Transform your career through the world's most immersive peer-to-peer knowledge network. Verified mentors. Real outcomes. Zero fluff.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
              <Link href="/skills" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-18 px-12 rounded-[1.5rem] text-xl font-black shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all group">
                  Explore Experts
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-18 px-10 rounded-[1.5rem] text-xl font-black border-border/60 hover:bg-muted/30 transition-all">
                  Join for Free
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 grayscale opacity-40 animate-in fade-in duration-1000 delay-500">
              <p className="text-xs font-bold uppercase tracking-widest">Featured on</p>
              <div className="text-lg font-black tracking-tighter">TECHRUMOR</div>
              <div className="text-lg font-black tracking-tighter">SKILLHUB</div>
            </div>
          </div>

          {/* Right Column: Visual Component Ecosystem */}
          <div className="lg:col-span-5 relative lg:h-[700px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
            {/* The Floating UI Stack */}
            <div className="relative w-full h-full perspective-[2000px] flex items-center justify-center">

              {/* Card 1: Mentor Profile (Sarah) */}
              <div className="absolute top-[5%] right-[5%] w-[85%] p-6 rounded-[2.5rem] bg-background border border-border/40 shadow-2xl rotate-y-[-20deg] rotate-x-[10deg] -rotate-12 hover:rotate-0 transition-all duration-700 cursor-default group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-xl font-black">Sarah Chen</p>
                    <p className="text-sm font-bold text-primary italic">Verified Senior Designer</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-primary/20 scale-x-75 origin-left" />
                  </div>
                  <div className="h-2 w-[80%] bg-muted/40 rounded-full" />
                </div>
                <div className="mt-8 flex justify-between items-center text-xs font-bold uppercase opacity-40">
                  <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Trusted</div>
                  <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> 5.0</div>
                </div>
              </div>

              {/* Card 2: Glass Notification (Session Started) */}
              <div className="absolute bottom-[20%] left-[0%] w-[75%] p-5 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-white/20 shadow-2xl rotate-y-[30deg] rotate-x-[-10deg] rotate-6 z-20 hover:rotate-0 transition-all duration-700 delay-150">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black">Mentor is typing...</p>
                    <p className="text-xs text-muted-foreground italic">"I can definitely help with that React project!"</p>
                  </div>
                </div>
              </div>

              {/* Decorative Beam */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Logo Cloud */}
      <section className="py-12 border-y border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40">
          <div className="text-xl font-black italic tracking-tighter">MENTOR.LY</div>
          <div className="text-xl font-black italic tracking-tighter">SKILLSET</div>
          <div className="text-xl font-black italic tracking-tighter">LEARNLAB</div>
          <div className="text-xl font-black italic tracking-tighter">DEVFLUX</div>
          <div className="text-xl font-black italic tracking-tighter">CREATIVE.CO</div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="px-4 py-24 sm:py-32 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight">Everything you need to <span className="text-primary tracking-tighter">Excel.</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Built for the next generation of knowledge seekers and creators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Main Feature */}
          <div className="md:col-span-3 md:row-span-2 rounded-[2.5rem] bg-slate-900 border border-border/10 p-10 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-primary/30" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white">Global Talent Pool</h3>
              <p className="text-slate-400 text-lg leading-relaxed">Access 1-on-1 mentorship from verified experts across 50+ countries. No borders, just knowledge.</p>
            </div>
          </div>

          <div className="md:col-span-3 rounded-[2.5rem] bg-primary/5 border border-primary/10 p-8 flex flex-col justify-between hover:bg-primary/10 transition-colors">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs font-bold px-3 py-1 bg-primary/10 rounded-full text-primary uppercase">Reliable</div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Verified Mentors ONLY</h3>
              <p className="text-muted-foreground leading-relaxed">Every mentor undergoes a rigorous verification process to ensure the highest quality of education.</p>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-accent/5 border border-accent/10 p-6 flex flex-col items-center justify-center text-center gap-2">
            <Zap className="w-10 h-10 text-accent mb-2" />
            <p className="text-lg font-black tracking-tight">Real-time Sessions</p>
          </div>

          <div className="md:col-span-2 md:row-span-1 rounded-[2.5rem] bg-muted/40 border border-border/40 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                ))}
              </div>
              <p className="text-sm font-bold opacity-60">+10k Active</p>
            </div>
            <h3 className="text-xl font-black">Thriving Community</h3>
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-5xl md:text-6xl font-black tracking-tighter text-primary">{stat.value}</p>
                <p className="text-sm font-bold uppercase tracking-widest opacity-60 text-primary-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories - aesthetic version */}
      <section className="px-4 py-24 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Start looking for <span className="opacity-40">Your path.</span></h2>
            <p className="text-lg text-muted-foreground font-medium">Diverse categories tailored for your specific goals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link href="/skills" key={idx} className="group overflow-hidden rounded-[2rem] border border-border/40 bg-background p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
                <div className="flex items-center gap-6">
                  <div className="text-5xl transition-transform group-hover:scale-110 duration-500">{cat.icon}</div>
                  <div>
                    <h3 className="text-xl font-black mb-1">{cat.name}</h3>
                    <p className="text-sm font-bold text-primary">{cat.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - modern center layout */}
      <section className="px-4 py-24 sm:py-32 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Trusted by creators worldwide.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-muted/50 border border-border/60 relative overflow-hidden">
              <Star className="w-12 h-12 text-primary opacity-10 absolute -top-2 -left-2" />
              <p className="text-xl font-medium leading-relaxed mb-8 italic">"Skill Swap changed how I think about professional growth. I found an amazing mentor in days."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20" />
                <div>
                  <p className="font-black">Alex Rivera</p>
                  <p className="text-sm text-muted-foreground">Product Designer</p>
                </div>
              </div>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-muted/50 border border-border/60 relative overflow-hidden">
              <Star className="w-12 h-12 text-accent opacity-10 absolute -top-2 -left-2" />
              <p className="text-xl font-medium leading-relaxed mb-8 italic">"Transitioning to tech was hard until I met my mentor through this platform. Best community ever."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/20" />
                <div>
                  <p className="font-black">Sarah Chen</p>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Premium Look */}
      <section className="px-4 py-32 sm:py-48 bg-background relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-primary/5 skew-y-3 -translate-y-24 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none text-balance"> Ready to reach <br /> the next level?</h2>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Join thousands of others exchanging knowledge and growing together. No subscriptions, just growth.</p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg" className="h-16 px-12 rounded-2xl text-xl font-black shadow-2xl shadow-primary/40 hover:scale-105 transition-all">Get Started for Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
