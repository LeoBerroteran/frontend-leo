/*
  El hook de useEffect se usa para ejecutar código después de que el componente se haya renderizado.
  Este acepta dependencias, si no se le pasan, se ejecutará cada vez que el componente se renderice, 
  si se le pasan un array vacío, se ejecutará solo una vez después del primer renderizado.
  si se le pasan dependencias, se ejecutará cada vez que alguna de las dependencias cambie.
*/
"use client";
import { useState, useEffect } from "react";

export default function ApiPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [page]);

  function makeSearch() {
    setLoading(true);
    console.log("hola");
    fetch(`https://rickandmortyapi.com/api/character?name=${search}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => console.error(error));
  }

  return (
    <section className="flex flex-col items-center h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Rick and morty</h1>
      <input
        type="text"
        placeholder="Buscar personaje..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") makeSearch();
        }}
        className="border my-4 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          data?.results?.length > 0 ? (
            data.results?.map((character) => (
              <div
                key={character.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h2 className="text-xl font-bold text-black">{character.name}</h2>
                <p className="text-gray-600">{character.species}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron personajes</p>
          )
        )}
      </div>
      <div className="flex justify-center items-center w-full gap-4 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Anterior
        </button>
        <span className="mx-4 text-gray-700">Página {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === data?.info?.pages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}