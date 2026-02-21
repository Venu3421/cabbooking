import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotData, setForgotData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = "bg-background-dark text-slate-100 antialiased min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white";

    // Check for remembered email
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }

    return () => { document.body.className = ""; };
  }, []);

  const handleChange = (e) => {
    // Check if it's a checkbox
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleForgotChange = (e) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      localStorage.setItem("email", decoded.sub);
      const role = decoded.role;

      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "hr") navigate("/hr-dashboard");
      else if (role === "it") navigate("/it-dashboard");
      else if (role === "driver") navigate("/driver-dashboard");
      else navigate("/");

    } catch (err) {
      alert(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/api/auth/reset-password', {
        email: forgotData.email,
        newPassword: forgotData.newPassword
      });
      alert("Password changed successfully!");
      setShowForgot(false);
      setForgotData({ email: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8081/api/auth/google', {
        token: credentialResponse.credential
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      localStorage.setItem("email", decoded.sub);
      const role = decoded.role;

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "hr") navigate("/hr-dashboard");
      else if (role === "it") navigate("/it-dashboard");
      else if (role === "driver") navigate("/driver-dashboard");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <img
          alt="Blurred illustration of interconnected routes"
          className="w-full h-full object-cover scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOs2AvquS6UG7WU5vEEFjE19wmZJ0QneiqMre2vySFgVJFGsug5CGaCfcyaNhfRwiT9Jp9Ns63hSNYfsyut6l50s4KW_Tn-9jqdmwfQzuBLLNEin85jgj0TyDD3PY_LI8Gutw0fu_54O989i4tgZ6gz_13JuFalX9AjnYxOi4H5l1CZ1Qb5Ulqggs8k863l8_a4rxmp-xGImYyRpc6A3OxR6bCz9kCQeMK8dBX3F2VaRDGJUlug81HbIW7ExQV7BT44ceZtRMf3x0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark/95 via-background-dark/80 to-primary/30 backdrop-blur-[2px]"></div>
      </div>

      <main className="relative z-10 flex h-screen overflow-hidden flex-col items-center justify-center p-4 lg:px-8 lg:py-4">
        <nav className="absolute top-0 left-0 right-0 p-4 lg:px-8 lg:py-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white">local_taxi</span>
            </div>
            <span className="text-xl font-bold tracking-tight font-display text-white">CabConnect</span>
          </div>
        </nav>

        <div className="w-full max-w-[1400px] grid lg:grid-cols-2 gap-8 items-center relative z-10 mt-8 px-4 lg:px-12">
          <div className="hidden lg:block space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-white m-0">
                Your Global Fleet, <br />
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="text-slate-300 text-xl leading-relaxed max-w-lg">
                Connect with your drivers, manage trips, and optimize operations from anywhere.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end lg:pr-12">
            <div className="w-full max-w-[480px] bg-surface-dark/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

              {!showForgot ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-1">Ready to roll?</h2>
                    <p className="text-slate-400 text-xs">Please sign in to access your dashboard.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300" htmlFor="email">Email Address</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                        </div>
                        <input
                          className="block w-full rounded-xl border-0 bg-white/5 py-3 pl-11 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                          id="email"
                          name="email"
                          placeholder="name@company.com"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                        </div>
                        <input
                          className="block w-full rounded-xl border-0 bg-white/5 py-3 pl-11 pr-11 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center">
                        <input
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                        <label className="ml-2 block text-xs text-slate-400" htmlFor="rememberMe">Remember me</label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      className="flex w-full justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-bold leading-6 text-white shadow-lg shadow-primary/20 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 ease-in-out transform active:scale-[0.98]"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "SIGN IN"}
                    </button>
                  </form>

                  <div className="relative my-4">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
                      <span className="px-4 text-slate-500 bg-transparent">or</span>
                    </div>
                  </div>

                  <div className="flex w-full justify-center mt-2">
                    <div className="flex justify-center rounded-full overflow-hidden bg-transparent w-[40px] h-[40px]">
                      <div className="scale-110 origin-center bg-transparent">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={() => console.log('Login Failed')}
                          type="icon"
                          shape="circle"
                          theme="filled_black"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-xs text-slate-400">
                    Don't have an account? <Link className="font-bold text-primary hover:text-primary/80 transition-colors" to="/reg">Sign up for access</Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-1">Reset Password</h2>
                    <p className="text-slate-400 text-xs">Enter your email and new password.</p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300" htmlFor="forgot-email">Email Address</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                        </div>
                        <input
                          className="block w-full rounded-xl border-0 bg-white/5 py-3 pl-11 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                          id="forgot-email"
                          name="email"
                          placeholder="name@company.com"
                          type="email"
                          value={forgotData.email}
                          onChange={handleForgotChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300" htmlFor="forgot-newPassword">New Password</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                        </div>
                        <input
                          className="block w-full rounded-xl border-0 bg-white/5 py-2.5 pl-11 pr-11 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 transition-all"
                          id="forgot-newPassword"
                          name="newPassword"
                          placeholder="••••••••"
                          type={showNewPassword ? "text" : "password"}
                          value={forgotData.newPassword}
                          onChange={handleForgotChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showNewPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300" htmlFor="forgot-confirmPassword">Confirm Password</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">lock_reset</span>
                        </div>
                        <input
                          className="block w-full rounded-xl border-0 bg-white/5 py-2.5 pl-11 pr-11 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 transition-all"
                          id="forgot-confirmPassword"
                          name="confirmPassword"
                          placeholder="••••••••"
                          type={showConfirmPassword ? "text" : "password"}
                          value={forgotData.confirmPassword}
                          onChange={handleForgotChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showConfirmPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        className="flex w-1/3 justify-center rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold leading-6 text-white hover:bg-white/20 transition-all duration-200"
                        type="button"
                        onClick={() => setShowForgot(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex w-2/3 justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-bold leading-6 text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-200"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Change Password"}
                      </button>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 py-3 w-full flex justify-start items-center gap-4 px-4 lg:px-8">
          <p className="text-[9px] text-slate-500 font-medium tracking-wide">© 2026 CABCONNECT INC. ALL RIGHTS RESERVED.</p>
        </footer>
      </main>
    </>
  );
}

export default Login;
