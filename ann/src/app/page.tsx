// Home page

export default function Page() {
  return (
    <div className="bgImage h-[100vh] w-full flex justify-center items-center">
      <main className="border-2 h-4/5 w-[95%] bg-neutral-900 flex flex-col justify-center items-center gap-10 desktop:max-h-[600px] max-w-[900px] opacity-90 py-6 rounded-xl">
        <section className="flex flex-col h-fit justify-center items-center rounded-xl w-full">
          <h1>ANN</h1>
          <ul className="pl-0 list-disc tablet:flex tablet:flex-row tablet:justify-between tablet:gap-20">
            <li className="text-2xl">Music Manager</li>
            <li className="text-2xl">Playlists</li>
            <li className="text-2xl">Trivia</li>
          </ul>
        </section>
        <section className="w-[90%] tablet:w-4/5">
          <p>Welcome to the ANN application. This is a place where you can search songs, create your playlists, and even do trivia games based on your songs!</p>
          <br/>
          <p>Click on the button below to login or get started on the register page.</p>
        </section>
        <section className="flex flex-col h-1/6 justify-center items-center rounded-xl w-full">
          <a href="/login" className="hover:bg-neutral-600 active:bg-neutral-800 text-2xl bg-neutral-700 flex justify-center items-center h-full rounded-xl w-3/5">Login</a>
        </section>
      </main>
    </div>
  )
}
