// Home page

export default function Page() {
  return (
    <div className="bgImage h-full w-full flex justify-center items-center">
      <main className="h-3/4 w-4/5 bg-neutral-900 flex flex-col justify-center items-center gap-10 desktop:max-h-[600px] max-w-[900px] opacity-90 py-6 rounded-xl">
        <section className="flex flex-col h-fit justify-center items-center rounded-xl">
          <h1>ANN</h1>
          <ul className="list-disc pl-5">
            <li className="text-xl">Music Manager</li>
            <li className="text-xl">Playlists</li>
            <li className="text-xl">Trivia</li>
          </ul>
        </section>
        <section className="w-[90%] tablet:w-4/5">
          <p>Welcome to the ANN application. This is a place where you can search songs, create your playlists, and even do trivia games based on your songs!</p>
          <br/>
          <p>Click on the button below to login or get started on the register page.</p>
        </section>
        <section className="flex flex-col h-1/6 justify-center items-center rounded-xl w-full">
          <a href="/login" className="text-2xl bg-neutral-700 flex justify-center items-center h-full rounded-xl w-3/5">Login</a>
        </section>
      </main>
    </div>
  )
}
