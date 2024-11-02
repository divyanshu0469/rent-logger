"use client";
import { useGetSingleRent } from "@/app/api/queries";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const { data } = useGetSingleRent(params["id"] as string);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      <h1 className="w-full p-6 mt-24 text-3xl font-bold font-serif text-center border-b">
        Rent
      </h1>
      {data?.tenant && data?.rent ? (
        <div className="w-11/12 md:w-1/2 flex flex-col gap-4">
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
            <div className="w-full px-2 flex flex-row justify-between font-bold">
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
        </div>
      ) : (
        <div>No Rent Found</div>
      )}
    </div>
  );
};

export default Page;
