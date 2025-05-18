import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Facebook, Twitter } from 'lucide-react';
import './login.css';

const LoginPage = () => {
    return (
        <section className="background-radial-gradient overflow-hidden">
            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                <div className="row gx-lg-5 align-items-center mb-5">
                    <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                        <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: "hsl(0, 0.00%, 100.00%)" }}>
                            Fitness for Everyone <br />
                            <span style={{ color: "hsl(79, 100.00%, 56.50%)" }}>GET FIT DON'T QUIT</span>
                        </h1>
                        <p className="mb-4 opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
                        The only bad workout is the one you didn’t do.
                        </p>
                    </div>

                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                        <div className="card bg-glass">
                            <div className="card-body px-4 py-5 px-md-5">
                                <div>
                                    <div className="row center mb-4">
                                        <h1>Sign in</h1>
                                    </div>
                                    {/* Email input */}
                                    <div className="form-outline mb-4">
                                        <input type="email" id="form3Example3" className="form-control" />
                                        <label className="form-label" htmlFor="form3Example3">Email address</label>
                                    </div>

                                    {/* Password input */}
                                    <div className="form-outline mb-4">
                                        <input type="password" id="form3Example4" className="form-control" />
                                        <label className="form-label" htmlFor="form3Example4">Password</label>
                                    </div>

                                    {/* Checkbox */}
                                    <div className="form-check d-flex justify-content-center mb-4">
                                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example33" defaultChecked />
                                        <label className="form-check-label" htmlFor="form2Example33">
                                            Remember Password
                                        </label>
                                    </div>

                                    {/* Submit button */}
                                    <button type="button" className="btn btn-primary w-100 mb-4">
                                        Sign up
                                    </button>

                                    {/* Register buttons */}
                                    <div className="text-center mb-3">
                                        <p>Sign in with:</p>
                                        <button type="button" className="btn btn-link btn-floating mx-1">
                                            <Facebook />
                                        </button>

                                        <button type="button" className="btn btn-link btn-floating mx-1">
                                            <svg width="20" height="20" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                            </svg>
                                        </button>

                                        <button type="button" className="btn btn-link btn-floating mx-1">
                                            <Twitter />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;