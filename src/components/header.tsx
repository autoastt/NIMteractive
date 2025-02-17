import { Layers } from "lucide-react";

export default function Header({ ...props }) {
  return (
    <header
      className="sticky top-0 border-b w-full backdrop-blur transition-colors duration-500 supports-backdrop-blur:bg-white/60"
      {...props}
    >
      <nav className="w-full mx-auto flex items-center py-4 px-4 lg:px-8">
        <div className="select-none text-xl font-bold flex gap-2 items-center flex-1">
          <Layers />
          NIMteractive
        </div>
      </nav>
    </header>
  );
}
