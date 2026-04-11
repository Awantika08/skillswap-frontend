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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSubmitReview } from "../hooks/useReviews";
import { toast } from "react-hot-toast";
import { Loader2, Star, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  targetName: string;
  onSuccess: () => void;
}

const REVIEW_TAGS = [
  "Expert Knowledge",
  "Clear Explanation",
  "Helpful Support",
  "Great Listener",
  "Technical Depth",
  "Practical Tips",
  "Problem Solver",
  "Patient Mentor",
];

export function ReviewModal({
  isOpen,
  onClose,
  sessionId,
  targetName,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { mutateAsync: submitReview, isPending: isLoading } = useSubmitReview();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }

    try {
      await submitReview({
        sessionId,
        data: {
          rating,
          comment,
          tags: selectedTags,
          isPublic: true,
        },
      });

      toast.success("Thank you for your feedback!");
      onSuccess();
    } catch (error: any) {
      // Error handling is already managed by the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            Rate your session
          </DialogTitle>
          <DialogDescription>
            How was your experience with {targetName}? Your feedback helps the
            community grow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90 p-1"
                >
                  <Star
                    className={cn(
                      "w-10 h-10 transition-colors",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-700",
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-primary h-5">
              {rating > 0 ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1] : ""}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              What went well?
            </Label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full border transition-all truncate max-w-full",
                    selectedTags.includes(tag)
                      ? "bg-primary text-white border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50",
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-bold">
              Comments
            </Label>
            <Textarea
              id="comment"
              placeholder="Share more about your experience..."
              className="rounded-xl border-border/50 min-h-[100px] resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={isLoading || rating === 0}
              className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
