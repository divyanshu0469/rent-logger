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

  const getSmallerDate = (date: string) => {
    const dateAsArray = date.split(" ");
    return `${dateAsArray[0]} ${dateAsArray[1].substring(0, 3)} ${
      dateAsArray[2]
    }`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      <h1 className="w-full p-6 mt-24 text-3xl font-bold font-serif text-center border-b">
        View Rents
      </h1>
      <Accordion
        type="single"
        collapsible
        className="w-full md:w-1/2 flex flex-col justify-center items-center gap-2"
      >
        {sorted && sorted.length > 0 ? (
          sorted.map((rent, index) => {
            const tenant = data?.tenants?.find((value) => {
              return value._id === rent.tenantId;
            });
            if (!tenant) {
              return <div key={index}>No Tenants Found</div>;
            }
            return (
              <div
                key={index}
                className="w-full p-2 flex flex-row justify-around items-center gap-2"
              >
                <AccordionItem
                  value={`rent-${index}`}
                  className="w-full flex flex-col p-2 rounded-md"
                >
                  <AccordionTrigger className="w-full flex gap-2 p-2">
                    <div className="w-full flex flex-wrap justify-between items-center gap-2">
                      <span
                        className="flex truncate text-left text-xl font-bold"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "inherit",
                        }}
                      >
                        {tenant.name}
                      </span>
                      <span className="flex text-nowrap">
                        {getSmallerDate(rent.date)}
                      </span>
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
                <Button size={"defaultWithNoPadding"}>
                  <Link
                    href={`/view-rent/${rent._id}`}
                    className="w-full h-full px-2 flex justify-center items-center rounded-lg"
                  >
                    View Rent
                  </Link>
                </Button>
              </div>
            );
          })
        ) : (
          <div>No Rents Found</div>
        )}
      </Accordion>
    </div>
  );
};

export default Page;
