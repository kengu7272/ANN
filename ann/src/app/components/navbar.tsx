export default function Navbar() {
    return (
        <div className="absolute top-0 border-b-2 bg-transparent flex items-center justify-center h-1/6 max-h-[90px] w-full">
            <a className="text-3xl font-medium absolute hidden tablet:block left-5 laptop:left-10 text-teal-300" href="/home">ANN</a>
            <nav className="flex gap-8 small:mr-5 tablet:mr-0 laptop:gap-16 text-xl text-white" aria-label="main">
                <a href="/create" className="hover:opacity-50">Create</a>
                <a href="/playlists" className="hover:opacity-50">Playlists</a>
                <a href="/profile" className="hover:opacity-50">Profile</a>
            </nav>
        </div>
    );
}