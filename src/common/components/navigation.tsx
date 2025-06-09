import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
} from "src/common/components/ui/navigation-menu";
import { Button } from "src/common/components/ui/button";
import { ShoppingCartIcon, UserIcon } from "lucide-react";
import { WordRotate } from "./ui/word-rotate";

export default function Navigation() {
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
    <nav className="flex flex-col fixed top-0 left-0 right-0 z-50 ">
      <div className="grid grid-cols-3 items-center w-full h-16 px-10 backdrop-blur bg-background/50">
        <div className="justify-self-start">
          <NavigationMenu>
            <NavigationMenuList>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.name}>
                  <NavigationMenuLink>
                    <Link to={menu.to}>{menu.name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="justify-self-center ">
          <h1>
            <WordRotate
              words={["DOT.", "Day Off Today"]}
              className="text-2xl font-bold font-serif"
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
  );
}
