import Button from "./_ui/button";
/*
  Link es un componente de Next.js que se utiliza para crear enlaces entre páginas dentro de la aplicación.
  Es similar al componente <a> de HTML, pero con algunas características adicionales que lo hacen más 
  eficiente para la navegación en aplicaciones Next.js.
  Link permite la navegación sin recargar la página, lo que mejora la experiencia del usuario al hacer 
  que las transiciones entre páginas sean más rápidas y suaves.
*/
import Link from "next/link";
// Componente para optimizar la carga de imágenes en Next.js
import Image from "next/image";
//agregamos SEO a la página
export const metadata = {
  title: "Home Page",
  description: "This is the home page of our Next.js application",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Button text="Hello World" color="green" />
      <Button text="Presioname" color="red" />
      <Button text="Hola!" color="blue" />
      <Link href="/contacto" className="text-blue-500 hover:underline">
        Ir a Contacto
      </Link>
      {/*
        Traer de la carpeta public e imagenes la imagen zufoto_logo_transp_yellow.png y mostrarla en la página utilizando el componente Image de Next.js, con un ancho de 200px y una altura de 200px.
      */}
      <Image
        src="/imagenes/zufoto_logo_transp_yellow.png"
        alt="Next.js Logo"
        width={200}
        height={200}
      />
    </div>
  );
}

/*
  Hacer el juego de piedra papel o tijeras con React y Tailwind CSS, utilizando componentes funcionales y hooks de React para manejar el estado del juego.
*/