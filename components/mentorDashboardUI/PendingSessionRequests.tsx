import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Check, X } from "lucide-react";

export default function PendingSessionRequests() {
  const requests = [
    {
      id: 1,
      studentName: "Michael Brown",
      course: "React & Modern JavaScript",
      date: "Jan 18",
      time: "3:00 PM",
      message:
        '"Hi! I\'m working on a React project and need help with state management and hooks."',
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 2,
      studentName: "Sophie Anderson",
      course: "React & Modern JavaScript",
      date: "Jan 19",
      time: "2:00 PM",
      message:
        '"Looking forward to learning about React performance optimization!"',
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Pending Session Requests
        </h2>
        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
          2 New
        </span>
      </div>

      <Card className="p-0 border-0 shadow-none bg-transparent space-y-4">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900"
          >
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12 border border-gray-100 dark:border-gray-800">
                <AvatarImage
                  src={request.avatarUrl}
                  alt={request.studentName}
                />
                <AvatarFallback>{request.studentName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {request.studentName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {request.course}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {request.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {request.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                {request.message}
              </p>
            </div>

            <div className="flex grid-cols-2 gap-3 w-full">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </div>
          </Card>
        ))}
      </Card>
    </div>
  );
}
