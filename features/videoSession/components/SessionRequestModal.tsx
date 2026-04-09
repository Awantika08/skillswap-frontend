"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Loader2, MessageSquarePlus } from "lucide-react";

interface SessionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  skills: { SkillID: string; Name: string }[];
}

export function SessionRequestModal({
  isOpen,
  onClose,
  mentorId,
  mentorName,
  skills,
}: SessionRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    skillId: "",
    title: "",
    description: "",
  });

  // Effect to auto-populate when skills or selection changes
  React.useEffect(() => {
    if (skills.length > 0 && !formData.skillId) {
      const firstSkill = skills[0];
      setFormData({
        skillId: firstSkill.SkillID,
        title: `${firstSkill.Name} Session with ${mentorName}`,
        description: `Hi ${mentorName}, I'd like to learn more about ${firstSkill.Name}.`,
      });
    }
  }, [skills, mentorName]);

  const handleSkillChange = (value: string) => {
    const selectedSkill = skills.find((s) => s.SkillID === value);
    if (selectedSkill) {
      setFormData({
        ...formData,
        skillId: value,
        title: `${selectedSkill.Name} Session with ${mentorName}`,
        description: `Hi ${mentorName}, I'd like to learn more about ${selectedSkill.Name}.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skillId || !formData.title) {
      toast.error("Please fill in the required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/learner/sessions/request", {
        mentorId,
        skillId: formData.skillId,
        title: formData.title,
        description: formData.description,
      });

      if (response.data.success) {
        toast.success("Session request sent successfully!");
        onClose();
      }
    } catch (error: any) {
      console.error("Session request error", error);
      toast.error(
        error.response?.data?.errors?.[0]?.message ||
          "Failed to send session request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquarePlus className="w-6 h-6 text-primary" />
            Connect with {mentorName}
          </DialogTitle>
          <DialogDescription>
            Send a session request to start learning. The mentor will review your
            request and propose time slots.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill" className="text-sm font-semibold">
              What do you want to learn? <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.skillId}
              onValueChange={handleSkillChange}
            >
              <SelectTrigger id="skill" className="rounded-xl border-border/50">
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((skill) => (
                  <SelectItem key={skill.SkillID} value={skill.SkillID}>
                    {skill.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Session Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Help with React state management"
              className="rounded-xl border-border/50"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Tell the mentor more (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what you're struggling with or what you'd like to achieve."
              className="rounded-xl border-border/50 min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}