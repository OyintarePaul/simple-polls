export default function MainLayout ({children}: {children: React.ReactNode}) {
    return (
        <div className="px-4 mx-auto lg:max-w-8/10">
            {children}
        </div>
    )
}