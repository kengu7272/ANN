// Login page
import './login.css'

export default function Login() {
    return (
        <div className="bgImage flex justify-center items-center h-full w-full">
            <div className='bg-neutral-900 border-2 flex h-3/5 justify-center items-center w-4/5'>
                <form className='bg-transparent flex flex-col gap-6 h-3/5 items-center justify-center w-4/5'>
                    <label className='text-2xl'>ANN</label>
                    <input type="text" placeholder="Username" className='p-2 rounded-xl text-neutral-900'/>
                    <input type="password" placeholder='Password' className='p-2 rounded-xl text-neutral-900'/>
                    <input type="submit" value="Login" className='bg-neutral-700 px-8 py-2 rounded-xl'/>
                </form>
            </div>
        </div>
    )
}