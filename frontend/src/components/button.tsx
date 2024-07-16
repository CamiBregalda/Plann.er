import { ComponentProps, ReactNode } from "react";
import { tv, VariantProps } from 'tailwind-variants';

{/*Passa a função um objeto*/}
{/*Base: Passa quais as classes do tailwind serão iguais entre todos os botões*/}
{/*Variants: Como quer chamar a diferença de um botão para outro*/}
const buttonVariants = tv({
    base: 'rounded-lg font-medium flex items-center gap-2 justify-center',
    variants: {
        color: {
            green: 'bg-lime-300 text-lime-950 hover:bg-lime-400',
            gray: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
            red: 'bg-red-500 text-white hover:bg-red-600 transition duration-200',
        },

        size: {
            default: 'py-2',
            full: 'w-full h-11'
        },

        width: {
            default: 'px-5',
            small: 'px-6'
        }
    },

    defaultVariants: {
        color: 'green',
        size: 'default',
        width: 'default'
    }
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants>{
    children: ReactNode
}

export function Button({ children, type, color, size, width, ...props }: ButtonProps) {
    return (
        <button type={type} {...props} className={buttonVariants({ color, size, width })}>
            {children}
        </button>
    )
}