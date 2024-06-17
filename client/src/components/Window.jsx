import React from "react";

export default function Window({ response, title }) {
  return (
    <div className="">
      <div className="mockup-window border  bg-base-300">
        <h2 className="text-xl pl-4 pb-4">{title}</h2>
        <div className="flex overflow-auto h-[250px] md:h-[500px] px-4 p-2 bg-base-200">
          <ul className="flex flex-col gap-y-3">
            {" "}
            {response.map((x,idx) => (
              <li className="text-lg" key={idx}> - {x} </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
