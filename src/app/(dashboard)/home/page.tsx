"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="h-full flex flex-col items-center gap-2">
      <div className="w-full flex h-10 flex-row justify-around items-center">
        <Button>
          <Link href={"/add-rent"}>Add Rent</Link>
        </Button>
        <Button>
          <Link href={"/view-rents"}>View Rents</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
