// Login page
import './login.css'

export default function Login() {
    return (
        <div className="bgImage flex justify-center items-center h-full w-full">
            <div className='bg-neutral-900 border-2 flex h-3/5 justify-center items-center shadow-neutral-900 shadow-2xl w-4/5 laptop:w-1/2'>
                <form className='bg-transparent flex flex-col gap-[15%] h-[70%] tablet:h-4/5 items-center justify-center tablet:text-lg w-[95%]'>
                    <label className='text-3xl tablet:text-4xl'>ANN</label>
                    <input type="text" placeholder="Username" className='h-1/5 p-2 rounded-xl text-neutral-900 w-4/5'/>
                    <input type="password" placeholder='Password' className='h-1/5 p-2 rounded-xl text-neutral-900 w-4/5'/>
                    <div className='bg-transparent flex flex-row justify-center h-2/5 items-center w-full'>
                        <a href='/login/register' className='bg-neutral-700 flex items-center h-full justify-center mx-2 rounded-xl text-center w-2/5'>Register</a>
                        <input type="submit" value="Login" className='bg-neutral-700 h-full mx-2 rounded-xl w-2/5'/>
                    </div>
                </form>
            </div>
        </div>
    )
}