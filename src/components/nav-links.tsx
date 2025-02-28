import { navigation } from "@/lib/utils";
import Link from "next/link";

export function NavLinks() {
  return navigation.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className="text-sm font-medium transition-colors hover:text-primary"
    >
      {item.name}
    </Link>
  ));
}

export function MobileNavLinks({ onClick }: { onClick: () => void }) {
  return navigation.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
      onClick={onClick}
    >
      {item.name}
    </Link>
  ));
}
