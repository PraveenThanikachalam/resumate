import React, { useContext, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { ResponseContext } from "../context/responseContext";

export default function Home() {
  const api = import.meta.env.VITE_API;
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const { setResponseData } = useContext(ResponseContext);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && role && description) {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", role);
      formData.append("description", description);

      setLoading(true); // Set loading state to true

      try {
        const response = await fetch(api, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.err) {
          alert("Server error, please try again");
          console.log("Server side error");
          setServerError(true);
        } else {
          console.log("Success:", data);
          setResponseData(data);
          navigate("/response");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading state to false regardless of the outcome
      }
    } else {
      console.error("All fields are required.");
    }
  };

  return (
    <div className="">
      <div className="w-full h-full">
        <Layout />
        <div className="md:flex px-3 tracking-wide justify-center text-center text-wrap text-xl md:text-5xl text-white underline underline-offset-8 font-semibold">
          <h4>Get instant, actionable feedback on your resume</h4>
        </div>
        <div className="hidden p-10 md:flex justify-center text-center text-2xl">
          <h1>
            Gemini powered AI model analyze your resume for formatting,
            keywords, and more. Improve your resume in minutes, not hours.
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex md:p-0 p-6 justify-center">
            <input
              required
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />
          </div>
          <div className="flex flex-col items-center text-white justify-center pt-5 text-lg">
            <h1 className="font-thin tracking-wider">Max file size 10mb</h1>
            {serverError && (
              <p className="text-red-700">Server error, please try again</p>
            )}
          </div>

          <div className="flex justify-center items-center flex-col w-full  pt-5">
            <div className="w-full flex item justify-center">
              <input
                type="text"
                required
                value={role}
                placeholder="Job role"
                onChange={handleRole}
                className="input input-bordered input-primary w-[400px] max-w-xs"
              />
            </div>
            <div className="w-[400px] md:w-[800px] p-4 px-10">
              <textarea
                required
                value={description}
                onChange={handleDescription}
                className="textarea w-full h-[200px] textarea-primary"
                placeholder="Job Description"
              ></textarea>
            </div>
            <button
              className={`${
                loading && "btn-disabled"
              } btn w-[200px] btn-outline btn-primary`}
              type="submit"
            >
              {loading ? (
                <span className="loading loading-infinity loading-lg"></span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
