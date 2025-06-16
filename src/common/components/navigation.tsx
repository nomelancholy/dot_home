import { Link } from "react-router";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "src/common/components/ui/navigation-menu";
import { WordRotate } from "./ui/word-rotate";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    {
      name: "Shop",
      to: "/shop",
    },
    {
      name: "Class",
      to: "/class",
    },
    // {
    //   name: "Shop",
    //   to: "/shop",
    //   items: [
    //     {
    //       name: "All",
    //       to: "/shop",
    //     },
    //     {
    //       name: "Cup",
    //       to: "/shop?type=cup",
    //     },
    //     {
    //       name: "Plate",
    //       to: "/shop?type=plate",
    //     },
    //   ],
    // },
    // {
    //   name: "Class",
    //   to: "/class",
    //   items: [
    //     {
    //       name: "One Day Class",
    //       to: "/class/one-day",
    //     },
    //     {
    //       name: "Regular Class",
    //       to: "/shop/regular",
    //     },
    //   ],
    // },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <nav className="flex flex-col fixed top-0 left-0 right-0 z-50 ">
        <div className="grid grid-cols-[1fr_4fr_1fr] md:grid-cols-3 items-center w-full h-16 px-4 md:px-10 backdrop-blur bg-background/50">
          <div className="justify-self-start flex items-center gap-2">
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList>
                {menus.map((menu) => (
                  <NavigationMenuItem key={menu.name}>
                    <NavigationMenuLink asChild>
                      <Link to={menu.to}>{menu.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="lg:hidden">
              <SheetHeader>
                <ul className="flex flex-col gap-4">
                  {menus.map((menu) => (
                    <li key={menu.name} onClick={() => setIsOpen(false)}>
                      <Link to={menu.to}>{menu.name}</Link>
                    </li>
                  ))}
                </ul>
              </SheetHeader>
            </SheetContent>
          </div>
          <div className="justify-self-center w-full text-center">
            <h1>
              <WordRotate
                words={["DOT.", "Day Off Today"]}
                className="w-full text-2xl font-bold font-serif"
                duration={5000}
              />
            </h1>
          </div>
          {/* <div className="justify-self-end flex items-center gap-2">
          <Button>
            <ShoppingCartIcon className="w-4 h-4" />
            <UserIcon className="w-4 h-4" />
          </Button>
        </div> */}
        </div>
      </nav>
    </Sheet>
  );
}
