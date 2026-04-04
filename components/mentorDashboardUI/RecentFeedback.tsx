import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function RecentFeedback() {
  const feedbacks = [
    {
      id: 1,
      studentName: "James Wilson",
      rating: 5,
      comment: "Sarah is an amazing mentor! She explained React concepts clearly and patiently answered all my questions.",
      date: "Jan 12",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    },
    {
      id: 2,
      studentName: "Lisa Chen",
      rating: 5,
      comment: "Best React mentor on the platform! Highly recommend!",
      date: "Jan 10",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Recent Feedback
      </h2>

      <Card className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        <div className="space-y-6">
          {feedbacks.map((feedback, index) => (
            <div key={feedback.id} className={index !== feedbacks.length - 1 ? "border-b border-gray-100 dark:border-gray-800 pb-5" : ""}>
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={feedback.avatarUrl} alt={feedback.studentName} />
                  <AvatarFallback>{feedback.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                    {feedback.studentName}
                  </h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < feedback.rating ? 'fill-rose-400 text-rose-400' : 'fill-gray-200 text-gray-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {feedback.comment}
              </p>
              
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
                {feedback.date}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
