/**
 * Button component with Tailwind CSS styles
 * @param {string} text - The text to display on the button
 * @param {string} color - The background color of the button (default: 'blue')
 * @returns {JSX.Element} The rendered button component
 */

//client component
/*
  El porque se llama client component es porque se ejecuta en el cliente, es decir, en el navegador del usuario. 
  Esto significa que el código de este componente se ejecutará en el navegador y no en el servidor. 
  Esto es importante porque algunos hooks de React, como useState, solo funcionan en el cliente y no en el servidor. 
  Por lo tanto, si queremos usar useState u otros hooks que solo funcionan en el cliente, debemos marcar nuestro 
  componente como un client component usando "use client" al inicio del archivo.
*/
"use client";
/*
  Los hooks de React, son funciones especiales que nos permiten usar el estado y 
  otras características de React en componentes funcionales.
  useState es un hook que nos permite agregar estado a nuestros componentes funcionales.
*/
import { useState } from "react";

export default function Button({
  text = "Hola",
  color = "blue",
}: {
  text: string;
  color?: string;
}) {
  /*
    count es el valor actual del estado, y setCount es la función que usamos para actualizar ese estado.
    El valor inicial del estado es 0, por lo que count comenzará con el valor 0.
  */
  const [count, setCount] = useState(0);
  return (
    <button
      className={`bg-${color}-500 text-white px-4 py-2 rounded hover:bg-${color}-700 transition duration-300 cursor-pointer`}
      onClick={() => setCount(count + 1)}
    >
      {text} ({count})
    </button>
  );
}