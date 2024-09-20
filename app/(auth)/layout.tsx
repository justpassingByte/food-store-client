const AuthLayout= ({children}:{children:React.ReactNode}) =>{
    return(
        <div className="flex items-center justify-center [calc(100%-170px)]">
            {children}
        </div>
    )
}
export default AuthLayout