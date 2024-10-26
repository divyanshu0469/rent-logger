"use client";
import { useGetSingleRent } from "@/app/api/queries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const { data } = useGetSingleRent(params["id"] as string);
  return (
    <div className="w-full h-full flex justify-center items-center">
      {data?.tenant && data?.rent && (
        <div className="w-11/12 flex flex-col gap-4">
          <div className="w-full flex justify-between items-center gap-2">
            <span className="text-xl font-bold">{data.tenant.name}</span>
            <span>{data.rent.date}</span>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="w-full px-2 flex flex-row justify-between">
              <span>Rent: </span>
              <span>{data.tenant.rent}</span>
            </div>
            <div className="w-full px-2 flex flex-row justify-between">
              <span>Water Bill: </span>
              <span>{data.tenant.waterBill}</span>
            </div>
            <div className="w-full px-2 flex flex-row justify-between">
              <span>Reading Before: </span>
              <span>
                {(data.rent.reading ?? 0) - (data.rent.readingDifference ?? 0)}
              </span>
            </div>
            <div className="w-full px-2 flex flex-row justify-between">
              <span>Reading After: </span>
              <span>{data.rent.reading}</span>
            </div>
            <div className="w-full px-2 flex flex-row justify-between font-semibold">
              <span>Total Bill: </span>
              <span>{data.rent.totalBill}</span>
            </div>
          </div>
          <div className="w-full px-2 flex flex-row justify-between">
            <span>Notes: </span>
            <span>
              <Textarea
                readOnly
                value={data.rent.notes ?? ""}
                placeholder="No Notes"
              />
            </span>
          </div>
          <div className="w-full py-6 px-4 flex justify-center gap-2">
            <Button variant={"outline"}>
              <Link href={`/add-rent/${data.tenant._id}`}>Add Rent</Link>
            </Button>
            <Button variant={"outline"}>
              <Link href={"/view-rents"}>View Rents</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
