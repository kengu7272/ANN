export default function Navbar() {
    return (
        <div className="absolute top-0 border-b-2 bg-transparent flex items-center justify-center small:justify-end tablet:justify-center h-1/6 max-h-[90px] text-teal-300 w-full">
            <h1 className="text-3xl font-medium absolute hidden small:block left-5 laptop:left-10">
                <a href="/home">ANN</a>
            </h1>
            <nav className="flex gap-8 small:mr-5 tablet:mr-0 laptop:gap-16 text-xl text-white" aria-label="main">
                <a href="/create" className="hover:opacity-50">Create</a>
                <a href="#Edit" className="hover:opacity-50">Edit</a>
                <a href="#Manage" className="hover:opacity-50">Manage</a>
            </nav>
        </div>
    );
}