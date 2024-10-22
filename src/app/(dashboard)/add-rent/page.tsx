"use client";
import { useGetTenants } from "@/app/api/queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";

const page = () => {
  const { data } = useGetTenants();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col justify-center items-center gap-2"
      >
        {data?.tenants?.map((tenant, index) => {
          return (
            <div
              key={index}
              className="w-full p-2 flex flex-row justify-around items-center"
            >
              <AccordionItem
                value={`tenant-${index}`}
                className="w-3/4 p-2 rounded-md"
              >
                <AccordionTrigger className="text-xl font-bold">
                  {tenant.name}
                </AccordionTrigger>
                <AccordionContent className="text-lg font-semibold flex flex-col gap-2">
                  <div className="w-full px-2 flex flex-row justify-between">
                    <span>Rent: </span>
                    <span>{tenant.rent}</span>
                  </div>
                  <div className="w-full px-2 flex flex-row justify-between">
                    <span>Water: </span>
                    <span>{tenant.waterBill}</span>
                  </div>
                  <div className="w-full px-2 flex flex-row justify-between">
                    <span>Last Reading: </span>
                    <span>{tenant.lastReading ?? "-"}</span>
                  </div>
                  <div className="w-full px-2 flex flex-row justify-between">
                    <span>Last Notes: </span>
                    <span>
                      <Textarea
                        readOnly
                        value={tenant.lastNotes ?? ""}
                        placeholder="No Notes"
                      />
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <Button>
                <Link href={`/add-rent/${tenant._id}`}>Add Rent</Link>
              </Button>
            </div>
          );
        })}
      </Accordion>
      <div className="flex gap-2">
        <Button variant={"outline"}>
          <Link href={"/add-tenant"}>Add Tenant</Link>
        </Button>
        <Button variant={"outline"}>
          <Link href={"/view-rents"}>View Rents</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
