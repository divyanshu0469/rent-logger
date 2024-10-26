"use client";
import { useGetRents } from "@/app/api/queries";
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

const Page = () => {
  const { data } = useGetRents();
  const sorted = data?.rents?.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return -1 * (dateA - dateB);
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col justify-center items-center gap-2"
      >
        {sorted?.map((rent, index) => {
          const tenant = data?.tenants?.find((value) => {
            return value._id === rent.tenantId;
          });
          if (!tenant) {
            return;
          }
          return (
            <div
              key={index}
              className="w-full p-2 flex flex-row justify-around items-center"
            >
              <AccordionItem
                value={`rent-${index}`}
                className="w-3/4 p-2 rounded-md"
              >
                <AccordionTrigger className="flex gap-2">
                  <div className="w-full flex justify-between items-center gap-2">
                    <span className="text-xl font-bold">{tenant.name}</span>
                    <span>{rent.date}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-lg font-semibold flex flex-col gap-2">
                  <div className="w-full px-2 flex flex-row justify-between">
                    <span>Total Bill: </span>
                    <span>{rent.totalBill}</span>
                  </div>
                  <div className="w-full px-2 flex flex-row justify-between">
                    <span>Notes: </span>
                    <span>
                      <Textarea
                        readOnly
                        value={rent.notes ?? ""}
                        placeholder="No Notes"
                      />
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <Button>
                <Link href={`/view-rent/${rent._id}`}>View Rent</Link>
              </Button>
            </div>
          );
        })}
      </Accordion>
      <Button variant={"outline"}>
        <Link href={"/add-rent"}>Add Rent</Link>
      </Button>
    </div>
  );
};

export default Page;
