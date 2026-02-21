import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Apply Tailwind body classes from user's template
  useEffect(() => {
    document.body.className = "bg-background-dark text-slate-100 antialiased min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white";
    return () => { document.body.className = ""; }; // reset on unmount
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/api/auth/register', formData);
      alert(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data || 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8081/api/auth/google', {
        token: credentialResponse.credential,
        role: formData.role // Pass their selected role to ensure correct registration
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
      alert(err.response?.data || "Google Registration failed");
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
              <div className="mb-3">
                <h2 className="text-xl font-bold tracking-tight text-white mb-1">Join the Fleet</h2>
                <p className="text-slate-400 text-[11px]">Create your account to access the system.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300" htmlFor="username">Username</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                    </div>
                    <input
                      className="block w-full rounded-xl border-0 bg-white/5 py-3 pl-10 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                      id="username"
                      name="username"
                      placeholder="e.g. jdoe123"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300" htmlFor="email">Email Address</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                    </div>
                    <input
                      className="block w-full rounded-xl border-0 bg-white/5 py-3 pl-10 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
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

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-slate-300" htmlFor="password">Password</label>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                    </div>
                    <input
                      className="block w-full rounded-xl border-0 bg-white/5 py-3 pl-10 pr-10 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                      id="password"
                      name="password"
                      placeholder="Create a password"
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
                      <span className="material-symbols-outlined text-[16px]">
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300" htmlFor="role">Select Role</label>
                  <div className="relative">
                    <select
                      className="appearance-none !bg-none block w-full rounded-xl border-0 bg-white/5 py-3 pl-4 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="admin" className="bg-surface-dark">Administrator</option>
                      <option value="hr" className="bg-surface-dark">HR Manager</option>
                      <option value="it" className="bg-surface-dark">IT Support</option>
                      <option value="driver" className="bg-surface-dark">Driver</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                  </div>
                </div>

                <button
                  className="flex w-full justify-center rounded-xl bg-primary px-3 py-2.5 mt-2 text-sm font-bold leading-6 text-white shadow-lg shadow-primary/20 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 ease-in-out transform active:scale-[0.98]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Register Now"}
                </button>
              </form>

              <div className="relative my-3">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
                  <span className="px-4 text-slate-500 bg-transparent">or</span>
                </div>
              </div>

              <div className="flex w-full justify-center mt-2">
                <div className="flex justify-center rounded-full overflow-hidden w-[40px] h-[40px]">
                  <div className="scale-110 origin-center bg-transparent">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => console.log('Registration Failed')}
                      type="icon"
                      shape="circle"
                      theme="filled_black"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                Already have an account? <Link className="font-bold text-primary hover:text-primary/80 transition-colors" to="/">Sign in</Link>
              </p>
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

export default Register;
