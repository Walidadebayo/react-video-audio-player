import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} React Video Audio Player. All rights reserved.
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">Made with</span>
            <span className="text-red-500">❤️</span>
            <span className="text-sm text-muted-foreground">by</span>
            <Link
              href="https://walidadebayo.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline underline-offset-4"
            >
              Walid Adebayo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;