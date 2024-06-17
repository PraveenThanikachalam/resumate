import React from "react";
import { Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="pl-5 pt-5 w-full">
        <Link className=" text-2xl  text-white font-mono bg-purple-700 px-5 py-2 rounded-lg " to="/">
          Resumate
        </Link>
        <div className="divider" />
    </div>
  );
}
