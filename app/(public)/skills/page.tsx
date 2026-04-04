"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import MentorCard from "@/components/MentorCard";
import { Search, X, Loader2, Sparkles, Filter, Check, ChevronsUpDown } from "lucide-react";
import { useAvailableMentors } from "@/features/learner/hooks/useAvailableMentors";
import { useGetAllSkillCategories } from "@/features/skillCategory/hooks/useGetAllSkillCategory";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllSkillCategories({
    limit: 100,
  });

  const categories = categoriesData?.data?.categories || [];

  // Fetch ALL available mentors to build a complete skill autocomplete (limit: 50)
  const { data: allMentorsResponse } = useAvailableMentors({ limit: 50 });
  const allAvailableMentors = allMentorsResponse?.data?.mentors || [];
  
  // Extract unique skill names for global suggestions
  const allGlobalSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    allAvailableMentors.forEach((mentor) => {
      mentor.skills.forEach((skill) => {
        skillsSet.add(skill.Name);
      });
    });
    return Array.from(skillsSet);
  }, [allAvailableMentors]);

  // Fetch Filtered Mentors (Primary results)
  const {
    data: mentorsResponse,
    isLoading: isLoadingMentors,
    error: mentorsError,
  } = useAvailableMentors({
    search: searchQuery,
    skillCategoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId,
  });

  const mentors = mentorsResponse?.data?.mentors || [];

  // Filter global suggestions by user input
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allGlobalSkills
      .filter((skillName) =>
        skillName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 8); // Show more suggestions for better discovery
  }, [searchQuery, allGlobalSkills]);

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("all");
  };

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "all") return "All Categories";
    return categories.find((c) => c.SkillCategoryID === selectedCategoryId)?.Name || "Select Category...";
  }, [selectedCategoryId, categories]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-muted/30 pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-color),transparent_25%)] opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Sparkles className="w-3 h-3" />
            Discover Expert Mentorship
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Find Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Skill Mentor</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
            Connect with verified industry professionals for 1-on-1 mentorship and career growth.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 py-12 relative z-50">
        {/* Unified Search and Filter Row */}
        <div 
          className={cn(
            "bg-background border border-border/60 shadow-xl shadow-primary/5 rounded-[2rem] p-4 mb-12 flex flex-col md:flex-row items-stretch gap-4 backdrop-blur-md transition-all",
            showSuggestions && "ring-2 ring-primary/20 bg-muted/50"
          )}
          style={{ position: 'relative', zIndex: 100 }}
        >
          {/* Search Input Layer */}
          <div className="flex-grow relative">
            <div className="relative group h-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="What skill do you want to learn today?"
                className="pl-14 pr-4 py-7 text-base rounded-2xl border-none bg-transparent transition-all focus:ring-0 focus:bg-background/80"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown (Z-INDEX FORCED TO FRONT) */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute top-full left-0 right-0 mt-3 p-2 bg-background border border-border shadow-2xl rounded-2xl z-[1000] animate-in fade-in zoom-in-95 duration-200"
                style={{ visibility: 'visible', pointerEvents: 'auto' }}
              >
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-4 py-2 border-b border-border/50 mb-1">
                  Discover Skills
                </p>
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-between group"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span className="text-sm font-semibold">{suggestion}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] group-hover:bg-white/20 group-hover:text-white border-primary/20">Skill</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:block w-px bg-border/40" />

          {/* Searchable Category Combobox */}
          <div className="w-full md:w-80 relative z-[90]">
            <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={openCategoryPopover}
                  className="w-full py-7 px-6 justify-between rounded-2xl hover:bg-muted/30 group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Filter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    <span className="truncate font-semibold text-sm">
                      {selectedCategoryName}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-80 p-0 rounded-2xl border-border/40 shadow-2xl z-[1001]">
                <Command className="rounded-2xl">
                  <CommandInput placeholder="Type to filter categories..." className="h-12 border-none focus:ring-0" />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setSelectedCategoryId("all");
                          setOpenCategoryPopover(false);
                        }}
                        className="rounded-xl px-4 py-2.5 mx-1"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            selectedCategoryId === "all" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-medium">All Categories</span>
                      </CommandItem>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.SkillCategoryID}
                          value={category.Name}
                          onSelect={() => {
                            setSelectedCategoryId(category.SkillCategoryID);
                            setOpenCategoryPopover(false);
                          }}
                          className="rounded-xl px-4 py-2.5 mx-1"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              selectedCategoryId === category.SkillCategoryID ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="font-medium">{category.Name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Status Indicators */}
        {(searchQuery || selectedCategoryId !== "all") && (
          <div className="flex items-center justify-between mb-10 pl-6 border-l-2 border-primary/20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">
                Active Filters
              </span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                    Skill: <span className="font-bold">"{searchQuery}"</span>
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-foreground" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {selectedCategoryId !== "all" && (
                  <Badge variant="secondary" className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                    Category: <span className="font-bold">{selectedCategoryName}</span>
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-foreground" onClick={() => setSelectedCategoryId("all")} />
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60 hover:text-destructive h-auto p-0 hover:bg-transparent"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Results Grid - Lower Z-Index to avoid overlap */}
        <div className="relative z-0">
          {isLoadingMentors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[380px] rounded-[2.5rem] bg-muted/40 animate-pulse border border-border/20 shadow-sm" />
              ))}
            </div>
          ) : mentorsError ? (
            <div className="text-center py-24 bg-destructive/5 rounded-[2.5rem] border border-destructive/10">
              <div className="p-5 rounded-full bg-destructive/10 border border-destructive/20 w-fit mx-auto mb-6">
                <X className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Data Access Error</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">We encountered a problem fetching mentor details. This could be a temporary issue.</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl px-10 border-destructive/20 hover:bg-destructive/10">Retry Connection</Button>
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.UserID}
                  id={mentor.UserID}
                  fullName={mentor.FullName}
                  bio={mentor.Bio}
                  profileImage={mentor.ProfileImageURL}
                  avgRating={mentor.avgRating}
                  totalReviews={mentor.totalReviews}
                  skillCount={mentor.skillCount}
                  skills={mentor.skills}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/40 mb-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_70%)] opacity-[0.02]" />
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-background border border-border shadow-xl mb-8 group transition-all">
                <Search className="w-10 h-10 text-muted-foreground/40 group-hover:scale-110 group-hover:text-primary transition-all duration-500" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">No Matching Skills</h3>
              <p className="text-lg text-muted-foreground max-w-sm mx-auto mb-12 font-medium leading-relaxed opacity-80">
                We couldn't find any mentors teaching that specific skill. Try searching for a broader term or check different categories!
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={handleClearFilters}
                className="rounded-2xl px-12 h-16 font-extrabold hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5 border-primary/20"
              >
                Clear All Criteria
              </Button>
            </div>
          )}
        </div>

        {/* Footer Info Card */}
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-[3.5rem] p-10 md:p-16 border border-primary/20 flex flex-col lg:flex-row items-center justify-between gap-12 translate-z-0 overflow-hidden relative shadow-2xl shadow-primary/10 group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/25 rounded-full blur-[140px] -mr-40 -mt-40 transition-all duration-700 group-hover:bg-primary/30" />
          <div className="relative z-10 text-center lg:text-left">
            <Badge className="mb-6 bg-primary/10 text-primary border-none hover:bg-primary/20 px-4 py-1.5 transition-colors">Coming Soon</Badge>
            <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">Can't Find a Specific Skill?</h3>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl font-bold opacity-80 leading-relaxed">
              Our community is growing fast. Tell us what you want to learn, and we'll prioritize finding an expert mentor for you.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 relative z-10">
            <Button size="lg" className="rounded-2xl px-14 h-20 text-xl font-black shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 group">
              Request Mentorship
              <span className="ml-3 px-2 py-0.5 rounded text-[10px] bg-white/20">New</span>
            </Button>
            <p className="text-xs font-bold text-muted-foreground/60">Average response time: 24h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
