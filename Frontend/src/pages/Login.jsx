import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import API from "../services/api.js";
import { getRole, login } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState("");


  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await API.post("/auth/login", values);
      login(res.data.token, res.data.role);
      navigate("/")
    } catch (err) {
      setStatusMsg(err.response?.data?.error || "Login failed");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Login to VerifyMe
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {statusMsg && <div className="text-red-500">{statusMsg}</div>}

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-lg font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
