type HeaderProps = {
  active?: 'flights' | 'tickets' | 'checkin' | 'support'
}

export function Header({ active = 'flights' }: HeaderProps) {
  const items: Array<{ key: HeaderProps['active']; label: string; href: string }> = [
    { key: 'flights', label: 'Chuyến bay', href: '#/flights' },
    { key: 'tickets', label: 'Vé của tôi', href: '#/tickets' },
    { key: 'checkin', label: 'Check-in', href: '#/checkin' },
    { key: 'support', label: 'Hỗ trợ', href: '#/support' },
  ]

  return (
    <header className="fixed left-0 right-0 top-0 bg-surface/80 backdrop-blur-md dark:bg-surface-container/80 z-50 shadow-sm border-b border-white/20">
      <nav className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto transition-all duration-300 ease-in-out">
        <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">SkyVoyage</div>
        <div className="hidden md:flex items-center gap-stack-lg">
          {items.map((item) => (
            <a
              key={item.key}
              className={
                item.key === active
                  ? 'font-body-md text-body-md text-primary border-b-2 border-primary dark:text-primary-fixed dark:border-primary-fixed pb-1 transition-opacity hover:opacity-80'
                  : 'font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-surface-variant dark:hover:text-primary-fixed transition-opacity hover:opacity-80'
              }
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-stack-md">
          <button className="p-2 rounded-full hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </button>
          <button onClick={() => { window.location.hash = '/profile' }} className="p-2 rounded-full hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-primary">person</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
