import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthIamgePattern';
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };
  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
            transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
           <div className="form-control">
                         <label className="label">
                           <span className="label-text font-medium">Email</span>
                         </label>
           
                         {/* DaisyUI native way to put icon inside input */}
                         <label className="input input-bordered w-full flex items-center gap-2 pl-2 pr-2">
                           <Mail className="w-5 h-5 text-base-content/60" />
                           <input
                             type="email"
                             placeholder="you@example.com"
                             className="grow bg-transparent focus:outline-none"
                             value={formData.email}
                             onChange={(e) =>
                               setFormData({ ...formData, email: e.target.value })
                             }
                           />
                         </label>
           </div>

           <div className="form-control">
                         <label className="label">
                           <span className="label-text font-medium">Password</span>
                         </label>
           
                         <label className="input input-bordered w-full flex items-center gap-2 pl-2 pr-2">
                           <Lock className="size-5 text-base-content/40" />
           
                           <input
                             type={showPassword ? "text" : "password"}
                             className="grow bg-transparent focus:outline-none"
                             placeholder="••••••••"
                             value={formData.password}
                             onChange={(e) =>
                               setFormData({ ...formData, password: e.target.value })
                             }
                           />
           
                           <button
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="text-base-content/40"
                           >
                             {showPassword ? (
                               <EyeOff className="size-5" />
                             ) : (
                               <Eye className="size-5" />
                             )}
                           </button>
                         </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
}
