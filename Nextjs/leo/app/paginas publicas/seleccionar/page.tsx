/*
  useRef es un hook de React que nos permite crear una referencia mutable a un elemento del DOM 
  o a cualquier valor que queramos mantener entre renders sin causar una nueva renderización. 
  Es útil para acceder directamente a elementos del DOM, almacenar valores persistentes o 
  mantener referencias a funciones.
*/
"use client";
import { useRef } from "react";

export default function seleccionar() {
  const buttonRef = useRef(null);
  function handleClick() {
    if (buttonRef.current) {
      buttonRef.current.style.backgroundColor = "red";
    }
  }
  
  return (
    <div>
      <button 
        ref={buttonRef} 
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Presioname
      </button>
    </div>
  )
}