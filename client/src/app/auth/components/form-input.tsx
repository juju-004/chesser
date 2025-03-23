"use client";

import React from "react";

function FormInput({
  name,
  type,
  placeholder,
  id
}: {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-6">
      <input
        name={name}
        id={id}
        className="input input-lg border-1 w-full rounded-lg duration-150 focus:border-sky-400 focus:outline-0 focus:ring-0"
        type={type || name}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default FormInput;
