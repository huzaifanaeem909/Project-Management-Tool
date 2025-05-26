import React, { useState, useEffect } from "react";
import { API_ROUTES } from "@/config";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Calendar, User, CheckCircle, Clock, AlertCircle } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(API_ROUTES.PROJECT_DETAIL(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Project details:", response.data);
      setProject(response.data);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(API_ROUTES.CREATE_TASK(id), newTask , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTasks([...tasks, response.data]);
      setNewTask({title: "", description: "", status: "pending"});
      toast.success("Task created successfully!");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const response = await axios.put(API_ROUTES.MANAGE_TASK(id, editingTask.id), editingTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)));
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(API_ROUTES.MANAGE_TASK(id, taskId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };
  
  if (!project) return null;

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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {project.name}
              </h1>
              <p className="text-sm text-gray-500">Project Details & Tasks</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="mt-2">
                  {project.description}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                {project.verified && (
                  <Badge className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created: {project.created_at.split("T")[0]}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {tasks.length} tasks
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to this project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="taskTitle" className="mb-2">
                    Task Title
                  </Label>
                  <Input
                    id="taskTitle"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label htmlFor="taskDescription" className="mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTask(task)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first task to this project
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Task
            </Button>
          </div>
        )}

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update task details</DialogDescription>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editTitle" className="mb-2">Task Title</Label>
                  <Input
                    id="editTitle"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editDescription" className="mb-2">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">Status</Label>
                    <Select
                      value={editingTask.status}
                      onValueChange={(value) =>
                        setEditingTask({ ...editingTask, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask}>Update Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ProjectDetail;
