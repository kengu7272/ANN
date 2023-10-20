// Home page


export default function Home() {
    return (
    <div className="bgImage bg-center bg-cover h-full w-full">
        <header className="border-b-2 bg-transparent text-teal-300">
            <section className="max-w-10xl mx-auto p-4 flex flex-row gap-8 tablet:justify-center items-center">
                <h1 className="text-3xl font-medium absolute left-5">
                    <a href="/home">ANN</a>
                </h1>
                <nav className="sm:block space-x-8 text-xl ml-auto tablet:ml-0 mt-14 small:mt-0 text-white" aria-label="main">
                    <a href="/create" className="hover:opacity-50">Create</a>
                    <a href="#Edit" className="hover:opacity-50">Edit</a>
                    <a href="#Manage" className="hover:opacity-50">Manage</a>
                </nav>
            </section>
        </header>
            <div className='flex flex-col justify-center'>
                <section className="p-2 mt-4 tablet:mt-9 text-white max-w-10xl mx-auto">
                    <h1 className="text-3xl font-medium">
                            <a>Create a playlist</a>
                    </h1>
                </section>
                <nav className="bg-transparent flex flex-wrap flex-col items-center justify-center">
                    <input type="input" placeholder="playlist name..." className='flex mb-100 px-2 my-1 mt-5 max-h-2lg rounded-xl text-neutral-900 max-w-xs w-4/5'/>
                </nav>
            </div>
            <div className='flex items-center justify-center'>
                <div className='bg-neutral-900 border-2 opacity-90 shadow-neutral-900 shadow-2xl w-[100%] mx-4 max-w-lg'>
                    <form className='flex justify-center items-center'>
                        <input type="input" placeholder="Search" className='h-[10%] p-1 my-2 rounded-xl text-neutral-900 w-4/5'/>
                    </form>
                    <table className='text-white space-x-8'>
                        <thead>
                            <tr>
                                <th>art</th>
                                <th>song title</th>
                                <th>artist</th>
                                <th>yt link</th>
                                <th>+</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>art</td>
                                <td>song title</td>
                                <td>artist</td>
                                <td>yt link</td>
                                <td>+</td>
                            </tr>
                            <tr>
                                <td>art</td>
                                <td>song title</td>
                                <td>artist</td>
                                <td>yt link</td>
                                <td>+</td>
                            </tr>
                            <tr>
                                <td>art</td>
                                <td>song title</td>
                                <td>artist</td>
                                <td>yt link</td>
                                <td>+</td>
                            </tr>
                            <tr>
                                <td>art</td>
                                <td>song title</td>
                                <td>artist</td>
                                <td>yt link</td>
                                <td>+</td>
                            </tr>
                            <tr>
                                <td>art</td>
                                <td>song title</td>
                                <td>artist</td>
                                <td>yt link</td>
                                <td>+</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        <footer className="max-w-10xl mx-auto p-4 flex flex-row gap-8 justify-center items-center">
            <button className='m-4 hover:opacity-50'>
                <input type="submit" value="Create Playlist" className='p-1 bg-teal-300 h-full mx-2 rounded-xl max-w-fit min-w-fit w-[15%]'/>
            </button>
        </footer>
    </div>

    
    )
}
