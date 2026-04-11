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
} from "lucide-react";

export default function Home() {
  const stats = [
    { value: "5,000+", label: "Active Learners" },
    { value: "2,000+", label: "Expert Mentors" },
    { value: "500+", label: "Skills Available" },
    { value: "10k+", label: "Completed Sessions" },
  ];

  const categories = [
    { icon: "💻", name: "Technology", color: "bg-blue-50" },
    { icon: "🎨", name: "Design & Creative", color: "bg-purple-50" },
    { icon: "📊", name: "Business", color: "bg-amber-50" },
    { icon: "🗣️", name: "Language", color: "bg-pink-50" },
    { icon: "🎵", name: "Music & Arts", color: "bg-rose-50" },
    { icon: "⚽", name: "Sports & Fitness", color: "bg-emerald-50" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Mentor",
      image: "SC",
      quote:
        "Teaching on Skill Swap has been incredibly rewarding. I love helping others grow.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Learner",
      image: "MJ",
      quote:
        "I learned web design in just 4 weeks with an amazing mentor. Best investment ever!",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Both",
      image: "ER",
      quote:
        "The community here is so supportive. I'm both teaching and learning.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Schedule sessions that work with your busy lifestyle, anytime, anywhere.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Award,
      title: "Verified Mentors",
      description:
        "All mentors are verified and reviewed by our community. Learn with confidence.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your learning journey with detailed progress tracking and achievements.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Join a vibrant community of learners and mentors supporting each other.",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Join the peer-to-peer learning revolution
              </p>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Share Your Skills, Learn Anything
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance leading-relaxed">
              Connect with expert mentors and passionate learners. Exchange
              knowledge peer-to-peer in a trusted, supportive community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/skills">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold">
                Explore Skills
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="px-8 py-6 text-base font-semibold hover:bg-primary/90"
              >
                Start as Mentor
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills Categories */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-gradient-to-br from-primary/8 via-secondary/40 to-accent/8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover skills across diverse fields and find the perfect mentor
              for your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <Link href="/skills" key={idx}>
                <div
                  className={`p-8 rounded-xl ${category.color} border border-primary/20 hover:border-primary/60 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                >
                  <p className="text-5xl mb-6 group-hover:scale-125 transition-transform inline-block">
                    {category.icon}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Explore now</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How Skill Swap Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-6 transition-colors">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <div className="bg-foreground text-primary-foreground text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Explore Skills
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse our curated collection of skills across any topic. Filter
                by level, duration, and price.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-6 transition-colors">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <div className="bg-foreground text-primary-foreground text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Connect & Chat
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Message mentors directly, ask questions, and find the perfect
                match for your learning style.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-6 transition-colors">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div className="bg-foreground text-primary-foreground text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Learn & Grow
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Take sessions, apply your new skills, and track your progress on
                your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Why Choose Skill Swap
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Features designed to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)`,
                    }}
                  ></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-gradient-to-br from-primary/8 via-background to-accent/8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Loved by Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what mentors and learners have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-semibold text-primary-foreground group-hover:shadow-lg transition-all">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of mentors and learners exchanging knowledge and
            growing together. It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/skills">
              <Button className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary px-8 py-6 text-base font-semibold">
                Browse Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
