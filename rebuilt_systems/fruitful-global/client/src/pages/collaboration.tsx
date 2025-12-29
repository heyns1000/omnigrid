import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageCircle, Video, Share2, Edit3, Clock, CheckCircle, UserPlus } from "lucide-react";

export default function Collaboration() {
  const [activeProject, setActiveProject] = useState("fruitful-global-redesign");

  const projects = [
    {
      id: "fruitful-global-redesign",
      name: "Fruitful Global™ Redesign",
      status: "active",
      members: 8,
      lastActivity: "2 min ago",
      progress: 75
    },
    {
      id: "seedwave-analytics",
      name: "Seedwave™ Analytics Dashboard",
      status: "review",
      members: 5,
      lastActivity: "1 hour ago",
      progress: 90
    },
    {
      id: "vaultmesh-security",
      name: "VaultMesh™ Security Update",
      status: "planning",
      members: 3,
      lastActivity: "3 hours ago",
      progress: 25
    }
  ];

  const teamMembers = [
    { name: "Sarah Chen", role: "Lead Designer", status: "online", initials: "SC" },
    { name: "Alex Kumar", role: "Frontend Dev", status: "away", initials: "AK" },
    { name: "Maria Santos", role: "Backend Dev", status: "online", initials: "MS" },
    { name: "David Park", role: "Product Manager", status: "offline", initials: "DP" },
    { name: "Lisa Zhang", role: "UX Researcher", status: "online", initials: "LZ" },
    { name: "John Smith", role: "DevOps", status: "busy", initials: "JS" }
  ];

  const recentActivity = [
    { user: "Sarah Chen", action: "Updated homepage mockup", time: "2 min ago", type: "design" },
    { user: "Alex Kumar", action: "Pushed code changes to develop", time: "15 min ago", type: "code" },
    { user: "Maria Santos", action: "Completed API integration", time: "32 min ago", type: "backend" },
    { user: "David Park", action: "Added new feature requirements", time: "1 hour ago", type: "planning" },
    { user: "Lisa Zhang", action: "Published user research findings", time: "2 hours ago", type: "research" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            👥 Collaboration Hub
          </h1>
          <p className="text-lg text-muted-foreground">Real-time collaboration across all brand projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      activeProject === project.id 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveProject(project.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{project.members} members</span>
                      <span>{project.lastActivity}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="chat">Team Chat</TabsTrigger>
            <TabsTrigger value="files">Shared Files</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-shrink-0">
                        {activity.type === "design" && <Edit3 className="h-5 w-5 text-purple-600" />}
                        {activity.type === "code" && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {activity.type === "backend" && <CheckCircle className="h-5 w-5 text-blue-600" />}
                        {activity.type === "planning" && <Clock className="h-5 w-5 text-orange-600" />}
                        {activity.type === "research" && <Share2 className="h-5 w-5 text-pink-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Team Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4 h-64 overflow-y-auto">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Sarah Chen</p>
                      <p className="text-sm">Just finished the new homepage design. Ready for review!</p>
                      <p className="text-xs text-muted-foreground">2 min ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Alex Kumar</p>
                      <p className="text-sm">Looks great! I'll start implementing the frontend components.</p>
                      <p className="text-xs text-muted-foreground">1 min ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Shared Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Homepage_Mockup_v3.figma", type: "Design", size: "2.4 MB", shared: "Sarah Chen" },
                    { name: "API_Documentation.pdf", type: "Documentation", size: "1.2 MB", shared: "Maria Santos" },
                    { name: "User_Research_Report.docx", type: "Research", size: "856 KB", shared: "Lisa Zhang" },
                    { name: "Brand_Guidelines.zip", type: "Assets", size: "15.3 MB", shared: "David Park" }
                  ].map((file) => (
                    <div key={file.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">{file.type} • {file.size}</p>
                      <p className="text-xs text-muted-foreground mt-1">Shared by {file.shared}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Share2 className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Scheduled Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Design Review Session", time: "Today 2:00 PM", attendees: 5, status: "upcoming" },
                    { title: "Sprint Planning", time: "Tomorrow 10:00 AM", attendees: 8, status: "scheduled" },
                    { title: "Client Presentation", time: "Friday 3:00 PM", attendees: 12, status: "important" }
                  ].map((meeting) => (
                    <div key={meeting.title} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{meeting.title}</h4>
                        <Badge variant={meeting.status === "important" ? "destructive" : "outline"}>
                          {meeting.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{meeting.time}</p>
                      <p className="text-xs text-muted-foreground">{meeting.attendees} attendees</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Video className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}