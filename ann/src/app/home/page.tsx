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
            <div className='flex flex-col justify-center h-[70%]'>
                <section className="p-2 text-white max-w-10xl mx-auto">
                    <h1 className="text-3xl font-medium">
                            <a>Test Yourself!</a>
                    </h1>
                </section>
                <a className='text-center text-medium text-white p-10'>question?</a>
                <nav className="bg-transparent flex flex-wrap flex-col items-center justify-center">
                    <input type="input" placeholder="your answer..." className='flex mb-100 px-2 max-h-2lg rounded-xl text-neutral-900 max-w-lg w-4/5'/>
                </nav>
                <button className='m-4 hover:opacity-50'>
                    <input type="submit" value="Submit" className='p-2 bg-teal-300 h-full mx-2 rounded-xl max-w-fit min-w-fit w-[15%]'/>
                </button>
            </div>
    </div>

    
    )
}
