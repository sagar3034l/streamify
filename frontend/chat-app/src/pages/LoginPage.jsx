import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShipWheelIcon } from "lucide-react";
import { useState } from "react"
import { Link } from "react-router-dom";
import { login } from "./lib/api";

export default function Login(){
    const[loginData,setLoginData] = useState({
        email:"",
        password:""
    });
    
    const queryClient = useQueryClient();
    const {mutate,isPending,error} = useMutation({
        mutationFn:login,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["authUser"]})
        }
    })
    const handleLogin = (e)=>{
        e.preventDefault();
        mutate(loginData)
    }
    return <div className="min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8" data-theme="forest">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* Login */}
                <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col">
                        <div className="mb-4 flex items-center justify-start gap-2">
                            <ShipWheelIcon className="size-9 text-primary"/>
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                               Streamify
                            </span>
                        </div>   
                        {
                            error && (
                                <div className="alert alert-error mb-4">
                                    <span>
                                      {
                                        error.response?.data.message
                                      }
                                    </span>
                                </div>
                            )
                        } 
                    <div className="w-full">
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold ">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                        Sign in to your account and continue your journey
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input 
                                        type="email" 
                                        placeholder="you@example.com"
                                        value={loginData.email}
                                        onChange={(e)=>setLoginData({...loginData,email:e.target.value})}
                                        required
                                        className="input input-bordered w-full"
                                         />
                                    </div>
                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input 
                                        type="password" 
                                        placeholder="********"
                                        value={loginData.password}
                                        onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
                                        required
                                        className="input input-bordered w-full"
                                         />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full">
                                        {
                                            isPending ? (
                                               <>
                                                 <span className="loading loading-spinner loading-xs">
                                                    Signing in...
                                                 </span>
                                               </>
                                            ) : (
                                                <div>
                                                    Sign in
                                                </div>
                                            )
                                        }
                                    </button>
                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Dont't have an account?{""}
                                            <Link to="/signup" className="text-primary hover:underline">
                                                 Create one
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form> 
                    </div>                 
                </div>

                {/* image section */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary items-center justify-center">
                        <div className="max-w-md p-8">
                            <div className="relative aspect-square max-w-sm mx-auto">
                                <img src="Video call-bro.png" alt="Language connection illustration" className="w-full h-full"/>
                            </div>
                            <div className="text-center space-y-3 mt-6">
                                    <h1 className="text-xl font-semibold">Connect with language parteners worldwide</h1>
                                    <p className="opacity-70">
                                        Practice conversations, make friends, and improve your language skill together
                                    </p>
                            </div>
                        </div>
                </div>
            </div>
    </div>  
}