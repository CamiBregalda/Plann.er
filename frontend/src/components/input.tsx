import { ComponentProps } from "react"

interface InputProps extends ComponentProps<'input'>{}

export function Input({ type, name, placeholder, ...props }: InputProps) {
    return (
        <input type={type} name={name} placeholder={placeholder} {...props} className={'bg-transparent text-lg placeholder-zinc-400 outline-none flex-1'}/>
    )                   
}