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
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Loader2, Calendar as CalendarIcon, Clock, Plus, Trash2 } from "lucide-react";
import { format, addDays, nextDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";

interface ProposeSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  learnerName: string;
  onSuccess: () => void;
}

const DAYS_MAP = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ProposeSlotsModal({
  isOpen,
  onClose,
  sessionId,
  learnerName,
  onSuccess,
}: ProposeSlotsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposedSlots, setProposedSlots] = useState<{ startTime: string, endTime: string }[]>([]);

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["mentor", "availability"],
    queryFn: async () => {
      const res = await api.get("/mentor/availability");
      return res.data?.data;
    },
    enabled: isOpen,
  });

  const handleAddSlot = (slot: any, isRecurring: boolean, specificDate?: Date) => {
    let dateStr: string;
    
    if (isRecurring) {
        // Find next occurrence of this day of week
        const today = startOfToday();
        const nextOccurrence = nextDay(today, slot.DayOfWeek as any);
        dateStr = format(nextOccurrence, "yyyy-MM-dd");
    } else {
        dateStr = format(new Date(slot.SpecificDate), "yyyy-MM-dd");
    }

    const startTime = `${dateStr}T${slot.StartTime}`;
    const endTime = `${dateStr}T${slot.EndTime}`;

    // Check if duplicate
    if (proposedSlots.some(s => s.startTime === startTime)) {
        toast.error("This slot is already added.");
        return;
    }

    setProposedSlots([...proposedSlots, { startTime, endTime }]);
  };

  const handleRemoveSlot = (index: number) => {
    setProposedSlots(proposedSlots.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (proposedSlots.length === 0) {
      toast.error("Please propose at least one time slot.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post(`/sessions/${sessionId}/time-slots`, {
        timeSlots: proposedSlots
      });

      if (response.data.success) {
        toast.success("Time slots proposed successfully!");
        onSuccess();
      }
    } catch (error: any) {
      console.error("Propose slots error", error);
      toast.error(error.response?.data?.errors?.[0]?.message || "Failed to propose slots.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Propose Slots to {learnerName}
          </DialogTitle>
          <DialogDescription>
            Select from your pre-defined availability to offer sessions to the learner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Availability Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Your Availability</h4>
            {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : (
                <div className="space-y-3">
                    {availabilityData?.weekly?.map((slot: any) => (
                        <div key={slot.AvailabilityID} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/30 group">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{DAYS_MAP[slot.DayOfWeek]} (Weekly)</span>
                                <span className="text-xs text-muted-foreground">{slot.StartTime} - {slot.EndTime}</span>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0" onClick={() => handleAddSlot(slot, true)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {availabilityData?.specific?.map((slot: any) => (
                        <div key={slot.AvailabilityID} className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10 group">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{format(new Date(slot.SpecificDate), "MMM dd, yyyy")}</span>
                                <span className="text-xs text-muted-foreground">{slot.StartTime} - {slot.EndTime}</span>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0" onClick={() => handleAddSlot(slot, false)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <hr className="border-border/50" />

          {/* Proposed Slots List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Proposed Slots ({proposedSlots.length})</h4>
            {proposedSlots.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-xl border border-dashed">
                    No slots added yet. Click the + button above to add.
                </p>
            ) : (
                <div className="space-y-2">
                    {proposedSlots.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-sm font-semibold">
                                    {format(new Date(slot.startTime), "MMM dd")} @ {format(new Date(slot.startTime), "p")}
                                </span>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveSlot(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || proposedSlots.length === 0}
            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Send Proposals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
