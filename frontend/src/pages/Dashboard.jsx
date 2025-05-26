import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "@/config";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FolderOpen, Calendar, Users, LogOut, Settings, Filter } from "lucide-react";

const Dashboard = () => {
  const [projectList, setProjectList] = useState([]);
  const [projectCategory, serProjectCategory] = useState("all");
  const [user, setUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchProjects();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(API_ROUTES.PROFILE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to fetch user profile.");
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_ROUTES.PROJECTS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Projects fetched:", response.data.results);
      setProjectList(response.data.results);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to fetch projects.");
      }
    }
  };

  const filteredProjects = useMemo(() => {
    if (!user || projectCategory === "all") {
      return projectList;
    }
    return projectList.filter((project) => project.owner_email === user.email);
  }, [projectCategory, projectList, user]);

  const projects = projectCategory === "all" ? projectList : filteredProjects;

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axios.post(
        API_ROUTES.LOGOUT,
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out.");
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast.error("Please fill in all fields.");
      return;
    }

    const payload = {
      name: newProject.title,
      description: newProject.description,
    };
    try {
      const response = await axios.post(API_ROUTES.PROJECTS, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      setProjectList([...projectList, response.data]);
      setNewProject({ title: "", description: "" });
      setIsCreateOpen(false);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-right" />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FolderOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Project Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.username}
              </span>
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <p className="text-gray-600">
              Manage and track your project progress
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Filter projects:
          </span>
          <ToggleGroup
            type="single"
            value={projectCategory}
            onValueChange={(value) => value && serProjectCategory(value)}
            className="border rounded-lg p-1 bg-white"
          >
            <ToggleGroupItem
              value="all"
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900"
            >
              All Projects ({projectList.length})
            </ToggleGroupItem>
            <ToggleGroupItem
              value="my_projects"
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900"
            >
              My Projects (
              {projectList.filter((p) => p.owner_email === user.email).length})
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className={
                        project.verified
                          ? "bg-green-100 text-green-800"
                          : "text-orange-600 border-orange-300"
                      }
                    >
                      {project.verified ? "Verified" : "Pending Verification"}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.created_at.split("T")[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.task_count} tasks
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first project
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
