import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "@/config";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, CheckCircle, Clock, Users, FolderOpen } from "lucide-react";

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_ROUTES.PROJECTS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProjects(response.data.results || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again later.");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(API_ROUTES.AUTH_PROFILE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile. Please try again later.");
    }
  };

  const handleVerifyProject = async (projectId) => {
    try {
      const response = await axios.post(
        API_ROUTES.VERIFY_PROJECT(projectId),
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, verified: true } : project
      );
      setProjects(updatedProjects);
      toast.success("Project verified successfully!");
    } catch (error) {
      console.error("Error verifying project:", error);
      toast.error("Failed to verify project. Please try again later.");
    }
  };

  const unverifiedProjects = projects.filter((project) => !project.verified);
  const verifiedProjects = projects.filter((project) => project.verified);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-right" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-red-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-500">
                  Manage projects and user access
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FolderOpen className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {verifiedProjects.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unverifiedProjects.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unverified Projects */}
        {unverifiedProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Verification ({unverifiedProjects.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {unverifiedProjects.map((project) => (
                <Card
                  key={project.id}
                  className="border-l-4 border-l-yellow-500"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>Owner: {project.owner_username}</p>
                        <p>Created: {project.created_at.split("T")[0]}</p>
                        <p>Tasks: {project.task_count}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVerifyProject(project.id)}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Verify Project
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/project/${project.id}`)}
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            All Projects ({projects.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  project.verified
                    ? "border-l-4 border-l-green-500"
                    : "border-l-4 border-l-yellow-500"
                }`}
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex flex-col gap-2">
                      {project.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-300"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Owner: {project.owner_username}</p>
                    <p>Created: {project.created_at.split("T")[0]}</p>
                    <p>Tasks: {project.task_count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              Projects will appear here once users start creating them
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
