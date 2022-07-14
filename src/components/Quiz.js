import React from "react";

export default function Quiz(props) {
  const { name, questions } = props;

  return (
    <div>
      <h3>{name}</h3>
      <div></div>
    </div>
  );
}
