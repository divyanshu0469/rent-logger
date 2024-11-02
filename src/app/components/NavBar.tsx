"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = ({
  token,
  logout,
}: {
  token: string | null;
  logout: () => void;
}) => {
  const url = usePathname();

  const routeMap = new Map();
  routeMap.set("add-rent", {
    buttonOne: { displayName: "Add Tenant", urlRoute: "add-tenant" },
    buttonTwo: { displayName: "View Rents", urlRoute: "view-rents" },
  });

  let buttonOne = { displayName: "Add Rent", urlRoute: "add-rent" };
  let buttonTwo = { displayName: "View Rents", urlRoute: "view-rents" };

  const keys: string[] = routeMap
    .keys()
    .toArray()
    .filter((route) => url.includes(route));

  if (keys.length > 0) {
    buttonOne = routeMap.get(keys[0]).buttonOne;
    buttonTwo = routeMap.get(keys[0]).buttonTwo;
  }

  return (
    <div className="fixed w-full h-20 my-6 flex justify-center">
      <div className="w-80 rounded-2xl flex flex-row justify-evenly items-center gap-1 shadow-lg shadow-gray-500/50 backdrop-blur-sm">
        <Button
          variant={"accented"}
          size={token ? "icon" : undefined}
          className={token ? "p-0" : undefined}
        >
          <Link
            className={`w-full h-full ${
              token ? "px-2" : ""
            } flex justify-center items-center rounded-lg font-serif`}
            href={"/"}
          >
            {token ? "RL" : "Rent Logger"}
          </Link>
        </Button>

        {token && (
          <>
            <Button size={"defaultWithNoPadding"}>
              <Link
                className="w-full h-full px-2 flex justify-center items-center rounded-lg"
                href={`/${buttonOne.urlRoute}`}
              >
                {buttonOne.displayName}
              </Link>
            </Button>
            <Button size={"defaultWithNoPadding"}>
              <Link
                className="w-full h-full px-2 flex justify-center items-center rounded-lg"
                href={`/${buttonTwo.urlRoute}`}
              >
                {buttonTwo.displayName}
              </Link>
            </Button>
            <Button variant={"accentedOutline"} size={"icon"} onClick={logout}>
              <LogOut />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
