import { useState } from "react"
import { ShipWheelIcon } from 'lucide-react'
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios"
import { signup } from "./lib/api"

export default function Signup() {
    const [signupData, setSignupData] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        }
    })
    const handleSignUp = (e) => {
        e.preventDefault();
        mutate(signupData);
    }
    return <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
            {/* sign up  left side*/}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                <div className="mb-4 flex items-center justify-start gap-2">
                    <ShipWheelIcon className="size-9 text-primary" />
                    <span className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text
                     text-transparent tracking-wider">
                        Streamify
                    </span>
                </div>
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>
                            {error.response?.data?.message || error.message || "Something went wrong"}
                        </span>
                    </div>
                )}

                <div className="w-full">
                    <form onSubmit={handleSignUp}>
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Create an Account</h2>
                            <p className="text-sm opacity-70">
                                Join Azuzu and start your language adventure
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Full name</span>
                                </label>
                                <input type="text"
                                    placeholder="john doe"
                                    className="input input-bordered w-full"
                                    value={signupData.fullname}
                                    onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email"
                                    placeholder="john@gmail.com"
                                    className="input input-bordered w-full"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password"
                                    placeholder="******"
                                    className="input input-bordered w-full"
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                    required
                                />
                                <p>Password must be at least 6 charecter long</p>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                    <input type="checkbox" className="checkbox checkbox-sm" required />
                                    <span className="text-x5 leading-tight">
                                        I agree to the{" "}
                                        <span className="text-primary hover:underline">terms of service</span> and {" "}
                                        <span className="text-primary hover:underline">privacy policy</span>
                                    </span>
                                </label>
                            </div>
                            <button className="btn btn-primary w-full" type="submit">
                                {isPending ? (
                                    <>
                                      <span className="loading loading-spinner loading-xs">
                                        Loading...
                                      </span>
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link to='/login' className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            {/* signup form right side */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                <div className="max-w-md p-8">
                    <div className="relative aspect-square max-w-sm mx-auto">
                        <img src="/Video call-bro.png" alt="language connection illustration" className="w-full h-full" />
                    </div>
                    <div className="text-center space-y-3 mt-6">
                        <h2 className="text-xl font-semibold">Connect with language parteners worldwide</h2>
                        <p className="opacity-70">
                            Practice conversations, make friends, and improve your language skills together
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}