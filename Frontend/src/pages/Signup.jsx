import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import API from "../services/api";
import { login } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState("");

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const res = await API.post("/auth/signup", values);
      login(res.data.token, res.data.role);
      navigate("/");
    } catch (err) {
      setStatusMsg(err.response?.data?.error || "Signup failed");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Create Your Account
        </h2>

        <Formik
          initialValues={{ email: "", password: "", role: "user" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Required"),
            password: Yup.string().min(6, "Min 6 characters").required("Required"),
            role: Yup.string().oneOf(["user", "inspector", "admin"]).required("Required"),
          })}
          onSubmit={handleSignup}
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

              <div>
                <Field
                  as="select"
                  name="role"
                  className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="inspector">Inspector</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
