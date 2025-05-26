import React, { useState } from "react";
import { API_ROUTES } from "@/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Mail, Lock, User, Users, Rocket, PieChart, ShieldCheck} from "lucide-react";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    general: "",
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { username, email, role, password };
    console.log("Signup payload:", payload);

    try {
      const response = await axios.post(API_ROUTES.REGISTER, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        const { data } = error.response;

        if (data.username) {
          setErrors((prev) => ({
            ...prev,
            username: "This username is already taken",
          }));
        }
        if (data.email) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Network error. Please try again",
        }));
        toast.error("Network error. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-right" />
      {/* Left Column - Welcome Message */}
      <div className="flex-1 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center p-8 text-white">
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <Rocket className="w-12 h-12 text-green-200 mb-4" />
            <h2 className="text-4xl font-bold">
              Start Managing Projects Better
            </h2>
            <p className="text-xl text-emerald-100">
              Join thousands of teams already streamlining their workflow with
              our platform
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-yellow-300" />
              <span className="text-lg">
                Collaborate with your team in real-time
              </span>
            </div>
            <div className="flex items-center gap-4">
              <PieChart className="w-6 h-6 text-blue-300" />
              <span className="text-lg">
                Track project progress with analytics
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-purple-300" />
              <span className="text-lg">Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Get started with us and explore all features
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className={`pl-10 ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="radio"
                      id="admin"
                      name="role"
                      value="admin"
                      checked={role === "admin"}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden peer"
                      required
                    />
                    <label
                      htmlFor="admin"
                      className="flex flex-col p-4 border rounded-md cursor-pointer peer-checked:border-green-600 peer-checked:bg-green-50"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Administrator</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Full access to all features and team management
                      </p>
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="user"
                      name="role"
                      value="user"
                      checked={role === "user"}
                      onChange={(e) => setRole(e.target.value)}
                      className="hidden peer"
                    />
                    <label
                      htmlFor="user"
                      className="flex flex-col p-4 border rounded-md cursor-pointer peer-checked:border-green-600 peer-checked:bg-green-50"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Standard User</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Basic access to projects and tasks
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-emerald-600 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
