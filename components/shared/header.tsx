export function Header() {
    return (
        <header className="w-full border-b bg-background p-4">
            <div className="container flex items-center justify-between">
                <div className="font-bold">My App</div>
                <nav className="flex gap-4">
                    <a href="/" className="text-sm font-medium hover:underline">
                        Home
                    </a>
                    <a href="/login" className="text-sm font-medium hover:underline">
                        Login
                    </a>
                </nav>
            </div>
        </header>
    );
}
