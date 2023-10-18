// Home page


export default function Home() {
    return (
    <div className="bgImage bg-center bg-cover h-full w-full">
        <header className="bg-transparent text-teal-300 sticky top-0 z-10">
            <section className="max-w-10xl mx-auto p-4 flex justify-between items-center">
                <h1 className="text-3xl font-medium">
                    <a href="#hero">ANN</a>
                </h1>
                <div>
                    <nav className="sm:block space-x-8 text-xl text-white" aria-label="main">
                        <a href="#Create" className="hover:opacity-50">Create</a>
                        <a href="#Edit" className="hover:opacity-50">Edit</a>
                        <a href="#Manage" className="hover:opacity-50">Manage</a>
                        </nav>
                </div>
            </section>
        </header>
        <header className="bg-transparent text-teal-300 sticky top-0 z-10">
                    <section className="max-w-10xl mx-auto p-1 flex justify-between items-center">
                        <a></a>
                        <input type="search" placeholder="Search" className='px-4 h-[50%] rounded-xl text-neutral-900 w-[40%]'/>
                    </section>
        </header>
    </div>

    
    )
}
