import React from 'react'
import '../globals.css'


export default function Page(){
    return (
        <section className='flex justify-center items-center bg-blue-400 h-[100vh]'>
            <div className='rounded-md shadow-lg flex flex-col gap-3 bg-white px-8 py-6'>
                <h2 className='text-center text-2xl font-semibold'>Inicio de sesión</h2>
                <input className='border border-blue-400 rounded-md' type="email" name="Correo" id="Correo" />
                <input className='border border-blue-400 rounded-md' type="password" name="password" id="password" />
                <input type="submit" value="Enviar" className='hover:bg-blue-400 transition-all cursor-pointer hover:text-white border-2 rounded-md border-blue-400'/>
            </div>
        </section>
    )
}