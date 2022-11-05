import Link from 'next/link';

interface ISidebarItem {
  key: string;
  url: string;
  name: string;
}

export default function Sidebar({
  items,
  activeItem,
}: {
  items: ISidebarItem[];
  activeItem: string;
}) {
  return (
    <aside className='col-span-1 py-4 mb-4 border-b-2 md:pr-6 md:border-b-0 md:border-r-2 md:mb-0 border-slate-300'>
      <ul className='text-sm font-light tracking-wide divide-y lg:text-base'>
        {items.map((item) => (
          <li key={item.key} className='py-4 first:pt-2 first:pb-4'>
            <Link href={item.url}>
              <a
                className={`${
                  item.key === activeItem && 'text-sky-600'
                } hover:text-sky-500`}
              >
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
