import React, { useState } from "react";
import { API_ROUTES } from "@/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Lock, Users, Rocket, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { email, password };
    console.log("Login payload:", payload);

    try {
      const response = await axios.post(API_ROUTES.LOGIN, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        console.log("Login response:", response.data);
        if (response.data.access && response.data.refresh) {
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
        }
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        const { data } = error.response;
        if (data.error) {
          toast.error(data.error);
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-right" />
      {/* Left Column - Welcome Message */}
      <div className="flex-1 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center p-8 text-white">
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <Rocket className="w-12 h-12 text-blue-200 mb-4" />
            <h2 className="text-4xl font-bold">Welcome to ProjectFlow</h2>
            <p className="text-xl text-blue-100">
              Streamline your team's workflow and boost productivity with our
              comprehensive project management solution
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-green-300" />
              <span className="text-lg">Secure & Reliable Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-purple-300" />
              <span className="text-lg">Collaborate with Team Members</span>
            </div>
            <div className="flex items-center gap-4">
              <LogIn className="w-6 h-6 text-yellow-300" />
              <span className="text-lg">Manage Projects Effortlessly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Sign In to Your Account
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Manage your projects and collaborate with your team
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 mb-4">
              {/* Keep existing form fields the same */}
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
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-indigo-600 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
